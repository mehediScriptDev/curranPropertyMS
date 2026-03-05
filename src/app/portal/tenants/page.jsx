"use client";

import { useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import { Eye, Search, ChevronDown } from "lucide-react";

const tenants = [
  { name: "Ellis Davis", property: "Apt 4 Willow Court", start: "Aug 1, 2023", pps: "1234567SA", status: "Let", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Stephen Blake", property: "Apt 306 Fairview Rd", start: "May 19, 2023", pps: "8765432TA", status: "Let", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Kevin Madden", property: "Apt 5B Rosewood Close", start: "Oct 10, 2022", pps: "—", status: "Notice Served", statusColor: "bg-amber-100 text-amber-700", late: "Rent 5 Days Late" },
  { name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Aug 3, 2023", pps: "9876543L", status: "Let", statusColor: "bg-teal-100 text-teal-700" },
  { name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Jul 15, 2021", pps: "9876543L", status: "Ended", statusColor: "bg-slate-100 text-slate-500" },
];

export default function TenantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <PortalShell>
      <div className="mb-3 lg:mb-5">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Tenants</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 lg:gap-3 mb-2 lg:mb-4">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition shadow-sm">
          All Statuses <ChevronDown size={15} />
        </button>
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {tenants.map((t, i) => (
            <div key={i} className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-700">{t.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${t.statusColor}`}>{t.status}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <p className="text-slate-400">Property</p>
                  <p className="text-slate-700">{t.property}</p>
                </div>
                <div>
                  <p className="text-slate-400">Start Date</p>
                  <p className="text-slate-700">{t.start}</p>
                </div>
                <div>
                  <p className="text-slate-400">PPS No.</p>
                  <p className="font-mono text-slate-600">{t.pps}</p>
                </div>
              </div>
              <button aria-label="View tenant" className="w-full flex items-center justify-center px-3 py-2 text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                View
              </button>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-4">Property Address</th>
                <th className="text-left px-5 py-4">Tenancy Start</th>
                <th className="text-left px-5 py-4">P.P.S. Number</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 text-base font-semibold text-slate-700">{t.name}</td>
                  <td className="px-5 py-5 text-base text-slate-600">{t.property}</td>
                  <td className="px-5 py-5 text-base text-slate-600">{t.start}</td>
                  <td className="px-5 py-5 font-mono text-sm text-slate-600">{t.pps}</td>
                  <td className="px-5 py-5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.statusColor}`}>
                      {t.status}
                    </span>
                    
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button aria-label="View tenant" className="inline-flex items-center justify-center px-3 py-2 bg-[#f0fdfa] text-gray-800 rounded-lg transition">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          total={tenants.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>
    </PortalShell>
  );
}
