import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/integrations/firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/integrations/firebase/types";

interface ProductForm {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  flavors: string;
  imageUrl: string;
  isActive: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  category: "Siomai",
  description: "",
  price: "",
  stock: "0",
  flavors: "",
  imageUrl: "",
  isActive: true,
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: parseFloat(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        flavors: form.flavors
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        imageUrl: form.imageUrl || null,
        isActive: form.isActive,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct({
          ...payload,
          id: "",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["tracking-products"] });
      toast.success(editingId ? "Product updated" : "Product added");
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: (error) => {
      const message = error instanceof Error
        ? error.message
        : "Failed to save product";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["tracking-products"] });
      toast.success("Product deleted");
    },
    onError: (error) => {
      const message = error instanceof Error
        ? error.message
        : "Failed to delete product";
      toast.error(message);
    },
  });

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      flavors: product.flavors?.join(", ") ?? "",
      imageUrl: product.imageUrl ?? "",
      isActive: product.isActive,
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your food product catalog
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setForm(emptyForm);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="hero" onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingId ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription>
                Add or update product details and customer-facing visibility.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="space-y-3"
            >
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (₱)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Flavors (comma-separated)</Label>
                <Input
                  value={form.flavors}
                  onChange={(e) =>
                    setForm({ ...form, flavors: e.target.value })}
                  placeholder="Original, Spicy, Cheese"
                />
              </div>

              {/* Image URL */}
              <div>
                <Label>Product Image URL</Label>
                <div className="mt-1.5 space-y-2">
                  {form.imageUrl && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "";
                        }}
                      />
                    </div>
                  )}
                  <Input
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste image URL directly (supports external URLs or local
                    image paths)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })}
                  id="active"
                />
                <Label htmlFor="active">
                  Active (visible to customers)
                </Label>
              </div>
              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading
        ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border h-64 animate-pulse"
              />
            ))}
          </div>
        )
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products?.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {/* Product thumbnail */}
                <div className="h-36 bg-muted flex items-center justify-center overflow-hidden">
                  {product.imageUrl
                    ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )
                    : <Image className="h-8 w-8 text-muted-foreground" />}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <Badge
                      className={product.isActive
                        ? "bg-green-100 text-green-700 border-0"
                        : "bg-secondary text-secondary-foreground border-0"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0 mb-2">
                    {product.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-primary">
                      ₱{Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Stock: {product.stock}
                    </span>
                  </div>
                  {product.flavors && product.flavors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.flavors.map((f) => (
                        <span
                          key={f}
                          className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Delete this product?")) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
