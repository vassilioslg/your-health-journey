import { getMedicineInfo } from "@/data/medicineInfo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pill, Clock, AlertTriangle, UtensilsCrossed, SkipForward, ShieldAlert, Thermometer, CheckCircle2, Phone, Stethoscope } from "lucide-react";

interface MedicationDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication: { name: string; dose: string; frequency: string; time: string } | null;
}

const categoryConfig = {
  common: { label: "Common", color: "text-success", bg: "bg-success/10", icon: CheckCircle2 },
  lessCommon: { label: "Less Common", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  urgent: { label: "Seek Urgent Care", color: "text-destructive", bg: "bg-destructive/10", icon: Phone },
};

const MedicationDetail = ({ open, onOpenChange, medication }: MedicationDetailProps) => {
  if (!medication) return null;
  const info = getMedicineInfo(medication.name);
  const isEmbeddedPreview = typeof window !== "undefined" && window.self !== window.top;

  const infoSections = [
    { icon: Pill, title: "What is it for?", content: info.whatIsItFor },
    { icon: Clock, title: "How to take", content: `${info.howToTake}\n\nYour dose: ${medication.dose} — ${medication.frequency}` },
    { icon: UtensilsCrossed, title: "Food & drink", content: info.foodAndDrink },
    { icon: SkipForward, title: "Missed dose?", content: info.missedDose },
    { icon: ShieldAlert, title: "Important warnings", content: info.warnings.join(" · ") },
    { icon: Thermometer, title: "Storage", content: info.storage },
  ];

  const sideEffectCategories = [
    { key: "common" as const, items: info.sideEffectsByCategory.common },
    { key: "lessCommon" as const, items: info.sideEffectsByCategory.lessCommon },
    { key: "urgent" as const, items: info.sideEffectsByCategory.urgent },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`z-[70] left-0 top-0 h-[100dvh] max-h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none px-4 pb-4 ${
          isEmbeddedPreview
            ? "pt-24 [&>button]:top-7"
            : "pt-[calc(env(safe-area-inset-top)+2.75rem)] [&>button]:top-[calc(env(safe-area-inset-top)+1.8rem)]"
        } [&>button]:right-4 sm:left-[50%] sm:top-[50%] sm:h-[90vh] sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:p-6 sm:[&>button]:top-4`}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 pr-10 text-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            {medication.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{medication.dose} · {medication.frequency}</p>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          {/* Info sections */}
          {infoSections.map((section) => (
            <div key={section.title} className="rounded-xl border bg-muted/30 p-3.5">
              <div className="mb-1.5 flex items-center gap-2">
                <section.icon className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-bold">{section.title}</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{section.content}</p>
            </div>
          ))}

          {/* Side Effects Guide */}
          <div className="rounded-xl border bg-muted/30 p-3.5">
            <div className="mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold">Side Effects Guide</h4>
            </div>

            <div className="flex flex-col gap-3">
              {sideEffectCategories.map((cat) => {
                const config = categoryConfig[cat.key];
                const Icon = config.icon;
                return (
                  <div key={cat.key}>
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      <span className={`text-xs font-bold uppercase tracking-wide ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item) => (
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

            {/* When to call & duration */}
            <div className="mt-3 space-y-2 border-t pt-3">
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                <p className="text-xs leading-relaxed">{info.whenToCall}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs">⏱️</span>
                <p className="text-xs leading-relaxed text-muted-foreground">{info.sideEffectDuration}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-2 rounded-lg bg-destructive/5 p-3 text-xs text-destructive">
          ⚠️ This information is for general guidance only. Always follow your doctor's or pharmacist's specific instructions.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationDetail;
