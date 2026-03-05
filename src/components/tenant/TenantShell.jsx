"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePortalAuth } from "@/context/PortalAuthContext";
import TenantSidebar from "@/components/tenant/TenantSidebar";
import TenantTopbar from "@/components/tenant/TenantTopbar";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function TenantShell({ children }) {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && user?.role?.toUpperCase() !== "TENANT") {
      // Non-tenant tried to access tenant area — send to their own dashboard
      const r = user?.role?.toUpperCase();
      if (r === "ADMIN") router.replace("/admin/dashboard");
      else router.replace("/portal/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#f3f4f8]">
      <TenantSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <TenantTopbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main — offset for fixed sidebar + topbar */}
      <main className="lg:pl-[300px] pt-[72px] min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
