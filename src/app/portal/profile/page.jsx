"use client";

import PortalShell from "@/components/portal/PortalShell";
import Image from "next/image";
import { Lock, ArrowRight } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function ProfilePage() {
  const { user } = usePortalAuth();

  return (
    <PortalShell>
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
      </div>

      <div className="max-w-3xl space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
            <Image
              src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt={user?.name}
              width={72}
              height={72}
              className="rounded-full object-cover w-[72px] h-[72px] shrink-0"
            />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
            </div>
          </div>

          {/* Admin-only notice */}
          <div className="mx-6 my-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Lock size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-semibold text-amber-800">Edit Only by Admin</p>
              <p className="text-sm text-amber-700 mt-1">
                Contact McCann &amp; Curran for any changes to your profile.<br />
                Editing is restricted to administrators.
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="px-6 py-4">
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Email</p>
                <p className="text-base text-slate-700">{user?.email}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Address</p>
                <p className="text-base font-semibold text-slate-700">{user?.address?.split(",")[0]}</p>
                <p className="text-base text-slate-500">{user?.address?.split(",").slice(1).join(",").trim()}</p>
                <p className="text-sm text-slate-400 mt-1.5">30 minutes ago</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-t border-slate-100">
              <div className="px-6 py-4">
                <p className="text-base text-slate-700">{user?.phone}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-base font-bold text-slate-700">{user?.ppsNumber}</p>
                <p className="text-sm text-slate-400 mt-1.5">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact admin card */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-amber-200 flex items-center gap-2.5">
            <Lock size={18} className="text-amber-600" />
            <p className="text-base font-semibold text-amber-800">
              Only McCann &amp; Curran administrators can{" "}
              <span className="font-bold">edit this information</span>
            </p>
          </div>
          <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-base text-amber-700">
              Need any changes made to your profile? Please contact McCann &amp; Curran for assistance.
            </p>
            <a
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition"
            >
              Contact Us <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
