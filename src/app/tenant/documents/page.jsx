"use client";

import TenantShell from "@/components/tenant/TenantShell";
import { FileText, Download } from "lucide-react";

const docs = [
  { name: "Lease Agreement 2022.pdf",          type: "Lease",       date: "Oct 10, 2022", size: "248 KB", typeColor: "bg-blue-50 text-blue-700" },
  { name: "RTB Registration Certificate.pdf",  type: "RTB",         date: "Oct 15, 2022", size: "134 KB", typeColor: "bg-purple-50 text-purple-700" },
  { name: "Lease Renewal Agreement 2024.pdf",  type: "Lease",       date: "May 15, 2024", size: "261 KB", typeColor: "bg-blue-50 text-blue-700" },
  { name: "January 2025 Rent Statement.pdf",   type: "Statement",   date: "Feb 1, 2025",  size: "89 KB",  typeColor: "bg-teal-50 text-teal-700" },
  { name: "Annual Inspection Report 2024.pdf", type: "Inspection",  date: "Mar 20, 2024", size: "320 KB", typeColor: "bg-amber-50 text-amber-700" },
];

export default function TenantDocumentsPage() {
  return (
    <TenantShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
        <p className="text-slate-500 mt-1 text-sm">All documents related to your tenancy at Apt 5B Rosewood Close</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-6 py-4">Document</th>
                <th className="text-left px-5 py-4">Type</th>
                <th className="text-left px-5 py-4">Date</th>
                <th className="text-left px-5 py-4">Size</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-slate-500" />
                      </div>
                      <span className="text-base font-semibold text-slate-700">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${d.typeColor}`}>{d.type}</span>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">{d.date}</td>
                  <td className="px-5 py-5 text-sm text-slate-400">{d.size}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TenantShell>
  );
}
