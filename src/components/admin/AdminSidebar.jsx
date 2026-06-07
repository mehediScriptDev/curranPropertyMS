"use client";

import Link from "next/link";
import Image from "next/image";
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
  Mail,
  MessageSquare,
  BarChart2,
  Settings,
} from "lucide-react";

export default function AdminSidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/admin/properties", label: "Properties", Icon: Building2 },
    { href: "/admin/documents", label: "Documents", Icon: FileText },
    { href: "/admin/maintenance", label: "Maintenance", Icon: Wrench },
    { href: "/admin/landlords", label: "Landlords", Icon: Users },
    { href: "/admin/tenants", label: "Tenants", Icon: UserCheck },
    { href: "/admin/tenancies", label: "Tenancies", Icon: ClipboardList },
    { href: "/admin/rtb",       label: "RTB Registration", Icon: FileText },
    { href: "/admin/messages",  label: "Messages",  Icon: Mail },
    { href: "/admin/contact-submissions", label: "Contact Submissions", Icon: MessageSquare },
    { href: "/admin/reports",   label: "Reports",   Icon: BarChart2 },
    { href: "/admin/audit",     label: "Audit",     Icon: FolderOpen },
    { href: "/admin/settings",  label: "Settings",  Icon: Settings },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-[300px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-6 h-[72px] border-b border-slate-100">
          <Image src="/logo.png" alt="McCann & Curran Reality" width={36} height={36} />
          <div className="leading-tight">
            <span className="text-sm font-bold text-slate-800 tracking-tight block">McCann &amp; Curran Reality</span>
            <span className="text-xs text-teal-600 font-semibold">Admin</span>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto py-5 px-4">
          <ul className="space-y-1">
            {navItems.map(({ href, label, Icon }) => {
              const active = pathname === href || (href !== "/admin/dashboard" && pathname?.startsWith(href));
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
                    <Icon size={20} className={active ? "text-teal-600" : "text-slate-400"} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-5 py-4 border-t border-slate-100 text-xs text-slate-400">McCann &amp; Curran Reality Admin v1.0</div>
      </aside>
    </>
  );
}
