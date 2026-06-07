"use client";

import { useEffect, useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { authenticatedFetch } from "@/utils/authFetch";
import Link from "next/link";
import {
  Home,
  CreditCard,
  Wrench,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Calendar,
  Loader2,
} from "lucide-react";

// Helper function to map payment status to display color
const getPaymentStatusColor = (status) => {
  switch (status) {
    case "PAID":
      return "bg-teal-100 text-teal-700";
    case "PENDING":
      return "bg-orange-100 text-orange-700";
    case "OVERDUE":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

// Helper function to map payment status to display text
const mapPaymentStatus = (status) => {
  switch (status) {
    case "PAID":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "OVERDUE":
      return "Overdue";
    default:
      return status;
  }
};

// Helper to get status badge color for maintenance
const getMaintenanceStatusColor = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-700";
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-700";
    case "RESOLVED":
      return "bg-teal-100 text-teal-700";
    case "CLOSED":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "—";
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return amount;
  return `€${numeric.toLocaleString("en-IE")}`;
};

const formatPaymentMonth = (value) => {
  if (!value) return "—";
  const d = new Date(`${value}-01`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IE", { month: "short", year: "numeric" });
};

export default function TenantDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenant/dashboard`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const json = await res.json();
        setDashboardData(json.data);
      } catch (err) {
        console.warn("Error fetching dashboard:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <TenantShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-teal-600 animate-spin" />
        </div>
      </TenantShell>
    );
  }

  if (error || !dashboardData) {
    return (
      <TenantShell>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load dashboard
              </p>
              <p className="text-sm text-red-700 mt-1">
                {error ||
                  "Failed to load your dashboard data. Please try refreshing."}
              </p>
            </div>
          </div>
        </div>
      </TenantShell>
    );
  }

  const {
    profile,
    summary,
    nextPayment,
    alerts,
    tenancy,
    recentPayments,
    recentMaintenanceRequests,
  } = dashboardData;
  const visibleAlerts = Array.isArray(alerts)
    ? alerts.filter((a) => a && (a.text || a.title || a.description || a.meta))
    : [];
  const rentStatus = summary?.rentStatus || tenancy?.rentStatus || "—";

  return (
    <TenantShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 xl:mb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {profile?.name
              ? `Welcome Back, ${profile.name.split(" ")[0]}`
              : "Welcome Back"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {tenancy?.property?.name
              ? `${tenancy.property.name} · Tenancy since ${formatDate(tenancy.startDate)}`
              : "—"}
          </p>
        </div>
        <Link
          href="/tenant/maintenance"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Wrench size={15} /> Report Issue
        </Link>
      </div>

      {/* Pending Connection Banner */}
      {!tenancy && (
        <div className="mb-6 p-6 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-3xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Clock size={32} className="text-teal-600 animate-pulse" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-slate-800">
                Welcome to RPR Property Management
              </h2>
              <p className="text-slate-600 mt-1 max-w-2xl">
                We're currently setting up your digital tenancy. Once our
                administrators connect your profile to your property.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-white/60 text-xs font-bold text-teal-700 rounded-full border border-teal-100 uppercase tracking-tight">
                  Status: Connection Pending
                </span>
                <span className="px-3 py-1 bg-white/60 text-xs font-bold text-slate-500 rounded-full border border-slate-100">
                  Estimated time: ~2-4 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 xl:gap-3 mb-3 xl:mb-5">
        {/* Monthly Rent */}
        <div
          className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">
              Monthly Rent
            </p>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600`}
            >
              <CreditCard size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">
            {formatCurrency(summary?.monthlyRent)}
          </p>
          <p className="text-xs text-slate-400">
            {summary?.rentDueDay ? `Due day ${summary.rentDueDay}` : "—"}
          </p>
        </div>

        {/* Next Payment */}
        <div
          className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">
              Next Payment
            </p>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600`}
            >
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">
            {formatCurrency(nextPayment?.amount)}
          </p>
          <p className="text-xs text-slate-400">
            {nextPayment?.dueDate
              ? `Due ${formatDate(nextPayment.dueDate)}${
                  nextPayment?.daysUntilDue !== undefined
                    ? ` · ${nextPayment.daysUntilDue} days`
                    : ""
                }`
              : "—"}
          </p>
        </div>

        {/* Open Requests */}
        <div
          className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">
              Open Requests
            </p>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600`}
            >
              <Wrench size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">
            {summary?.openMaintenanceRequests || "0"}
          </p>
          <p className="text-xs text-slate-400">Maintenance</p>
        </div>

        {/* Documents */}
        <div
          className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">
              Documents
            </p>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600`}
            >
              <FileText size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">
            {summary?.availableDocuments || "0"}
          </p>
          <p className="text-xs text-slate-400">Available</p>
        </div>

        {/* Rent Status */}
        <div
          className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-slate-500 leading-tight">
              Rent Status
            </p>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600`}
            >
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 leading-tight">
            {rentStatus}
          </p>
          <p className="text-xs text-slate-400">
            {nextPayment?.month
              ? formatPaymentMonth(nextPayment.month)
              : "Current month"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Alerts + Rent History */}
        <div className="lg:col-span-2 space-y-3 xl:space-y-4">
          {/* Alerts */}
          {visibleAlerts && visibleAlerts.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-base lg:text-lg font-bold text-slate-800">
                  <AlertCircle size={18} className="text-amber-500" />
                  Alerts
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {visibleAlerts.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start lg:items-center justify-between px-5 py-3 lg:py-4 gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={16}
                        className="text-amber-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm lg:text-base text-slate-700 font-medium">
                          {a.text || a.title}
                        </p>
                        <p className="text-xs lg:text-sm text-slate-400 mt-0.5">
                          {a.meta || a.description || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rent Payment History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Rent Payments
              </h3>
              <Link
                href="/tenant/rent"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {/* Table (lg+) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-6 py-3.5">Month</th>
                    <th className="text-left px-4 py-3.5">Date</th>
                    <th className="text-left px-4 py-3.5">Status</th>
                    <th className="text-right px-6 py-3.5">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPayments && recentPayments.length > 0 ? (
                    recentPayments.slice(0, 4).map((p, i) => {
                      const monthDate = new Date(p.month + "-01");
                      const monthLabel = monthDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      });
                      const dateDisplay = p.paidDate
                        ? new Date(p.paidDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : new Date(p.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                      return (
                        <tr
                          key={i}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-5 py-3 text-base font-semibold text-slate-700">
                            {monthLabel}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-500">
                            {dateDisplay}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${getPaymentStatusColor(
                                p.status,
                              )}`}
                            >
                              {mapPaymentStatus(p.status)}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right text-base font-bold text-slate-800">
                            {formatCurrency(p.amount)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-5 py-4 text-center text-slate-500"
                      >
                        No payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards (smaller than lg) */}
            <div className="lg:hidden space-y-4 p-4">
              {recentPayments && recentPayments.length > 0 ? (
                recentPayments.slice(0, 4).map((p, i) => {
                  const monthDate = new Date(p.month + "-01");
                  const monthLabel = monthDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  });
                  const dateDisplay = p.paidDate
                    ? new Date(p.paidDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : new Date(p.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 "
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-700">
                            {monthLabel}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {dateDisplay}
                          </div>
                          <div className="mt-2">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${getPaymentStatusColor(
                                p.status,
                              )}`}
                            >
                              {mapPaymentStatus(p.status)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-slate-800">
                            {formatCurrency(p.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-slate-500">
                  No payments found
                </div>
              )}
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Maintenance Requests
              </h3>
              <Link
                href="/tenant/maintenance"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentMaintenanceRequests &&
              recentMaintenanceRequests.length > 0 ? (
                recentMaintenanceRequests.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Wrench size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-700">
                          {m.title || "—"}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock size={12} /> {formatDate(m.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ml-4 ${getMaintenanceStatusColor(
                        m.status,
                      )}`}
                    >
                      {m.status || "—"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-4 text-center text-slate-500 text-sm">
                  No maintenance requests
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Property Info */}
        <div className="space-y-3 xl:space-y-4">
          {/* My Property */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">My Property</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-base font-bold text-slate-800">
                  {tenancy?.property?.name || "—"}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {tenancy?.property?.address
                    ? `${tenancy.property.address}${tenancy.property.county ? `, ${tenancy.property.county}` : ""}`
                    : "—"}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  {
                    label: "Rent",
                    value: tenancy?.rent
                      ? `${formatCurrency(tenancy.rent)} / month`
                      : "—",
                  },
                  {
                    label: "Rent Due Day",
                    value: tenancy?.rentDueDay || "—",
                  },
                  {
                    label: "Tenancy Status",
                    value: tenancy?.status || "—",
                  },
                  {
                    label: "RTB Registration",
                    value: tenancy?.rtb?.rtbRegistration || "—",
                  },
                  {
                    label: "RTB Number",
                    value: tenancy?.rtb?.rtbNumber || "—",
                  },
                  {
                    label: "Lease Ends",
                    value: formatDate(tenancy?.endDate),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-700">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Landlord
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {tenancy?.landlord?.name || "—"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {tenancy?.landlord?.email || "—"}
                </p>
                <p className="text-xs text-slate-500">
                  {tenancy?.landlord?.phone || "—"}
                </p>
              </div>
              <Link
                href="/tenant/property"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-50 transition"
              >
                View Full Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
