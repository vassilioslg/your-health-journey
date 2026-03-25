import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import heroIllustration from "@/assets/hero-illustration.png";

const Index = () => {
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
        <div className="absolute inset-x-0 top-[18%] -z-10 flex justify-center lg:hidden">
          <img
            src={heroIllustration}
            alt=""
            aria-hidden="true"
            className="w-[130%] max-w-none opacity-[0.08]"
          />
        </div>
      </div>
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default Index;
