import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroIllustration from "@/assets/hero-illustration.png";
import { Shield, Pill, Bell } from "lucide-react";
import logo from "@/assets/harmonimed-logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pb-10 pt-12 md:min-h-screen md:pt-20 md:pb-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-y-0 right-[-10%] hidden w-[70%] items-center justify-center lg:flex">
          <div className="absolute inset-0 rounded-full bg-gradient-hero opacity-10 blur-3xl" />
          <img
            src={heroIllustration}
            alt="HarmoniMed medication safety illustration"
            className="relative w-full max-w-2xl animate-fade-in opacity-35 drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="container">
        <div className="relative">
          <div className="absolute inset-x-0 top-8 -z-10 flex justify-center lg:hidden">
            <img
              src={heroIllustration}
              alt="HarmoniMed medication safety illustration"
              className="w-full max-w-lg animate-fade-in opacity-20 blur-[1px]"
            />
          </div>

          <div className="relative flex min-h-[calc(100svh-5.5rem)] max-w-2xl flex-col md:min-h-[calc(100vh-9rem)]">
            <div className="flex items-center justify-center pt-2 md:pt-8">
              <div className="-ml-12 inline-flex max-w-full items-center gap-0 md:-ml-7">
                <img
                  src={logo}
                  alt="HarmoniMed"
                  className="h-[clamp(5rem,18vw,10rem)] w-[clamp(4.5rem,18vw,8rem)] object-contain"
                />
                <span className="-ml-1 text-[clamp(2.9rem,12vw,6rem)] font-black tracking-tight text-[#000000] md:-ml-2">
                  HarmoniMed
                </span>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-6 pb-3 md:pb-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
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

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/app">Log In</Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/app">Sign Up</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="xl"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground"
                  asChild
                >
                  <Link to="/how-it-works">See How It Works</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 pb-1 pt-5 text-center md:pb-2 md:pt-6">
              <div className="inline-flex items-center gap-2">
                <img src={logo} alt="HarmoniMed" className="h-5 w-5" />
                <span className="text-lg font-bold tracking-tight text-foreground">HarmoniMed</span>
              </div>
              <p className="max-w-xl text-[clamp(0.95rem,2.9vw,1.35rem)] font-medium leading-snug text-muted-foreground">
                Ensuring your medications work in harmony. © {new Date().getFullYear()} HarmoniMed. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
