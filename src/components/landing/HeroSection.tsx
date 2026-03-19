import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroIllustration from "@/assets/hero-illustration.png";
import { Shield, Pill, Bell } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pt-40 md:pb-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
              Medication safety, simplified
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Ensuring your medications work in{" "}
              <span className="text-gradient">harmony</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Personalized drug interaction checks, safety nudges, and side effect guides — all in one app designed for patients managing complex prescriptions.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/app">Get Started Free</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="#features">See How It Works</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-success" /> HIPAA Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Pill className="h-4 w-4 text-primary" /> 10k+ Medications
              </span>
              <span className="flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-accent" /> Daily Nudges
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-hero opacity-10 blur-3xl" />
            <img
              src={heroIllustration}
              alt="HarmoniMed medication safety illustration"
              className="relative z-10 w-full max-w-md animate-fade-in drop-shadow-2xl lg:max-w-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
