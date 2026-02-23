"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePortalAuth } from "@/context/PortalAuthContext";
import TenantSidebar from "@/components/tenant/TenantSidebar";
import TenantTopbar from "@/components/tenant/TenantTopbar";

export default function TenantShell({ children }) {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/portal/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f8]">
        <span className="w-8 h-8 border-2 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

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
