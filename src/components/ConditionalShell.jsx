"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/app/components/LenisInit";
import { PortalAuthProvider } from "@/context/PortalAuthContext";

export default function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/portal");
  const isAdmin  = pathname.startsWith("/admin");
  const isTenant = pathname.startsWith("/tenant");

  if (isPortal || isTenant) {
    return <>{children}</>;
  }

  if (isAdmin) {
    return <PortalAuthProvider>{children}</PortalAuthProvider>;
  }

  return (
    <SmoothScroll>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
