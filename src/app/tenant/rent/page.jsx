"use client";

import { useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import Link from "next/link";
import { Download, AlertTriangle, CreditCard } from "lucide-react";

const payments = [
  { month: "February 2025", amount: "€1,750", status: "Overdue",   statusColor: "bg-red-100 text-red-700",    date: "Due Feb 1, 2025",  ref: "#TXN-2025-02" },
  { month: "January 2025",  amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700",  date: "Jan 1, 2025",       ref: "#TXN-2025-01" },
  { month: "December 2024", amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700",  date: "Dec 1, 2024",       ref: "#TXN-2024-12" },
  { month: "November 2024", amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700",  date: "Nov 1, 2024",       ref: "#TXN-2024-11" },
  { month: "October 2024",  amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700",  date: "Oct 1, 2024",       ref: "#TXN-2024-10" },
  { month: "September 2024",amount: "€1,750", status: "Paid",      statusColor: "bg-teal-100 text-teal-700",  date: "Sep 1, 2024",       ref: "#TXN-2024-09" },
];

export default function TenantRentPage() {
  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Rent Payments</h1>
        <p className="text-slate-500 mt-1 text-sm">Full payment history for your tenancy at Apt 5B Rosewood Close</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3 mb-3 xl:mb-5">
        {[
          { label: "Monthly Rent",   value: "€1,750", color: "text-teal-600 bg-teal-50",   border: "border-teal-100" },
          { label: "Next Payment",   value: "Mar 1",  color: "text-blue-600 bg-blue-50",    border: "border-blue-100" },
          { label: "Current Balance",value: "Overdue",color: "text-red-600 bg-red-50",      border: "border-red-100" },
        ].map(({ label, value, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3 ${border}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <CreditCard size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overdue banner */}
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
        <AlertTriangle size={20} className="text-red-500 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-700">February 2025 rent is overdue</p>
          <p className="text-xs text-red-400 mt-0.5">Please contact your letting agent if you have any issues.</p>
        </div>
        <Link
          href="/tenant/messages"
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Message Agent
        </Link>
      </div>

      {/* Table (lg+) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Month</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Reference</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="text-right px-5 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 text-base font-semibold text-slate-700">{p.month}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{p.date}</td>
                  <td className="px-4 py-4 font-mono text-sm text-slate-400">{p.ref}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-base font-bold text-slate-800">{p.amount}</td>
                  <td className="px-5 py-4 text-right">
                    {p.status === "Paid" ? (
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 rounded-lg transition">
                        <Download size={13} /> Receipt
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards (smaller than lg) */}
      <div className="lg:hidden space-y-2">
        {payments.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-700">{p.month}</div>
                <div className="text-xs text-slate-400 mt-1">{p.date} · <span className="font-mono">{p.ref}</span></div>
                <div className="mt-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.statusColor}`}>{p.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-slate-800">{p.amount}</div>
                <div className="mt-2">
                  {p.status === "Paid" ? (
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 rounded-lg transition">
                      <Download size={13} /> Receipt
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TenantShell>
  );
}
