import { createContext, useContext, useState, ReactNode } from "react";

export interface CaregiverLink {
  id: string;
  patientName: string;
  relationship: string;
  shareCode: string;
  linkedAt: string;
  notifications: {
    missedDose: boolean;
    newSymptom: boolean;
    urgentAlert: boolean;
  };
}

export interface CaregiverAlert {
  id: string;
  type: "missed_dose" | "new_symptom" | "urgent" | "refill";
  patientName: string;
  message: string;
  time: string;
  read: boolean;
}

interface CaregiverContextType {
  isCaregiverMode: boolean;
  toggleCaregiverMode: () => void;
  linkedPatients: CaregiverLink[];
  addPatient: (name: string, relationship: string) => void;
  removePatient: (id: string) => void;
  updateNotifications: (id: string, notifications: CaregiverLink["notifications"]) => void;
  alerts: CaregiverAlert[];
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
  unreadCount: number;
  shareCode: string;
}

const sampleAlerts: CaregiverAlert[] = [
  { id: "a1", type: "missed_dose", patientName: "Mum", message: "Missed Metformin 500mg (8:00 AM dose)", time: "35 min ago", read: false },
  { id: "a2", type: "new_symptom", patientName: "Mum", message: "Logged new symptom: Dizziness (severity 7/10)", time: "2 hours ago", read: false },
  { id: "a3", type: "urgent", patientName: "Dad", message: "Reported chest tightness — check in recommended", time: "4 hours ago", read: false },
  { id: "a4", type: "missed_dose", patientName: "Dad", message: "Missed Atorvastatin 20mg (evening dose)", time: "Yesterday", read: true },
  { id: "a5", type: "refill", patientName: "Mum", message: "Lisinopril 10mg running low — 3 days supply left", time: "Yesterday", read: true },
];

const samplePatients: CaregiverLink[] = [
  {
    id: "p1",
    patientName: "Mum",
    relationship: "Mother",
    shareCode: "HM-7K3X-9R2P",
    linkedAt: "2 weeks ago",
    notifications: { missedDose: true, newSymptom: true, urgentAlert: true },
  },
  {
    id: "p2",
    patientName: "Dad",
    relationship: "Father",
    shareCode: "HM-4M8N-1T6Q",
    linkedAt: "1 week ago",
    notifications: { missedDose: true, newSymptom: false, urgentAlert: true },
  },
];

const CaregiverContext = createContext<CaregiverContextType | undefined>(undefined);

const generateShareCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `HM-${seg()}-${seg()}`;
};

export const CaregiverProvider = ({ children }: { children: ReactNode }) => {
  const [isCaregiverMode, setIsCaregiverMode] = useState(() =>
    localStorage.getItem("harmonimed-caregiver") === "true"
  );
  const [linkedPatients, setLinkedPatients] = useState<CaregiverLink[]>(samplePatients);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>(sampleAlerts);
  const [shareCode] = useState(() => generateShareCode());

  const toggleCaregiverMode = () => {
    const next = !isCaregiverMode;
    setIsCaregiverMode(next);
    localStorage.setItem("harmonimed-caregiver", String(next));
  };

  const addPatient = (name: string, relationship: string) => {
    setLinkedPatients((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        patientName: name,
        relationship,
        shareCode: generateShareCode(),
        linkedAt: "Just now",
        notifications: { missedDose: true, newSymptom: true, urgentAlert: true },
      },
    ]);
  };

  const removePatient = (id: string) => {
    setLinkedPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const updateNotifications = (id: string, notifications: CaregiverLink["notifications"]) => {
    setLinkedPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, notifications } : p))
    );
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const clearAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <CaregiverContext.Provider
      value={{
        isCaregiverMode,
        toggleCaregiverMode,
        linkedPatients,
        addPatient,
        removePatient,
        updateNotifications,
        alerts,
        markAlertRead,
        clearAlerts,
        unreadCount,
        shareCode,
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
};

export const useCaregiver = () => {
  const ctx = useContext(CaregiverContext);
  if (!ctx) throw new Error("useCaregiver must be used within CaregiverProvider");
  return ctx;
};
