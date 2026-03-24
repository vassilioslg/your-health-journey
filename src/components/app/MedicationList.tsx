import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pill, X, Clock, Droplets, ChevronRight } from "lucide-react";
import { MEDICINES_LIST } from "@/data/medicines";
import MedicationDetail from "@/components/app/MedicationDetail";

interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  time: string;
}

const sampleMeds: Medication[] = [
  { id: "1", name: "Metformin", dose: "500mg", frequency: "Twice daily", time: "Morning & Evening" },
  { id: "2", name: "Lisinopril", dose: "10mg", frequency: "Once daily", time: "Morning" },
  { id: "3", name: "Atorvastatin", dose: "20mg", frequency: "Once daily", time: "Evening" },
];

const MedicationList = () => {
  const [medications, setMedications] = useState<Medication[]>(sampleMeds);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dose: "", frequency: "Once daily" });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
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

  // Close suggestions on outside click
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
            {/* Medicine name with autocomplete */}
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
        {medications.map((med) => (
          <div
            key={med.id}
            onClick={() => setSelectedMed(med)}
            className="group flex cursor-pointer items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
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
        ))}
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
