import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";

// Map for local product images by name
import porkImg from "@/assets/product-pork-siomai.jpg";
import beefImg from "@/assets/product-beef-siomai.jpg";
import japaneseImg from "@/assets/product-japanese-siomai.jpg";
import sharksfinImg from "@/assets/product-sharksfin-siomai.jpg";
import longganisaImg from "@/assets/product-longganisa.jpg";

const localImages: Record<string, string> = {
  "Pork Siomai": porkImg,
  "Beef Siomai": beefImg,
  "Japanese Siomai": japaneseImg,
  "Shark's Fin Siomai": sharksfinImg,
  "Longganisang Calumpit": longganisaImg,
};

export function ProductsSection() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="products" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">Our Products</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Premium Frozen Goods</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Carefully crafted with the finest ingredients — perfect for reselling, food carts, and small businesses.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product, i) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                description={product.description}
                price={product.price}
                imageUrl={product.image_url || localImages[product.name]}
                flavors={product.flavors}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
