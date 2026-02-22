"use client";
import { useState } from "react";
import {
  Plus, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown
} from "lucide-react";

const TENANCIES = [
  { id: 1,  initials: "SK", color: "bg-teal-500",    name: "Sarah Kelly",           sub: "Apt 12, Grand Dock",         statusLet: "Let",    statusBadge: null,           county: "AKsiculs",  landlord: "Edward O'Neill", landlordSub: "Dublin · 10:44", startDate: "01 Feb 2022", rent: "€2,200", rtb: "1234598",   rtbStatus: "Active",  rtbReg: null },
  { id: 2,  initials: "KM", color: "bg-orange-400",  name: "Kevin Madden",          sub: "Apt 5B · 10:2",              statusLet: "Notice", statusBadge: "Notice",       county: null,        landlord: "Joan Doyle",      landlordSub: "Dublin · 54:60", startDate: "18 Nov 2020", rent: "€1,950", rtb: "2324059",   rtbStatus: "Notice", rtbReg: null },
  { id: 3,  initials: "AW", color: "bg-slate-500",   name: "Adam Walsh",            sub: "1652AO55 · 3.6.2",           statusLet: "Let",    statusBadge: null,           county: null,        landlord: "Brendan Walsh",   landlordSub: "Dublin · 00:383", startDate: "27 Dec 2019", rent: "€1,950", rtb: "2324059",   rtbStatus: "Active",  rtbReg: null },
  { id: 4,  initials: "RS", color: "bg-sky-600",     name: "Reginald Spencer",      sub: "Apt 25, Grand Dock",        statusLet: "Let",    statusBadge: null,           county: null,        landlord: "Edward O'Neill", landlordSub: "Dublin · 10:24", startDate: "28 Jan 2022", rent: "€2,350", rtb: "100999118", rtbStatus: "Active",  rtbReg: "Registered" },
  { id: 5,  initials: "ES", color: "bg-emerald-500", name: "Apt 21C, Harbour View",  sub: "Dublin · 10:30",            statusLet: "Let",    statusBadge: "AAlctice",     county: null,        landlord: "Edward O'Neill", landlordSub: "Dublin · 10:36", startDate: "20 Feb 2021", rent: "€2,400", rtb: "100999118", rtbStatus: "Active",  rtbReg: "Registered" },
  { id: 6,  initials: "7D", color: "bg-teal-700",    name: "Apt 7D, Hanover Quay",  sub: "IyarlSD Dublin · 10:40",    statusLet: "Let",    statusBadge: "AAlctice",     county: null,        landlord: "Brendan Walsh",   landlordSub: "Dublin · 10:63", startDate: "23 Jan 2018", rent: "€2,200", rtb: "100993361",  rtbStatus: "Active",  rtbReg: "Registered" },
  { id: 7,  initials: "PH", color: "bg-slate-400",   name: "Peter Hughes",           sub: "Dublin · Spetari · 1042",  statusLet: "Let",    statusBadge: "Notice",       county: null,        landlord: "Mary Bennett",    landlordSub: "Dublin · 29:23", startDate: "29 Jun 2018", rent: "€2,100", rtb: "100999253",  rtbStatus: "Active",  rtbReg: "Registered" },
  { id: 8,  initials: "SB", color: "bg-indigo-400",  name: "Apt 399, Pearse Street", sub: "Dublin · 10:25",            statusLet: "Let",    statusBadge: "Notice",       county: null,        landlord: "Edward O'Neill", landlordSub: "Dublin · 10:55", startDate: "20 Sep 2023", rent: "€2,100", rtb: "1000993419", rtbStatus: "Active",  rtbReg: "Registered" },
  { id: 9,  initials: "HQ", color: "bg-pink-400",    name: "Holly Quigley",          sub: "Dublin · 10:35",            statusLet: "Let",    statusBadge: "AActive",      county: null,        landlord: "Leo Mohan",       landlordSub: "Dublin · 10:35", startDate: "25 Dec 2021", rent: "€1,650", rtb: "100992455",  rtbStatus: "Active",  rtbReg: "Registered" },
  { id: 10, initials: "2B", color: "bg-violet-400",  name: "Apt 2B, Parkside Plaza", sub: "Dublin · 10:69",            statusLet: "Let",    statusBadge: null,           county: null,        landlord: "Leo Mohan",       landlordSub: "Dublin · 16r:29", startDate: "29 Jun 2020", rent: "€1,800", rtb: "100092490",  rtbStatus: "Active",  rtbReg: "Unknown" },
];

const STATUS_LET = {
  Let:    "bg-teal-500 text-white",
  Notice: "bg-orange-100 text-orange-600 border border-orange-300",
};
const BADGE = {
  Notice:   "bg-orange-400 text-white",
  AAlctice: "bg-teal-500 text-white",
  AActive:  "bg-teal-500 text-white",
};
const RTB_STATUS = {
  Active: "bg-teal-600 text-white",
  Notice: "bg-orange-400 text-white",
};

export default function AdminTenanciesPage() {
  const [selected, setSelected] = useState([]);

  const filtered = TENANCIES;

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Tenancies</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> New Tenancy
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Tenant <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Status <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">County/City <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Landlord <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Rent</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB #</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <tr key={t.id} className={`hover:bg-slate-50/60 transition ${selected.includes(t.id) ? "bg-teal-50/40" : ""}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleRow(t.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-base">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold w-fit ${STATUS_LET[t.statusLet]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                      {t.statusLet}
                    </span>
                    {t.statusBadge && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-semibold w-fit ${BADGE[t.statusBadge] || "bg-orange-400 text-white"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                        {t.statusBadge.replace("AAlctice", "Active").replace("AActive", "Active")}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-600 text-sm">{t.county}</td>
                <td className="px-3 py-3">
                  <p className="text-slate-800 font-medium text-sm">{t.landlord}</p>
                  <p className="text-sm text-slate-400">{t.landlordSub}</p>
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800 text-sm">{t.rent}</td>
                <td className="px-3 py-3">
                  <p className="text-slate-600 text-sm">{t.rtb}</p>
                  {t.rtbReg && (
                    <p className="text-sm text-teal-600 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                      {t.rtbReg}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-0.5">
                    <button className={`px-3 py-1.5 text-white text-sm font-semibold rounded-l-md transition ${
                      t.rtbStatus === "Notice"
                        ? "bg-orange-400 hover:bg-orange-500"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}>
                      {t.rtbStatus}
                    </button>
                    <button className={`px-1.5 py-1.5 text-white rounded-r-md transition border-l ${
                      t.rtbStatus === "Notice"
                        ? "bg-orange-500 hover:bg-orange-600 border-orange-400"
                        : "bg-teal-700 hover:bg-teal-800 border-teal-500"
                    }`}>
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
