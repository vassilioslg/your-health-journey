import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, Pill, AlertTriangle, Lightbulb } from "lucide-react";
import PremiumGate from "./PremiumGate";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: Pill, text: "Can I take ibuprofen with my current meds?" },
  { icon: AlertTriangle, text: "What should I avoid while on Metformin?" },
  { icon: Lightbulb, text: "Tips for managing statin side effects" },
];

// Simulated AI responses based on keywords
const getSimulatedResponse = (input: string): string => {
  const lower = input.toLowerCase();

  if (lower.includes("ibuprofen")) {
    return "Based on your current medications (Metformin, Lisinopril, Atorvastatin), here's what you should know about ibuprofen:\n\n⚠️ **Lisinopril + Ibuprofen**: NSAIDs like ibuprofen can reduce the blood pressure-lowering effect of Lisinopril and may increase kidney stress.\n\n⚠️ **Metformin + Ibuprofen**: NSAIDs can affect kidney function, which may increase Metformin levels in your blood.\n\n**Recommendation**: Paracetamol (acetaminophen) is generally a safer alternative for occasional pain relief with your current medications. Always consult your pharmacist before taking any new medication.";
  }

  if (lower.includes("metformin") && (lower.includes("avoid") || lower.includes("food") || lower.includes("what"))) {
    return "Here are key things to avoid while taking **Metformin**:\n\n🚫 **Excessive alcohol** — increases risk of lactic acidosis\n🚫 **Skipping meals** — can cause blood sugar to drop too low\n🚫 **High-sugar foods** — counteracts the medication's purpose\n\n✅ **Do**: Take with meals to reduce stomach side effects\n✅ **Do**: Stay hydrated\n✅ **Do**: Get regular B12 level checks (Metformin can lower B12 over time)\n\n💡 Your profile shows no alcohol consumption — that's great for Metformin safety!";
  }

  if (lower.includes("statin") || lower.includes("atorvastatin") || lower.includes("side effect")) {
    return "Here are evidence-based tips for managing **Atorvastatin** side effects:\n\n**For muscle aches** (most common):\n• Take CoQ10 supplements (discuss with your doctor first)\n• Stay active — gentle exercise can actually help\n• Take your dose at bedtime for better tolerability\n\n**For digestive issues**:\n• Take with a light snack\n• Avoid large fatty meals close to dosing time\n\n⚠️ **Important**: Report any unexplained muscle pain, dark urine, or unusual fatigue to your doctor immediately — these could indicate a rare but serious condition.\n\n🍊 Remember: Avoid grapefruit products (flagged in your interaction checker).";
  }

  if (lower.includes("headache") || lower.includes("pain")) {
    return "For pain management with your current medications:\n\n✅ **Paracetamol** — Generally safe with all your current meds\n⚠️ **Ibuprofen/NSAIDs** — Use with caution (can interact with Lisinopril)\n🚫 **Aspirin (high dose)** — Discuss with doctor first\n\nIf you're experiencing frequent headaches, this could be related to your **Lisinopril** — it's a known side effect that usually improves within a few weeks. Track the frequency in your symptom log so you can discuss with your doctor.";
  }

  return "Based on your health profile and current medications (Metformin, Lisinopril, Atorvastatin), I'd recommend discussing this with your pharmacist for personalized advice.\n\nIn the meantime, you can:\n• Log any symptoms in the **Symptom Logger** for tracking\n• Check the **Interaction Checker** for drug compatibility\n• Review the **Side Effects Guide** for your medications\n\nIs there anything specific about your medications I can help with?";
};

const AIHealthChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your HarmoniMed AI assistant. I have access to your medication profile and can help answer questions about your medications, side effects, and interactions.\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getSimulatedResponse(content);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const formatContent = (text: string) => {
    // Simple markdown-like rendering
    return text.split("\n").map((line, i) => {
      // Bold
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line === "") return <br key={i} />;
      return <p key={i} className="mb-0.5" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <PremiumGate featureName="AI Health Chat">
      <div className="flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">AI Health Chat</h1>
            <p className="text-[10px] text-muted-foreground">Personalized to your medication profile</p>
          </div>
          <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" /> AI-Powered
          </span>
        </div>

        {/* Chat messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                }`}
              >
                {formatContent(msg.content)}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="my-3 flex flex-col gap-1.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.text}
                onClick={() => sendMessage(prompt.text)}
                className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-left text-xs font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <prompt.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                {prompt.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Ask about your medications..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </PremiumGate>
  );
};

export default AIHealthChat;
