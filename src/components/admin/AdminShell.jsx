"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePortalAuth } from "@/context/PortalAuthContext";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }) {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/portal/login");
    } else if (!loading && user?.role !== "admin") {
      router.replace("/portal/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#f3f4f8]">
      <AdminTopbar
        onMenuClick={() => setMobileOpen((p) => !p)}
        mobileOpen={mobileOpen}
      />
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      {/* Main content — offset for topbar + sidebar */}
      <main className="pt-[68px] md:pl-[300px] min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
