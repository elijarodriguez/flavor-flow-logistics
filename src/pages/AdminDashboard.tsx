import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, ClipboardList, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["hsl(0, 85%, 46%)", "hsl(0, 85%, 60%)", "hsl(0, 85%, 72%)", "hsl(0, 50%, 40%)", "hsl(0, 30%, 55%)"];

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

  const { data: orderItems } = useQuery({
    queryKey: ["admin-order-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("order_items").select("*");
      if (error) throw error;
      return data;
    },
  });

  const totalProducts = products?.length ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === "Pending").length ?? 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
  const lowStockProducts = products?.filter((p) => p.stock > 0 && p.stock <= 50) ?? [];
  const outOfStockProducts = products?.filter((p) => p.stock === 0) ?? [];
  const recentOrders = orders?.slice(0, 5) ?? [];

  // Revenue by day (last 7 days)
  const revenueByDay = useMemo(() => {
    if (!orders) return [];
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days[key] = 0;
    }
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (key in days) days[key] += Number(o.total);
    });
    return Object.entries(days).map(([date, revenue]) => ({ date, revenue }));
  }, [orders]);

  // Top products by quantity sold
  const topProducts = useMemo(() => {
    if (!orderItems) return [];
    const map: Record<string, { name: string; qty: number }> = {};
    orderItems.forEach((item) => {
      if (!map[item.product_name]) map[item.product_name] = { name: item.product_name, qty: 0 };
      map[item.product_name].qty += item.quantity;
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orderItems]);

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

      {/* Stats */}
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

      {/* Low Stock Alert */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-display font-semibold text-red-800">Stock Alerts</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {outOfStockProducts.map((p) => (
              <span key={p.id} className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                {p.name} — Out of Stock
              </span>
            ))}
            {lowStockProducts.map((p) => (
              <span key={p.id} className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                {p.name} — {p.stock} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: "var(--card-shadow)" }}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Revenue (Last 7 Days)</h2>
          {revenueByDay.some((d) => d.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(0, 0%, 40%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0, 0%, 40%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${v}`} />
                <Tooltip formatter={(value: number) => [`₱${value.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "8px", border: "1px solid hsl(0,5%,88%)", fontSize: "12px" }} />
                <Bar dataKey="revenue" fill="hsl(0, 85%, 46%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: "var(--card-shadow)" }}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Top Products</h2>
          {topProducts.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={topProducts} dataKey="qty" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {topProducts.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(0,5%,88%)", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-xs text-foreground truncate flex-1">{p.name}</span>
                    <span className="text-xs font-bold text-muted-foreground">{p.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No order data yet</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
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
