import { useState } from "react";
import {
  Users, Bell, BellRing, Share2, AlertTriangle, Pill,
  Heart, Clock, Plus, X, Check, Copy, Shield, Settings,
  ChevronRight, Activity, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCaregiver, CaregiverLink } from "./CaregiverContext";

const alertTypeConfig = {
  missed_dose: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Missed Dose" },
  new_symptom: { icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10", label: "New Symptom" },
  urgent: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Urgent" },
  refill: { icon: Pill, color: "text-primary", bg: "bg-primary/10", label: "Refill Needed" },
};

type CaregiverTab = "alerts" | "patients" | "share";

const CaregiverDashboard = () => {
  const {
    linkedPatients, addPatient, removePatient, updateNotifications,
    alerts, markAlertRead, clearAlerts, unreadCount, shareCode,
  } = useCaregiver();

  const [activeTab, setActiveTab] = useState<CaregiverTab>("alerts");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", relationship: "", shareCode: "" });
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.relationship) return;
    addPatient(newPatient.name, newPatient.relationship, newPatient.shareCode);
    setNewPatient({ name: "", relationship: "", shareCode: "" });
    setShowAddPatient(false);
  };

  const tabs: { id: CaregiverTab; label: string; icon: typeof Bell; badge?: number }[] = [
    { id: "alerts", label: "Alerts", icon: BellRing, badge: unreadCount },
    { id: "patients", label: "Patients", icon: Users },
    { id: "share", label: "Share Profile", icon: Share2 },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Caregiver Mode</h1>
            <p className="text-sm text-muted-foreground">Monitor and support your loved ones</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="mb-5 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts tab */}
      {activeTab === "alerts" && (
        <div className="animate-fade-in">
          {unreadCount > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">{unreadCount} unread alerts</p>
              <button onClick={clearAlerts} className="text-xs font-medium text-primary hover:underline">
                Mark all read
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {alerts.map((alert) => {
              const config = alertTypeConfig[alert.type];
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  onClick={() => markAlertRead(alert.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-sm ${
                    alert.read ? "bg-card opacity-70" : "bg-card border-l-4 border-l-primary"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">• {alert.patientName}</span>
                        {!alert.read && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-muted-foreground">No alerts yet</p>
              <p className="text-xs text-muted-foreground/70">You'll be notified of missed doses and symptoms</p>
            </div>
          )}
        </div>
      )}

      {/* Patients tab */}
      {activeTab === "patients" && (
        <div className="animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              {linkedPatients.length} linked patient{linkedPatients.length !== 1 ? "s" : ""}
            </p>
            <Button variant="hero" size="sm" onClick={() => setShowAddPatient(true)}>
              <Plus className="h-4 w-4" /> Link Patient
            </Button>
          </div>

          {showAddPatient && (
            <div className="mb-4 rounded-2xl border bg-card p-4 shadow-sm animate-fade-in">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-sm">Link New Patient</h3>
                <button onClick={() => setShowAddPatient(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  placeholder="Patient's name (e.g. Mum, Dad)"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Patient share code (e.g. HM-7K3X-9R2P)"
                  value={newPatient.shareCode}
                  onChange={(e) => setNewPatient({ ...newPatient, shareCode: e.target.value })}
                  className="rounded-lg border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={newPatient.relationship}
                  onChange={(e) => setNewPatient({ ...newPatient, relationship: e.target.value })}
                  className="rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select relationship</option>
                  <option>Mother</option>
                  <option>Father</option>
                  <option>Spouse</option>
                  <option>Grandparent</option>
                  <option>Child</option>
                  <option>Sibling</option>
                  <option>Friend</option>
                  <option>Client</option>
                </select>
                <Button variant="hero" onClick={handleAddPatient} disabled={!newPatient.name || !newPatient.relationship}>
                  Link Patient
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {linkedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onRemove={() => removePatient(patient.id)}
                onUpdateNotifications={(n) => updateNotifications(patient.id, n)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Share Profile tab */}
      {activeTab === "share" && (
        <div className="animate-fade-in">
          <div className="rounded-2xl border bg-card p-5 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Share2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Your Share Code</h3>
                <p className="text-xs text-muted-foreground">Give this code to a caregiver to link your profile</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl bg-muted/50 px-4 py-3 text-center">
                <p className="font-mono text-lg font-bold tracking-widest text-primary">{shareCode}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyCode(shareCode)} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="font-bold mb-3">What caregivers can see</h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: Pill, label: "Medication list & schedule", desc: "Current meds, doses, and timing" },
                { icon: Clock, label: "Missed dose alerts", desc: "Notified when a dose is overdue" },
                { icon: Activity, label: "Symptom updates", desc: "New symptoms logged and severity" },
                { icon: AlertTriangle, label: "Urgent health flags", desc: "Serious side effects or interactions" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-primary">Perfect for families</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Help elderly parents, loved ones with chronic conditions, or anyone who needs medication support. 
                  Caregivers get real-time peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Patient card sub-component
const PatientCard = ({
  patient,
  onRemove,
  onUpdateNotifications,
}: {
  patient: CaregiverLink;
  onRemove: () => void;
  onUpdateNotifications: (n: CaregiverLink["notifications"]) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border bg-card shadow-sm transition-all">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex cursor-pointer items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <Users className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">{patient.patientName}</h4>
          <p className="text-xs text-muted-foreground">{patient.relationship} • Linked {patient.linkedAt}</p>
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 animate-fade-in">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Notification Preferences
          </p>

          <div className="flex flex-col gap-3">
            {([
              { key: "missedDose" as const, label: "Missed dose alerts", icon: Clock },
              { key: "newSymptom" as const, label: "New symptom logged", icon: MessageCircle },
              { key: "urgentAlert" as const, label: "Urgent health alerts", icon: AlertTriangle },
            ]).map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <Switch
                  checked={patient.notifications[item.key]}
                  onCheckedChange={(checked) =>
                    onUpdateNotifications({ ...patient.notifications, [item.key]: checked })
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2">
            <div>
              <p className="text-[10px] text-muted-foreground">Share code</p>
              <p className="font-mono text-xs font-bold">{patient.shareCode}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="text-xs font-medium text-destructive hover:underline"
            >
              Unlink
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverDashboard;
