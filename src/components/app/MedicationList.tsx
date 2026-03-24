import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pill, X, Clock, Droplets, ChevronRight, Bell, BellOff, Check } from "lucide-react";
import { MEDICINES_LIST } from "@/data/medicines";
import MedicationDetail from "@/components/app/MedicationDetail";
import PremiumGate from "./PremiumGate";
import { usePremium } from "./PremiumContext";

interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  time: string;
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
  { id: "1", name: "Metformin", dose: "500mg", frequency: "Twice daily", time: "Morning & Evening" },
  { id: "2", name: "Lisinopril", dose: "10mg", frequency: "Once daily", time: "Morning" },
  { id: "3", name: "Atorvastatin", dose: "20mg", frequency: "Once daily", time: "Evening" },
];

const sampleReminders: Reminder[] = [
  { id: "r1", medId: "1", time: "08:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true, lastTaken: "Today, 8:02 AM" },
  { id: "r2", medId: "1", time: "18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
  { id: "r3", medId: "2", time: "08:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
  { id: "r4", medId: "3", time: "21:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
];

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MedicationList = () => {
  const { isPremium } = usePremium();
  const [medications, setMedications] = useState<Medication[]>(sampleMeds);
  const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dose: "", frequency: "Once daily" });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showReminders, setShowReminders] = useState<string | null>(null); // medId
  const [addingReminder, setAddingReminder] = useState<string | null>(null); // medId
  const [newReminderTime, setNewReminderTime] = useState("08:00");
  const [newReminderDays, setNewReminderDays] = useState([...allDays]);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidMedicine = MEDICINES_LIST.some(
    (m) => m.toLowerCase() === newMed.name.toLowerCase()
  );

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

  const addMedication = () => {
    if (!isValidMedicine || !newMed.dose) return;
    const doseValue = newMed.dose.replace(/[^0-9.]/g, "");
    if (!doseValue) return;
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        name: newMed.name,
        dose: `${doseValue}mg`,
        frequency: newMed.frequency,
        time: "As directed",
      },
    ]);
    setNewMed({ name: "", dose: "", frequency: "Once daily" });
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
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    setReminders(reminders.map((r) => (r.id === id ? { ...r, lastTaken: timeStr } : r)));
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const addReminder = (medId: string) => {
    setReminders([
      ...reminders,
      { id: Date.now().toString(), medId, time: newReminderTime, days: [...newReminderDays], enabled: true },
    ]);
    setAddingReminder(null);
    setNewReminderTime("08:00");
    setNewReminderDays([...allDays]);
  };

  const toggleDay = (day: string) => {
    setNewReminderDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
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
            <button onClick={() => { setShowAdd(false); setShowSuggestions(false); }} className="text-muted-foreground hover:text-foreground">
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
              <select
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>As needed</option>
              </select>
            </div>
            <Button variant="hero" onClick={addMedication} disabled={!isValidMedicine || !newMed.dose}>
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
          const isAddingReminder = addingReminder === med.id;

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

                      {/* Add reminder form */}
                      {isAddingReminder ? (
                        <div className="rounded-xl border bg-muted/20 p-3 animate-fade-in">
                          <div className="flex flex-col gap-2">
                            <input
                              type="time"
                              value={newReminderTime}
                              onChange={(e) => setNewReminderTime(e.target.value)}
                              className="rounded-lg border bg-background px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex gap-1">
                              {allDays.map((day) => (
                                <button
                                  key={day}
                                  onClick={() => toggleDay(day)}
                                  className={`flex-1 rounded-md py-1 text-[10px] font-medium transition-colors ${
                                    newReminderDays.includes(day)
                                      ? "bg-primary text-primary-foreground"
                                      : "border bg-background text-muted-foreground"
                                  }`}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="hero" size="sm" className="flex-1 text-xs" onClick={() => addReminder(med.id)}>
                                Set
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs" onClick={() => setAddingReminder(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingReminder(med.id)}
                          className="flex items-center justify-center gap-1 rounded-xl border border-dashed py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <Plus className="h-3 w-3" /> Add reminder
                        </button>
                      )}
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
