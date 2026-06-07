"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import { AlertTriangle, Home, Users, Wrench, FileText, ArrowRight, CheckCircle2, AlertCircle, Clock, TrendingUp, Loader2 } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";
import Link from "next/link";

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "—";
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return amount;
  return `€${numeric.toLocaleString("en-IE")}`;
};

const getPropertyStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "LET":
      return "bg-teal-100 text-teal-700";
    case "NOTICE":
      return "bg-amber-100 text-amber-700";
    case "VACANT":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getTenancyStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-teal-100 text-teal-700";
    case "NOTICE":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/landlord/dashboard`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch landlord dashboard");
        }
        const json = await res.json();
        setDashboardData(json.data);
      } catch (err) {
        console.warn("Error fetching landlord dashboard:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <PortalShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-teal-600 animate-spin" />
        </div>
      </PortalShell>
    );
  }

  if (error || !dashboardData) {
    return (
      <PortalShell>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Unable to load dashboard</p>
              <p className="text-sm text-red-700 mt-1">
                {error || "Failed to load your dashboard data. Please try refreshing."}
              </p>
            </div>
          </div>
        </div>
      </PortalShell>
    );
  }

  const { profile, summary, rentStatus, financialSummary, properties, activeTenancies } = dashboardData;
  const profileName = profile?.name ? profile.name.split(" ")[0] : "Landlord";
  const kpis = [
    { label: "My Properties", value: summary?.totalProperties || "0", Icon: Home, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { label: "Active Tenancies", value: summary?.activeTenancies || "0", Icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Open Maintenance", value: summary?.openMaintenance || "0", Icon: Wrench, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "New Documents", value: summary?.newDocuments || "0", Icon: FileText, color: "bg-rose-50 text-rose-600 border-rose-100" },
  ];

  const financeSummary = {
    period: financialSummary?.period || "March 2026",
    totalRent: Number(financialSummary?.totalRent) || 0,
    totalDeductions: Number(financialSummary?.deductions) || 0,
    totalNet: Number(financialSummary?.netAmount) || 0,
    paidCount: financialSummary?.paidAmount || 0,
  };

  return (
    <PortalShell>
      {/* Title */}
      <div className="flex items-center justify-between mb-3 lg:mb-5">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Welcome Back, {profileName}</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 lg:mb-5">
        {kpis.map(({ label, value, Icon, color }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 lg:p-5 flex flex-col gap-2 lg:gap-3 shadow-sm ${color.split(" ")[2]}`}>
            <div className="flex items-start justify-between">
              <p className="text-xs lg:text-sm font-semibold text-slate-500 leading-tight">{label}</p>
              <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center ${color.split(" ").slice(0, 2).join(" ")}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Rent Status Indicator - Only show if overdue */}
      {rentStatus?.overdueCount > 0 && (
        <div className="bg-white rounded-2xl border border-red-200 overflow-hidden shadow-sm mb-3 lg:mb-5">
          <div className="flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 border-b border-red-100">
            <Clock size={16} className="text-red-500" />
            <h3 className="text-base lg:text-lg font-bold text-slate-800">Overdue Rent</h3>
            <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
              {rentStatus.overdueCount} Overdue
            </span>
          </div>
          {Array.isArray(rentStatus?.outstandingPayments) && rentStatus.outstandingPayments.length > 0 ? (
            <div className="divide-y divide-red-50">
              {rentStatus.outstandingPayments.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 lg:px-6 py-3 lg:py-4">
                  <div>
                    <p className="text-sm lg:text-base font-semibold text-slate-700">{p.property?.name || "—"}</p>
                    <p className="text-xs lg:text-sm text-slate-400 mt-0.5">Tenant: {p.tenant?.name || "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-slate-700">{formatCurrency(p.amount)}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                      <AlertCircle size={11} /> Overdue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 lg:px-6 py-4 text-center text-slate-500 text-sm">
              No overdue payments
            </div>
          )}
        </div>
      )}

      {/* RTB Registration Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-3 lg:mb-5">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100 bg-slate-50/30">
          <h3 className="text-base lg:text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-teal-600" />
            RTB Registration Overview
          </h3>
          <Link 
            href="/portal/rtb"
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition flex items-center gap-1"
          >
            Manage RTB <ArrowRight size={14} />
          </Link>
        </div>
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Registered", value: summary?.rtbStatus?.REGISTERED ?? 0, color: "text-teal-600", bg: "bg-teal-50" },
              { label: "Pending", value: summary?.rtbStatus?.PENDING ?? 0, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Missing", value: summary?.rtbStatus?.MISSING ?? 0, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Unknown", value: summary?.rtbStatus?.UNKNOWN ?? 0, color: "text-slate-600", bg: "bg-slate-50" },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-4 rounded-xl border border-slate-100 shadow-sm transition hover:shadow-md cursor-pointer hover:-translate-y-1 duration-300`} onClick={() => router.push('/portal/rtb')}>
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Finances Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-3 lg:mb-5">
        <div className="flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100">
          <TrendingUp size={18} className="text-teal-600" />
          <h3 className="text-base lg:text-lg font-bold text-slate-800">Finances Summary</h3>
          <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700">
            {financeSummary.period}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 lg:p-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs lg:text-sm font-semibold text-slate-500">Total Rent</p>
            <p className="text-lg lg:text-2xl font-bold text-slate-800">{formatCurrency(financeSummary.totalRent)}</p>
            <p className="text-xs text-slate-400 mt-1">From {summary?.totalProperties || 0} properties</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs lg:text-sm font-semibold text-slate-500">Deductions</p>
            <p className="text-lg lg:text-2xl font-bold text-rose-600">-{formatCurrency(financeSummary.totalDeductions)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {financeSummary.totalRent > 0 ? Math.round((financeSummary.totalDeductions / financeSummary.totalRent) * 100) : 0}% of rent
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs lg:text-sm font-semibold text-slate-500">Net Amount</p>
            <p className="text-lg lg:text-2xl font-bold text-teal-600">{formatCurrency(financeSummary.totalNet)}</p>
            <p className="text-xs text-slate-400 mt-1">Payable</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs lg:text-sm font-semibold text-slate-500">Paid Amount</p>
            <p className="text-lg lg:text-2xl font-bold text-slate-800">{formatCurrency(financeSummary.paidCount)}</p>
            <p className="text-xs text-slate-400 mt-1">This period</p>
          </div>
        </div>
        <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-slate-100 text-center">
          <a href="/portal/properties" className="text-sm lg:text-base text-teal-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-1.5">
            View Detailed Finances <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          {/* My Properties */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100">
              <h3 className="text-base lg:text-lg font-bold text-slate-800">My Properties</h3>
              <a href="/portal/properties" className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5">
                View All <ArrowRight size={14} />
              </a>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-slate-100">
              {properties && properties.length > 0 ? (
                properties.map((p, i) => (
                  <div key={i} className="px-4 py-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700">{p.name || p.address || "—"}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${getPropertyStatusColor(p.status)}`}>
                        {p.status || "—"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{p.address || "—"}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Rent</p>
                        <p className="text-sm font-semibold text-slate-700">{formatCurrency(p.rent)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-slate-500">No properties</div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-6 py-3.5">Status</th>
                    <th className="text-left px-4 py-3.5">Property</th>
                    <th className="text-left px-4 py-3.5">Address</th>
                    <th className="text-right px-6 py-3.5">Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties && properties.length > 0 ? (
                    properties.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getPropertyStatusColor(p.status)}`}>
                            {p.status || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-base font-semibold text-slate-700">{p.name || "—"}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-base text-slate-700">{p.address || "—"}</p>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <p className="text-base font-bold text-slate-800">{formatCurrency(p.rent)}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-5 py-4 text-center text-slate-500">
                        No properties
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-slate-100 text-center">
              <a href="/portal/properties" className="text-sm lg:text-base text-teal-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-1.5">
                View All Properties <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Active Tenancies */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100">
              <h3 className="text-base lg:text-lg font-bold text-slate-800">Active Tenancies</h3>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-slate-100">
              {activeTenancies && activeTenancies.length > 0 ? (
                activeTenancies.slice(0, 4).map((t, i) => (
                  <div key={i} className="px-4 py-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700">{t.property?.name || "—"}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${getTenancyStatusColor(t.status)}`}>
                        {t.status || "—"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Tenant: {t.tenant?.name || "—"}</p>
                    <p className="text-xs text-slate-400 font-semibold">{formatCurrency(t.rent)} / month</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-slate-500">No active tenancies</div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-6 py-3.5">Status</th>
                    <th className="text-left px-4 py-3.5">Property</th>
                    <th className="text-left px-4 py-3.5">Tenant</th>
                    <th className="text-right px-6 py-3.5">Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeTenancies && activeTenancies.length > 0 ? (
                    activeTenancies.slice(0, 4).map((t, i) => (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getTenancyStatusColor(t.status)}`}>
                            {t.status || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-base font-semibold text-slate-700">{t.property?.name || "—"}</p>
                          <p className="text-sm text-slate-400 mt-0.5">{t.property?.address || "—"}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-base text-slate-700">{t.tenant?.name || "—"}</p>
                          <p className="text-sm text-slate-400 mt-0.5">{t.tenant?.email || "—"}</p>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <p className="text-base font-bold text-slate-800">{formatCurrency(t.rent)}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-5 py-4 text-center text-slate-500">
                        No active tenancies
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 lg:px-6 py-3 lg:py-4 border-t border-slate-100 text-center">
              <Link href="/portal/tenants" className="text-sm lg:text-base text-teal-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-1.5">
                View All Tenancies <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
