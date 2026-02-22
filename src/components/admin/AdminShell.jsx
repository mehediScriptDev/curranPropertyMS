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
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <AdminTopbar onMenuClick={() => setMobileOpen((p) => !p)} mobileOpen={mobileOpen} />

      {/* Main — offset for fixed sidebar + topbar (match portal) */}
      <main className="lg:pl-[300px] pt-[72px] min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
