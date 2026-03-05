"use client";
import { useState } from "react";
import { Search, Download, ChevronDown } from "lucide-react";

const ALL_LOGS = [
  { id: 1, ts: "2026-02-23 10:12:04", adminId: "JM01", user: "John McCann",  actionType: "Update",  action: "Updated Rent",             target: "Property: Apt 5B",        ip: "192.168.1.40" },
  { id: 2, ts: "2026-02-22 16:03:11", adminId: "SYS",  user: "System",       actionType: "Create",  action: "Auto-Invoice Generated",   target: "Tenancy: Apt 5B",        ip: "127.0.0.1" },
  { id: 3, ts: "2026-02-21 09:22:50", adminId: "EC01", user: "Emma Curran",  actionType: "Update",  action: "Approved Maintenance",     target: "Maintenance: #342",      ip: "192.168.1.47" },
  { id: 4, ts: "2026-02-20 14:45:18", adminId: "JM01", user: "John McCann",  actionType: "Create",  action: "Created Lease",            target: "Property: Apt 12 Elm",   ip: "192.168.1.40" },
  { id: 5, ts: "2026-02-19 11:30:00", adminId: "SQ01", user: "Sarah Quinn",  actionType: "Delete",  action: "Deleted Document",         target: "Document: Invoice #21",  ip: "192.168.1.45" },
  { id: 6, ts: "2026-02-18 08:55:12", adminId: "CB02", user: "Ciarán Byrne", actionType: "Login",   action: "Logged In",                target: "System",                 ip: "192.168.1.46" },
];

const ACTION_TYPES = ["All Actions", "Create", "Update", "Delete", "Login"];
const USERS = ["All Users", "John McCann", "Emma Curran", "Sarah Quinn", "Ciarán Byrne", "System"];

export default function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [userFilter, setUserFilter] = useState("All Users");
  const [dateFrom, setDateFrom] = useState("");

  const filtered = ALL_LOGS.filter((l) => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "All Actions" || l.actionType === actionFilter;
    const matchUser   = userFilter === "All Users" || l.user === userFilter;
    const matchDate   = !dateFrom || l.ts >= dateFrom;
    return matchSearch && matchAction && matchUser && matchDate;
  });

  const handleExport = () => {
    const header = "Timestamp,Admin ID,User,Action Type,Action,Target,IP Address";
    const rows = filtered.map((l) => `${l.ts},${l.adminId},${l.user},${l.actionType},${l.action},${l.target},${l.ip}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "audit-log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Audit Log</h1>
          <p className="text-base text-slate-500 mt-0.5">Track all system actions and changes</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          {ACTION_TYPES.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          {USERS.map((u) => <option key={u}>{u}</option>)}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full sm:w-auto col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <div className="relative col-span-2 sm:flex-1 sm:min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs…"
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Table lg+ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hidden lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">Timestamp</th>
              <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">Admin ID</th>
              <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">User</th>
              <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">Action Type</th>
              <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">Action</th>
              <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">Target</th>
              <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition">
                <td className="px-4 py-3 font-mono text-slate-600">{l.ts}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{l.adminId}</td>
                <td className="px-4 py-3 font-medium  text-slate-700">{l.user}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    l.actionType === "Delete" ? "bg-red-100 text-red-700" :
                    l.actionType === "Create" ? "bg-teal-100 text-teal-700" :
                    l.actionType === "Login"  ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{l.actionType}</span>
                </td>
                <td className="px-4 py-3 text-slate-700">{l.action}</td>
                <td className="px-4 py-3 text-slate-500">{l.target}</td>
                <td className="px-4 py-3 font-mono text-slate-400">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((l) => (
          <div key={l.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
            <div className="flex items-start justify-between">
              <p className="text-base font-medium text-slate-800">{l.action}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                l.actionType === "Delete" ? "bg-red-100 text-red-700" :
                l.actionType === "Create" ? "bg-teal-100 text-teal-700" :
                l.actionType === "Login"  ? "bg-blue-100 text-blue-700" :
                "bg-amber-100 text-amber-700"
              }`}>{l.actionType}</span>
            </div>
            <p className="text-sm text-slate-500">{l.target}</p>
            <p className="text-sm font-semibold text-slate-700">{l.user} <span className="font-mono text-slate-400">·{l.adminId}</span></p>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span className="font-mono">{l.ts}</span>
              <span className="font-mono">{l.ip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
