"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Wrench,
  FolderOpen,
  MessageSquare,
  User,
  Key,
} from "lucide-react";

const navItems = [
  { href: "/tenant/dashboard",    label: "Dashboard",       Icon: LayoutDashboard },
  { href: "/tenant/property",     label: "My Property",     Icon: Building2 },
  { href: "/tenant/rent",         label: "Rent Payments",   Icon: CreditCard },
  { href: "/tenant/maintenance",  label: "Maintenance",     Icon: Wrench },
  { href: "/tenant/documents",    label: "Documents",       Icon: FolderOpen },
  { href: "/tenant/rtb",          label: "RTB Registration", Icon: Key },
  { href: "/tenant/messages",     label: "Messages",        Icon: MessageSquare, badge: 2 },
  { href: "/tenant/profile",      label: "Profile",         Icon: User },
];

export default function TenantSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-[300px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-[72px] border-b border-slate-100">
          <Image src="/logo.png" alt="McCann & Curran" width={36} height={36} />
          <div className="leading-tight">
            <span className="text-sm font-bold text-slate-800 tracking-tight block">
              McCann &amp; Curran
            </span>
            <span className="text-xs text-teal-600 font-semibold">Tenant Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-4">
          <ul className="space-y-1">
            {navItems.map(({ href, label, Icon, badge }) => {
              const active =
                pathname === href ||
                (href !== "/tenant/dashboard" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.95rem] font-medium transition-colors relative ${
                      active
                        ? "bg-teal-50 text-teal-700 border-l-[3px] border-teal-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-[3px] border-transparent"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={active ? "text-teal-600" : "text-slate-400"}
                    />
                    <span>{label}</span>
                    {badge && (
                      <span className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-400">
          © 2024 McCann &amp; Curran
        </div>
      </aside>
    </>
  );
}
