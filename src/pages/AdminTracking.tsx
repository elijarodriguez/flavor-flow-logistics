import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface TrackingItem {
  id: string;
  product: string;
  category: string;
  flavor: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
  location: string;
}

const trackingData: TrackingItem[] = [
  { id: "SKU-001", product: "Pork Siomai", category: "Siomai", flavor: "Original", stock: 450, status: "In Stock", lastUpdated: "2 hours ago", location: "Warehouse A" },
  { id: "SKU-002", product: "Pork Siomai", category: "Siomai", flavor: "Spicy", stock: 200, status: "In Stock", lastUpdated: "2 hours ago", location: "Warehouse A" },
  { id: "SKU-003", product: "Pork Siomai", category: "Siomai", flavor: "Cheese", stock: 30, status: "Low Stock", lastUpdated: "1 day ago", location: "Warehouse B" },
  { id: "SKU-004", product: "Beef Siomai", category: "Siomai", flavor: "Original", stock: 320, status: "In Stock", lastUpdated: "5 hours ago", location: "Warehouse A" },
  { id: "SKU-005", product: "Beef Siomai", category: "Siomai", flavor: "Pepper Steak", stock: 0, status: "Out of Stock", lastUpdated: "3 days ago", location: "Warehouse A" },
  { id: "SKU-006", product: "Japanese Siomai", category: "Siomai", flavor: "Sesame", stock: 180, status: "In Stock", lastUpdated: "1 day ago", location: "Warehouse B" },
  { id: "SKU-007", product: "Japanese Siomai", category: "Siomai", flavor: "Teriyaki", stock: 45, status: "Low Stock", lastUpdated: "2 days ago", location: "Warehouse B" },
  { id: "SKU-008", product: "Shark's Fin Siomai", category: "Siomai", flavor: "Original", stock: 500, status: "In Stock", lastUpdated: "6 hours ago", location: "Warehouse A" },
  { id: "SKU-009", product: "Shark's Fin Siomai", category: "Siomai", flavor: "Supreme", stock: 260, status: "In Stock", lastUpdated: "6 hours ago", location: "Warehouse A" },
  { id: "SKU-010", product: "Longganisang Calumpit", category: "Longganisa", flavor: "Sweet", stock: 150, status: "In Stock", lastUpdated: "1 day ago", location: "Warehouse C" },
  { id: "SKU-011", product: "Longganisang Calumpit", category: "Longganisa", flavor: "Garlic", stock: 90, status: "In Stock", lastUpdated: "1 day ago", location: "Warehouse C" },
  { id: "SKU-012", product: "Longganisang Calumpit", category: "Longganisa", flavor: "Hamonado", stock: 20, status: "Low Stock", lastUpdated: "4 days ago", location: "Warehouse C" },
  { id: "SKU-013", product: "Longganisang Calumpit", category: "Longganisa", flavor: "Spicy", stock: 0, status: "Out of Stock", lastUpdated: "1 week ago", location: "Warehouse C" },
];

export default function AdminTracking() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = trackingData.filter((item) => {
    const matchSearch =
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.flavor.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || item.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-700";
      case "Low Stock": return "bg-amber-100 text-amber-700";
      case "Out of Stock": return "bg-red-100 text-red-700";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Product Tracking</h1>
        <p className="text-muted-foreground mt-1">Monitor stock levels and product locations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product, flavor, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "Siomai", "Longganisa"].map((cat) => (
            <Button
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(cat)}
            >
              {cat === "all" ? "All" : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700 font-body">
            {trackingData.filter((i) => i.status === "In Stock").length}
          </div>
          <span className="text-sm text-green-600">In Stock</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-700 font-body">
            {trackingData.filter((i) => i.status === "Low Stock").length}
          </div>
          <span className="text-sm text-amber-600">Low Stock</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-700 font-body">
            {trackingData.filter((i) => i.status === "Out of Stock").length}
          </div>
          <span className="text-sm text-red-600">Out of Stock</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left font-semibold text-foreground px-4 py-3">SKU</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Product</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Flavor</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Stock</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Status</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Location</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.product}</td>
                  <td className="px-4 py-3 text-foreground">{item.flavor}</td>
                  <td className="px-4 py-3 font-body font-semibold text-foreground">{item.stock} packs</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.location}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
