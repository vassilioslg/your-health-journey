import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircle, AlertTriangle, CheckCircle2, Info, Clock,
  Send, Pill, Activity, X, ChevronDown, ChevronUp
} from "lucide-react";

// Known side effects database keyed by symptom → matching medications + severity
const symptomDatabase: Record<string, {
  medications: string[];
  severity: "high" | "moderate" | "low";
  explanation: string;
  advice: string;
}[]> = {
  "dizzy": [
    { medications: ["Lisinopril"], severity: "moderate", explanation: "Dizziness is a common side effect of Lisinopril, especially when standing up quickly (orthostatic hypotension).", advice: "Rise slowly from sitting/lying positions. If persistent or severe, contact your doctor." },
    { medications: ["Atorvastatin"], severity: "low", explanation: "Less common side effect of Atorvastatin.", advice: "Usually mild and temporary. Monitor and report if it worsens." },
  ],
  "dizziness": [
    { medications: ["Lisinopril"], severity: "moderate", explanation: "Dizziness is a common side effect of Lisinopril, especially when standing up quickly (orthostatic hypotension).", advice: "Rise slowly from sitting/lying positions. If persistent or severe, contact your doctor." },
    { medications: ["Atorvastatin"], severity: "low", explanation: "Less common side effect of Atorvastatin.", advice: "Usually mild and temporary. Monitor and report if it worsens." },
  ],
  "nausea": [
    { medications: ["Metformin"], severity: "moderate", explanation: "Nausea is one of the most common side effects of Metformin, especially in early weeks.", advice: "Take with food. Symptoms usually improve within 2-4 weeks. Talk to your pharmacist about extended-release options." },
  ],
  "headache": [
    { medications: ["Lisinopril"], severity: "low", explanation: "Headaches can occur with Lisinopril as your body adjusts.", advice: "Stay hydrated. Use paracetamol if needed. Usually resolves within a few days." },
    { medications: ["Metformin"], severity: "low", explanation: "Less common side effect of Metformin.", advice: "Monitor and stay hydrated." },
  ],
  "muscle pain": [
    { medications: ["Atorvastatin"], severity: "high", explanation: "Muscle pain is a well-known side effect of statins. In rare cases, it can indicate rhabdomyolysis — a serious condition.", advice: "Contact your doctor within 24 hours. If accompanied by dark urine or severe weakness, seek urgent care." },
  ],
  "muscle ache": [
    { medications: ["Atorvastatin"], severity: "high", explanation: "Muscle aches are a well-known side effect of statins. In rare cases, it can indicate rhabdomyolysis.", advice: "Contact your doctor within 24 hours. If accompanied by dark urine or severe weakness, seek urgent care." },
  ],
  "cough": [
    { medications: ["Lisinopril"], severity: "moderate", explanation: "A persistent dry cough is a very common side effect of ACE inhibitors like Lisinopril — affecting up to 15% of patients.", advice: "Speak with your pharmacist. Your doctor may switch you to an ARB (like Losartan) which doesn't cause cough." },
  ],
  "dry cough": [
    { medications: ["Lisinopril"], severity: "moderate", explanation: "A persistent dry cough is a very common side effect of ACE inhibitors like Lisinopril.", advice: "Speak with your pharmacist. Your doctor may switch you to an ARB (like Losartan) which doesn't cause cough." },
  ],
  "stomach": [
    { medications: ["Metformin"], severity: "moderate", explanation: "GI discomfort (stomach upset, bloating, diarrhea) is the most common side effect of Metformin.", advice: "Take with meals. If persistent beyond 2 weeks, ask about extended-release Metformin." },
  ],
  "diarrhea": [
    { medications: ["Metformin"], severity: "moderate", explanation: "Diarrhea is a common GI side effect of Metformin.", advice: "Take with meals. Usually improves over time. Consider extended-release formulation." },
  ],
  "fatigue": [
    { medications: ["Lisinopril"], severity: "low", explanation: "Fatigue can occur with blood pressure medications as your body adjusts to lower BP.", advice: "Usually improves within 1-2 weeks. Ensure adequate sleep and hydration." },
    { medications: ["Atorvastatin"], severity: "moderate", explanation: "Unusual fatigue with Atorvastatin could signal liver concerns.", advice: "If persistent, request liver function tests from your doctor." },
    { medications: ["Metformin"], severity: "moderate", explanation: "Fatigue with Metformin could indicate low blood sugar or vitamin B12 deficiency.", advice: "Check blood sugar levels. Ask your doctor about B12 supplementation." },
  ],
  "rash": [
    { medications: ["Lisinopril"], severity: "moderate", explanation: "Skin rash is a less common side effect of Lisinopril and may indicate an allergic reaction.", advice: "Contact your doctor. If accompanied by swelling of face/lips, seek emergency care." },
  ],
  "swelling": [
    { medications: ["Lisinopril"], severity: "high", explanation: "Swelling (angioedema) is a serious, potentially life-threatening side effect of ACE inhibitors.", advice: "If face, lips, tongue, or throat are swelling — call emergency services (999) immediately." },
  ],
  "breathing": [
    { medications: ["Metformin"], severity: "high", explanation: "Difficulty breathing with Metformin could indicate lactic acidosis — a rare but serious condition.", advice: "Seek urgent medical care immediately." },
  ],
  "chest pain": [
    { medications: ["Lisinopril", "Atorvastatin"], severity: "high", explanation: "Chest pain requires immediate evaluation. It may not be medication-related.", advice: "Call emergency services (999) immediately." },
  ],
  "insomnia": [
    { medications: ["Atorvastatin"], severity: "low", explanation: "Some patients report sleep difficulties with statins.", advice: "Try taking Atorvastatin in the morning instead of evening. Discuss with your pharmacist." },
  ],
  "metallic taste": [
    { medications: ["Metformin"], severity: "low", explanation: "Metallic taste is a common side effect of Metformin.", advice: "Usually temporary. Sugar-free mints or gum can help." },
  ],
};

// Interaction risks when symptoms occur with specific drug combos
const interactionAlerts: {
  symptom: string;
  drugs: string[];
  alert: string;
  severity: "high" | "moderate";
}[] = [
  {
    symptom: "dizzy",
    drugs: ["Metformin", "Lisinopril"],
    alert: "Dizziness while taking Metformin + Lisinopril together could indicate hypoglycemia — Lisinopril can enhance Metformin's blood sugar-lowering effect.",
    severity: "high",
  },
  {
    symptom: "dizziness",
    drugs: ["Metformin", "Lisinopril"],
    alert: "Dizziness while taking Metformin + Lisinopril together could indicate hypoglycemia — Lisinopril can enhance Metformin's blood sugar-lowering effect.",
    severity: "high",
  },
  {
    symptom: "muscle pain",
    drugs: ["Atorvastatin"],
    alert: "Muscle pain with statins requires attention. If you're also consuming grapefruit, it can significantly increase Atorvastatin levels and worsen muscle side effects.",
    severity: "high",
  },
  {
    symptom: "fatigue",
    drugs: ["Metformin", "Lisinopril"],
    alert: "Combined fatigue effects: Lisinopril lowers blood pressure while Metformin can affect blood sugar. Together they may amplify fatigue — check both BP and glucose levels.",
    severity: "moderate",
  },
];

interface LogEntry {
  id: string;
  symptom: string;
  timestamp: Date;
  matches: typeof symptomDatabase[string];
  interactionAlerts: typeof interactionAlerts;
}

const severityConfig = {
  high: { bg: "bg-danger/10", border: "border-danger/20", text: "text-danger", label: "High Risk" },
  moderate: { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning", label: "Moderate" },
  low: { bg: "bg-success/10", border: "border-success/20", text: "text-success", label: "Low Risk" },
};

const SymptomLogger = () => {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const analyzeSymptom = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed || trimmed.length > 200) return;

    // Find matching side effects
    const matches: typeof symptomDatabase[string] = [];
    const matchedInteractions: typeof interactionAlerts = [];

    Object.entries(symptomDatabase).forEach(([keyword, effects]) => {
      if (trimmed.includes(keyword)) {
        effects.forEach((e) => {
          if (!matches.some((m) => m.medications.join() === e.medications.join() && m.explanation === e.explanation)) {
            matches.push(e);
          }
        });
      }
    });

    interactionAlerts.forEach((ia) => {
      if (trimmed.includes(ia.symptom)) {
        matchedInteractions.push(ia);
      }
    });

    // Sort by severity
    const severityOrder = { high: 0, moderate: 1, low: 2 };
    matches.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const entry: LogEntry = {
      id: Date.now().toString(),
      symptom: input.trim(),
      timestamp: new Date(),
      matches,
      interactionAlerts: matchedInteractions,
    };

    setLogs([entry, ...logs]);
    setExpandedLog(entry.id);
    setInput("");
  };

  const removeLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
    if (expandedLog === id) setExpandedLog(null);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Symptom Log</h1>
        <p className="text-sm text-muted-foreground">
          Log how you're feeling — we'll check for side effects & interaction risks
        </p>
      </div>

      {/* Input area */}
      <div className="mb-6 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold">How are you feeling?</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. I'm feeling dizzy and nauseous..."
            value={input}
            maxLength={200}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeSymptom()}
            className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <Button variant="hero" size="default" onClick={analyzeSymptom} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {/* Quick symptom chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Dizzy", "Nausea", "Headache", "Muscle pain", "Fatigue", "Cough"].map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Log entries */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No symptoms logged yet</p>
          <p className="text-xs text-muted-foreground/60">
            Describe how you're feeling and we'll analyze it
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((log) => {
            const isExpanded = expandedLog === log.id;
            const hasHighRisk =
              log.matches.some((m) => m.severity === "high") ||
              log.interactionAlerts.some((ia) => ia.severity === "high");
            const hasMatches = log.matches.length > 0;

            return (
              <div
                key={log.id}
                className={`rounded-2xl border shadow-sm transition-all ${
                  hasHighRisk ? "border-danger/30 bg-danger/5" : "bg-card"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      hasHighRisk ? "bg-danger/10" : hasMatches ? "bg-warning/10" : "bg-success/10"
                    }`}
                  >
                    {hasHighRisk ? (
                      <AlertTriangle className="h-5 w-5 text-danger" />
                    ) : hasMatches ? (
                      <Info className="h-5 w-5 text-warning" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">"{log.symptom}"</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(log.timestamp)}</span>
                      <span>•</span>
                      <span>
                        {log.matches.length} match{log.matches.length !== 1 ? "es" : ""}
                      </span>
                      {log.interactionAlerts.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-danger font-medium">
                            {log.interactionAlerts.length} interaction risk{log.interactionAlerts.length !== 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeLog(log.id); }}
                      className="p-1 text-muted-foreground hover:text-danger"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3 animate-fade-in">
                    {/* Interaction alerts first (most important) */}
                    {log.interactionAlerts.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-danger">
                          <AlertTriangle className="h-3.5 w-3.5" /> Interaction Risks
                        </h4>
                        <div className="flex flex-col gap-2">
                          {log.interactionAlerts.map((ia, i) => {
                            const config = severityConfig[ia.severity];
                            return (
                              <div
                                key={i}
                                className={`rounded-xl ${config.bg} ${config.border} border p-3`}
                              >
                                <div className="mb-1 flex items-center gap-2">
                                  <Pill className={`h-4 w-4 ${config.text}`} />
                                  <span className="text-xs font-bold">
                                    {ia.drugs.join(" + ")}
                                  </span>
                                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text}`}>
                                    {config.label}
                                  </span>
                                </div>
                                <p className="text-xs leading-relaxed">{ia.alert}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Side effect matches */}
                    {log.matches.length > 0 ? (
                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          <Pill className="h-3.5 w-3.5" /> Possible Side Effects
                        </h4>
                        <div className="flex flex-col gap-2">
                          {log.matches.map((match, i) => {
                            const config = severityConfig[match.severity];
                            return (
                              <div
                                key={i}
                                className={`rounded-xl ${config.bg} ${config.border} border p-3`}
                              >
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-xs font-bold">
                                    {match.medications.join(", ")}
                                  </span>
                                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text}`}>
                                    {config.label}
                                  </span>
                                </div>
                                <p className="mb-1.5 text-xs leading-relaxed">{match.explanation}</p>
                                <p className="text-xs font-medium text-muted-foreground">💡 {match.advice}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl bg-success/10 p-3">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <p className="text-sm">
                          No known side effects or interaction risks found for your current medications.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SymptomLogger;
