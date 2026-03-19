import { Bell, Coffee, Wine, Apple, Clock, Sun, Moon } from "lucide-react";

interface Nudge {
  icon: typeof Bell;
  title: string;
  description: string;
  time: string;
  type: "warning" | "tip" | "reminder";
}

const nudges: Nudge[] = [
  {
    icon: Coffee,
    title: "Take Metformin with food",
    description: "Taking Metformin with meals reduces stomach upset and improves absorption.",
    time: "Morning & Evening",
    type: "tip",
  },
  {
    icon: Wine,
    title: "Avoid alcohol with Metformin",
    description: "Alcohol can increase the risk of lactic acidosis. Limit or avoid alcohol.",
    time: "Daily",
    type: "warning",
  },
  {
    icon: Apple,
    title: "Avoid grapefruit with Atorvastatin",
    description: "Grapefruit interferes with how your body processes this medication. Avoid all grapefruit products.",
    time: "Daily",
    type: "warning",
  },
  {
    icon: Clock,
    title: "Don't stop Lisinopril abruptly",
    description: "Stopping suddenly can cause a rebound increase in blood pressure. Always consult your doctor first.",
    time: "Ongoing",
    type: "reminder",
  },
  {
    icon: Sun,
    title: "Best time for Lisinopril: morning",
    description: "Taking Lisinopril in the morning aligns with your body's natural blood pressure patterns.",
    time: "Morning",
    type: "tip",
  },
  {
    icon: Moon,
    title: "Take Atorvastatin at bedtime",
    description: "Cholesterol production peaks at night. Taking statins before bed maximizes effectiveness.",
    time: "Evening",
    type: "tip",
  },
];

const typeConfig = {
  warning: { bg: "bg-warning/10", border: "border-warning/20", dot: "bg-warning" },
  tip: { bg: "bg-primary/5", border: "border-primary/20", dot: "bg-primary" },
  reminder: { bg: "bg-accent/5", border: "border-accent/20", dot: "bg-accent" },
};

const SafetyNudges = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Daily Safety Nudges</h1>
        <p className="text-sm text-muted-foreground">
          Personalized guidance for your medications
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {nudges.map((nudge, i) => {
          const config = typeConfig[nudge.type];
          return (
            <div
              key={i}
              className={`rounded-2xl border ${config.border} ${config.bg} p-4 transition-all hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm">
                  <nudge.icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                    <h3 className="font-bold text-sm">{nudge.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{nudge.description}</p>
                  <span className="mt-2 inline-block text-xs font-medium text-muted-foreground">
                    ⏰ {nudge.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyNudges;
