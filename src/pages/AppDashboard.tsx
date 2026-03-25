import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/harmonimed-logo.png";
import { Pill, AlertTriangle, Bell, MessageCircle, ArrowLeft, Crown, Bot, FileText } from "lucide-react";
import MedicationList from "@/components/app/MedicationList";
import InteractionChecker from "@/components/app/InteractionChecker";
import SafetyNudges from "@/components/app/SafetyNudges";

import SymptomLogger from "@/components/app/SymptomLogger";
import OnboardingFlow from "@/components/app/OnboardingFlow";

import HealthReports from "@/components/app/HealthReports";
import AIHealthChat from "@/components/app/AIHealthChat";
import UpgradeModal from "@/components/app/UpgradeModal";
import { useUserProfile } from "@/components/app/UserProfileContext";
import { usePremium } from "@/components/app/PremiumContext";

type Tab = "medications" | "interactions" | "symptom-log" | "nudges" | "reports" | "ai-chat";

const tabs: { id: Tab; label: string; icon: typeof Pill; premium?: boolean }[] = [
  { id: "medications", label: "Meds", icon: Pill },
  { id: "interactions", label: "Interactions", icon: AlertTriangle },
  { id: "symptom-log", label: "Log", icon: MessageCircle },
  { id: "nudges", label: "Nudges", icon: Bell },
  { id: "reports", label: "Reports", icon: FileText, premium: true },
  { id: "ai-chat", label: "AI Chat", icon: Bot, premium: true },
];

const AppDashboard = () => {
  const { profile } = useUserProfile();
  const { isPremium, setShowUpgrade } = usePremium();
  const [activeTab, setActiveTab] = useState<Tab>("medications");

  if (!profile.onboardingComplete) {
    return <OnboardingFlow />;
  }

  const freeTabs = tabs.filter((t) => !t.premium);
  const premiumTabs = tabs.filter((t) => t.premium);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <UpgradeModal />

      {/* App Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            <img src={logo} alt="HarmoniMed" className="h-9 w-9" />
          </Link>
          {!isPremium && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <Crown className="h-3 w-3" /> Upgrade
            </button>
          )}
          {isPremium && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              <Crown className="h-3 w-3" /> Premium
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-28">
        <div className="container max-w-2xl py-6">
          {activeTab === "medications" && <MedicationList />}
          {activeTab === "interactions" && <InteractionChecker />}
          {activeTab === "symptom-log" && <SymptomLogger />}
          {activeTab === "nudges" && <SafetyNudges />}
          
          
          {activeTab === "reports" && <HealthReports />}
          {activeTab === "ai-chat" && <AIHealthChat />}
        </div>
      </main>

      {/* Bottom Navigation - two rows */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
        <div className="container max-w-2xl">
          {/* Free tabs */}
          <div className="flex items-stretch justify-around">
            {freeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            ))}
          </div>
          {/* Premium tabs */}
          <div className="flex items-stretch justify-around border-t border-dashed border-primary/20 bg-primary/[0.02]">
            {premiumTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-primary" : ""}`} />
                  {!isPremium && (
                    <Crown className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 text-accent" />
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
