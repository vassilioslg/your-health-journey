import { useState } from "react";
import { FileText, Download, Calendar, Pill, Activity, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PremiumGate from "./PremiumGate";

interface Report {
  id: string;
  title: string;
  date: string;
  type: "monthly" | "weekly" | "custom";
  status: "ready" | "generating";
}

const sampleReports: Report[] = [
  { id: "1", title: "Monthly Health Summary", date: "March 2026", type: "monthly", status: "ready" },
  { id: "2", title: "Weekly Symptom Report", date: "10-16 Mar 2026", type: "weekly", status: "ready" },
  { id: "3", title: "Medication Adherence Report", date: "February 2026", type: "monthly", status: "ready" },
];

const reportPreviewData = {
  medications: 3,
  adherenceRate: 94,
  symptomEntries: 12,
  interactionsChecked: 3,
  highRiskFlags: 1,
  daysTracked: 30,
};

const HealthReports = () => {
  const [reports] = useState<Report[]>(sampleReports);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  return (
    <PremiumGate featureName="Health Reports">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Health Reports</h1>
            <p className="text-sm text-muted-foreground">Generate & share reports with your doctor</p>
          </div>
          <Button variant="hero" size="sm" onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Generating...
              </span>
            ) : (
              <>
                <FileText className="h-4 w-4" /> Generate
              </>
            )}
          </Button>
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: "Medications", value: reportPreviewData.medications, icon: Pill, color: "text-primary" },
            { label: "Adherence", value: `${reportPreviewData.adherenceRate}%`, icon: TrendingUp, color: "text-success" },
            { label: "Symptoms", value: reportPreviewData.symptomEntries, icon: Activity, color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-3 text-center shadow-sm">
              <stat.icon className={`mx-auto mb-1 h-4 w-4 ${stat.color}`} />
              <span className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</span>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Report preview */}
        {showPreview && (
          <div className="mb-6 rounded-2xl border bg-card p-5 shadow-sm animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">Report Preview</h3>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <div className="mb-4 border-b pb-3">
                <h4 className="text-lg font-extrabold text-primary">HarmoniMed Health Report</h4>
                <p className="text-xs text-muted-foreground">Generated: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h5 className="font-bold mb-1.5 flex items-center gap-1.5"><Pill className="h-3.5 w-3.5 text-primary" /> Active Medications</h5>
                  <ul className="ml-5 list-disc text-muted-foreground space-y-0.5 text-xs">
                    <li>Metformin 500mg — Twice daily</li>
                    <li>Lisinopril 10mg — Once daily (morning)</li>
                    <li>Atorvastatin 20mg — Once daily (evening)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold mb-1.5 flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-warning" /> Symptom Summary</h5>
                  <p className="text-xs text-muted-foreground">12 symptoms logged this period. Most common: dizziness (4x), nausea (3x), headache (2x).</p>
                </div>

                <div>
                  <h5 className="font-bold mb-1.5 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-danger" /> Interaction Alerts</h5>
                  <p className="text-xs text-muted-foreground">1 high-risk interaction flagged: Atorvastatin + Grapefruit. 1 moderate interaction: Metformin + Lisinopril.</p>
                </div>

                <div>
                  <h5 className="font-bold mb-1.5 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-success" /> Adherence</h5>
                  <div className="w-full rounded-full bg-muted h-2.5">
                    <div className="rounded-full bg-success h-2.5" style={{ width: "94%" }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">94% adherence rate over 30 days — Excellent!</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="hero" size="sm" className="flex-1">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Share with Doctor
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Past reports */}
        <div>
          <h3 className="mb-3 font-bold text-sm text-muted-foreground">Past Reports</h3>
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{report.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{report.date}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PremiumGate>
  );
};

export default HealthReports;
