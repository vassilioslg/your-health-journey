import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary px-8 py-16 text-center md:px-16 md:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-success/20 blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="mx-auto mb-4 max-w-xl text-3xl font-extrabold text-primary-foreground md:text-4xl">
              Take control of your medication safety today
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-lg text-primary-foreground/80">
              Join thousands of patients who trust HarmoniMed for personalized, continuous medication guidance.
            </p>
            <Button
              size="xl"
              asChild
              className="group relative isolate overflow-hidden rounded-2xl border border-white/25 bg-gradient-primary px-6 text-sm font-extrabold tracking-tight text-white shadow-[0_18px_42px_rgba(56,79,216,0.42)] transition-all hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_24px_56px_rgba(56,79,216,0.5)] sm:px-8 sm:text-base"
            >
              <Link to="/app" className="flex items-center gap-2.5">
                <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-primary" />
                <span className="relative">Start Managing Medications</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
