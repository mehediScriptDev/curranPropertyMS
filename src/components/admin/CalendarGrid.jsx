"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, List, Loader2 } from "lucide-react";
import {
  buildCalendarGrid,
  getMonthLabel,
  getStatusConfig,
  formatCalCurrency,
  todayKey,
} from "@/utils/calendarHelpers";

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, idx) => ({
  value: idx + 1,
  label: new Date(2026, idx, 1).toLocaleDateString("en-IE", { month: "short" }),
}));



export default function CalendarGrid({
  year,
  month,
  days = {},
  summary = {},
  loading = false,
  calError = "",
  onDateClick,
  onPrevMonth,
  onNextMonth,
  onSetMonth,
  onSetYear,
  onJumpToToday,
}) {
  const [viewMode, setViewMode] = useState("calendar");

  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month]);
  const TODAY_KEY = todayKey();
  const currentYear = new Date().getFullYear();

  const yearOptions = useMemo(() => {
    const years = new Set([year]);
    for (let y = currentYear - 2; y <= currentYear + 3; y++) years.add(y);
    return Array.from(years).sort((a, b) => a - b);
  }, [currentYear, year]);

  const dayEntries = useMemo(() => {
    return Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateKey, rawPayments]) => {
        const allPayments = Array.isArray(rawPayments) ? rawPayments : [];

        const statusCounts = { PAID: 0, PENDING: 0, OVERDUE: 0 };
        allPayments.forEach((p) => {
          if (statusCounts[p.status] !== undefined) statusCounts[p.status] += 1;
        });

        return {
          dateKey,
          allPayments,
          filteredPayments: allPayments,
          filteredTotal: allPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
          statusCounts,
          counts: statusCounts,
          hasAny: allPayments.length > 0,
          visibleTotal: allPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
        };
      });
  }, [days]);

  const dayMap = useMemo(() => {
    const map = new Map();
    dayEntries.forEach((entry) => map.set(entry.dateKey, entry));
    return map;
  }, [dayEntries]);

  const listEntries = useMemo(
    () => dayEntries.filter((d) => d.filteredPayments.length > 0),
    [dayEntries]
  );

  const filteredTotals = useMemo(() => {
    return listEntries.reduce(
      (acc, entry) => {
        acc.count += entry.filteredPayments.length;
        acc.amount += entry.filteredTotal;
        return acc;
      },
      { count: 0, amount: 0 }
    );
  }, [listEntries]);

  function getCellInfo(dateKey) {
    const allPayments = Array.isArray(days[dateKey]) ? days[dateKey] : [];
    const counts = { PAID: 0, PENDING: 0, OVERDUE: 0 };
    allPayments.forEach((p) => {
      if (counts[p.status] !== undefined) counts[p.status]++;
    });

    return {
      allPayments,
      filteredPayments: allPayments,
      counts,
      hasAny: allPayments.length > 0,
      visibleTotal: allPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    };
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-100 bg-gradient-to-r from-teal-50/60 via-cyan-50/20 to-white">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Rent Calendar</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
            Track due dates, open day-level details, and focus by status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 order-first sm:order-none">
            <button
              onClick={() => setViewMode("calendar")}
              className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === "calendar"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CalendarDays size={13} />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition ${
                viewMode === "list"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <List size={13} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevMonth}
              className="p-1.5 sm:p-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>

            <select
              value={month}
              onChange={(e) => onSetMonth?.(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
              aria-label="Select month"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => onSetYear?.(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
              aria-label="Select year"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={onNextMonth}
              className="p-1.5 sm:p-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={onJumpToToday}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Today
            </button>

            {loading && (
              <Loader2 size={14} className="text-teal-500 animate-spin" />
            )}
          </div>
        </div>
      </div>

      {calError ? (
        <div className="mx-4 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <div className="flex-shrink-0 text-rose-500 font-bold text-lg">⚠</div>
          <div className="flex-1">
            <p className="font-semibold">Unable to load calendar</p>
            <p className="text-xs mt-1">{calError}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="mx-4 mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
          <Loader2 size={20} className="text-teal-500 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Loading calendar data...</p>
        </div>
      ) : Object.keys(days).length === 0 ? (
        <div className="mx-4 mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-slate-600">No data records</p>
          <p className="text-xs text-slate-500 mt-1">There are no payments scheduled for this month yet.</p>
        </div>
      ) : null}

      {viewMode === "calendar" ? (
        <div className="p-2 sm:p-4">
          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map((d) => (
              <div
                key={d}
                className="text-center text-[9px] sm:text-[11px] font-semibold text-slate-400 py-1 uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5">
            {grid.map((cell, i) => {
              if (!cell) {
                return (
                  <div
                    key={`pad-${i}`}
                    className="rounded-lg sm:rounded-xl bg-slate-50/40 min-h-[60px] sm:min-h-[80px] md:min-h-[96px]"
                  />
                );
              }

              const dayData = dayMap.get(cell.dateKey);
              const { filteredPayments, counts, hasAny, visibleTotal } = dayData || getCellInfo(cell.dateKey);
              const isToday = cell.dateKey === TODAY_KEY;

              const hasOverdue = filteredPayments.some((p) => p.status === "OVERDUE");
              const hasPending = filteredPayments.some((p) => p.status === "PENDING");
              const tone = hasOverdue
                ? "border-rose-200 bg-rose-50/30"
                : hasPending
                ? "border-amber-200 bg-amber-50/30"
                : "border-teal-200 bg-teal-50/25";

              return (
                <button
                  key={cell.dateKey}
                  onClick={() => onDateClick(cell.dateKey, filteredPayments)}
                  className={[
                    "relative rounded-lg sm:rounded-xl border min-h-[60px] sm:min-h-[80px] md:min-h-[96px] p-1.5 sm:p-2 flex flex-col text-left transition",
                    hasAny ? `${tone} hover:shadow-sm hover:-translate-y-[1px]` : "border-slate-100 bg-slate-50/50",
                    isToday ? "ring-1 ring-teal-400" : "",
                    "cursor-pointer",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="flex items-center justify-between gap-0.5">
                    <span
                      className={`text-xs sm:text-xs font-bold ${
                        isToday ? "text-teal-700" : hasAny ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {cell.day}
                    </span>
                    {hasAny ? (
                      <span className="text-[8px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0 sm:py-0.5 rounded-full bg-white/80 text-slate-600 border border-slate-200">
                        {filteredPayments.length}
                      </span>
                    ) : null}
                  </div>

                  {hasAny ? (
                    <>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-800 mt-0.5 sm:mt-1">
                        {formatCalCurrency(visibleTotal)}
                      </p>

                      <div className="mt-0.5 sm:mt-1 space-y-0.5 hidden sm:block">
                        {filteredPayments.slice(0, 2).map((p) => (
                          <p
                            key={p.id}
                            className="text-[9px] truncate px-1 py-0.5 rounded bg-white/75 border border-white/70 text-slate-600"
                          >
                            {p.tenant?.name || p.tenancy?.property?.name || "Tenant"}
                          </p>
                        ))}
                        {filteredPayments.length > 2 ? (
                          <p className="text-[9px] text-slate-500 font-medium">
                            +{filteredPayments.length - 2} more
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1 mt-auto pt-1">
                        {counts.PAID > 0 ? (
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusConfig("PAID").dot}`} />
                        ) : null}
                        {counts.PENDING > 0 ? (
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusConfig("PENDING").dot}`} />
                        ) : null}
                        {counts.OVERDUE > 0 ? (
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusConfig("OVERDUE").dot}`} />
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Legend:</span>
            {[
              { status: "PAID", label: "Paid" },
              { status: "PENDING", label: "Pending" },
              { status: "OVERDUE", label: "Overdue" },
            ].map(({ status, label }) => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${getStatusConfig(status).dot}`} />
                <span className="text-[11px] text-slate-500">{label}</span>
              </div>
            ))}
            <p className="text-[11px] text-slate-400 ml-auto hidden sm:block">
              Click a highlighted day to open payment details
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {listEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
              <p className="text-sm font-semibold text-slate-600">No payments this month</p>
              <p className="text-xs text-slate-400 mt-1">Navigate to a month with payments to see details.</p>
            </div>
          ) : (
            listEntries.map((entry) => {
              const dateLabel = new Date(`${entry.dateKey}T12:00:00`).toLocaleDateString("en-IE", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const hasOverdue = entry.filteredPayments.some((p) => p.status === "OVERDUE");
              const tone = hasOverdue
                ? "border-rose-200 bg-rose-50/40"
                : entry.filteredPayments.some((p) => p.status === "PENDING")
                ? "border-amber-200 bg-amber-50/35"
                : "border-teal-200 bg-teal-50/30";

              return (
                <button
                  key={entry.dateKey}
                  onClick={() => onDateClick(entry.dateKey, entry.filteredPayments)}
                  className={`w-full rounded-xl border p-3 text-left transition hover:shadow-sm ${tone}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">{dateLabel}</p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/80 border border-white text-slate-600">
                      {entry.filteredPayments.length} item{entry.filteredPayments.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatCalCurrency(entry.filteredTotal)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {entry.filteredPayments
                      .slice(0, 3)
                      .map((p) => p.tenant?.name || p.tenancy?.property?.name || "Tenant")
                      .join(" • ")}
                    {entry.filteredPayments.length > 3 ? " ..." : ""}
                  </p>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
