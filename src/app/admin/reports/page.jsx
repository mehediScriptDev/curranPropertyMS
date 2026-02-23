"use client";
import { useState, useMemo } from "react";
import { Download, TrendingUp, Banknote, Wrench, Building2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const STAT_CARDS = [
  { label: "Total Rent Collected",  value: "€1,245,600", sub: "Year to date",      Icon: Banknote,   iconBg: "bg-teal-50",   iconColor: "text-teal-600",   trend: "+4.2%" },
  { label: "Outstanding Balance",   value: "€42,300",    sub: "Across 18 units",  Icon: TrendingUp,  iconBg: "bg-rose-50",   iconColor: "text-rose-500",   trend: "-1.1%" },
  { label: "Maintenance Costs",     value: "€18,750",    sub: "Last 12 months",   Icon: Wrench,      iconBg: "bg-orange-50", iconColor: "text-orange-500", trend: "+2.8%" },
  { label: "Occupancy Rate",        value: "97%",         sub: "315 properties",   Icon: Building2,   iconBg: "bg-sky-50",    iconColor: "text-sky-500",    trend: "+0.5%" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const RENT_DATA = [88,92,85,96,100,98,102,97,93,105,110,104];
const MAX_RENT  = Math.max(...RENT_DATA);

function _downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function CustomTooltip({ payload, monthRange }) {
  if (!payload || !payload.length) return null;
  const data = payload[0];
  const inRange = monthRange.wraps
    ? (data.payload.idx >= monthRange.startMonth || data.payload.idx <= monthRange.endMonth)
    : (data.payload.idx >= monthRange.startMonth && data.payload.idx <= monthRange.endMonth);
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-800">{data.payload.month}</p>
      <p className={`text-base font-bold ${inRange ? 'text-teal-600' : 'text-slate-400'}`}>€{data.value}k</p>
      <p className="text-xs text-slate-500 mt-1">{inRange ? 'In range' : 'Outside range'}</p>
    </div>
  );
}

export default function AdminReportsPage() {
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(); d.setMonth(0, 1); d.setHours(0,0,0,0); return d.toISOString().slice(0,10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0,10));
  const [property, setProperty] = useState("All Properties");

  const properties = useMemo(() => ["All Properties", "Parkside Plaza", "Grand Dock", "Harbour View"], []);

  const monthRange = useMemo(() => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const startMonth = Math.max(0, Math.min(11, start.getMonth()));
    const endMonth = Math.max(0, Math.min(11, end.getMonth()));
    const wraps = startMonth > endMonth;
    return { startMonth, endMonth, wraps };
  }, [fromDate, toDate]);

  function handleExport() {
    const rows = [];
    rows.push(["Report Export", `Generated: ${new Date().toISOString()}`]);
    rows.push(["Filter", `Property: ${property}`, `From: ${fromDate}`, `To: ${toDate}`]);
    rows.push([]);
    rows.push(["Metric", "Value", "Notes"]);
    STAT_CARDS.forEach((s) => rows.push([s.label, s.value, s.sub]));
    rows.push([]);
    rows.push(["Month", "Value (k)"]);
    RENT_DATA.forEach((v, i) => {
      if (i >= monthRange.startMonth && i <= monthRange.endMonth) rows.push([MONTHS[i], v]);
    });
    _downloadCSV("reports_export.csv", rows);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <p className="text-base text-slate-500 mt-0.5">View and export system-wide financial and occupancy reports</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-slate-500">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-sm text-slate-500">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <select value={property} onChange={(e) => setProperty(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
            {properties.map((p) => <option key={p}>{p}</option>)}
          </select>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-slate-500 leading-tight">{s.label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                <s.Icon size={18} className={s.iconColor} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{s.sub}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                s.trend.startsWith("+") ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-500"
              }`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart - Enhanced */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Monthly Rent Collected</h2>
            <p className="text-sm text-slate-400 mt-1">Figures in thousands (€000s) • Teal bars = selected range</p>
          </div>
        </div>
        <div className="relative" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={RENT_DATA.map((v, i) => ({ month: MONTHS[i], value: v, idx: i }))}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f0f4f8" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip monthRange={monthRange} />}
                cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={600} isAnimationActive>
                {RENT_DATA.map((v, i) => {
                  const inRange = monthRange.wraps
                    ? (i >= monthRange.startMonth || i <= monthRange.endMonth)
                    : (i >= monthRange.startMonth && i <= monthRange.endMonth);
                  return (
                    <Cell
                      key={`c-${i}`}
                      fill={inRange ? 'url(#colorGrad)' : '#f0f4f8'}
                      stroke={inRange ? '#0f766e' : '#cbd5e1'}
                      strokeWidth={inRange ? 1 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

