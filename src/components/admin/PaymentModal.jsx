"use client";

import { useEffect, useMemo } from "react";
import { X, User, CreditCard, Calendar, Home } from "lucide-react";
import { getStatusConfig, formatCalCurrency } from "@/utils/calendarHelpers";

export default function PaymentModal({ dateKey, payments, onClose }) {
  const safePayments = Array.isArray(payments) ? payments : [];

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const dateLabel = new Date(dateKey + "T12:00:00").toLocaleDateString("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const total = useMemo(
    () => safePayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [safePayments]
  );

  const statusSummary = useMemo(() => {
    const summary = { PAID: 0, PENDING: 0, OVERDUE: 0 };
    safePayments.forEach((payment) => {
      if (summary[payment.status] !== undefined) summary[payment.status] += 1;
    });
    return summary;
  }, [safePayments]);

  if (!dateKey || !Array.isArray(payments)) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop - covers full screen */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* Modal panel with padding wrapper */}
      <div className="relative p-0 sm:p-4 w-full sm:max-w-2xl">
        <div
          className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh] sm:max-h-[88vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 sm:px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-teal-50/60">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">{dateLabel}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {safePayments.length} payment{safePayments.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-slate-500">Day total</p>
              <p className="text-lg font-bold text-slate-800">{formatCalCurrency(total)}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-2 flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {statusSummary.PAID > 0 ? (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusConfig("PAID").badge}`}>
                {statusSummary.PAID} Paid
              </span>
            ) : null}
            {statusSummary.PENDING > 0 ? (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusConfig("PENDING").badge}`}>
                {statusSummary.PENDING} Pending
              </span>
            ) : null}
            {statusSummary.OVERDUE > 0 ? (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusConfig("OVERDUE").badge}`}>
                {statusSummary.OVERDUE} Overdue
              </span>
            ) : null}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3 bg-slate-50/40">
          {safePayments.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No payments on this date.</p>
          ) : (
            safePayments.map((payment) => {
              const status = getStatusConfig(payment.status);
              const property = payment.tenancy?.property;
              const tenant = payment.tenant;
              const dueDateLabel = payment.dueDate
                ? new Date(payment.dueDate).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-";
              const paidDateLabel = payment.paidDate
                ? new Date(payment.paidDate).toLocaleDateString("en-IE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Not paid";

              return (
                <div
                  key={payment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {property?.image ? (
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Home size={16} className="text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                          {property?.name || "—"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {property?.address || property?.county || "—"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.badge}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-600 truncate">
                        {tenant?.name || "—"}
                        {tenant?.email ? ` (${tenant.email})` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={12} className="text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-700">
                        {formatCalCurrency(payment.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-500">Due: {dueDateLabel}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-teal-500 shrink-0" />
                      <span className="text-xs text-slate-500">Paid: {paidDateLabel}</span>
                    </div>

                    {payment.reference ? (
                      <div className="sm:col-span-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Ref: {payment.reference}
                        </span>
                      </div>
                    ) : null}

                    {payment.maintenanceCost ? (
                      <div className="sm:col-span-2">
                        <span className="text-[11px] text-slate-500">
                          Maintenance cost: {formatCalCurrency(payment.maintenanceCost)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
