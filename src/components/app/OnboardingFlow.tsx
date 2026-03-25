import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "./UserProfileContext";
import {
  User, Heart, AlertTriangle, Activity, Thermometer,
  ChevronRight, ChevronLeft, Check, X, Plus
} from "lucide-react";
import logo from "@/assets/harmonimed-logo.png";

const commonConditions = [
  "Diabetes", "Hypertension", "Heart Disease", "Asthma", "COPD",
  "Arthritis", "Depression", "Anxiety", "Thyroid Disorder", "Kidney Disease",
];

const commonAllergies = [
  "Penicillin", "Sulfa Drugs", "Aspirin", "NSAIDs", "Codeine",
  "Latex", "Shellfish", "Peanuts", "Gluten", "Dairy",
];

const commonSymptoms = [
  "Headache", "Fatigue", "Nausea", "Dizziness", "Joint Pain",
  "Insomnia", "Shortness of Breath", "Chest Pain", "Swelling", "Rash",
];

const STEPS = ["basics", "conditions", "allergies", "lifestyle", "symptoms"] as const;
type Step = typeof STEPS[number];

const stepMeta: Record<Step, { title: string; subtitle: string; icon: typeof User }> = {
  basics: { title: "About You", subtitle: "Help us personalize your experience", icon: User },
  conditions: { title: "Health Conditions", subtitle: "Select any that apply to you", icon: Heart },
  allergies: { title: "Allergies & Sensitivities", subtitle: "So we can flag risky medications", icon: AlertTriangle },
  lifestyle: { title: "Lifestyle", subtitle: "These factors affect drug interactions", icon: Activity },
  symptoms: { title: "Current Symptoms", subtitle: "What are you experiencing?", icon: Thermometer },
};

const OnboardingFlow = () => {
  const { profile, updateProfile, completeOnboarding } = useUserProfile();
  const [step, setStep] = useState(0);
  const [customInput, setCustomInput] = useState("");

  const currentStep = STEPS[step];
  const meta = stepMeta[currentStep];
  const StepIcon = meta.icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  const toggleArrayItem = (field: "conditions" | "allergies" | "symptoms", item: string) => {
    const current = profile[field];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateProfile({ [field]: updated });
  };

  const addCustomItem = (field: "conditions" | "allergies" | "symptoms") => {
    const trimmed = customInput.trim();
    if (trimmed && trimmed.length <= 100 && !profile[field].includes(trimmed)) {
      updateProfile({ [field]: [...profile[field], trimmed] });
      setCustomInput("");
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else completeOnboarding();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const ChipSelector = ({
    items,
    selected,
    field,
  }: {
    items: string[];
    selected: string[];
    field: "conditions" | "allergies" | "symptoms";
  }) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleArrayItem(field, item)}
              className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {item}
              {isSelected && <X className="ml-1.5 inline h-3 w-3" />}
            </button>
          );
        })}
      </div>

      {/* Custom additions */}
      {selected.filter((s) => !items.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected
            .filter((s) => !items.includes(s))
            .map((item) => (
              <button
                key={item}
                onClick={() => toggleArrayItem(field, item)}
                className="rounded-full border border-primary bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary transition-all"
              >
                {item} <X className="ml-1.5 inline h-3 w-3" />
              </button>
            ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add other..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value.slice(0, 100))}
          onKeyDown={(e) => e.key === "Enter" && addCustomItem(field)}
          className="flex-1 rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <Button variant="outline" size="sm" onClick={() => addCustomItem(field)} disabled={!customInput.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center px-5 pt-6 pb-2">
        <div className="flex items-center">
          <img src={logo} alt="HarmoniMed" className="h-14 w-14 object-contain" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-5 py-3">
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <StepIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{meta.title}</h2>
            <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
          </div>
        </div>

        {currentStep === "basics" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Age</label>
              <input
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 45"
                value={profile.age}
                onChange={(e) => updateProfile({ age: e.target.value.slice(0, 3) })}
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Weight</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="500"
                  placeholder="e.g. 70"
                  value={profile.weight}
                  onChange={(e) => updateProfile({ weight: e.target.value.slice(0, 4) })}
                  className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex overflow-hidden rounded-xl border">
                  {(["kg", "lbs"] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => updateProfile({ weightUnit: unit })}
                      className={`px-4 py-3 text-sm font-medium transition-colors ${
                        profile.weightUnit === unit
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "conditions" && (
          <ChipSelector items={commonConditions} selected={profile.conditions} field="conditions" />
        )}

        {currentStep === "allergies" && (
          <ChipSelector items={commonAllergies} selected={profile.allergies} field="allergies" />
        )}

        {currentStep === "lifestyle" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Do you smoke?</label>
              <div className="flex gap-3">
                {[
                  { label: "No", value: false },
                  { label: "Yes", value: true },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() =>
                      updateProfile({ lifestyle: { ...profile.lifestyle, smoking: opt.value } })
                    }
                    className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                      profile.lifestyle.smoking === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Alcohol consumption</label>
              <div className="flex gap-2">
                {(["none", "occasional", "regular"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      updateProfile({ lifestyle: { ...profile.lifestyle, alcohol: level } })
                    }
                    className={`flex-1 rounded-xl border py-3 text-sm font-medium capitalize transition-all ${
                      profile.lifestyle.alcohol === level
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Dietary preference</label>
              <input
                type="text"
                placeholder="e.g. Vegetarian, Low-sodium, Keto..."
                maxLength={100}
                value={profile.lifestyle.diet}
                onChange={(e) =>
                  updateProfile({ lifestyle: { ...profile.lifestyle, diet: e.target.value } })
                }
                className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Exercise frequency</label>
              <div className="flex flex-wrap gap-2">
                {["Sedentary", "1-2x/week", "3-4x/week", "Daily"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() =>
                      updateProfile({ lifestyle: { ...profile.lifestyle, exerciseFrequency: freq } })
                    }
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      profile.lifestyle.exerciseFrequency === freq
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === "symptoms" && (
          <ChipSelector items={commonSymptoms} selected={profile.symptoms} field="symptoms" />
        )}
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-card px-5 py-4">
        <div className="mx-auto flex max-w-2xl gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={back} className="flex-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}
          <Button variant="hero" size="lg" onClick={next} className="flex-1">
            {step === STEPS.length - 1 ? (
              <>
                <Check className="h-4 w-4" /> Finish Setup
              </>
            ) : (
              <>
                Continue <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
