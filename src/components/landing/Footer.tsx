import logo from "@/assets/harmonimed-logo.png";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="HarmoniMed" className="h-7 w-7" />
          <span className="text-lg font-bold">HarmoniMed</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Ensuring your medications work in harmony. © {new Date().getFullYear()} HarmoniMed. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
