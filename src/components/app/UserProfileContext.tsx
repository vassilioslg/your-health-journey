import { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  age: string;
  weight: string;
  weightUnit: "kg" | "lbs";
  conditions: string[];
  allergies: string[];
  lifestyle: {
    smoking: boolean;
    alcohol: "none" | "occasional" | "regular";
    diet: string;
    exerciseFrequency: string;
  };
  symptoms: string[];
  onboardingComplete: boolean;
}

const defaultProfile: UserProfile = {
  age: "",
  weight: "",
  weightUnit: "kg",
  conditions: [],
  allergies: [],
  lifestyle: {
    smoking: false,
    alcohol: "none",
    diet: "",
    exerciseFrequency: "",
  },
  symptoms: [],
  onboardingComplete: false,
};

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  startOnboarding: () => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("harmonimed-profile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("harmonimed-profile", JSON.stringify(updated));
      return updated;
    });
  };

  const completeOnboarding = () => {
    updateProfile({ onboardingComplete: true });
  };

  const startOnboarding = () => {
    updateProfile({ onboardingComplete: false });
  };

  const resetProfile = () => {
    localStorage.removeItem("harmonimed-profile");
    setProfile(defaultProfile);
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, completeOnboarding, startOnboarding, resetProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
};
