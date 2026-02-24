"use client";

import TenantShell from "@/components/tenant/TenantShell";
import Link from "next/link";
import {
  Home,
  CreditCard,
  Wrench,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Key,
  ArrowRight,
  Clock,
  Calendar,
} from "lucide-react";

const kpis = [
  {
    label: "Monthly Rent",
    value: "€1,750",
    Icon: CreditCard,
    color: "bg-teal-50 text-teal-600 border-teal-100",
    sub: "Due 1st of month",
  },
  {
    label: "Next Payment",
    value: "Mar 1",
    Icon: Calendar,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    sub: "6 days away",
  },
  {
    label: "Lease Ends",
    value: "Oct 10, 2025",
    Icon: Home,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    sub: "Rosewood Close",
  },
  {
    label: "Open Requests",
    value: "1",
    Icon: Wrench,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    sub: "Maintenance",
  },
  {
    label: "Documents",
    value: "4",
    Icon: FileText,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    sub: "Available",
  },
];

const alerts = [
  {
    type: "warning",
    text: "Rent payment 5 days overdue",
    meta: "€1,750 due Feb 1, 2025",
    badge: "Overdue",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    type: "info",
    text: "Maintenance request in progress — Boiler issue",
    meta: "Submitted 3 days ago",
    badge: "In Progress",
    badgeColor: "bg-teal-100 text-teal-700",
  },
];

const payments = [
  { month: "February 2025", amount: "€1,750", status: "Overdue",   statusColor: "bg-red-100 text-red-700",   date: "Due Feb 1" },
  { month: "January 2025",  amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700", date: "Jan 1, 2025" },
  { month: "December 2024", amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700", date: "Dec 1, 2024" },
  { month: "November 2024", amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700", date: "Nov 1, 2024" },
];

const maintenance = [
  { title: "Boiler not heating", date: "Feb 20, 2025", status: "In Progress", statusColor: "bg-blue-100 text-blue-700" },
  { title: "Leaking tap in kitchen", date: "Jan 10, 2025", status: "Resolved",    statusColor: "bg-teal-100 text-teal-700" },
];

const messages = [
  { from: "McCann & Curran Agency", text: "Your rent review is scheduled for May 2025.", time: "2 days ago" },
  { from: "McCann & Curran Agency", text: "A maintenance engineer will visit on Feb 24th between 10am–1pm.", time: "3 days ago" },
];

export default function TenantDashboardPage() {
  return (
    <TenantShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 xl:mb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back, Kevin</h1>
          <p className="text-slate-500 mt-1 text-sm">Apt 5B Rosewood Close · Tenancy since Oct 2022</p>
        </div>
        <Link
          href="/tenant/maintenance"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Wrench size={15} /> Report Issue
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 xl:gap-3 mb-3 xl:mb-5">
        {kpis.map(({ label, value, Icon, color, sub }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm ${color.split(" ")[2]}`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-slate-500 leading-tight">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.split(" ").slice(0, 2).join(" ")}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Alerts + Rent History */}
        <div className="lg:col-span-2 space-y-3 xl:space-y-4">

          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-lg font-bold text-slate-800">
                <AlertCircle size={20} className="text-amber-500" />
                Alerts
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3.5">
                    {a.type === "warning" ? (
                      <AlertCircle size={18} className="text-red-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={18} className="text-teal-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-base text-slate-700 font-medium">{a.text}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{a.meta}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ml-4 ${a.badgeColor}`}>
                    {a.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rent Payment History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Rent Payments</h3>
              <Link
                href="/tenant/rent"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {/* Table (lg+) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-6 py-3.5">Month</th>
                    <th className="text-left px-4 py-3.5">Date</th>
                    <th className="text-left px-4 py-3.5">Status</th>
                    <th className="text-right px-6 py-3.5">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-base font-semibold text-slate-700">{p.month}</td>
                      <td className="px-4 py-4 text-sm text-slate-500">{p.date}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-base font-bold text-slate-800">{p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards (smaller than lg) */}
            <div className="lg:hidden space-y-4 p-4">
              {payments.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 ">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{p.month}</div>
                      <div className="text-xs text-slate-400 mt-1">{p.date}</div>
                      <div className="mt-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.statusColor}`}>{p.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-800">{p.amount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Maintenance Requests</h3>
              <Link
                href="/tenant/maintenance"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {maintenance.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <Wrench size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-700">{m.title}</p>
                      <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} /> {m.date}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ml-4 ${m.statusColor}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Property Info + Messages */}
        <div className="space-y-3 xl:space-y-4">
          {/* My Property */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">My Property</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center">
                <Home size={48} className="text-teal-300" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">Apt 5B Rosewood Close</p>
                <p className="text-sm text-slate-500 mt-0.5">Dublin 9, Ireland</p>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Rent",         value: "€1,750 / month" },
                  { label: "Lease Start",  value: "Oct 10, 2022" },
                  { label: "Lease End",    value: "Oct 10, 2025" },
                  { label: "RTB",          value: "Registered" },
                  { label: "MPRN",         value: "10623847501" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/tenant/property"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-50 transition"
              >
                View Full Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right to Buy quick card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Right to Buy</h3>
              <Link href="/tenant/rtb" className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5">
                View <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Key size={20} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Eligible for Right to Buy</p>
                  <p className="text-xs text-slate-500 mt-1">You have an estimated discount based on tenancy years.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 p-3 rounded-md">
                  <div className="text-xs text-slate-500">Years tenancy</div>
                  <div className="font-semibold text-slate-800">7 years</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <div className="text-xs text-slate-500">Estimated discount</div>
                  <div className="font-semibold text-slate-800">7%</div>
                </div>
              </div>

              <Link href="/tenant/rtb" className="block w-full text-center py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold">
                View RTB Details
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Messages</h3>
              <Link
                href="/tenant/messages"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {messages.map((msg, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0">
                      MC
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{msg.from}</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-snug">{msg.text}</p>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                    <Clock size={11} /> {msg.time}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-slate-100">
              <Link
                href="/tenant/messages"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                <MessageSquare size={15} /> Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
