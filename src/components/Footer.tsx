import logo from "@/assets/jimmela_logo.jpg";

export function Footer() {
  return (
    <footer className="bg-foreground py-8 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Jimmela Food Products" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-display text-lg font-bold" style={{ color: "hsl(0 0% 100%)" }}>
            Jimmela <span className="text-primary">Food Products</span>
          </span>
        </div>
        <p className="text-sm" style={{ color: "hsl(0 0% 60%)" }}>
          © {new Date().getFullYear()} Jimmela Food Products. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
