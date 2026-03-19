import { usePremium } from "./PremiumContext";
import { X, Check, Bell, FileText, Bot, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "£0",
    period: "/forever",
    features: [
      "Up to 5 medications",
      "Basic interaction checker",
      "Side effects guide",
      "Daily safety nudges",
      "Symptom logger",
    ],
    current: true,
  },
  {
    name: "Premium",
    price: "£4.99",
    period: "/month",
    features: [
      "Unlimited medications",
      "Medication reminders",
      "AI health chatbot",
      "Health reports & exports",
      "Priority support",
      "Family sharing (coming soon)",
    ],
    highlighted: true,
  },
];

const premiumPerks = [
  { icon: Bell, label: "Smart Reminders", desc: "Never miss a dose" },
  { icon: FileText, label: "Health Reports", desc: "PDF summaries for your doctor" },
  { icon: Bot, label: "AI Health Chat", desc: "Ask anything about your meds" },
  { icon: Sparkles, label: "Personalized Insights", desc: "Tailored to your profile" },
];

const UpgradeModal = () => {
  const { showUpgrade, setShowUpgrade, togglePremium } = usePremium();

  if (!showUpgrade) return null;

  const handleUpgrade = () => {
    togglePremium();
    setShowUpgrade(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowUpgrade(false)} />
      <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-t-3xl sm:rounded-t-3xl text-primary-foreground">
          <button
            onClick={() => setShowUpgrade(false)}
            className="absolute right-4 top-4 rounded-full bg-primary-foreground/20 p-1.5 hover:bg-primary-foreground/30"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-center">
            <span className="text-4xl mb-2 block">👑</span>
            <h2 className="text-2xl font-extrabold mb-1">Go Premium</h2>
            <p className="text-sm opacity-90">Unlock the full power of HarmoniMed</p>
          </div>
        </div>

        {/* Perks grid */}
        <div className="grid grid-cols-2 gap-3 p-5">
          {premiumPerks.map((perk) => (
            <div key={perk.label} className="rounded-xl border bg-background p-3 text-center">
              <perk.icon className="mx-auto mb-1.5 h-5 w-5 text-primary" />
              <p className="text-xs font-bold">{perk.label}</p>
              <p className="text-[10px] text-muted-foreground">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="flex gap-3 px-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex-1 rounded-2xl border p-4 ${
                plan.highlighted ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "bg-background"
              }`}
            >
              <p className="text-xs font-bold text-muted-foreground mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-0.5 mb-3">
                <span className="text-2xl font-extrabold">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs">
                    <Check className="h-3.5 w-3.5 shrink-0 text-success mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="p-5">
          <button
            onClick={handleUpgrade}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
          >
            Start Premium — £4.99/month
          </button>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Demo mode — no actual payment will be processed
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
