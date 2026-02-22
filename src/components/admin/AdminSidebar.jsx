"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FileText,
  FolderOpen,
  Wrench,
  Users,
  UserCheck,
  ClipboardList,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard",   label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/admin/properties",  label: "Properties",  Icon: Building2 },
  { href: "/admin/tenancies",   label: "Tenancies",   Icon: FileText },
  { href: "/admin/documents",   label: "Documents",   Icon: FolderOpen },
  { href: "/admin/maintenance", label: "Maintenance", Icon: Wrench },
  { href: "/admin/landlords",   label: "Landlords",   Icon: UserCheck },
  { href: "/admin/tenants",     label: "Tenants",     Icon: Users },
  { href: "/admin/audit",       label: "Audit Log",   Icon: ClipboardList },
  { href: "/admin/settings",    label: "Settings",    Icon: Settings },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-[68px] left-0 z-20 h-[calc(100vh-68px)] w-[300px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav className="flex-1 py-5 px-4">
          <ul className="space-y-1">
            {navItems.map(({ href, label, Icon }) => {
              const active =
                pathname === href ||
                (href !== "/admin/dashboard" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.95rem] font-medium transition-colors ${
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-400">
          McCann &amp; Curran Admin v1.0
        </div>
      </aside>
    </>
  );
}
