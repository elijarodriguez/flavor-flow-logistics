import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Processing": return "bg-amber-100 text-amber-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      {isLoading ? (
        <div className="bg-card rounded-xl border border-border h-64 animate-pulse" />
      ) : orders?.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
          <p className="text-muted-foreground">No orders yet. Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left font-semibold text-foreground px-4 py-3">Customer</th>
                  <th className="text-left font-semibold text-foreground px-4 py-3">Email</th>
                  <th className="text-left font-semibold text-foreground px-4 py-3">Phone</th>
                  <th className="text-left font-semibold text-foreground px-4 py-3">Total</th>
                  <th className="text-left font-semibold text-foreground px-4 py-3">Status</th>
                  <th className="text-left font-semibold text-foreground px-4 py-3">Date</th>
                  <th className="text-left font-semibold text-foreground px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{order.customer_name}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{order.customer_email}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{order.customer_phone}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">₱{Number(order.total).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={order.status}
                        onValueChange={(status) => updateStatus.mutate({ id: order.id, status })}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
