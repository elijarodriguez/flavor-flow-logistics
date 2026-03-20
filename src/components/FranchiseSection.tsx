import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail, MapPin } from "lucide-react";

const benefits = [
  "We manufacture and supply Siomai, Longganisa Calumpit, Skinless, Chili-Garlic, and more",
  "Start your own business at a very affordable price",
  "Complete product training and support",
  "Exclusive territory for your area",
  "Marketing materials provided",
  "Flexible ordering — no minimum monthly quota",
  "High profit margin (40-60%)",
];

const contactInfo = [
  { icon: Phone, label: "Phone", value: "0975 798 2690" },
  { icon: Mail, label: "Email", value: "jimmelafoods@gmail.com" },
  { icon: MapPin, label: "Location", value: "2nd Floor, ASM Plaza, McArthur Hiway, Caniogan, Calumpit, Philippines" },
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
              We are open for franchise! Join our growing network of food entrepreneurs.
              We provide everything you need to start selling premium frozen foods in your community.
              Message us for more details!
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
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Get In Touch</h3>
            <p className="text-muted-foreground mb-8">
              Interested in franchising? Contact us through any of the channels below and we'll get back to you with all the details.
            </p>
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/60 border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm">{item.label}</h4>
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
