import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProfileProvider } from "@/components/app/UserProfileContext";
import { PremiumProvider } from "@/components/app/PremiumContext";
import { CaregiverProvider } from "@/components/app/CaregiverContext";
import Index from "./pages/Index.tsx";
import AppDashboard from "./pages/AppDashboard.tsx";
import HowItWorksPage from "./pages/HowItWorksPage.tsx";
import PhonePreview from "./pages/PhonePreview.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProfileProvider>
      <PremiumProvider>
        <CaregiverProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/app" element={<AppDashboard />} />
              <Route path="/phone-preview" element={<PhonePreview />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </CaregiverProvider>
      </PremiumProvider>
    </UserProfileProvider>
  </QueryClientProvider>
);

export default App;
