import { Phone, Mail, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto text-center">
        <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
          Get In Touch
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          Contact Us
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg mb-12">
          Interested in our products or franchise opportunities? Reach out and we'll get back to you.
        </p>
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { icon: Phone, label: "Phone", value: "0975 798 2690" },
            { icon: Mail, label: "Email", value: "jimmelafoods@gmail.com" },
            { icon: MapPin, label: "Location", value: "2nd Floor, ASM Plaza, McArthur Hiway, Caniogan, Calumpit, Philippines" },
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
