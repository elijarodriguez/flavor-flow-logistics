import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Package, Truck, AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function AdminTracking() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingForm, setTrackingForm] = useState({ tracking_number: "", courier: "" });
  const queryClient = useQueryClient();

  // ── Inventory Data ──
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["tracking-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // ── Orders Data ──
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["tracking-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["Processing", "Shipped", "Delivered"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // ── Update delivery info ──
  const updateDelivery = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("orders").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Delivery info updated");
      setSelectedOrder(null);
    },
    onError: () => toast.error("Failed to update"),
  });

  // ── Inventory helpers ──
  const categories = [...new Set(products?.map((p) => p.category) ?? [])];

  const filteredProducts = products?.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const inStockCount = products?.filter((p) => p.stock > 50).length ?? 0;
  const lowStockCount = products?.filter((p) => p.stock > 0 && p.stock <= 50).length ?? 0;
  const outOfStockCount = products?.filter((p) => p.stock === 0).length ?? 0;

  const stockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700", icon: AlertTriangle };
    if (stock <= 50) return { label: "Low Stock", color: "bg-amber-100 text-amber-700", icon: AlertTriangle };
    return { label: "In Stock", color: "bg-green-100 text-green-700", icon: CheckCircle };
  };

  // ── Delivery helpers ──
  const deliveryStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock className="h-4 w-4 text-amber-600" />;
      case "Shipped": return <Truck className="h-4 w-4 text-blue-600" />;
      case "Delivered": return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-amber-100 text-amber-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Delivered": return "bg-green-100 text-green-700";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const openTrackingDialog = (order: any) => {
    setSelectedOrder(order);
    setTrackingForm({
      tracking_number: order.tracking_number ?? "",
      courier: order.courier ?? "",
    });
  };

  const handleShipOrder = () => {
    if (!selectedOrder) return;
    updateDelivery.mutate({
      id: selectedOrder.id,
      updates: {
        status: "Shipped",
        tracking_number: trackingForm.tracking_number || null,
        courier: trackingForm.courier || null,
        shipped_at: new Date().toISOString(),
      },
    });
  };

  const handleMarkDelivered = (orderId: string) => {
    updateDelivery.mutate({
      id: orderId,
      updates: {
        status: "Delivered",
        delivered_at: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Tracking</h1>
        <p className="text-muted-foreground mt-1">Monitor inventory levels and track order deliveries</p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory" className="gap-2"><Package className="h-4 w-4" />Inventory</TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2"><Truck className="h-4 w-4" />Delivery</TabsTrigger>
        </TabsList>

        {/* ════════ INVENTORY TAB ════════ */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700 font-body">{inStockCount}</div>
              <span className="text-sm text-green-600">In Stock</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-700 font-body">{lowStockCount}</div>
              <span className="text-sm text-amber-600">Low Stock</span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-700 font-body">{outOfStockCount}</div>
              <span className="text-sm text-red-600">Out of Stock</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant={filterCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterCategory("all")}>All</Button>
              {categories.map((cat) => (
                <Button key={cat} variant={filterCategory === cat ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(cat)}>{cat}</Button>
              ))}
            </div>
          </div>

          {/* Inventory Table */}
          {productsLoading ? (
            <div className="bg-card rounded-xl border border-border h-64 animate-pulse" />
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border">
                      <th className="text-left font-semibold text-foreground px-4 py-3">Product</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Category</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Flavors</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Stock</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Status</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts?.map((product) => {
                      const status = stockStatus(product.stock);
                      return (
                        <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{product.flavors?.join(", ") || "—"}</td>
                          <td className="px-4 py-3 font-body font-semibold text-foreground">{product.stock} packs</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span>
                          </td>
                          <td className="px-4 py-3 text-foreground">₱{Number(product.price).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ════════ DELIVERY TAB ════════ */}
        <TabsContent value="delivery" className="space-y-6">
          {/* Delivery summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-700 font-body">{orders?.filter((o) => o.status === "Processing").length ?? 0}</div>
              <span className="text-sm text-amber-600">Processing</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-700 font-body">{orders?.filter((o) => o.status === "Shipped").length ?? 0}</div>
              <span className="text-sm text-blue-600">In Transit</span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700 font-body">{orders?.filter((o) => o.status === "Delivered").length ?? 0}</div>
              <span className="text-sm text-green-600">Delivered</span>
            </div>
          </div>

          {ordersLoading ? (
            <div className="bg-card rounded-xl border border-border h-64 animate-pulse" />
          ) : orders?.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No orders to track yet. Orders will appear here once they move to Processing.</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border">
                      <th className="text-left font-semibold text-foreground px-4 py-3">Customer</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Address</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Total</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Status</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Tracking #</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Courier</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {deliveryStatusIcon(order.status)}
                            <div>
                              <p className="font-medium text-foreground">{order.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs max-w-48 truncate">{order.customer_address}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">₱{Number(order.total).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{order.tracking_number || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{order.courier || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            {order.status === "Processing" && (
                              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => openTrackingDialog(order)}>
                                <Truck className="h-3 w-3 mr-1" />Ship
                              </Button>
                            )}
                            {order.status === "Shipped" && (
                              <Button size="sm" variant="outline" className="text-xs h-7 text-green-700" onClick={() => handleMarkDelivered(order.id)}>
                                <CheckCircle className="h-3 w-3 mr-1" />Delivered
                              </Button>
                            )}
                            {order.status === "Delivered" && (
                              <span className="text-xs text-muted-foreground">
                                {order.delivered_at ? new Date(order.delivered_at).toLocaleDateString() : "Done"}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ship Order Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Ship Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Shipping to: <strong className="text-foreground">{selectedOrder?.customer_name}</strong>
            </p>
            <div>
              <Label>Tracking Number (optional)</Label>
              <Input value={trackingForm.tracking_number} onChange={(e) => setTrackingForm({ ...trackingForm, tracking_number: e.target.value })} placeholder="e.g. JNT-123456789" />
            </div>
            <div>
              <Label>Courier (optional)</Label>
              <Input value={trackingForm.courier} onChange={(e) => setTrackingForm({ ...trackingForm, courier: e.target.value })} placeholder="e.g. J&T Express, LBC, Grab" />
            </div>
            <Button variant="hero" className="w-full" onClick={handleShipOrder} disabled={updateDelivery.isPending}>
              {updateDelivery.isPending ? "Updating..." : "Mark as Shipped"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
