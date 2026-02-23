"use client";

import { useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { Wrench, Plus, Clock, CheckCircle2, AlertCircle, X } from "lucide-react";

const requests = [
  {
    id: "MR-001",
    title: "Boiler not heating",
    desc: "The boiler stopped providing hot water and central heating since Feb 20th.",
    date: "Feb 20, 2025",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    priority: "High",
    priorityColor: "bg-red-100 text-red-700",
  },
  {
    id: "MR-002",
    title: "Leaking tap in kitchen",
    desc: "The kitchen cold tap has been dripping constantly.",
    date: "Jan 10, 2025",
    status: "Resolved",
    statusColor: "bg-teal-100 text-teal-700",
    priority: "Medium",
    priorityColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "MR-003",
    title: "Broken window latch",
    desc: "Bedroom window latch is broken and cannot be secured.",
    date: "Nov 5, 2024",
    status: "Resolved",
    statusColor: "bg-teal-100 text-teal-700",
    priority: "Low",
    priorityColor: "bg-slate-100 text-slate-600",
  },
];

const statusIcon = {
  "In Progress": <Clock size={14} className="text-blue-600" />,
  "Resolved": <CheckCircle2 size={14} className="text-teal-600" />,
  "Open": <AlertCircle size={14} className="text-amber-600" />,
};

export default function TenantMaintenancePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <TenantShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Maintenance</h1>
          <p className="text-slate-500 mt-1 text-sm">Submit and track maintenance requests for your property</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus size={15} /> Report Issue
        </button>
      </div>

      {/* New Request Form (inline) */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-800">New Maintenance Request</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Issue Title</label>
              <input
                type="text"
                placeholder="e.g. Broken heating unit"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Priority</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Emergency</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Description</label>
              <textarea
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
                Submit Request
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-6 py-4">Issue</th>
                <th className="text-left px-5 py-4">Submitted</th>
                <th className="text-left px-5 py-4">Priority</th>
                <th className="text-left px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Wrench size={17} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-700">{r.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5 max-w-xs truncate">{r.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">{r.date}</td>
                  <td className="px-5 py-5">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.priorityColor}`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${r.statusColor}`}>
                      {statusIcon[r.status]} {r.status}
                    </span>
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
