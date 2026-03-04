import { products } from "@/data/products";
import { Badge } from "@/components/ui/badge";

export default function AdminProducts() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground mt-1">Manage your food product catalog</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
                <Badge className="bg-primary/10 text-primary border-0">{product.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
              {product.flavors && (
                <div className="flex flex-wrap gap-1.5">
                  {product.flavors.map((f) => (
                    <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
