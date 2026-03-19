import { createContext, useContext, useState, ReactNode } from "react";

interface PremiumContextType {
  isPremium: boolean;
  togglePremium: () => void;
  showUpgrade: boolean;
  setShowUpgrade: (show: boolean) => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem("harmonimed-premium") === "true";
  });
  const [showUpgrade, setShowUpgrade] = useState(false);

  const togglePremium = () => {
    const next = !isPremium;
    setIsPremium(next);
    localStorage.setItem("harmonimed-premium", String(next));
  };

  return (
    <PremiumContext.Provider value={{ isPremium, togglePremium, showUpgrade, setShowUpgrade }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider");
  return ctx;
};
