import { useState } from "react";
import { Bell, BellOff, Check, Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PremiumGate from "./PremiumGate";

interface Reminder {
  id: string;
  medication: string;
  time: string;
  days: string[];
  enabled: boolean;
  lastTaken?: string;
}

const sampleReminders: Reminder[] = [
  { id: "1", medication: "Metformin 500mg", time: "08:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true, lastTaken: "Today, 8:02 AM" },
  { id: "2", medication: "Lisinopril 10mg", time: "08:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
  { id: "3", medication: "Atorvastatin 20mg", time: "21:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: true },
  { id: "4", medication: "Metformin 500mg", time: "18:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], enabled: false },
];

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MedicationReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(sampleReminders);
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({ medication: "", time: "08:00", days: [...allDays] });

  const toggleReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const markTaken = (id: string) => {
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    setReminders(reminders.map((r) => (r.id === id ? { ...r, lastTaken: timeStr } : r)));
  };

  const addReminder = () => {
    if (!newReminder.medication) return;
    setReminders([
      ...reminders,
      { id: Date.now().toString(), ...newReminder, enabled: true },
    ]);
    setNewReminder({ medication: "", time: "08:00", days: [...allDays] });
    setShowAdd(false);
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const toggleDay = (day: string) => {
    setNewReminder((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  return (
    <PremiumGate featureName="Medication Reminders">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Reminders</h1>
            <p className="text-sm text-muted-foreground">
              {reminders.filter((r) => r.enabled).length} active reminders
            </p>
          </div>
          <Button variant="hero" size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="mb-6 rounded-2xl border bg-card p-4 shadow-sm animate-fade-in">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">New Reminder</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Medication name"
                value={newReminder.medication}
                onChange={(e) => setNewReminder({ ...newReminder, medication: e.target.value })}
                className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-1.5">
                {allDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                      newReminder.days.includes(day)
                        ? "bg-primary text-primary-foreground"
                        : "border bg-background text-muted-foreground"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <Button variant="hero" onClick={addReminder}>Set Reminder</Button>
            </div>
          </div>
        )}

        {/* Reminder cards */}
        <div className="flex flex-col gap-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`group rounded-2xl border p-4 shadow-sm transition-all ${
                reminder.enabled ? "bg-card" : "bg-muted/50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    reminder.enabled ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  {reminder.enabled ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{reminder.medication}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{reminder.time}</span>
                    <span>•</span>
                    <span>{reminder.days.length === 7 ? "Every day" : reminder.days.join(", ")}</span>
                  </div>
                  {reminder.lastTaken && (
                    <p className="mt-0.5 text-[10px] text-success font-medium flex items-center gap-1">
                      <Check className="h-2.5 w-2.5" /> Taken: {reminder.lastTaken}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {reminder.enabled && !reminder.lastTaken && (
                    <button
                      onClick={() => markTaken(reminder.id)}
                      className="rounded-lg bg-success/10 px-3 py-1.5 text-xs font-bold text-success hover:bg-success/20 transition-colors"
                    >
                      Take
                    </button>
                  )}
                  <button
                    onClick={() => removeReminder(reminder.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PremiumGate>
  );
};

export default MedicationReminders;
