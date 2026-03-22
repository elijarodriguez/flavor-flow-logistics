import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getOrders,
  updateOrder,
} from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Papa from "papaparse";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateOrder(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      const message = error instanceof Error
        ? error.message
        : "Failed to update status";
      toast.error(message);
    },
  });

  const parseCurrency = (value: unknown) => {
    const normalized = String(value ?? "")
      .replace(/[^\d.-]/g, "")
      .trim();

    return Number.parseFloat(normalized || "0") || 0;
  };

  const getValue = (row: Record<string, string>, keys: string[]) => {
    const entry = Object.entries(row).find(([key]) =>
      keys.includes(key.trim().toLowerCase())
    );
    return entry?.[1]?.trim() ?? "";
  };

  const importOrders = async (file: File) => {
    setImporting(true);

    try {
      const csvText = await file.text();
      const parsed = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        throw new Error(parsed.errors[0].message);
      }

      const rows = parsed.data
        .map((row) => {
          const status = getValue(row, ["status", "order_status"]);
          const normalizedStatus = statuses.includes(status)
            ? status
            : "Pending";

          const customerName = getValue(row, [
            "customer_name",
            "name",
            "customer",
          ]);
          const customerEmail = getValue(row, ["customer_email", "email"]);
          const customerPhone = getValue(row, [
            "customer_phone",
            "phone",
            "mobile",
          ]);
          const customerAddress = getValue(row, [
            "customer_address",
            "address",
            "delivery_address",
          ]);

          if (
            !customerName || !customerEmail || !customerPhone ||
            !customerAddress
          ) {
            return null;
          }

          return {
            customerName,
            customerEmail,
            customerPhone,
            customerAddress,
            total: parseCurrency(
              getValue(row, ["total", "amount", "order_total"]),
            ),
            status: normalizedStatus,
            notes: getValue(row, ["notes", "note"]) || null,
            trackingNumber: getValue(row, ["tracking_number", "tracking"]) ||
              null,
            courier: getValue(row, ["courier", "shipping_courier"]) || null,
          };
        })
        .filter(Boolean) as Array<{
          customerName: string;
          customerEmail: string;
          customerPhone: string;
          customerAddress: string;
          total: number;
          status: string;
          notes: string | null;
          trackingNumber: string | null;
          courier: string | null;
        }>;

      if (rows.length === 0) {
        throw new Error(
          "No valid rows found. Use headers like customer_name, customer_email, customer_phone, customer_address, and total.",
        );
      }

      // Create orders in Firestore
      let successCount = 0;
      for (const row of rows) {
        try {
          await createOrder(
            {
              id: "",
              customerName: row.customerName,
              customerEmail: row.customerEmail,
              customerPhone: row.customerPhone,
              customerAddress: row.customerAddress,
              status: row.status as
                | "Pending"
                | "Processing"
                | "Shipped"
                | "Delivered"
                | "Cancelled",
              total: row.total,
              items: [],
              courier: row.courier,
              trackingNumber: row.trackingNumber,
              notes: row.notes,
              shippedAt: null,
              deliveredAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            [],
          );
          successCount++;
        } catch (error) {
          console.error("Error importing order:", error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["tracking-orders"] });
      toast.success(
        `${successCount} order${successCount > 1 ? "s" : ""} imported`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import CSV",
      );
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-amber-100 text-amber-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Track, manage, and import customer orders from CSV
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            CSV headers: customer_name, customer_email, customer_phone,
            customer_address, total, status.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) importOrders(file);
            }}
          />
          <Button
            variant="hero"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            <Upload className="h-4 w-4" />
            {importing ? "Importing..." : "Import CSV"}
          </Button>
        </div>
      </div>

      {isLoading
        ? (
          <div className="bg-card rounded-xl border border-border h-64 animate-pulse" />
        )
        : orders?.length === 0
        ? (
          <div
            className="bg-card rounded-xl border border-border p-8 text-center"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <p className="text-muted-foreground">
              No orders yet. Orders will appear here when customers place them.
            </p>
          </div>
        )
        : (
          <div
            className="bg-card rounded-xl border border-border overflow-hidden"
            style={{ boxShadow: "var(--card-shadow)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border">
                    <th className="text-left font-semibold text-foreground px-4 py-3">
                      Customer
                    </th>
                    <th className="text-left font-semibold text-foreground px-4 py-3">
                      Email
                    </th>
                    <th className="text-left font-semibold text-foreground px-4 py-3">
                      Phone
                    </th>
                    <th className="text-left font-semibold text-foreground px-4 py-3">
                      Total
                    </th>
                    <th className="text-left font-semibold text-foreground px-4 py-3">
                      Status
                    </th>
                    <th className="text-left font-semibold text-foreground px-4 py-3">
                      Date
                    </th>
                    <th className="text-left font-semibold text-foreground px-4 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {order.customerEmail}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {order.customerPhone}
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        ₱{Number(order.total).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            statusColor(
                              order.status,
                            )
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {order.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={order.status}
                          onValueChange={(status) =>
                            updateStatusMutation.mutate({
                              id: order.id,
                              status,
                            })}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
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
