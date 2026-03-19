import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Pill, X, Clock, Droplets } from "lucide-react";

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
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dose: "", frequency: "Once daily" });

  const addMedication = () => {
    if (!newMed.name || !newMed.dose) return;
    setMedications([
      ...medications,
      { id: Date.now().toString(), name: newMed.name, dose: newMed.dose, frequency: newMed.frequency, time: "As directed" },
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
            <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Medication name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Dose (e.g. 500mg)"
                value={newMed.dose}
                onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
                className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
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
            <Button variant="hero" onClick={addMedication}>Add Medication</Button>
          </div>
        </div>
      )}

      {/* Medication cards */}
      <div className="flex flex-col gap-3">
        {medications.map((med) => (
          <div
            key={med.id}
            className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
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
            <button
              onClick={() => removeMedication(med.id)}
              className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationList;
