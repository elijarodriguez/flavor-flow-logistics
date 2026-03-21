import { Building2, Handshake, Award } from "lucide-react";

export function ContactSection() {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto">
        <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
          About Us
        </span>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Homegrown quality, built for everyday Filipino food businesses
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5 max-w-3xl">
              Jimmela Food Products is focused on delivering reliable frozen goods that are easy to cook,
              consistent in flavor, and ready for retail, food carts, resellers, and franchise partners.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
              From Calumpit, Bulacan, the company continues to grow by combining accessible pricing,
              dependable supply, and products designed to help small businesses serve customers faster.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--card-shadow)" }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">What we stand for</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Consistent product quality that customers can trust</li>
              <li>• Scalable supply for resellers and growing food operations</li>
              <li>• Practical franchise support for local entrepreneurs</li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: Building2,
              label: "Company Roots",
              value: "Built in Calumpit, Bulacan with a focus on dependable frozen food production.",
            },
            {
              icon: Award,
              label: "Product Promise",
              value: "Affordable, consistent, and convenient products for repeat customer satisfaction.",
            },
            {
              icon: Handshake,
              label: "Business Growth",
              value: "Created to support retailers, resellers, food carts, and franchise partners.",
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display font-semibold text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
