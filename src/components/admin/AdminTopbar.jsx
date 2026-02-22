"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, Mail, Users2, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function AdminTopbar({ onMenuClick, mobileOpen }) {
  const router = useRouter();
  const { user, logout } = usePortalAuth();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/portal/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-[68px] bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-6">
      {/* Logo */}
      <Link href="/admin/dashboard" className="flex items-center gap-2.5 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
          <Image src="/logo.png" alt="McCann & Curran" width={28} height={28} />
        </div>
        <span className="hidden sm:block text-[1rem] font-extrabold text-slate-800 tracking-tight">
          McCann &amp; Curran
        </span>
      </Link>

      <div className="flex-1" />

      {/* Right icons */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition relative">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition">
          <Mail size={19} />
        </button>
        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition">
          <Users2 size={19} />
        </button>

        <div className="w-px h-7 bg-slate-200 mx-2" />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition"
          >
            <Image
              src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt={user?.name || "Admin"}
              width={34}
              height={34}
              className="rounded-full object-cover"
            />
            <span className="hidden sm:block text-[0.875rem] font-semibold text-slate-700">
              {user?.name ? user.name.split(" ")[0][0] + ". " + user.name.split(" ").slice(-1)[0] : "Admin"}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {dropOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email || "admin@mccannandcurran.ie"}</p>
              </div>
              <a href="/admin/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setDropOpen(false)}>
                My Profile
              </a>
              <a href="/admin/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setDropOpen(false)}>
                Settings
              </a>
              <hr className="my-1 border-slate-100" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <button className="md:hidden p-2 ml-1 rounded-lg text-slate-500 hover:bg-slate-100" onClick={onMenuClick}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
