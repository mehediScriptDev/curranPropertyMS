"use client";

import PortalShell from "@/components/portal/PortalShell";
import { AlertTriangle, Home, Users, Wrench, FileText, FolderOpen, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

const kpis = [
  { label: "My Properties", value: "4", Icon: Home, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { label: "Active Tenancies", value: "3", Icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { label: "Open Maintenance", value: "2", Icon: Wrench, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { label: "New Documents", value: "2", Icon: FileText, color: "bg-rose-50 text-rose-600 border-rose-100" },
  { label: "My Documents", value: "1", Icon: FolderOpen, color: "bg-teal-50 text-teal-600 border-teal-100" },
];

const alerts = [
  { type: "warning", text: "Rent review due for Apt 5B Rosewood Close", meta: "Due 12 May 2024", badge: "12 May 2024", badgeColor: "bg-amber-100 text-amber-700" },
  { type: "info", text: "Broken shower reported in Apt 22 Parkside Plaza", meta: "2 days ago", badge: "In Progress", badgeColor: "bg-teal-100 text-teal-700" },
];

const properties = [
  { status: "On Notice", address: "Apt 5B Rosewood Close", sub: "Rent review in 11 days", tenant: "Kevin Madden", tenantSub: "5 days ago", rent: "€1,750", rentSub: "# 123C1678", statusColor: "bg-red-100 text-red-700" },
  { status: "Occupied", address: "Apt 306 Fairview Rd", sub: "Lease renewed", tenant: "Stephen Blake", tenantSub: "15 days ago", rent: "€1,850", rentSub: "4 Jan 2025", statusColor: "bg-teal-100 text-teal-700" },
  { status: "Notice Received", address: "Apt 22 Parkside Plaza", sub: "Tenant vacating", tenant: "Reginald Spencer", tenantSub: "3 days ago", rent: "€1,500", rentSub: "0 Dec 2024", statusColor: "bg-amber-100 text-amber-700" },
  { status: "Occupied", address: "Apt 104 Elmwood Grove", sub: "Active since Aug 2025", tenant: "Adam Walsh", tenantSub: "17 days ago", rent: "€1,600", rentSub: "12 Aug 2025", statusColor: "bg-teal-100 text-teal-700" },
];

const activity = [
  { name: "Edward Martin", action: "reported an issue in", property: "Apt 104 Elmwood Grove", time: "2 hours ago", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
  { name: "Kevin Madden", action: "rent payment 5 days late", property: "Apt 65 Southern Cross", time: "1 day ago", avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
  { name: "Sarah Quinn", action: 'uploaded "Lease Agreement"', property: "Apt 306 Fairview Rd", time: "15 days ago", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Steven Keane", action: "finalized RTB registration", property: "Apt 70 Square B-64", time: "17 days ago", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
];

export default function DashboardPage() {
  return (
    <PortalShell>
      {/* Title */}
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Welcome Back, Joe</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 mb-4 lg:mb-8">
        {kpis.map(({ label, value, Icon, color }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 lg:p-5 flex flex-col gap-2 lg:gap-3 shadow-sm ${color.split(" ")[2]}`}>
            <div className="flex items-start justify-between">
              <p className="text-xs lg:text-sm font-semibold text-slate-500 leading-tight">{label}</p>
              <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center ${color.split(" ").slice(0, 2).join(" ")}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Alerts + Properties */}
        <div className="lg:col-span-2 space-y-5">
          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-base lg:text-lg font-bold text-slate-800">
                <AlertTriangle size={18} className="text-amber-500" />
                Alerts
              </div>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5">
                View All <ArrowRight size={14} />
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-start lg:items-center justify-between px-4 lg:px-6 py-3 lg:py-4 gap-3">
                  <div className="flex items-start gap-3">
                    {a.type === "warning" ? (
                      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm lg:text-base text-slate-700 font-medium">{a.text}</p>
                      <p className="text-xs lg:text-sm text-slate-400 mt-0.5">{a.meta}</p>
                    </div>
                  </div>
                  <span className={`text-xs lg:text-sm font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${a.badgeColor}`}>
                    {a.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My Properties */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100">
              <h3 className="text-base lg:text-lg font-bold text-slate-800">My Properties</h3>
              <a href="/portal/properties" className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5">
                View All <ArrowRight size={14} />
              </a>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-slate-100">
              {properties.map((p, i) => (
                <div key={i} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-700">{p.address}</p>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${p.statusColor}`}>{p.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">{p.sub}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Tenant</p>
                      <p className="text-sm text-slate-700">{p.tenant}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Rent</p>
                      <p className="text-sm font-bold text-slate-800">{p.rent}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-6 py-3.5">Status</th>
                    <th className="text-left px-4 py-3.5">Property Address</th>
                    <th className="text-left px-4 py-3.5">Tenant</th>
                    <th className="text-right px-6 py-3.5">Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${p.statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-base font-semibold text-slate-700">{p.address}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{p.sub}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-base text-slate-700">{p.tenant}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{p.tenantSub}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-base font-bold text-slate-800">{p.rent}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{p.rentSub}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-slate-100 text-center">
              <a href="/portal/properties" className="text-sm lg:text-base text-teal-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-1.5">
                View All Properties <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-fit shadow-sm">
          <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100">
            <h3 className="text-base lg:text-lg font-bold text-slate-800">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {activity.map((a, i) => (
              <div key={i} className="flex gap-3 px-4 lg:px-5 py-3 lg:py-4">
                <Image
                  src={a.avatar}
                  alt={a.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover w-9 h-9 lg:w-10 lg:h-10 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm lg:text-base text-slate-700 leading-snug">
                    <span className="font-bold">{a.name}</span>{" "}
                    {a.action}
                  </p>
                  <p className="text-xs lg:text-sm text-teal-600 font-medium mt-0.5">{a.property}</p>
                  <p className="text-xs lg:text-sm text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 lg:px-5 py-3 lg:py-4 border-t border-slate-100 text-center">
            <a href="/portal/properties" className="text-sm lg:text-base text-teal-600 hover:text-teal-700 font-semibold">
              View All Properties →
            </a>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
