import heroImg from "@/assets/hero-siomai.jpg";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <img
        src={heroImg}
        alt="Assorted siomai dumplings"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(0 0% 6% / 0.75), hsl(0 85% 46% / 0.3))" }} />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(0 85% 65%)" }}>
            Premium Frozen Foods
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: "hsl(30 25% 97%)" }}>
            Authentic Filipino
            <br />
            <span className="text-gradient">Flavors</span> Delivered
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg" style={{ color: "hsl(30 15% 80%)" }}>
            We manufacture and supply Siomai, our famous Longganisa Calumpit, Skinless, Chili-Garlic, and more. Start your own business at a very affordable price!
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#products">
              <Button variant="hero" size="lg">
                View Products
              </Button>
            </a>
            <a href="#franchise">
              <Button variant="heroOutline" size="lg" style={{ borderColor: "hsl(30 25% 97%)", color: "hsl(30 25% 97%)" }}>
                Franchise With Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
