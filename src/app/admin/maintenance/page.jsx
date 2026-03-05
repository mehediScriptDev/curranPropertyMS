"use client";
import { useState } from "react";
import {
  Plus, ChevronDown, Search, MoreHorizontal, ArrowUpDown, Eye
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";

const REQUESTS = [
  // Open
  { id: 1,  col: "Open",        title: "Leaking tap",             priority: "Low",    assignee: { initials: "HQ", color: "bg-teal-500" },    name: "Holly Quigley",    property: "Apt 28 Parkside Plaza",   age: "4 days ago" },
  { id: 2,  col: "Open",        title: "Smoke detector faulty",   priority: "Medium", assignee: { initials: "AW", color: "bg-orange-500" },  name: "Adam Walsh",       property: "Apt 65 Southern Cross",   age: "5 days ago" },
  { id: 3,  col: "Open",        title: "Smoke alarm replacement", priority: "High",   assignee: { initials: "KD", color: "bg-rose-500" },    name: "Kevin Doples",     property: "Apt 22 Parkside Plaza",   age: "1 week ago" },
  { id: 4,  col: "Open",        title: "Leaking tap",             priority: "High",   assignee: { initials: "SK", color: "bg-emerald-600" }, name: "Steven Keane",     property: "Apt 5 City Square",       age: "1 week ago" },
  // In Progress
  { id: 5,  col: "In Progress",  title: "Broken window",           priority: "Medium", assignee: { initials: "KM", color: "bg-indigo-500" },  name: "Kevin Madden",     property: "Apt 5B Rosewood Close",   age: "4 days ago" },
  { id: 6,  col: "In Progress",  title: "Heating not working",     priority: "High",   assignee: { initials: "RS", color: "bg-sky-600" },     name: "Reginald Spencer", property: "Apt 21C Harbour View",    age: "1 week ago" },
  { id: 7,  col: "In Progress",  title: "Shower not draining",     priority: "Medium", assignee: { initials: "RS", color: "bg-sky-600" },     name: "Reginald Spencer", property: "Apt 21C Harbour View",    age: "1 week ago" },
  { id: 8,  col: "In Progress",  title: "Loose door handle",       priority: "Low",    assignee: { initials: "SK", color: "bg-teal-500" },    name: "Sarah Kelly",      property: "Apt 12 Grand Canal Dock", age: "2 weeks ago" },
  // Closed
  { id: 9,  col: "Closed",       title: "Bed replacement",         priority: "Medium", assignee: { initials: "EC", color: "bg-pink-500" },    name: "Emma Curran",      property: "Apt 7D Hanover Quay",     age: "4 days ago" },
  { id: 10, col: "Closed",       title: "Broken skirting board",   priority: "Low",    assignee: { initials: "PH", color: "bg-amber-600" },   name: "Peter Hughes",     property: "Apt 306 Fairview Road",   age: "2 weeks ago" },
  { id: 11, col: "Closed",       title: "Faulty light fitting",    priority: "Low",    assignee: { initials: "DB", color: "bg-violet-500" },  name: "Donal Byrne",      property: "Apt 104 Elmwood Grove",   age: "2 weeks ago" },
  { id: 12, col: "Closed",       title: "Damp patch on ceiling",   priority: "High",   assignee: { initials: "LB", color: "bg-cyan-600" },    name: "Leanne Byrne",     property: "Apt 104 Elmwood Grove",   age: "3 weeks ago" },
];

const STATUS_STYLE = {
  "Open":        "bg-slate-100 text-slate-600",
  "In Progress": "bg-amber-100 text-amber-700",
  "Closed":      "bg-teal-100 text-teal-700",
};

const PRIORITY_STYLE = {
  High:   "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low:    "bg-green-100 text-green-700",
};

export default function AdminMaintenancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = REQUESTS.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.property.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.col === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Maintenance</h1>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> <span className="hidden sm:inline">New Request</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {["All Property", "Priority"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition"
          >
            {label} <ChevronDown size={14} />
          </button>
        ))}
        <div className="flex-1 min-w-[180px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tenant, issue or property…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>
        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:border-slate-300 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-800 text-sm">{r.title}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${PRIORITY_STYLE[r.priority]}`}>
                {r.priority}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full ${r.assignee.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {r.assignee.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                <p className="text-xs text-slate-400">{r.property}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[r.col]}`}>{r.col}</span>
              <span className="text-xs text-slate-400">{r.age}</span>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={filtered.length} />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1"># <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">
                <span className="flex items-center gap-1">Issue </span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Tenant</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Property</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Reported</th>
              <th className="px-4 py-3 text-right font-semibold text-base text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition">
                <td className="px-4 py-3 text-slate-400 font-mono text-sm">{String(r.id).padStart(3, "0")}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-base text-slate-800">{r.title}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${r.assignee.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {r.assignee.initials}
                    </div>
                    <span className="font-medium text-slate-700">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.property}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLE[r.priority]}`}>
                    {r.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[r.col]}`}>
                    {r.col}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{r.age}</td>
                <td className="px-4 py-3 text-right">
                  <button className="w-9 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-700 text-teal-700 hover:text-white rounded-md transition">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} />
      </div>
    </div>
  );
}
