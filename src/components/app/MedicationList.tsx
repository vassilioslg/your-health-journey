import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pill, X, Clock, Droplets, ChevronRight, Bell, BellOff, Check, ScanLine, Loader2 } from "lucide-react";
import { MEDICINES_LIST } from "@/data/medicines";
import { lookupMedicineByBarcode } from "@/data/medicineBarcodes";
import MedicationDetail from "@/components/app/MedicationDetail";
import PremiumGate from "./PremiumGate";
import { usePremium } from "./PremiumContext";
import { loadStoredMedications, saveStoredMedications } from "@/lib/medicationsStorage";

interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  time: string;
  dosesPerDay?: number;
}

interface Reminder {
  id: string;
  medId: string;
  time: string;
  days: string[];
  enabled: boolean;
  lastTaken?: string;
}

const sampleMeds: Medication[] = [
  { id: "1", name: "Metformin", dose: "500mg", frequency: "Twice daily", time: "Morning & Evening", dosesPerDay: 2 },
  { id: "2", name: "Lisinopril", dose: "10mg", frequency: "Once daily", time: "Morning", dosesPerDay: 1 },
  { id: "3", name: "Atorvastatin", dose: "20mg", frequency: "Once daily", time: "Evening", dosesPerDay: 1 },
];

const sampleReminders: Reminder[] = [
  { id: "r1", medId: "1", time: "08:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true, lastTaken: "Today, 8:02 AM" },
  { id: "r2", medId: "1", time: "18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
  { id: "r3", medId: "2", time: "08:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
  { id: "r4", medId: "3", time: "21:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
];

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDoseFrequency = (dosesPerDay: number) => {
  if (dosesPerDay <= 1) return "Once daily";
  if (dosesPerDay === 2) return "Twice daily";
  return `${dosesPerDay} times daily`;
};

const toTimeValue = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const getDosesPerDay = (med: Medication) => {
  if (typeof med.dosesPerDay === "number" && med.dosesPerDay >= 1) {
    return med.dosesPerDay;
  }

  const normalized = med.frequency.toLowerCase();
  if (normalized.includes("once")) return 1;
  if (normalized.includes("twice")) return 2;

  const digitMatch = normalized.match(/(\d+)/);
  if (digitMatch) {
    const parsed = Number.parseInt(digitMatch[1], 10);
    if (Number.isFinite(parsed) && parsed >= 1) return parsed;
  }

  if (normalized.includes("every 12")) return 2;
  if (normalized.includes("every 8")) return 3;
  if (normalized.includes("every 6")) return 4;

  return 1;
};

const buildAutoRemindersFromFirstDose = (
  medId: string,
  dosesPerDay: number,
  firstTakenAt: Date,
  firstTakenLabel: string,
): Reminder[] => {
  const intervalMinutes = Math.round((24 * 60) / dosesPerDay);

  return Array.from({ length: dosesPerDay }, (_, index) => {
    const reminderTime = new Date(firstTakenAt.getTime() + index * intervalMinutes * 60_000);
    return {
      id: `${medId}-${firstTakenAt.getTime()}-${index}`,
      medId,
      time: toTimeValue(reminderTime),
      days: [...allDays],
      enabled: true,
      lastTaken: index === 0 ? firstTakenLabel : undefined,
    };
  });
};

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>>;
};

type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

const MedicationList = () => {
  const { isPremium } = usePremium();
  const [medications, setMedications] = useState<Medication[]>(() => {
    const stored = loadStoredMedications();
    return stored.length > 0 ? stored : sampleMeds;
  });
  const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dose: "", dosesPerDay: "1" });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("Point your camera at a medication barcode");
  const [scannerError, setScannerError] = useState("");
  const [isScannerLoading, setIsScannerLoading] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [showReminders, setShowReminders] = useState<string | null>(null); // medId
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  const scanFrameRef = useRef<number | null>(null);
  const hasDetectedRef = useRef(false);

  const isValidMedicine = MEDICINES_LIST.some(
    (m) => m.toLowerCase() === newMed.name.toLowerCase()
  );
  const parsedDosesPerDay = Number.parseInt(newMed.dosesPerDay, 10);
  const hasValidDosesPerDay = Number.isFinite(parsedDosesPerDay) && parsedDosesPerDay >= 1 && parsedDosesPerDay <= 12;

  const handleNameChange = (value: string) => {
    setNewMed({ ...newMed, name: value });
    setActiveSuggestion(-1);
    if (value.length >= 2) {
      const filtered = MEDICINES_LIST.filter((m) =>
        m.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (name: string) => {
    setNewMed({ ...newMed, name });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    saveStoredMedications(medications);
  }, [medications]);

  const stopScanner = useCallback(() => {
    if (scanFrameRef.current !== null) {
      cancelAnimationFrame(scanFrameRef.current);
      scanFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    detectorRef.current = null;
    setIsScannerLoading(false);
  }, []);

  const handleBarcodeDetected = useCallback((rawValue: string) => {
    const code = rawValue.trim();
    if (!code) return;

    setScannedBarcode(code);
    const matchedMedicine = lookupMedicineByBarcode(code);

    if (matchedMedicine) {
      setNewMed((prev) => ({ ...prev, name: matchedMedicine }));
      setShowSuggestions(false);
      setSuggestions([]);
      setActiveSuggestion(-1);
      setScannerStatus(`Scanned ${code} and matched ${matchedMedicine}`);
    } else {
      setScannerStatus(`Scanned ${code}. We could not match it yet, so enter medicine name manually.`);
    }

    setShowScanner(false);
  }, []);

  useEffect(() => {
    if (!showScanner) {
      stopScanner();
      return;
    }

    let cancelled = false;
    hasDetectedRef.current = false;

    const startScanner = async () => {
      setScannerError("");
      setScannerStatus("Starting camera...");
      setIsScannerLoading(true);

      if (!navigator.mediaDevices?.getUserMedia) {
        setScannerError("Camera access is unavailable in this browser.");
        setIsScannerLoading(false);
        return;
      }

      const detectorConstructor = (window as Window & { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
      if (!detectorConstructor) {
        setScannerError("Barcode scanning is not supported here. Try Chrome or Edge for live scanning.");
        setIsScannerLoading(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          throw new Error("Video preview failed to initialize.");
        }

        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        await video.play();

        detectorRef.current = new detectorConstructor({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
        });

        setScannerStatus("Point the barcode inside the guide frame");
        setIsScannerLoading(false);

        const scanLoop = async () => {
          if (cancelled || !videoRef.current || !detectorRef.current) return;

          try {
            if (videoRef.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
              const results = await detectorRef.current.detect(videoRef.current);
              const detected = results.find((result) => result.rawValue?.trim())?.rawValue;

              if (detected && !hasDetectedRef.current) {
                hasDetectedRef.current = true;
                handleBarcodeDetected(detected);
                return;
              }
            }
          } catch {
            // Keep scanning even if one detection frame fails.
          }

          scanFrameRef.current = requestAnimationFrame(scanLoop);
        };

        scanFrameRef.current = requestAnimationFrame(scanLoop);
      } catch {
        setScannerError("Unable to access camera. Please allow permissions and try again.");
        setIsScannerLoading(false);
      }
    };

    void startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [showScanner, stopScanner, handleBarcodeDetected]);

  const addMedication = () => {
    if (!isValidMedicine || !newMed.dose || !hasValidDosesPerDay) return;
    const doseValue = newMed.dose.replace(/[^0-9.]/g, "");
    if (!doseValue) return;
    const medId = Date.now().toString();
    const now = new Date();
    const firstReminderTime = toTimeValue(now);

    setMedications([
      ...medications,
      {
        id: medId,
        name: newMed.name,
        dose: `${doseValue}mg`,
        frequency: formatDoseFrequency(parsedDosesPerDay),
        time: "As directed",
        dosesPerDay: parsedDosesPerDay,
      },
    ]);
    setReminders((prev) => [
      ...prev,
      {
        id: `${medId}-first`,
        medId,
        time: firstReminderTime,
        days: [...allDays],
        enabled: true,
      },
    ]);
    setNewMed({ name: "", dose: "", dosesPerDay: "1" });
    setScannedBarcode("");
    setScannerError("");
    setScannerStatus("Point your camera at a medication barcode");
    setShowScanner(false);
    setShowAdd(false);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
    setReminders(reminders.filter((r) => r.medId !== id));
  };

  const getMedReminders = (medId: string) => reminders.filter((r) => r.medId === medId);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const markTaken = (id: string) => {
    const firstTakenAt = new Date();
    const firstTakenLabel = `Today, ${firstTakenAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

    setReminders((prev) => {
      const targetReminder = prev.find((r) => r.id === id);
      if (!targetReminder) return prev;

      const medication = medications.find((med) => med.id === targetReminder.medId);
      if (!medication) {
        return prev.map((r) =>
          r.id === id ? { ...r, lastTaken: firstTakenLabel, time: toTimeValue(firstTakenAt) } : r
        );
      }

      const dosesPerDay = getDosesPerDay(medication);
      if (dosesPerDay <= 1) {
        return prev.map((r) =>
          r.id === id ? { ...r, lastTaken: firstTakenLabel, time: toTimeValue(firstTakenAt) } : r
        );
      }

      const generatedReminders = buildAutoRemindersFromFirstDose(
        targetReminder.medId,
        dosesPerDay,
        firstTakenAt,
        firstTakenLabel,
      );

      return [
        ...prev.filter((r) => r.medId !== targetReminder.medId),
        ...generatedReminders,
      ];
    });
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">My Medications</h1>
          <p className="text-sm text-muted-foreground">{medications.length} active medications</p>
        </div>
        <Button variant="hero" size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {/* Add medication form */}
      {showAdd && (
        <div className="mb-6 rounded-2xl border bg-card p-4 shadow-sm animate-fade-in">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">Add Medication</h3>
            <button
              onClick={() => {
                setShowAdd(false);
                setShowSuggestions(false);
                setShowScanner(false);
                setScannerError("");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing a medicine name..."
                value={newMed.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                autoComplete="off"
              />
              {newMed.name.length >= 2 && !isValidMedicine && (
                <p className="mt-1 text-xs text-destructive">Please select a valid medicine from the list</p>
              )}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-popover shadow-lg"
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => selectSuggestion(s)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                        i === activeSuggestion ? "bg-accent text-accent-foreground" : "text-popover-foreground"
                      }`}
                    >
                      <Pill className="h-3.5 w-3.5 text-primary" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant={showScanner ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setScannerError("");
                  setShowScanner((prev) => !prev);
                }}
              >
                <ScanLine className="h-4 w-4" />
                {showScanner ? "Close Scanner" : "Scan Barcode"}
              </Button>
              {scannedBarcode && (
                <p className="truncate text-xs text-muted-foreground">
                  Last scan: {scannedBarcode}
                </p>
              )}
            </div>

            {showScanner && (
              <div className="rounded-xl border bg-muted/20 p-3 animate-fade-in">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Live Barcode Scanner
                  </p>
                  <button
                    onClick={() => setShowScanner(false)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-black">
                  {scannerError ? (
                    <div className="flex h-52 items-center justify-center px-4 text-center text-xs text-white/85">
                      {scannerError}
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        className="h-52 w-full object-cover"
                        muted
                        autoPlay
                        playsInline
                      />
                      <div className="pointer-events-none absolute inset-4 rounded-lg border-2 border-dashed border-white/75" />
                      {isScannerLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <p className={`mt-2 text-xs ${scannerError ? "text-destructive" : "text-muted-foreground"}`}>
                  {scannerError || scannerStatus}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Dose (e.g. 500)"
                  value={newMed.dose}
                  onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">mg</span>
              </div>
              <div className="relative w-32">
                <input
                  type="number"
                  min={1}
                  max={12}
                  step={1}
                  placeholder="1"
                  value={newMed.dosesPerDay}
                  onChange={(e) => setNewMed({ ...newMed, dosesPerDay: e.target.value })}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">times/day</span>
              </div>
            </div>
            {!hasValidDosesPerDay && (
              <p className="text-xs text-destructive">Enter a frequency between 1 and 12 times per day.</p>
            )}
            <Button variant="hero" onClick={addMedication} disabled={!isValidMedicine || !newMed.dose || !hasValidDosesPerDay}>
              Add Medication
            </Button>
          </div>
        </div>
      )}

      {/* Medication cards */}
      <div className="flex flex-col gap-3">
        {medications.map((med) => {
          const medReminders = getMedReminders(med.id);
          const activeReminders = medReminders.filter((r) => r.enabled);
          const isReminderExpanded = showReminders === med.id;

          return (
            <div key={med.id} className="rounded-2xl border bg-card shadow-sm transition-all">
              {/* Main med info row */}
              <div
                onClick={() => setSelectedMed(med)}
                className="group flex cursor-pointer items-center gap-4 p-4 transition-all hover:bg-muted/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{med.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" /> {med.dose}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {med.frequency}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeMedication(med.id); }}
                    className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Reminders section (premium) */}
              {isPremium && (
                <div className="border-t px-4 pb-3 pt-2">
                  <button
                    onClick={() => setShowReminders(isReminderExpanded ? null : med.id)}
                    className="flex w-full items-center gap-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Bell className="h-3 w-3" />
                    <span>
                      {activeReminders.length > 0
                        ? `${activeReminders.length} reminder${activeReminders.length !== 1 ? "s" : ""} active`
                        : "No reminders set"}
                    </span>
                    <span className="ml-auto text-[10px]">{isReminderExpanded ? "Hide" : "Manage"}</span>
                  </button>

                  {isReminderExpanded && (
                    <div className="mt-2 flex flex-col gap-2 animate-fade-in">
                      {medReminders.map((reminder) => (
                        <div
                          key={reminder.id}
                          className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs transition-all ${
                            reminder.enabled ? "bg-background" : "bg-muted/50 opacity-60"
                          }`}
                        >
                          <button onClick={() => toggleReminder(reminder.id)} className="shrink-0">
                            {reminder.enabled ? (
                              <Bell className="h-4 w-4 text-primary" />
                            ) : (
                              <BellOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{reminder.time}</span>
                              <span className="text-muted-foreground">
                                {reminder.days.length === 7 ? "Every day" : reminder.days.join(", ")}
                              </span>
                            </div>
                            {reminder.lastTaken && (
                              <p className="mt-0.5 text-[10px] text-success font-medium flex items-center gap-1">
                                <Check className="h-2.5 w-2.5" /> Taken: {reminder.lastTaken}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {reminder.enabled && !reminder.lastTaken && (
                              <button
                                onClick={() => markTaken(reminder.id)}
                                className="rounded-md bg-success/10 px-2 py-1 text-[10px] font-bold text-success hover:bg-success/20 transition-colors"
                              >
                                Take
                              </button>
                            )}
                            <button
                              onClick={() => removeReminder(reminder.id)}
                              className="p-0.5 text-muted-foreground hover:text-danger transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <p className="rounded-xl border bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
                        Tap <span className="font-semibold text-foreground">Take</span> on the first dose and we automatically calculate the rest of today&apos;s reminders based on your times/day.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MedicationDetail
        open={!!selectedMed}
        onOpenChange={(open) => { if (!open) setSelectedMed(null); }}
        medication={selectedMed}
      />
    </div>
  );
};

export default MedicationList;
