import { ReactNode } from "react";
import { usePremium } from "./PremiumContext";
import UpgradeModal from "./UpgradeModal";

interface PremiumGateProps {
  children: ReactNode;
  featureName: string;
}

const PremiumGate = ({ children, featureName }: PremiumGateProps) => {
  const { isPremium, setShowUpgrade } = usePremium();

  if (isPremium) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
        <span className="text-3xl">👑</span>
      </div>
      <h2 className="mb-2 text-xl font-extrabold">Premium Feature</h2>
      <p className="mb-1 text-sm text-muted-foreground max-w-sm">
        <span className="font-semibold text-foreground">{featureName}</span> is available with HarmoniMed Premium.
      </p>
      <p className="mb-6 text-xs text-muted-foreground max-w-xs">
        Unlock medication reminders, health reports, AI-powered health chat, and more.
      </p>
      <button
        onClick={() => setShowUpgrade(true)}
        className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      >
        Upgrade to Premium
      </button>
    </div>
  );
};

export default PremiumGate;
