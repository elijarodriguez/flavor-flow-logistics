import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { FACEBOOK_PAGE_URL } from "@/lib/contact";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  flavors?: string[] | null;
  index: number;
}

export function ProductCard({ id, name, category, description, price, imageUrl, flavors, index }: ProductCardProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(flavors?.[0]);

  // Map known product names to local assets for seeded products
  const getImageSrc = () => {
    if (imageUrl) return imageUrl;
    return "/placeholder.svg";
  };

  return (
    <div
      className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300"
      style={{ boxShadow: "var(--card-shadow)", animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-56 overflow-hidden bg-muted">
        <img src={getImageSrc()} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground font-medium">{category}</Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-xl font-semibold text-foreground">{name}</h3>
          <span className="font-body font-bold text-primary text-lg">₱{price.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{description}</p>
        {flavors && flavors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {flavors.map((flavor) => (
              <button
                key={flavor}
                onClick={() => setSelectedFlavor(flavor)}
                className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                  selectedFlavor === flavor
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        )}
        <Button variant="hero" size="sm" className="w-full" asChild>
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contact Jimmela Food Products to order ${name}${selectedFlavor ? ` in ${selectedFlavor}` : ""}`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact to Order
          </a>
        </Button>
      </div>
    </div>
  );
}
