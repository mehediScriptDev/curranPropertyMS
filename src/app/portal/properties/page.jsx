"use client";

import PortalShell from "@/components/portal/PortalShell";
import { Eye } from "lucide-react";
import Link from "next/link";

const properties = [
  { id: "1", status: "Notice Served", statusColor: "bg-red-100 text-red-700", address: "Apt 5B Rosewood Close", tenant: "Kevin Madden", rent: "€1,750", rentBadge: "Rent 5 Days Late", rtb: "Registered", mprn: "10623847501" },
  { id: "2", status: "Let", statusColor: "bg-teal-100 text-teal-700", address: "Apt 306 Fairview Rd", tenant: "Stephen Blake", rent: "€1,850", rentBadge: null, rtb: "Registered", mprn: "10234762819" },
  { id: "3", status: "Notice Served", statusColor: "bg-amber-100 text-amber-700", address: "Apt 22 Parkside Plaza", tenant: "Reginald Spencer", rent: "€1,500", rentBadge: null, rtb: "Pending", mprn: "10987654321" },
  { id: "4", status: "Let", statusColor: "bg-teal-100 text-teal-700", address: "Apt 104 Elmwood Grove", tenant: "Adam Walsh", rent: "€1,600", rentBadge: null, rtb: "Registered", mprn: "10543218765" },
];

export default function PropertiesPage() {
  return (
    <PortalShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-2xl xl:text-3xl font-bold text-slate-800">My Properties</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile / tablet cards */}
        <div className="xl:hidden divide-y divide-slate-100">
          {properties.map((p, i) => (
            <div key={i} className="px-4 py-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-700">{p.address}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${p.statusColor}`}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-slate-400">Tenant</p>
                  <p className="text-slate-700 font-medium">{p.tenant}</p>
                </div>
                <div>
                  <p className="text-slate-400">Rent</p>
                  <p className="text-slate-700 font-bold">{p.rent}</p>
                </div>
                <div>
                  <p className="text-slate-400">RTB Status</p>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${p.rtb === "Registered" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>{p.rtb}</span>
                </div>
                <div>
                  <p className="text-slate-400">MPRN</p>
                  <p className="font-mono text-slate-600">{p.mprn}</p>
                </div>
              </div>
              <button aria-label="View property" className="w-full flex items-center justify-center px-3 py-2 text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                <Link href={`/portal/properties/${p.id}`} className="w-full text-center">View property</Link>
              </button>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-4">Property Address</th>
                <th className="text-left px-5 py-4">Tenant</th>
                <th className="text-left px-5 py-4">Rent</th>
                <th className="text-left px-5 py-4">RTB Status</th>
                <th className="text-left px-5 py-4">MPRN</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-base font-semibold text-slate-700">{p.address}</p>
                  </td>
                  <td className="px-5 py-5 text-base text-slate-600">{p.tenant}</td>
                  <td className="px-5 py-5">
                    <p className="text-base font-bold text-slate-700">{p.rent}</p>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${p.rtb === "Registered" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
                      {p.rtb}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-slate-500 font-mono text-sm">{p.mprn}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/portal/properties/${p.id}`} aria-label="View property" className="inline-flex items-center justify-center px-3 py-2 bg-[#f0fdfa] text-gray-800 rounded-lg transition hover:bg-teal-100">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}
