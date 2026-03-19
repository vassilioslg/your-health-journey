import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/harmonimed-logo.png";
import { Pill, AlertTriangle, Bell, BookOpen, Plus, Search, ArrowLeft, X } from "lucide-react";
import MedicationList from "@/components/app/MedicationList";
import InteractionChecker from "@/components/app/InteractionChecker";
import SafetyNudges from "@/components/app/SafetyNudges";
import SideEffectsGuide from "@/components/app/SideEffectsGuide";

type Tab = "medications" | "interactions" | "nudges" | "side-effects";

const tabs = [
  { id: "medications" as Tab, label: "My Medications", icon: Pill },
  { id: "interactions" as Tab, label: "Interactions", icon: AlertTriangle },
  { id: "nudges" as Tab, label: "Safety Nudges", icon: Bell },
  { id: "side-effects" as Tab, label: "Side Effects", icon: BookOpen },
];

const AppDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("medications");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* App Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            <img src={logo} alt="HarmoniMed" className="h-7 w-7" />
            <span className="text-lg font-bold">HarmoniMed</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        <div className="container max-w-2xl py-6">
          {activeTab === "medications" && <MedicationList />}
          {activeTab === "interactions" && <InteractionChecker />}
          {activeTab === "nudges" && <SafetyNudges />}
          {activeTab === "side-effects" && <SideEffectsGuide />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
        <div className="container flex max-w-2xl items-stretch justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-primary" : ""}`} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppDashboard;
