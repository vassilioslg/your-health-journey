import { getMedicineInfo } from "@/data/medicineInfo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pill, Clock, AlertTriangle, UtensilsCrossed, SkipForward, ShieldAlert, Thermometer } from "lucide-react";

interface MedicationDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medication: { name: string; dose: string; frequency: string; time: string } | null;
}

const MedicationDetail = ({ open, onOpenChange, medication }: MedicationDetailProps) => {
  if (!medication) return null;
  const info = getMedicineInfo(medication.name);

  const sections = [
    { icon: Pill, title: "What is it for?", content: info.whatIsItFor },
    { icon: Clock, title: "How to take", content: `${info.howToTake}\n\nYour dose: ${medication.dose} — ${medication.frequency}` },
    { icon: AlertTriangle, title: "Common side effects", content: info.commonSideEffects.join(" · ") },
    { icon: UtensilsCrossed, title: "Food & drink", content: info.foodAndDrink },
    { icon: SkipForward, title: "Missed dose?", content: info.missedDose },
    { icon: ShieldAlert, title: "Important warnings", content: info.warnings.join(" · ") },
    { icon: Thermometer, title: "Storage", content: info.storage },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            {medication.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{medication.dose} · {medication.frequency}</p>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border bg-muted/30 p-3.5">
              <div className="mb-1.5 flex items-center gap-2">
                <section.icon className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-bold">{section.title}</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        <p className="mt-2 rounded-lg bg-destructive/5 p-3 text-xs text-destructive">
          ⚠️ This information is for general guidance only. Always follow your doctor's or pharmacist's specific instructions.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationDetail;
