import { Pill, AlertTriangle, Bell, BookOpen } from "lucide-react";

const features = [
  {
    icon: Pill,
    title: "Medication List Builder",
    description: "Search, scan barcodes, or use AI image recognition to add medications. Track dose, frequency, and start date with ease.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: AlertTriangle,
    title: "Interaction Checker",
    description: "Instantly flag high-risk drug combinations including OTC drugs and supplements, with clear explanations in plain language.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Bell,
    title: "Daily Safety Nudges",
    description: "Personalized daily reminders like 'Avoid alcohol with X' or 'Take with food' — continuous support beyond your doctor visit.",
    color: "bg-success/10 text-success",
  },
  {
    icon: BookOpen,
    title: "Side Effects Guide",
    description: "Understand what's common vs urgent. Know when to call your pharmacist and when to seek emergency care.",
    color: "bg-warning/10 text-warning",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            Everything you need for <span className="text-gradient">medication safety</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            HarmoniMed shifts medication safety from episodic doctor visits to continuous, personalized daily support.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
