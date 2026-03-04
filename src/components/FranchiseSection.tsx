import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Low capital investment starting from ₱15,000",
  "Complete product training and support",
  "Exclusive territory for your area",
  "Marketing materials provided",
  "Flexible ordering — no minimum monthly quota",
  "High profit margin (40-60%)",
];

export function FranchiseSection() {
  return (
    <section id="franchise" className="section-padding bg-secondary/50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
              Franchise Opportunity
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Start Your Own
              <br />
              <span className="text-gradient">Food Business</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Join our growing network of food entrepreneurs. We provide everything you need to start
              selling premium frozen foods in your community — from products to training to marketing support.
            </p>
            <div className="space-y-3 mb-8">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{b}</span>
                </div>
              ))}
            </div>
            <a href="#contact">
              <Button variant="hero" size="lg">
                Inquire About Franchise
              </Button>
            </a>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border" style={{ boxShadow: "var(--card-shadow)" }}>
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Franchise Packages</h3>
            <div className="space-y-6">
              {[
                { name: "Starter Cart", price: "₱15,000", desc: "Food cart setup with initial product supply" },
                { name: "Business Package", price: "₱35,000", desc: "Complete business setup with branding and equipment" },
                { name: "Premium Franchise", price: "₱75,000", desc: "Full franchise with exclusive territory and ongoing support" },
              ].map((pkg) => (
                <div key={pkg.name} className="p-4 rounded-xl bg-secondary/60 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-display font-semibold text-foreground">{pkg.name}</h4>
                    <span className="font-body font-bold text-primary text-lg">{pkg.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pkg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
