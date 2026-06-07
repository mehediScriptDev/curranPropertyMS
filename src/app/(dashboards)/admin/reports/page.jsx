"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Download, TrendingUp, Banknote, Wrench, Loader2 } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";
import CalendarGrid from "@/components/admin/CalendarGrid";
import PaymentModal from "@/components/admin/PaymentModal";
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

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const EMPTY_REPORT = {
  year: 0,
  cards: {
    rentCollected: { value: 0, label: "Year to date", changePercent: 0 },
    outstandingBalance: { value: 0, label: "Across 0 units", changePercent: 0 },
    maintenanceCosts: { value: 0, label: "From recorded costs (0 items)", changePercent: 0 },
  },
  monthlyChart: MONTHS.map((month, index) => ({
    month,
    monthKey: `0-${String(index + 1).padStart(2, "0")}`,
    collected: 0,
    isFuture: false,
  })),
};

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

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-800">{data.month}</p>
      <p className={`text-base font-bold ${data.isFuture ? "text-slate-500" : "text-teal-600"}`}>
        {formatCurrency(data.rawCollected)}
      </p>
      <p className="text-xs text-slate-500 mt-1">{data.isFuture ? "Projected" : "Recorded"}</p>
    </div>
  );
}

function formatCurrency(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "€0";
  const hasCents = Math.abs(n % 1) > 0;
  return `€${n.toLocaleString("en-IE", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

function normalizeCard(card, fallbackLabel) {
  const value = Number(card?.value ?? 0);
  const changePercent = Number(card?.changePercent ?? 0);
  return {
    value: Number.isFinite(value) ? value : 0,
    label: card?.label || fallbackLabel,
    changePercent: Number.isFinite(changePercent) ? changePercent : 0,
  };
}

function normalizeReportData(data) {
  const year = Number(data?.year) || 0;
  const cards = data?.cards || {};
  const monthlyMap = new Map(
    Array.isArray(data?.monthlyChart)
      ? data.monthlyChart
          .filter((entry) => entry?.month)
          .map((entry) => [entry.month, entry])
      : []
  );

  return {
    year,
    cards: {
      rentCollected: normalizeCard(cards.rentCollected, "Year to date"),
      outstandingBalance: normalizeCard(cards.outstandingBalance, "Across 0 units"),
      maintenanceCosts: normalizeCard(cards.maintenanceCosts, "From recorded costs (0 items)"),
    },
    monthlyChart: MONTHS.map((month, index) => {
      const match = monthlyMap.get(month);
      const collected = Number(match?.collected ?? 0);
      return {
        month,
        monthKey: match?.monthKey || `0-${String(index + 1).padStart(2, "0")}`,
        collected: Number.isFinite(collected) ? collected : 0,
        isFuture: Boolean(match?.isFuture),
      };
    }),
  };
}

export default function AdminReportsPage() {
  const [report, setReport] = useState(EMPTY_REPORT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Calendar state ─────────────────────────────────────────────────────────
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth() + 1);
  const [calData, setCalData] = useState({ summary: {}, days: {} });
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError] = useState("");

  // Modal
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!baseUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const res = await authenticatedFetch(`${baseUrl}/api/v1/admin/reports`, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Unable to load reports (${res.status})`);
        }

        const json = await res.json();
        if (!mounted) return;

        if (!json?.success || !json?.data) {
          throw new Error(json?.message || "Reports payload is invalid");
        }

        setReport(normalizeReportData(json.data));
      } catch (err) {
        console.error('Error loading reports API:', err);
        if (mounted) {
          setError(err?.message || "Failed to load reports");
          setReport(EMPTY_REPORT);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  // ── Calendar data fetch ────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function loadCalendar() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      try {
        setCalLoading(true);
        setCalError("");
        const res = await authenticatedFetch(
          `${baseUrl}/api/v1/rent-payments/admin/calendar?year=${calYear}&month=${calMonth}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Calendar request failed (${res.status})`);
        const json = await res.json();
        if (!mounted) return;
        if (!json?.success || !json?.data)
          throw new Error(json?.message || "Invalid calendar payload");
        setCalData({
          summary: json.data.summary || {},
          days: json.data.days || {},
        });
      } catch (err) {
        if (mounted) {
          setCalError(err?.message || "Failed to load calendar");
          setCalData({ summary: {}, days: {} });
        }
      } finally {
        if (mounted) setCalLoading(false);
      }
    }

    loadCalendar();
    return () => { mounted = false; };
  }, [calYear, calMonth]);

  // ── Calendar handlers ──────────────────────────────────────────────────────
  const handlePrevMonth = useCallback(() => {
    if (calMonth === 1) { setCalYear((y) => y - 1); setCalMonth(12); }
    else setCalMonth((m) => m - 1);
  }, [calMonth]);

  const handleNextMonth = useCallback(() => {
    if (calMonth === 12) { setCalYear((y) => y + 1); setCalMonth(1); }
    else setCalMonth((m) => m + 1);
  }, [calMonth]);

  const handleSetMonth = useCallback((nextMonth) => {
    if (nextMonth < 1 || nextMonth > 12) return;
    setCalMonth(nextMonth);
  }, []);

  const handleSetYear = useCallback((nextYear) => {
    if (!Number.isFinite(nextYear)) return;
    setCalYear(nextYear);
  }, []);

  const handleJumpToToday = useCallback(() => {
    const now = new Date();
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth() + 1);
  }, []);

  const handleDateClick = useCallback((dateKey, payments) => {
    setSelectedDate(dateKey);
    setSelectedPayments(payments);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedPayments([]);
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: "Rent Collected",
        value: report.cards.rentCollected.value.toLocaleString("en-IE"),
        sub: report.cards.rentCollected.label,
        Icon: Banknote,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
        trend: report.cards.rentCollected.changePercent,
      },
      {
        label: "Outstanding Balance",
        value: formatCurrency(report.cards.outstandingBalance.value),
        sub: report.cards.outstandingBalance.label,
        Icon: TrendingUp,
        iconBg: "bg-slate-50",
        iconColor: "text-slate-600",
        trend: report.cards.outstandingBalance.changePercent,
      },
      {
        label: "Maintenance Costs",
        value: formatCurrency(report.cards.maintenanceCosts.value),
        sub: report.cards.maintenanceCosts.label,
        Icon: Wrench,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-500",
        trend: report.cards.maintenanceCosts.changePercent,
      },
    ],
    [report]
  );

  function getMonthLabel(year, month) {
    return new Date(year, month - 1, 1).toLocaleDateString("en-IE", { month: "long", year: "numeric" });
  }

  const rentData = useMemo(
    () =>
      report.monthlyChart.map((m, i) => ({
        month: m.month,
        value: Number((m.collected / 1000).toFixed(1)),
        rawCollected: m.collected,
        idx: i,
        isFuture: m.isFuture,
      })),
    [report.monthlyChart]
  );

  function handleExport() {
    const rows = [];
    rows.push(["Report Export", `Generated: ${new Date().toISOString()}`]);
    rows.push(["Year", String(report.year)]);
    rows.push([]);
    rows.push(["Metric", "Value", "Notes", "Change"]);
    statCards.forEach((s) => {
      const trendLabel = `${s.trend > 0 ? "+" : ""}${s.trend}%`;
      rows.push([s.label, s.value, s.sub, trendLabel]);
    });
    rows.push([]);
    rows.push(["Month", "Collected (€)", "Type"]);
    report.monthlyChart.forEach((r) => {
      rows.push([
        r.month,
        Number(r.collected || 0).toLocaleString("en-IE", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
        r.isFuture ? "Projected" : "Recorded",
      ]);
    });
    _downloadCSV("reports_export.csv", rows);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Reports</h1>
          <p className="text-base text-slate-500 mt-0.5">View and export system-wide financial reports for {report.year}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 flex items-start gap-2">
          <div className="flex-shrink-0 font-bold text-rose-500">⚠</div>
          <div className="flex-1">
            <p className="font-semibold">Error loading report data</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      ) : null}

      {/* Stat cards from calendar summary */}
      {calLoading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center">
          <Loader2 size={20} className="text-teal-500 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Loading payment statistics...</p>
        </div>
      ) : calError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700 flex items-start gap-2">
          <div className="flex-shrink-0 font-bold text-rose-500">⚠</div>
          <div className="flex-1">
            <p className="font-semibold">Unable to load statistics</p>
            <p className="text-xs mt-1">{calError}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-slate-500 leading-tight">{s.label}</p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                  <s.Icon size={18} className={s.iconColor} />
                </div>
              </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{s.sub}</p>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* ── Rent Payment Calendar ── */}
      <CalendarGrid
        year={calYear}
        month={calMonth}
        days={calData.days}
        summary={calData.summary}
        loading={calLoading}
        calError={calError}
        onDateClick={handleDateClick}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onSetMonth={handleSetMonth}
        onSetYear={handleSetYear}
        onJumpToToday={handleJumpToToday}
      />

      {/* Payment detail modal */}
      {showModal && (
        <PaymentModal
          dateKey={selectedDate}
          payments={selectedPayments}
          onClose={handleCloseModal}
        />
      )}

      {/* Bar chart - Enhanced */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Monthly Rent Collected</h2>
            <p className="text-sm text-slate-400 mt-1">Figures in thousands (€000s) • Teal = recorded • Slate = projected</p>
          </div>
          {loading ? <p className="text-xs text-slate-400">Loading...</p> : null}
        </div>
        <div className="relative" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rentData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="recordedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
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
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={600} isAnimationActive>
                {rentData.map((r, i) => {
                  const hasCollection = Number(r.rawCollected) > 0;
                  const fill = !hasCollection
                    ? "#f0f4f8"
                    : r.isFuture
                      ? "url(#projectedGrad)"
                      : "url(#recordedGrad)";
                  return (
                    <Cell
                      key={`c-${i}`}
                      fill={fill}
                      stroke={hasCollection ? (r.isFuture ? "#94a3b8" : "#0f766e") : "#cbd5e1"}
                      strokeWidth={hasCollection ? 1 : 0}
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

