"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePortalAuth } from "@/context/PortalAuthContext";
import Sidebar from "@/components/portal/Sidebar";
import Topbar from "@/components/portal/Topbar";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function PortalShell({ children }) {
  const { user, loading } = usePortalAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && user?.role?.toUpperCase() === "ADMIN") {
      router.replace("/admin/dashboard");
    } else if (!loading && user?.role?.toUpperCase() === "TENANT") {
      router.replace("/tenant/dashboard");
    }
  }, [user, loading, router]);

  // scroll to top when the route/pathname changes (prevents preserved scroll position)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname]);

  if (loading) return <LoadingScreen />;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main — offset for fixed sidebar + topbar */}
      <main className="lg:pl-[300px] pt-[72px] min-h-screen">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
