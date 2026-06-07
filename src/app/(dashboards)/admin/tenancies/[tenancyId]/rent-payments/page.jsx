"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpDown, Banknote, CheckCircle2, Filter, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const DEFAULT_ITEMS_PER_PAGE = 10;
const STATUS_FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Late", value: "LATE" },
  { label: "Partial", value: "PARTIAL" },
];

const PAYMENT_STATUS_STYLES = {
  PAID: "bg-teal-100 text-teal-700",
  PARTIAL: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  OVERDUE: "bg-red-100 text-red-700",
  LATE: "bg-orange-100 text-orange-700",
  UNKNOWN: "bg-slate-100 text-slate-700",
};

function formatDate(value) {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString();
}

function formatCurrency(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "EUR 0.00";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function getStatusBadgeClass(status) {
  return PAYMENT_STATUS_STYLES[String(status || "UNKNOWN").toUpperCase()] || PAYMENT_STATUS_STYLES.UNKNOWN;
}

function getPaidAmount(payment) {
  const totalAmount = Number(payment?.amount ?? 0);
  const paidAmount = Number(
    payment?.paidAmount ?? payment?.amountPaid ?? payment?.partialAmount ?? payment?.paid ?? 0
  );

  if (Number.isFinite(paidAmount) && paidAmount > 0) {
    return Math.min(paidAmount, totalAmount || paidAmount);
  }

  return String(payment?.status || "").toUpperCase() === "PAID" ? totalAmount : 0;
}

function getRemainingAmount(payment) {
  const totalAmount = Number(payment?.amount ?? 0);
  return Math.max(totalAmount - getPaidAmount(payment), 0);
}

export default function AdminTenancyRentPaymentsPage() {
  const router = useRouter();
  const params = useParams();
  const tenancyId = String(params?.tenancyId || "");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 1,
  });
  const [savingPaymentId, setSavingPaymentId] = useState(null);
  const [partialPaymentDraft, setPartialPaymentDraft] = useState(null);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const closePartialPaymentModal = () => {
    setPartialPaymentDraft(null);
  };

  const handleMarkAsPaid = async (paymentId) => {
    try {
      setSavingPaymentId(paymentId);
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/${paymentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PAID" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark payment as paid");
      }

      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: "PAID" } : p))
      );

      await Swal.fire({
        icon: "success",
        title: "Marked as Paid!",
        text: "Rent payment has been marked as paid.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error marking payment as paid:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to mark payment as paid.",
      });
    } finally {
      setSavingPaymentId(null);
    }
  };

  const handlePartialPaymentSubmit = async (event) => {
    event.preventDefault();

    const payment = partialPaymentDraft?.payment;
    if (!payment?.id) return;

    const totalAmount = Number(payment.amount ?? 0);
    const amountPaid = Number(partialPaymentDraft.amount);

    if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid amount",
        text: "Enter a partial payment amount greater than zero.",
      });
      return;
    }

    if (amountPaid > totalAmount) {
      await Swal.fire({
        icon: "warning",
        title: "Amount too high",
        text: "Partial payment cannot exceed the full rent amount.",
      });
      return;
    }

    const nextPaidAmount = Math.min(totalAmount, getPaidAmount(payment) + amountPaid);
    const nextRemainingAmount = Math.max(totalAmount - nextPaidAmount, 0);
    const nextStatus = nextRemainingAmount > 0 ? "PARTIAL" : "PAID";

    try {
      setSavingPaymentId(payment.id);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/${payment.id}/partial`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountReceived: amountPaid,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to record partial payment");
      }

      setPayments((prev) =>
        prev.map((current) =>
          current.id === payment.id
            ? {
                ...current,
                status: nextStatus,
                paidAmount: nextPaidAmount,
                remainingAmount: nextRemainingAmount,
              }
            : current
        )
      );

      closePartialPaymentModal();

      await Swal.fire({
        icon: "success",
        title: nextStatus === "PAID" ? "Marked as Paid!" : "Partial payment recorded",
        text:
          nextStatus === "PAID"
            ? "The payment has been fully cleared."
            : `€${amountPaid.toFixed(2)} has been recorded and €${nextRemainingAmount.toFixed(2)} is still due.`,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error recording partial payment:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to record partial payment.",
      });
    } finally {
      setSavingPaymentId(null);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchRentPayments = async () => {
      if (!tenancyId) {
        setLoading(false);
        setError("Missing tenancy ID.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams();
        query.append("tenancyId", tenancyId);
        query.append("page", String(currentPage));
        query.append("limit", String(DEFAULT_ITEMS_PER_PAGE));
        if (statusFilter !== "ALL") {
          query.append("status", statusFilter);
        }

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments?${query.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch rent payments: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result?.success || !Array.isArray(result?.data)) {
          throw new Error(result?.message || "Failed to load rent payments");
        }

        const serverPagination = result.meta?.pagination || {};
        const totalItems = Number(serverPagination.totalItems ?? result.data.length);
        const resolvedItemsPerPage = DEFAULT_ITEMS_PER_PAGE;
        const totalPages = Number(
          serverPagination.totalPages ??
          Math.max(1, Math.ceil(totalItems / Math.max(1, resolvedItemsPerPage)))
        );

        setPayments(result.data);
        setPagination({
          currentPage: Number(serverPagination.currentPage ?? currentPage),
          itemsPerPage: resolvedItemsPerPage,
          totalItems,
          totalPages,
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load rent payments");
        setPayments([]);
        setPagination({
          currentPage: 1,
          itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
          totalItems: 0,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRentPayments();
    return () => controller.abort();
  }, [tenancyId, currentPage, statusFilter]);

  const summary = useMemo(() => {
    const first = payments[0] || {};
    const tenant = first.tenant || {};
    const property = first.tenancy?.property || {};

    return {
      tenantName: tenant.name || "Unknown Tenant",
      tenantEmail: tenant.email || "N/A",
      propertyName: property.name || "Unknown Property",
      propertyLocation: [property.address, property.county].filter(Boolean).join(" - ") || "N/A",
    };
  }, [payments]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && partialPaymentDraft) {
        closePartialPaymentModal();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [partialPaymentDraft]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => router.push("/admin/tenancies")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={16} /> Back to Tenancies
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Rent Payments</h1>
        <p className="mt-1 text-sm text-slate-500 break-all">Tenancy ID: {tenancyId}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Tenant</p>
            <p className="font-semibold text-slate-800 mt-1">{summary.tenantName}</p>
            <p className="text-slate-500">{summary.tenantEmail}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Property</p>
            <p className="font-semibold text-slate-800 mt-1">{summary.propertyName}</p>
            <p className="text-slate-500">{summary.propertyLocation}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Filter size={15} className="text-slate-400" />
            Filter by status
          </span>
          {STATUS_FILTERS.map((option) => {
            const active = statusFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStatusFilterChange(option.value)}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Loading rent payments...
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          No rent payments found for this tenancy.
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <>
          <div className="lg:hidden space-y-3">
            {payments.map((payment) => {
              const normalizedStatus = String(payment.status || "UNKNOWN").toUpperCase();
              const statusClass = getStatusBadgeClass(normalizedStatus);
              const paidAmount = getPaidAmount(payment);
              const remainingAmount = getRemainingAmount(payment);
              const isLocked = normalizedStatus === "PAID" || savingPaymentId === payment.id;

              return (
                <article key={payment.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">{payment.month || "N/A"}</p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                      {normalizedStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Paid</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(paidAmount)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Remaining</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(remainingAmount)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Maintenance</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(payment.maintenanceCost)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-400">Due Date</p>
                      <p className="font-medium text-slate-700">{formatDate(payment.dueDate)}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-sm space-y-2">
                    <p className="text-xs text-slate-400">Action</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleMarkAsPaid(payment.id)}
                        disabled={isLocked}
                        className="inline-flex items-center justify-center gap-1 rounded-md bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed px-3 py-2 text-xs text-white font-semibold transition"
                      >
                        <CheckCircle2 size={14} /> Full Paid
                      </button>
                      <button
                        onClick={() =>
                          setPartialPaymentDraft({
                            payment,
                            amount: String(Math.max(Number(payment.amount || 0) - paidAmount, 0) || ""),
                          })
                        }
                        disabled={isLocked}
                        className="inline-flex items-center justify-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed px-3 py-2 text-xs text-white font-semibold transition"
                      >
                        <Banknote size={14} /> Partial
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Pagination
                total={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                showItemsPerPage={false}
              />
            </div>
          </div>

          <div className="hidden lg:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">
                    <span className="inline-flex items-center gap-1">Month <ArrowUpDown size={12} className="text-slate-400" /></span>
                  </th>
                  <th className="px-4 py-3 font-semibold">Tenant</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Paid / Balance</th>
                  <th className="px-4 py-3 font-semibold">Maintenance</th>
                  <th className="px-4 py-3 font-semibold">Due Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => {
                  const normalizedStatus = String(payment.status || "UNKNOWN").toUpperCase();
                  const statusClass = getStatusBadgeClass(normalizedStatus);
                  const paidAmount = getPaidAmount(payment);
                  const remainingAmount = getRemainingAmount(payment);
                  const isLocked = normalizedStatus === "PAID" || savingPaymentId === payment.id;

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-medium text-slate-800">{payment.month || "N/A"}</td>
                      <td className="px-4 py-3 text-slate-700">{payment.tenant?.name || "Unknown Tenant"}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3 text-slate-700">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{formatCurrency(paidAmount)}</span>
                          <span className="text-xs text-slate-500">{formatCurrency(remainingAmount)} remaining</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(payment.maintenanceCost)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatDate(payment.dueDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
                          {normalizedStatus}
                        </span>
                        <p className="mt-1 text-xs text-slate-500">
                          {normalizedStatus === "PARTIAL"
                            ? `${formatCurrency(paidAmount)} received`
                            : normalizedStatus === "PAID"
                            ? "Cleared in full"
                            : `${formatCurrency(remainingAmount)} outstanding`}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleMarkAsPaid(payment.id)}
                            disabled={isLocked}
                            className="inline-flex items-center gap-1 rounded-md bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed px-3 py-1.5 text-xs text-white font-semibold transition"
                          >
                            <CheckCircle2 size={14} /> Full Paid
                          </button>
                          <button
                            onClick={() =>
                              setPartialPaymentDraft({
                                payment,
                                amount: String(Math.max(Number(payment.amount || 0) - paidAmount, 0) || ""),
                              })
                            }
                            disabled={isLocked}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed px-3 py-1.5 text-xs text-white font-semibold transition"
                          >
                            <Banknote size={14} /> Partial
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              total={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              showItemsPerPage={false}
            />
          </div>
        </>
      )}

      {partialPaymentDraft && (
        <div className="fixed inset-0 -top-5 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close partial payment modal"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closePartialPaymentModal}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Record partial payment</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{partialPaymentDraft.payment?.month || "Selected payment"}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Full amount: {formatCurrency(partialPaymentDraft.payment?.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={closePartialPaymentModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePartialPaymentSubmit} className="space-y-4 px-5 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Already paid</p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {formatCurrency(getPaidAmount(partialPaymentDraft.payment))}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Remaining</p>
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {formatCurrency(getRemainingAmount(partialPaymentDraft.payment))}
                  </p>
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Amount received
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={Number(partialPaymentDraft.payment?.amount || 0)}
                  value={partialPaymentDraft.amount}
                  onChange={(event) =>
                    setPartialPaymentDraft((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="0.00"
                />
              </label>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePartialPaymentModal}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPaymentId === partialPaymentDraft.payment?.id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Banknote size={16} /> Save partial payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
