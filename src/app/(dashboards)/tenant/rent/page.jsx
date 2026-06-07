"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TenantShell from "@/components/tenant/TenantShell";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";
import { AlertTriangle, CreditCard, Calendar, AlertCircle } from "lucide-react";

const ITEMS_PER_PAGE = 10;
const STATUS_FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
];

const getPaymentStatusColor = (status) => {
  switch ((status || "").toUpperCase()) {
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

const mapPaymentStatus = (status) => {
  switch ((status || "").toUpperCase()) {
    case "PAID":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "OVERDUE":
      return "Overdue";
    default:
      return status || "-";
  }
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `€${amount.toLocaleString("en-IE")}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatMonth = (monthValue) => {
  if (!monthValue) return "-";
  return new Date(`${monthValue}-01`).toLocaleDateString("en-IE", {
    year: "numeric",
    month: "long",
  });
};

export default function TenantRentPage() {
  const [summary, setSummary] = useState(null);
  const [rentPayments, setRentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 1,
  });

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("page", String(currentPage));
        params.append("limit", String(ITEMS_PER_PAGE));
        if (statusFilter !== "ALL") {
          params.append("status", statusFilter);
        }

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/tenant?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err?.message || `Failed to load rent payments (${response.status})`);
        }

        const result = await response.json();
        if (!result?.success || !result?.data) {
          throw new Error(result?.message || "Failed to load rent payments");
        }

        const data = result.data;
        const payments = Array.isArray(data.payments) ? data.payments : [];
        const paging = data.pagination || {};

        setSummary(data.summary || null);
        setRentPayments(payments);
        setPagination({
          currentPage: paging.currentPage ?? currentPage,
          itemsPerPage: paging.itemsPerPage ?? ITEMS_PER_PAGE,
          totalItems: paging.totalItems ?? payments.length,
          totalPages:
            paging.totalPages ?? Math.max(1, Math.ceil((paging.totalItems ?? payments.length) / ITEMS_PER_PAGE)),
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching rent payments:", err);
        setError(err.message || "Failed to load rent payments");
        setSummary(null);
        setRentPayments([]);
        setPagination({
          currentPage: 1,
          itemsPerPage: ITEMS_PER_PAGE,
          totalItems: 0,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [currentPage, statusFilter]);

  const firstOverdue = rentPayments.find((p) => (p?.status || "").toUpperCase() === "OVERDUE");
  const dueBalance = Number(summary?.dueBalance ?? 0);
  const duePaymentsCount = Number(summary?.duePaymentsCount?.id ?? 0);
  const monthlyRent = summary?.monthlyRent;
  const rentDueDay = summary?.rentDueDay;
  const nextPayment = summary?.nextPayment;
  const propertyName = summary?.property?.name || "your property";
  const showOverdueBanner = !loading && (dueBalance > 0 || Boolean(firstOverdue) || Number(nextPayment?.daysUntilDue) < 0);

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Rent Payments</h1>
        <p className="text-slate-500 mt-1 text-sm">Full payment history for your tenancy at {propertyName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-3 mb-3 xl:mb-5">
        {[
          {
            label: "Monthly Rent",
            value: loading ? "€0" : formatCurrency(monthlyRent),
            sub: rentDueDay ? `Due day ${rentDueDay} of each month` : "Due day unavailable",
            Icon: CreditCard,
            color: "bg-teal-50 text-teal-600",
            border: "border-teal-100",
          },
          {
            label: "Next Payment",
            value: loading ? "€0" : formatCurrency(nextPayment?.amount),
            sub: nextPayment?.dueDate ? `Due ${formatDate(nextPayment.dueDate)}` : "No upcoming due date",
            Icon: Calendar,
            color: "bg-blue-50 text-blue-600",
            border: "border-blue-100",
          },
          {
            label: "Due Balance",
            value: loading ? "€0" : formatCurrency(dueBalance),
            sub: `${duePaymentsCount} due payment${duePaymentsCount === 1 ? "" : "s"}`,
            Icon: AlertCircle,
            color: dueBalance > 0 ? "bg-red-50 text-red-600" : "bg-teal-50 text-teal-600",
            border: dueBalance > 0 ? "border-red-100" : "border-teal-100",
          },
        ].map(({ label, value, sub, Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 flex flex-col gap-2 shadow-sm ${border}`}>
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-slate-500 leading-tight">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {false && showOverdueBanner && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
          <AlertTriangle size={20} className="text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">
              {(firstOverdue?.month && `${formatMonth(firstOverdue.month)} rent is overdue`) ||
                (nextPayment?.month && `${formatMonth(nextPayment.month)} rent is overdue`) ||
                "There are overdue rent payments on your account"}
            </p>
            <p className="text-xs text-red-400 mt-0.5">Please contact your letting agent if you have any issues.</p>
          </div>
          <Link
            href="/tenant/messages"
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Message Agent
          </Link>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((option) => {
          const active = statusFilter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleStatusFilterChange(option.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                active
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-red-800">Failed to load rent payments</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Month</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Reference</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentPayments.length > 0 ? (
                rentPayments.map((payment) => {
                  const monthLabel = formatMonth(payment?.month);
                  const dateDisplay = payment?.paidDate ? formatDate(payment.paidDate) : formatDate(payment?.dueDate);
                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 text-base font-semibold text-slate-700">{monthLabel}</td>
                      <td className="px-4 py-4 text-sm text-slate-500">{dateDisplay}</td>
                      <td className="px-4 py-4 font-mono text-sm text-slate-400">{payment?.reference || "-"}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPaymentStatusColor(payment.status)}`}>
                          {mapPaymentStatus(payment.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-base font-bold text-slate-800">
                        {formatCurrency(payment?.amount)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-4 text-center text-slate-500">
                    {loading ? "Loading payments..." : "No payments found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden space-y-2">
        {rentPayments.length > 0 ? (
          rentPayments.map((payment) => {
            const monthLabel = formatMonth(payment?.month);
            const dateDisplay = payment?.paidDate ? formatDate(payment.paidDate) : formatDate(payment?.dueDate);
            return (
              <div key={payment.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{monthLabel}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {dateDisplay} · <span className="font-mono">{payment?.reference || "-"}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPaymentStatusColor(payment.status)}`}>
                        {mapPaymentStatus(payment.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-slate-800">{formatCurrency(payment?.amount)}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-slate-500">
            {loading ? "Loading payments..." : "No payments found"}
          </div>
        )}
      </div>

      {pagination.totalItems > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-3 xl:mt-4">
          <Pagination
            total={pagination.totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={() => {}}
            showItemsPerPage={false}
          />
        </div>
      )}
    </TenantShell>
  );
}
