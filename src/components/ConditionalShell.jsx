"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/app/components/LenisInit";

export default function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isPortal  = pathname.startsWith("/portal");
  const isAdmin   = pathname.startsWith("/admin");
  const isTenant  = pathname.startsWith("/tenant");
  const isAuth    = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isPortal || isTenant || isAuth) {
    return <>{children}</>;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
