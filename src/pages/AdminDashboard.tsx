import { Package, Truck, ClipboardList, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Products", value: "5", icon: Package, change: "+2 this month" },
  { label: "Active Orders", value: "24", icon: ClipboardList, change: "+8 today" },
  { label: "In Transit", value: "12", icon: Truck, change: "3 arriving today" },
  { label: "Monthly Revenue", value: "₱145,200", icon: TrendingUp, change: "+18% vs last month" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your food product operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-6"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
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
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { text: "New order #1042 — 50 packs Pork Siomai", time: "2 hours ago", status: "Processing" },
            { text: "Order #1039 delivered — Longganisang Calumpit", time: "5 hours ago", status: "Delivered" },
            { text: "New franchise inquiry from Malolos, Bulacan", time: "1 day ago", status: "Pending" },
            { text: "Stock replenished — Japanese Siomai +200 packs", time: "2 days ago", status: "Completed" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{activity.text}</p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  activity.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : activity.status === "Processing"
                    ? "bg-amber-100 text-amber-700"
                    : activity.status === "Completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
