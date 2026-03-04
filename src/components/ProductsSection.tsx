import { products } from "@/data/products";
import { Badge } from "@/components/ui/badge";

export function ProductsSection() {
  return (
    <section id="products" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
            Our Products
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Premium Frozen Goods
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Carefully crafted with the finest ingredients — perfect for reselling, food carts, and small businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300"
              style={{
                boxShadow: "var(--card-shadow)",
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground font-medium">
                    {product.category}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>
                {product.flavors && (
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <span
                        key={flavor}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {flavor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
