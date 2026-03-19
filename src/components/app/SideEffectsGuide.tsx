import { AlertCircle, CheckCircle2, Phone, Stethoscope } from "lucide-react";

interface SideEffect {
  medication: string;
  effects: {
    category: "common" | "less-common" | "urgent";
    items: string[];
  }[];
  whenToCall: string;
  duration: string;
}

const sideEffects: SideEffect[] = [
  {
    medication: "Metformin",
    effects: [
      { category: "common", items: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"] },
      { category: "less-common", items: ["Loss of appetite", "Headache", "Muscle pain"] },
      { category: "urgent", items: ["Severe muscle pain", "Difficulty breathing", "Unusual fatigue", "Yellowing of skin"] },
    ],
    whenToCall: "Call your pharmacist if stomach issues persist for more than 2 weeks. Seek urgent care for breathing difficulty or severe muscle pain.",
    duration: "Stomach side effects typically improve within 2-4 weeks as your body adjusts.",
  },
  {
    medication: "Lisinopril",
    effects: [
      { category: "common", items: ["Dry cough", "Dizziness", "Headache"] },
      { category: "less-common", items: ["Fatigue", "Nausea", "Rash"] },
      { category: "urgent", items: ["Swelling of face/lips/tongue", "Fainting", "Severe dizziness", "Chest pain"] },
    ],
    whenToCall: "Persistent cough — speak with your pharmacist. Swelling of face or tongue — call 999 immediately.",
    duration: "Dry cough may persist while taking the medication. Dizziness usually improves within a few days.",
  },
  {
    medication: "Atorvastatin",
    effects: [
      { category: "common", items: ["Muscle aches", "Joint pain", "Mild digestive issues"] },
      { category: "less-common", items: ["Headache", "Difficulty sleeping", "Dizziness"] },
      { category: "urgent", items: ["Severe muscle pain/weakness", "Dark urine", "Yellowing of eyes/skin", "Unusual fatigue"] },
    ],
    whenToCall: "Unexplained muscle pain — contact your doctor within 24 hours. Dark urine or yellowing skin — seek urgent care.",
    duration: "Mild muscle aches may come and go. Report persistent muscle symptoms to your doctor.",
  },
];

const categoryConfig = {
  common: { label: "Common", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
  "less-common": { label: "Less Common", color: "text-warning", bg: "bg-warning/10", icon: AlertCircle },
  urgent: { label: "Seek Urgent Care", color: "text-danger", bg: "bg-danger/10", icon: Phone },
};

const SideEffectsGuide = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Side Effects Guide</h1>
        <p className="text-sm text-muted-foreground">
          Know what's normal and when to seek help
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sideEffects.map((med) => (
          <div key={med.medication} className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">{med.medication}</h2>

            <div className="mb-4 flex flex-col gap-3">
              {med.effects.map((effect) => {
                const config = categoryConfig[effect.category];
                const Icon = config.icon;
                return (
                  <div key={effect.category}>
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span className={`text-xs font-bold uppercase tracking-wide ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {effect.items.map((item) => (
                        <span
                          key={item}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t pt-3">
              <div className="flex items-start gap-2">
                <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm">{med.whenToCall}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-sm">⏱️</span>
                <p className="text-sm text-muted-foreground">{med.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideEffectsGuide;
