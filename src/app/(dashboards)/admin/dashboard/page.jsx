"use client";

import { useEffect, useMemo, useState } from "react";
import { authenticatedFetch } from "@/utils/authFetch";
import {
  Building2,
  Users,
  Wrench,
  FolderOpen,
  CreditCard,
  Loader2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ─── Sub-components ──────────────────────────── */
function KpiCard({ label, value, Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-slate-500 leading-tight">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "EUR0";
  }
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDateTime(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(dt);
}

export default function AdminDashboardPage() {
  const [dashboardResponse, setDashboardResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyRevenuePage, setMonthlyRevenuePage] = useState(1);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/dashboard`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch admin dashboard");
        }

        const json = await response.json();
        setDashboardResponse(json || null);
      } catch (err) {
        console.error("Error fetching admin dashboard:", err);
        setError(err?.message || "Failed to load admin dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const dashboardData = dashboardResponse?.data || {};
  const profile = dashboardData?.profile || {};
  const summary = dashboardData?.summary || {};
  const systemOverview = dashboardData?.systemOverview || {};
  const monthlyRevenue = Array.isArray(systemOverview?.monthlyRevenue)
    ? systemOverview.monthlyRevenue
    : [];
  const sortedMonthlyRevenue = useMemo(
    () =>
      [...monthlyRevenue].sort((a, b) => {
        const aMonth = a?.month || "";
        const bMonth = b?.month || "";
        return aMonth.localeCompare(bMonth);
      }),
    [monthlyRevenue]
  );
  const monthlyRevenuePageSize = 2;
  const monthlyRevenueTotalPages = Math.max(
    1,
    Math.ceil(sortedMonthlyRevenue.length / monthlyRevenuePageSize)
  );
  const safeMonthlyRevenuePage = Math.min(monthlyRevenuePage, monthlyRevenueTotalPages);
  const monthlyRevenueStart = (safeMonthlyRevenuePage - 1) * monthlyRevenuePageSize;
  const visibleMonths = sortedMonthlyRevenue.slice(
    monthlyRevenueStart,
    monthlyRevenueStart + monthlyRevenuePageSize
  );
  const hasAnyData = Boolean(
    (profile && Object.keys(profile).length > 0) ||
    (summary && Object.keys(summary).length > 0) ||
    (systemOverview && Object.keys(systemOverview).length > 0) ||
    (monthlyRevenue && monthlyRevenue.length > 0)
  );

  useEffect(() => {
    setMonthlyRevenuePage(1);
  }, [monthlyRevenue.length]);

  const kpis = useMemo(
    () => [
      {
        label: "Properties Under Management",
        value: summary?.propertiesUnderManagement ?? 0,
        Icon: Building2,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
      {
        label: "Active Tenancies",
        value: summary?.activeTenancies ?? 0,
        Icon: Users,
        iconBg: "bg-sky-50",
        iconColor: "text-sky-500",
      },
      {
        label: "Open Maintenance",
        value: summary?.openMaintenance ?? 0,
        Icon: Wrench,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
      },
      {
        label: "Documents Uploaded (30 days)",
        value: summary?.documentsUploaded30Days ?? 0,
        Icon: FolderOpen,
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
    ],
    [summary]
  );

  const breakdownStyles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    late: "bg-orange-50 text-orange-700 border-orange-100",
    overdue: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const goToPreviousMonthlyPage = () => {
    setMonthlyRevenuePage((current) => Math.max(1, current - 1));
  };

  const goToNextMonthlyPage = () => {
    setMonthlyRevenuePage((current) => Math.min(monthlyRevenueTotalPages, current + 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    );
  }

  // If the API returned successfully but no meaningful dashboard data was provided,
  // show a small, friendly message instead of empty placeholders.
  if (dashboardResponse && !hasAnyData) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-800">No dashboard data available</p>
          <p className="text-sm text-slate-500 mt-2">No data was returned from the server. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          {profile?.name
            ? `Welcome back, ${profile.name}. Here's an overview of your organisation's current status.`
            : "Overview of system status."}
        </p>
        <p className="text-xs text-slate-500 mt-3">
          Last updated: {formatDateTime(dashboardResponse?.timestamp)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <User size={18} className="text-slate-600" />
            Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-4">
            <p className="text-slate-600">
              ID: <span className="font-semibold text-slate-800">{profile?.id || "-"}</span>
            </p>
            <p className="text-slate-600">
              Role: <span className="font-semibold text-slate-800">{profile?.role || "-"}</span>
            </p>
            <p className="text-slate-600">
              Name: <span className="font-semibold text-slate-800">{profile?.name || "-"}</span>
            </p>
            <p className="text-slate-600">
              Phone: <span className="font-semibold text-slate-800">{profile?.phone || "-"}</span>
            </p>
            <p className="text-slate-600 md:col-span-2">
              Email: <span className="font-semibold text-slate-800">{profile?.email || "-"}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-800">System Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">Users</h3>
                <Users size={16} className="text-sky-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{systemOverview?.users?.total ?? 0}</p>
              <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                <span>Landlords: {systemOverview?.users?.landlords ?? 0}</span>
                <span>Tenants: {systemOverview?.users?.tenants ?? 0}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">Payments</h3>
                <CreditCard size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{systemOverview?.payments?.total ?? 0}</p>
              <p className="mt-3 text-sm text-slate-600">
                Overdue: <span className="font-semibold">{systemOverview?.payments?.overdue ?? 0}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Monthly Revenue</h2>
          <p className="text-sm text-slate-500 mt-1">Monthly collections and payment breakdowns.</p>
        </div>
        <div className="p-4 lg:p-5">
          {sortedMonthlyRevenue.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
              No monthly revenue data available.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {visibleMonths.map((entry, index) => (
                  <div
                    key={entry?.month || entry?.period || index}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                  >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{entry?.period || "Monthly Revenue"}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{entry?.month || "-"}</p>
                    </div>
                    {/* <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                      Collection: {entry?.collectionRate ?? 0}%
                    </span> */}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="rounded-lg bg-white border border-slate-100 p-2.5">
                      <p className="text-slate-500 text-xs">Expected</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(entry?.totalExpected ?? 0)}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-100 p-2.5">
                      <p className="text-slate-500 text-xs">Paid</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(entry?.totalPaid ?? 0)}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-100 p-2.5">
                      <p className="text-slate-500 text-xs">Outstanding</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(entry?.totalOutstanding ?? 0)}</p>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-100 p-2.5">
                      <p className="text-slate-500 text-xs">Payments Count</p>
                      <p className="font-semibold text-slate-800">{entry?.totalPaymentsCount ?? 0}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Breakdown</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "paid", label: "Paid" },
                        { key: "pending", label: "Pending" },
                        { key: "late", label: "Late" },
                        { key: "overdue", label: "Overdue" },
                      ].map((item) => {
                        const breakdown = entry?.breakdown?.[item.key] || {};
                        return (
                          <div
                            key={item.key}
                            className={`rounded-lg border p-2.5 ${breakdownStyles[item.key]}`}
                          >
                            <p className="text-xs font-semibold">{item.label}</p>
                            <p className="text-xs mt-1">Count: {breakdown?.count ?? 0}</p>
                            <p className="text-xs">Amount: {formatCurrency(breakdown?.amount ?? 0)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousMonthlyPage}
                    disabled={safeMonthlyRevenuePage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNextMonthlyPage}
                    disabled={safeMonthlyRevenuePage === monthlyRevenueTotalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
