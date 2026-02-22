"use client";
import { BarChart2 } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <p className="text-base text-slate-500 mt-0.5">View and export system-wide reports</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center">
          <BarChart2 size={26} className="text-teal-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">Reports coming soon</h3>
        <p className="text-sm text-slate-400 max-w-sm">The reports module is under construction.</p>
      </div>
    </div>
  );
}
