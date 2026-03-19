import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

type Severity = "high" | "moderate" | "safe";

interface Interaction {
  drugs: [string, string];
  severity: Severity;
  description: string;
  advice: string;
}

const interactions: Interaction[] = [
  {
    drugs: ["Metformin", "Lisinopril"],
    severity: "moderate",
    description: "Lisinopril may increase the blood sugar-lowering effect of Metformin.",
    advice: "Monitor blood sugar levels more frequently. Report any symptoms of hypoglycemia to your doctor.",
  },
  {
    drugs: ["Atorvastatin", "Grapefruit"],
    severity: "high",
    description: "Grapefruit can significantly increase Atorvastatin levels in your blood, raising the risk of serious side effects.",
    advice: "Avoid grapefruit and grapefruit juice while taking Atorvastatin.",
  },
  {
    drugs: ["Metformin", "Atorvastatin"],
    severity: "safe",
    description: "No clinically significant interaction is expected between these medications.",
    advice: "Continue taking both medications as prescribed.",
  },
];

const severityConfig = {
  high: {
    bg: "bg-danger/10",
    border: "border-danger/20",
    icon: AlertTriangle,
    iconColor: "text-danger",
    label: "High Risk",
    labelBg: "bg-danger/10 text-danger",
  },
  moderate: {
    bg: "bg-warning/10",
    border: "border-warning/20",
    icon: Info,
    iconColor: "text-warning",
    label: "Moderate",
    labelBg: "bg-warning/10 text-warning",
  },
  safe: {
    bg: "bg-success/10",
    border: "border-success/20",
    icon: CheckCircle2,
    iconColor: "text-success",
    label: "Safe",
    labelBg: "bg-success/10 text-success",
  },
};

const InteractionChecker = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Interaction Checker</h1>
        <p className="text-sm text-muted-foreground">
          Based on your current medications
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "High Risk", count: interactions.filter((i) => i.severity === "high").length, color: "text-danger" },
          { label: "Moderate", count: interactions.filter((i) => i.severity === "moderate").length, color: "text-warning" },
          { label: "Safe", count: interactions.filter((i) => i.severity === "safe").length, color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-3 text-center shadow-sm">
            <span className={`text-2xl font-extrabold ${stat.color}`}>{stat.count}</span>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Interactions list */}
      <div className="flex flex-col gap-3">
        {interactions.map((interaction, i) => {
          const config = severityConfig[interaction.severity];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl border ${config.border} ${config.bg} p-4`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${config.iconColor}`} />
                  <span className="font-bold">
                    {interaction.drugs[0]} + {interaction.drugs[1]}
                  </span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.labelBg}`}>
                  {config.label}
                </span>
              </div>
              <p className="mb-2 text-sm">{interaction.description}</p>
              <p className="text-sm font-medium text-muted-foreground">
                💡 {interaction.advice}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractionChecker;
