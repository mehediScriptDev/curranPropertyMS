"use client";
import { Search } from "lucide-react";

const LOGS = [
  { id: 1, ts: "2026-02-23 10:12:04", user: "Admin", action: "Updated Rent", target: "Property: 123 Main St" },
  { id: 2, ts: "2026-02-22 16:03:11", user: "System", action: "Auto-Invoice Generated", target: "Tenancy: Apt 5B" },
  { id: 3, ts: "2026-02-21 09:22:50", user: "Admin", action: "Approved Maintenance", target: "Maintenance: #342" },
  { id: 4, ts: "2026-02-20 14:45:18", user: "Admin", action: "Created Lease", target: "Property: 12 Elm St" },
];

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Audit Log</h1>
          <p className="text-base text-slate-500 mt-0.5">Track all system actions and changes</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search logs" className="pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 w-56 focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      </div>

      {/* Table for lg+ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hidden lg:block">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Timestamp</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">User</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Action</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {LOGS.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition">
                <td className="px-3 py-3 text-sm text-slate-600">{l.ts}</td>
                <td className="px-3 py-3 text-sm font-medium text-slate-700">{l.user}</td>
                <td className="px-3 py-3 text-sm text-slate-700">{l.action}</td>
                <td className="px-3 py-3 text-sm text-slate-500">{l.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for small devices */}
      <div className="space-y-3 lg:hidden">
        {LOGS.map((l) => (
          <div key={l.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">{l.ts}</div>
                <div className="mt-1 text-sm font-medium text-slate-800">{l.action}</div>
                <div className="text-sm text-slate-500">{l.target}</div>
              </div>
              <div className="text-sm font-semibold text-slate-700">{l.user}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
