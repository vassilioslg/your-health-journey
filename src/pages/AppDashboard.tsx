import { useState } from "react";
import logo from "@/assets/harmonimed-logo.png";
import { Pill, AlertTriangle, Bell, MessageCircle, Bot, FileText, Users } from "lucide-react";
import MedicationList from "@/components/app/MedicationList";
import InteractionChecker from "@/components/app/InteractionChecker";
import SafetyNudges from "@/components/app/SafetyNudges";
import SymptomLogger from "@/components/app/SymptomLogger";
import OnboardingFlow from "@/components/app/OnboardingFlow";
import HealthReports from "@/components/app/HealthReports";
import AIHealthChat from "@/components/app/AIHealthChat";
import UpgradeModal from "@/components/app/UpgradeModal";
import CaregiverDashboard from "@/components/app/CaregiverDashboard";
import { useUserProfile } from "@/components/app/UserProfileContext";
import { useCaregiver } from "@/components/app/CaregiverContext";

type Tab = "medications" | "interactions" | "symptom-log" | "nudges" | "reports" | "ai-chat" | "caregiver";

const allTabs: { id: Tab; label: string; icon: typeof Pill }[] = [
  { id: "medications", label: "Meds", icon: Pill },
  { id: "interactions", label: "Interactions", icon: AlertTriangle },
  { id: "symptom-log", label: "Log", icon: MessageCircle },
  { id: "nudges", label: "Nudges", icon: Bell },
  { id: "caregiver", label: "Caregiver", icon: Users },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "ai-chat", label: "AI Chat", icon: Bot },
];

const AppDashboard = () => {
  const { profile } = useUserProfile();
  const { unreadCount } = useCaregiver();
  const [activeTab, setActiveTab] = useState<Tab>("medications");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!profile.onboardingComplete) {
    return <OnboardingFlow />;
  }

  const bottomNavTabs = allTabs.filter((tab) =>
    ["medications", "interactions", "symptom-log"].includes(tab.id),
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <UpgradeModal />

      {/* App Header */}
      <header className="sticky top-0 z-[60] glass border-b">
        <div className="container flex h-20 items-center justify-start">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="ml-0.5 flex h-16 w-16 items-center justify-center rounded-xl transition-colors hover:bg-muted/60"
            aria-label="Open app menu"
            aria-expanded={isMenuOpen}
            aria-controls="app-feature-menu"
          >
            <img src={logo} alt="HarmoniMed menu" className="h-14 w-14 object-contain" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          />
          <div id="app-feature-menu" className="fixed left-0 right-0 top-20 z-50 border-b bg-card shadow-lg">
            <div className="container max-w-2xl py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Features</p>
              <div className="grid grid-cols-2 gap-2">
                {allTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="relative">
                      <tab.icon className="h-4 w-4" />
                      {tab.id === "caregiver" && unreadCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-24">
        <div className="container max-w-2xl py-6">
          {activeTab === "medications" && <MedicationList />}
          {activeTab === "interactions" && <InteractionChecker />}
          {activeTab === "symptom-log" && <SymptomLogger />}
          {activeTab === "nudges" && <SafetyNudges />}
          {activeTab === "caregiver" && <CaregiverDashboard />}
          {activeTab === "reports" && <HealthReports />}
          {activeTab === "ai-chat" && <AIHealthChat />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
        <div className="container max-w-2xl">
          <div className="flex items-stretch justify-around">
            {bottomNavTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
                  {tab.id === "caregiver" && unreadCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px]">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppDashboard;
