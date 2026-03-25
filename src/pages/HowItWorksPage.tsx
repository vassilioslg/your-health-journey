import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import heroIllustration from "@/assets/hero-illustration.png";

const HowItWorksPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-y-[12%] right-[-18%] hidden w-[78%] lg:block">
          <img
            src={heroIllustration}
            alt=""
            aria-hidden="true"
            className="w-full opacity-[0.14] blur-[1px]"
          />
        </div>
        <div className="absolute inset-x-0 top-[18%] flex justify-center lg:hidden">
          <img
            src={heroIllustration}
            alt=""
            aria-hidden="true"
            className="w-[130%] max-w-none opacity-[0.08]"
          />
        </div>
      </div>

      <div className="container pt-6 md:pt-8">
        <Button variant="ghost" size="sm" className="mb-2 text-foreground" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="-mt-16 md:-mt-20">
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default HowItWorksPage;
