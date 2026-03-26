import { Button } from "@/components/ui/button";
import { useUserProfile } from "./UserProfileContext";
import { getStoredMedicationNames } from "@/lib/medicationsStorage";
import { UserRound, Heart, ShieldAlert, Thermometer, Pill, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileSection = () => {
  const { profile, startOnboarding, resetProfile } = useUserProfile();
  const navigate = useNavigate();
  const medicationNames = getStoredMedicationNames();

  const handleLogout = () => {
    resetProfile();
    navigate("/login");
  };

  const profileRows = [
    { label: "Age", value: profile.age || "Not set" },
    {
      label: "Weight",
      value: profile.weight ? `${profile.weight} ${profile.weightUnit}` : "Not set",
    },
    { label: "Smoking", value: profile.lifestyle.smoking ? "Yes" : "No" },
    { label: "Alcohol", value: profile.lifestyle.alcohol || "Not set" },
    { label: "Diet", value: profile.lifestyle.diet || "Not set" },
    {
      label: "Exercise",
      value: profile.lifestyle.exerciseFrequency || "Not set",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Your care context used to personalize app guidance.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={startOnboarding}>
          Edit Context
        </Button>
      </div>

      <div className="mb-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <UserRound className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Basics & Lifestyle</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {profileRows.map((row) => (
            <div key={row.label} className="rounded-xl border bg-muted/25 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {row.label}
              </p>
              <p className="mt-0.5 text-sm font-medium">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Conditions</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.conditions.length > 0 ? (
            profile.conditions.map((condition) => (
              <span key={condition} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                {condition}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No conditions added.</p>
          )}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Allergies & Sensitivities</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.allergies.length > 0 ? (
            profile.allergies.map((allergy) => (
              <span key={allergy} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                {allergy}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No allergies added.</p>
          )}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Pill className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Medication Context</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {medicationNames.length > 0 ? (
            medicationNames.map((medication) => (
              <span key={medication} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                {medication}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No medications added yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Current Symptoms</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.symptoms.length > 0 ? (
            profile.symptoms.map((symptom) => (
              <span key={symptom} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                {symptom}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No symptoms set in profile.</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-primary/5 p-3">
        <p className="text-xs text-muted-foreground">
          Keep this section updated so interaction checks and symptom analysis stay relevant to your context.
        </p>
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </div>
    </div>
  );
};

export default ProfileSection;
