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
            <Button size="xl" variant="secondary" asChild className="group">
              <Link to="/app">
                Start Managing Medications
                <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
