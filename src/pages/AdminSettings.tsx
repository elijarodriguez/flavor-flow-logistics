import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function AdminSettings() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-8 max-w-2xl space-y-6" style={{ boxShadow: "var(--card-shadow)" }}>
        <div>
          <h3 className="font-display font-semibold text-foreground mb-1">Signed in as</h3>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
