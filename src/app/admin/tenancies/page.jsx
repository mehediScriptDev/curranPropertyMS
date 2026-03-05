"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, CheckCircle2, Clock, CreditCard
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import TENANCIES from "@/data/tenancies";

const RENT_STYLE = {
  Paid:    { badge: "bg-teal-100 text-teal-700",   label: "Paid" },
  Overdue: { badge: "bg-red-100 text-red-700",     label: "Overdue" },
  Pending: { badge: "bg-amber-100 text-amber-700", label: "Pending" },
};

const STATUS_LET = {
  Let:    "bg-teal-500 text-white",
  Notice: "bg-orange-100 text-orange-600 border border-orange-300",
};
const BADGE = {
  Notice: "bg-orange-400 text-white",
  Active: "bg-teal-500 text-white",
};
const RTB_STATUS = {
  Active: "bg-teal-600 text-white",
  Notice: "bg-orange-400 text-white",
};

function AdminTenanciesInner() {
  const [selected, setSelected] = useState([]);
  // Local override map: { [tenancy.id]: "Paid" | "Overdue" | "Pending" }
  // In production this would write to Supabase
  const [rentOverrides, setRentOverrides] = useState({});
  const getRentStatus = (t) => rentOverrides[t.id] ?? t.rentStatus;
  const markPaid = (id) => setRentOverrides((prev) => ({ ...prev, [id]: "Paid" }));

  const searchParams = useSearchParams();
  const filterParam  = searchParams?.get("filter");

  const today = new Date();
  const in30  = new Date(); in30.setDate(today.getDate() + 30);

  const filtered = TENANCIES.filter((t) => {
    if (filterParam === "rtb-missing")  return !t.rtb || t.rtb === "N/A";
    if (filterParam === "rent-reviews") {
      if (!t.rentReviewDate) return false;
      const d = new Date(t.rentReviewDate);
      return d >= today && d <= in30;
    }
    return true;
  });

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Tenancies</h1>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> <span className="hidden sm:inline">New Tenancy</span>
        </button>
      </div>

      {/* Mobile cards — visible below lg */}
      <div className="lg:hidden space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {t.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm truncate">{t.name}</p>
                <p className="text-xs text-slate-400 truncate">{t.sub}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_LET[t.statusLet]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />{t.statusLet}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Landlord</p>
                <p className="font-medium text-slate-700 truncate">{t.landlord}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Rent</p>
                <p className="font-semibold text-slate-800">{t.rent}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">County/City</p>
                <p className="font-medium text-slate-700">{t.county}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">RTB #</p>
                <p className="font-medium text-slate-700">{t.rtb}</p>
              </div>
            </div>
            {/* Rent status row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                RENT_STYLE[getRentStatus(t)]?.badge ?? "bg-slate-100 text-slate-500"
              }`}>
                {getRentStatus(t) === "Paid" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                {getRentStatus(t)}
              </span>
              {getRentStatus(t) !== "Paid" && (
                <button
                  onClick={() => markPaid(t.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                >
                  <CreditCard size={11} /> Mark Paid
                </button>
              )}
            </div>
            <div className="pt-1 border-t border-slate-100">
              <button className={`w-full py-1.5 text-white text-xs font-semibold rounded-md transition ${
                t.rtbStatus === "Notice" ? "bg-orange-400 hover:bg-orange-500" : "bg-teal-600 hover:bg-teal-700"
              }`}>{t.rtbStatus}</button>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={filtered.length} />
        </div>
      </div>

      {/* Table — visible lg+ */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
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
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Rent Status</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB #</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB Date</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">RTB Status</th>
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
                            {/* statusBadge intentionally removed - single primary status shown */}
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-600 text-sm">{t.county}</td>
                <td className="px-3 py-3">
                  <p className="text-slate-800 font-medium text-sm">{t.landlord}</p>
                  <p className="text-sm text-slate-400">{t.landlordSub}</p>
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800 text-sm">{t.rent}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      RENT_STYLE[getRentStatus(t)]?.badge ?? "bg-slate-100 text-slate-500"
                    }`}>
                      {getRentStatus(t) === "Paid" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {getRentStatus(t)}
                    </span>
                    {getRentStatus(t) !== "Paid" && (
                      <button
                        onClick={() => markPaid(t.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                      >
                        <CreditCard size={11} /> Mark Paid
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <p className="text-slate-600 text-sm">{t.rtb}</p>
                  {t.rtbReg && (
                    <p className="text-sm text-teal-600 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                      {t.rtbReg}
                    </p>
                  )}
                </td>
                <td className="px-3 py-3 text-slate-500 text-sm font-mono">
                  {t.rtbDate ?? <span className="text-slate-300">—</span>}
                </td>
                <td className="px-3 py-3">
                  <button className={`px-3 py-1.5 text-white text-sm font-semibold rounded-md transition ${
                    t.rtbStatus === "Notice"
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}>
                    {t.rtbStatus}
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

export default function AdminTenanciesPage() {
  return (
    <Suspense fallback={null}>
      <AdminTenanciesInner />
    </Suspense>
  );
}

// using shared Pagination component from components/portal/Pagination
