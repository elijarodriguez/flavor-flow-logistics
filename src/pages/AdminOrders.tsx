export default function AdminOrders() {
  const orders = [
    { id: "#1042", customer: "Juan's Food Cart", items: "50x Pork Siomai (Original)", total: "₱7,500", status: "Processing", date: "Mar 4, 2026" },
    { id: "#1041", customer: "Maria's Eatery", items: "30x Beef Siomai, 20x Longganisa (Sweet)", total: "₱9,200", status: "Shipped", date: "Mar 3, 2026" },
    { id: "#1040", customer: "Tindahan ni Aling Rosa", items: "100x Shark's Fin Siomai", total: "₱15,000", status: "Delivered", date: "Mar 2, 2026" },
    { id: "#1039", customer: "BFF Food Hub", items: "40x Longganisang Calumpit (Garlic)", total: "₱5,600", status: "Delivered", date: "Mar 1, 2026" },
    { id: "#1038", customer: "Street Bites Co.", items: "60x Japanese Siomai (Sesame)", total: "₱8,400", status: "Delivered", date: "Feb 28, 2026" },
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
        <h1 className="font-display text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left font-semibold text-foreground px-4 py-3">Order ID</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Customer</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Items</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Total</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Status</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{order.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.items}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{order.total}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
