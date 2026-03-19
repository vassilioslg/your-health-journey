import { Search, ScanLine, ShieldCheck, BellRing } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Add Your Medications",
    description: "Search, scan a barcode, or photograph your medications to build your personal list.",
  },
  {
    icon: ScanLine,
    step: "02",
    title: "Check Interactions",
    description: "HarmoniMed instantly analyses your full medication list for risky combinations.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Get Personalized Guidance",
    description: "Receive clear, plain-language safety information tailored to your specific medications.",
  },
  {
    icon: BellRing,
    step: "04",
    title: "Stay Safe Daily",
    description: "Receive daily safety nudges and side effect guidance — continuous support in your pocket.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-secondary/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            From adding medications to daily safety support — in four simple steps.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-primary">
                Step {step.step}
              </span>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-8 -right-4 hidden h-0.5 w-8 bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
