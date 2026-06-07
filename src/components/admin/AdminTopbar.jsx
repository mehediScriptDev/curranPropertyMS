"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Users2, ChevronDown, LogOut, Menu } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function AdminTopbar({ onMenuClick, mobileOpen }) {
  const router = useRouter();
  const { user, logout } = usePortalAuth();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 lg:left-[300px] right-0 z-20 h-[72px] bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 text-slate-500 hover:text-slate-800"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* Right icons */}
      <div className="flex items-center gap-4 ml-auto">
        <button onClick={() => router.push('/admin/messages')} className="p-2 text-slate-500 hover:text-slate-800 transition" title="Messages">
          <Mail size={20} />
        </button>
       

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className="flex items-center gap-2.5 ml-1 hover:opacity-80 transition"
          >
            {/* <Image
              src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt={user?.name}
              width={36}
              height={36}
              className="rounded-full object-cover"
            /> */}
            <span className="hidden sm:block text-[0.95rem] font-medium text-slate-700">
              {user?.name}
            </span>
            <ChevronDown size={15} className="text-slate-500" />
          </button>

          {dropOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
              <Link href="/" onClick={() => setDropOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Go home
              </Link>
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

        {/* (right-side mobile menu removed) */}
      </div>
    </header>
  );
}
