"use client";
import { useState } from "react";
import {
  Plus, ChevronDown, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, Home, Users
} from "lucide-react";

const LANDLORDS = [
  { id: 1, name: "Joan Doyle",      initials: "JD", color: "bg-teal-500",    sub: "Apt 28 Perkside Plaza",  properties: 12, tenants: 9,  mobile: "085-323-8927", pps: "3276513B",  pps2: "325-0305597", dob: "14 Mar 1972", email: "joan.doyle@email.com" },
  { id: 2, name: "Edward O'Neill",  initials: "EO", color: "bg-indigo-500",  sub: "Landlords",              properties: 9,  tenants: 9,  mobile: "087-830-5562", pps: "2215876M",  pps2: "329-L27656M", dob: "19 Aug 1970", email: "edward.oneill@email.com" },
  { id: 3, name: "Leo Mohan",       initials: "LM", color: "bg-orange-500",  sub: "Attarn Maien",           properties: 8,  tenants: 7,  mobile: "086-127-4503", pps: "4305567R",  pps2: "235-4005672", dob: "07 Jul 1970", email: "leo.mohan@email.com" },
  { id: 4, name: "Mark Sheehan",    initials: "MS", color: "bg-sky-600",     sub: "Brendan Walsh · 4G3",    properties: 7,  tenants: 7,  mobile: "084-157-8902", pps: "5992104N",  pps2: "598-2104N",  dob: "21 May 1969", email: "mark.sheehan@email.com" },
  { id: 5, name: "Brendan Walsh",   initials: "BW", color: "bg-emerald-600", sub: "brendan@mail.com",       properties: 7,  tenants: 7,  mobile: "085-385-5762", pps: "3382149B",  pps2: "685-3768336", dob: "12 Jan 1982", email: "brendan@mail.com" },
  { id: 6, name: "Tony Brennan",    initials: "TB", color: "bg-violet-500",  sub: "Laan Brennan",           properties: 7,  tenants: 5,  mobile: "085-229-5064", pps: "21630585",  pps2: "085-229-5056", dob: "13 Oct 1980", email: "tony.brennan@mail.com" },
  { id: 7, name: "Emma Curran",     initials: "EC", color: "bg-pink-500",    sub: "Emma Curran",            properties: 7,  tenants: 7,  mobile: "085-925-8367", pps: "2951066C",  pps2: "235-10986C", dob: "27 Mar 1977", email: "emma.curran@email.com" },
  { id: 8, name: "Zoe Finnegan",    initials: "ZF", color: "bg-amber-500",   sub: "Mark, Atarn@emai",       properties: 7,  tenants: 7,  mobile: "087-867-9893", pps: "1805949J",  pps2: "190-397-6902", dob: "22 Apr 1988", email: "zoe.finnegan@email.com" },
  { id: 9, name: "Zoe Finnegan",    initials: "ZF", color: "bg-rose-500",    sub: "Brianna",                properties: 7,  tenants: 7,  mobile: "086-480-3433", pps: "47268351",  pps2: "190-471-4927", dob: "10 Jun 1981", email: "mark.tron@email.com" },
];

export default function AdminLandlordsPage() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const filtered = LANDLORDS.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((l) => l.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">Landlords</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> Add Landlord
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-300 transition">
          All County/City <ChevronDown size={14} />
        </button>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-40"
          />
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search landlords"
            className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition w-52"
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
                <span className="flex items-center gap-1">Properties <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Tenants <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Mobile</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">P.P.S. <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Date of Birth <ArrowUpDown size={13} className="text-slate-400" /></span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
              <th className="w-10 px-4 py-3"><MoreHorizontal size={14} className="text-slate-400" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((landlord) => (
              <tr
                key={landlord.id}
                className={`hover:bg-slate-50/70 transition ${selected.includes(landlord.id) ? "bg-teal-50/40" : ""}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(landlord.id)}
                    onChange={() => toggleRow(landlord.id)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${landlord.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {landlord.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{landlord.name}</p>
                      <p className="text-xs text-slate-400">{landlord.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Home size={12} className="text-slate-400" /> {landlord.properties}
                    </div>
                    <p className="text-xs text-slate-400 pl-[18px]">{landlord.properties} properties</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Users size={12} className="text-slate-400" /> {landlord.tenants}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-700">{landlord.mobile}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-700 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
                    {landlord.pps}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{landlord.pps2}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{landlord.dob}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{landlord.email}</td>
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

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination />
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
