import { useCart } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  address: z.string().trim().min(1, "Address is required").max(500),
  notes: z.string().max(1000).optional(),
});

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: result.data.name,
          customer_email: result.data.email,
          customer_phone: result.data.phone,
          customer_address: result.data.address,
          notes: result.data.notes || null,
          total,
          status: "Pending",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        flavor: item.flavor || null,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      toast.success("Order placed successfully! We'll contact you soon.");
      navigate("/");
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-16">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button variant="hero" onClick={() => navigate("/#products")}>Browse Products</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.flavor}`} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" style={{ boxShadow: "var(--card-shadow)" }}>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                    {item.flavor && <span className="text-xs text-muted-foreground">{item.flavor}</span>}
                    <p className="text-sm font-semibold text-primary mt-1">₱{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity - 1, item.flavor)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-foreground">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity + 1, item.flavor)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-foreground w-20 text-right">₱{(item.price * item.quantity).toFixed(2)}</span>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.productId, item.flavor)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <div className="bg-card border border-border rounded-xl p-6" style={{ boxShadow: "var(--card-shadow)" }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Checkout</h2>
              <div className="border-t border-border pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total:</span>
                  <span className="text-primary">₱{total.toFixed(2)}</span>
                </div>
              </div>
              <form onSubmit={handleCheckout} className="space-y-3">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
                <div><Label htmlFor="address">Delivery Address</Label><Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
                <div><Label htmlFor="notes">Notes (optional)</Label><Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
