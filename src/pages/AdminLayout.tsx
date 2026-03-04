import { AdminSidebar } from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 bg-background overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
