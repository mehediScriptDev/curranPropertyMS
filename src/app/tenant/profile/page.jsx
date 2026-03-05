"use client";

import { useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { User, Mail, Phone, Lock, Save } from "lucide-react";

export default function TenantProfilePage() {
  const [editing, setEditing] = useState(false);

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your personal details and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Avatar + quick info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center text-center gap-3 h-fit">
          <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-3xl font-bold">
            KM
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Kevin Madden</h2>
            <p className="text-sm text-slate-500 mt-0.5">Tenant</p>
          </div>
          <div className="w-full space-y-2 text-sm text-left">
            {[
              { label: "Property",   value: "Apt 5B Rosewood Close" },
              { label: "Since",      value: "Oct 10, 2022" },
              { label: "Status",     value: "Active Tenant" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-700">{value}</span>
              </div>
            ))}
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-100">
            Active Tenant
          </span>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2 space-y-3 xl:space-y-4">
          {/* Personal details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Personal Details</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: "Full Name",     value: "Kevin Madden",             Icon: User,  type: "text" },
                { label: "Email Address", value: "kevin.madden@email.com",   Icon: Mail,  type: "email" },
                { label: "Phone Number",  value: "+353 87 123 4567",         Icon: Phone, type: "tel" },
                { label: "PPS Number",    value: "—",                        Icon: User,  type: "text" },
              ].map(({ label, value, Icon, type }) => (
                <div key={label}>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={type}
                      defaultValue={value}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
                    />
                  </div>
                </div>
              ))}
              {editing && (
                <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
                  <Save size={14} /> Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Change Password</h3>
            </div>
            <div className="p-4 space-y-4">
              {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                <div key={label}>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
                    />
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition">
                <Lock size={14} /> Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
