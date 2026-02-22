"use client";
import { useState } from "react";
import {
  Plus, ChevronDown, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown
} from "lucide-react";

const TENANTS = [
  { id: 1, name: "Sarah Kelly",      initials: "SK", color: "bg-teal-500",    sub: "Apt 12 Grand Canal Dock", property: "Apt 39 Grand Canal Dock", moveIn: "01 Feb 2022", status: "Active",  mobile: "087-965-6692",  email: "sarah.kelly@email.com" },
  { id: 2, name: "Kevin Madden",     initials: "KM", color: "bg-indigo-500",  sub: "Apt 5B Rosewood Close",   property: "Apt 5B Rosewood Close",   moveIn: "20 Jan 2024", status: "Active",  mobile: "085-349-2118",  email: "kevin.madder@email.com" },
  { id: 3, name: "Adam Walsh",       initials: "AW", color: "bg-orange-500",  sub: "Apt 65 Southern Cross",   property: "Apt 65 Southern Cross",   moveIn: "26 Sep 2021", status: "Notice",  mobile: "086-492-7564",  email: "adam.walsh@email.com" },
  { id: 4, name: "Reginald Spencer", initials: "RS", color: "bg-sky-600",     sub: "Apt 21C Harbour View",    property: "Apt 21C Harbour View",    moveIn: "24 Sep 2022", status: "Active",  mobile: "085-235-3433",  email: "reginald.spencer@email.com" },
  { id: 5, name: "Steven Keane",     initials: "SK", color: "bg-emerald-600", sub: "Emma Curran",             property: "Apt 5 City Square",       moveIn: "03 Mar 2020", status: "Active",  mobile: "083-705-6836",  email: "steven.keane@email.com" },
  { id: 6, name: "Stephen Blake",    initials: "SB", color: "bg-violet-500",  sub: "Dean Lyons",              property: "Apt 30 Fairview Road",    moveIn: "17 Oct 2020", status: "Active",  mobile: "086-103-6112",  email: "emma.ciuran@email.com" },
  { id: 7, name: "Holly Quigley",    initials: "HQ", color: "bg-pink-500",    sub: "Apt 22 Parkside Plaza",   property: "Apt 29 Parkside Plaza",   moveIn: "01 Apr 2018", status: "Notice",  mobile: "086-927-6382",  email: "holly.quigley@email.com" },
  { id: 8, name: "Peter Hughes",     initials: "PH", color: "bg-amber-600",   sub: "Apt 306 Fairview Road",   property: "Apt 206 Fairview Road",   moveIn: "08 Mar 2022", status: "Notice",  mobile: "086-209-3605",  email: "holly.quigley@email.com" },
];

const STATUS_STYLES = {
  Active: "bg-teal-100 text-teal-700",
  Notice: "bg-orange-100 text-orange-600",
};

export default function AdminTenantsPage() {
  const [selected, setSelected] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [search, setSearch] = useState("");

  const statuses = ["All Statuses", "Active", "Notice"];
  const nextStatus = () =>
    setStatusFilter((cur) => statuses[(statuses.indexOf(cur) + 1) % statuses.length]);

  const filtered = TENANTS.filter((t) => {
    const matchStatus = statusFilter === "All Statuses" || t.status === statusFilter;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.property.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">Tenants</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> Add Tenant
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 flex items-center gap-1.5">
        <span className="hover:text-slate-600 cursor-pointer">Landlords</span>
        <span>/</span>
        <span className="text-slate-600 font-medium">Add Landlord</span>
      </nav>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {["All County/City", "All Properties"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition"
          >
            {label} <ChevronDown size={14} />
          </button>
        ))}
        <button
          onClick={nextStatus}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition"
        >
          {statusFilter} <ChevronDown size={14} />
        </button>
        <div className="flex-1 min-w-[200px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenants…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition">
          <Plus size={14} /> New
        </button>
        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:border-slate-300 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Property <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Move-In Date <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Status <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Mobile</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
              <th className="w-28 px-4 py-3"><MoreHorizontal size={14} className="text-slate-400 ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tenant) => (
              <tr
                key={tenant.id}
                className={`hover:bg-slate-50/70 transition ${selected.includes(tenant.id) ? "bg-teal-50/40" : ""}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(tenant.id)}
                    onChange={() => toggleRow(tenant.id)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${tenant.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {tenant.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{tenant.name}</p>
                      <p className="text-xs text-slate-400">{tenant.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{tenant.property}</td>
                <td className="px-4 py-3 text-slate-600">{tenant.moveIn}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[tenant.status]}`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{tenant.mobile}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{tenant.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    <button className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-l-md transition">
                      View
                    </button>
                    <button className="px-1.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-r-md transition border-l border-teal-500">
                      <ChevronDown size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Pagination />
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition">
            Cancel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
            <Plus size={14} /> Add Landlord
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div className="flex items-center gap-1">
      <PagBtn icon={<ChevronsLeft size={14} />} />
      <PagBtn icon={<ChevronLeft size={14} />} />
      <button className="w-8 h-8 flex items-center justify-center rounded-md bg-teal-600 text-white text-sm font-semibold">1</button>
      <PagBtn icon={<ChevronRight size={14} />} />
      <PagBtn icon={<ChevronsRight size={14} />} />
    </div>
  );
}

function PagBtn({ icon }) {
  return (
    <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">
      {icon}
    </button>
  );
}
