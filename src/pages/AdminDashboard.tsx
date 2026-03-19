import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, ClipboardList, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const totalProducts = products?.length ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === "Pending").length ?? 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
  const recentOrders = orders?.slice(0, 5) ?? [];

  const stats = [
    { label: "Total Products", value: String(totalProducts), icon: Package, change: `${products?.filter(p => p.is_active).length ?? 0} active` },
    { label: "Pending Orders", value: String(pendingOrders), icon: ClipboardList, change: `${orders?.length ?? 0} total` },
    { label: "Delivered", value: String(orders?.filter((o) => o.status === "Delivered").length ?? 0), icon: Truck, change: "completed" },
    { label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, icon: TrendingUp, change: `${orders?.length ?? 0} orders` },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Processing": return "bg-amber-100 text-amber-700";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your food product operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: "var(--card-shadow)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground font-body">{stat.value}</div>
            <span className="text-xs text-muted-foreground mt-1">{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: "var(--card-shadow)" }}>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.customer_name} — ₱{Number(order.total).toLocaleString()}</p>
                  <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
