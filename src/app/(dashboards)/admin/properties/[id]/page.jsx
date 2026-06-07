"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { authenticatedFetch } from "@/utils/authFetch";
import Pagination from "@/components/portal/Pagination";
import {
  ArrowLeft, Home, BadgeCheck, FileText, Wrench,
  StickyNote, ClipboardList, MapPin, Euro, Zap,
  AlertCircle, Download, Eye, Edit, Plus,
  CalendarDays, Clock, User, Users, Shield, TrendingUp,
} from "lucide-react";

/* ─── Mock data ─── */
const property = {
  id: "1",
  name: "Apt 5B, Rosewood Close",
  area: "Blackrock, Co. Dublin",
  type: "Apartment",
  bedrooms: 2,
  bathrooms: 1,
  eircode: "D12 XY34",
  county: "Dublin",
  mprn: "10623847501",
  status: "Notice",
  statusColor: "bg-orange-100 text-orange-600",
  landlord: "Joan Doyle",
  landlordId: "2",
  rent: "€1,950",
  rentDue: "1st of month",
};

const tenancies = [
  { id: "t1", tenant: "Kevin Madden", start: "Oct 10, 2022", end: "Oct 9, 2024", rent: "€1,750", rtb: "RTB-2022-10-456782", status: "Notice", statusColor: "bg-orange-100 text-orange-600" },
  { id: "t2", tenant: "Sarah Kelly", start: "Jan 1, 2021", end: "Sep 30, 2022", rent: "€1,600", rtb: "RTB-2021-01-112233", status: "Ended", statusColor: "bg-slate-100 text-slate-500" },
];

const documents = [
  { name: "Lease Agreement 2022.pdf", type: "Lease", date: "Oct 10, 2022", size: "248 KB", uploader: "John McCann", visibility: ["Tenant", "Landlord"] },
  { name: "RTB Registration Cert.pdf", type: "RTB Registration", date: "Nov 5, 2022", size: "134 KB", uploader: "Emma Curran", visibility: ["Landlord"] },
  { name: "Plumbing Invoice #0042.pdf", type: "Invoice", date: "Feb 28, 2024", size: "72 KB", uploader: "Mark Sheehan", visibility: ["Landlord"] },
  { name: "Annual Inspection Report.pdf", type: "Inspection", date: "Jan 15, 2024", size: "320 KB", uploader: "Sarah Kelly", visibility: ["Tenant", "Landlord"] },
];

const maintenance = [
  { title: "Shower broken", priority: "Medium", status: "In Progress", assignee: "Contractor A", updated: "1 day ago" },
  { title: "Heating issue", priority: "High", status: "Open", assignee: "Maintenance Team", updated: "2 hours ago" },
  { title: "Leaky kitchen sink", priority: "High", status: "Closed", assignee: "Contractor B", updated: "3 weeks ago" },
];

const notes = [
  { date: "Mar 1, 2024", author: "Sarah Quinn", staffId: "SQ01", text: "Notice to vacate received from tenant. 90-day notice period begins today." },
  { date: "Feb 28, 2024", author: "Ciarán Byrne", staffId: "CB02", text: "Plumbing contractor invoice processed and filed." },
  { date: "Jan 15, 2024", author: "Sarah Quinn", staffId: "SQ01", text: "Annual inspection completed. Minor issues noted — property generally in good condition." },
];

const auditLog = [
  { ts: "2024-03-01 09:14:22", adminId: "SQ01", user: "Sarah Quinn", action: "Added Note", entity: "Property", ip: "192.168.1.45" },
  { ts: "2024-02-28 11:02:10", adminId: "CB02", user: "Ciarán Byrne", action: "Uploaded Document", entity: "Invoice #0042", ip: "192.168.1.46" },
  { ts: "2024-01-15 14:30:05", adminId: "SQ01", user: "Sarah Quinn", action: "Inspection Logged", entity: "Property", ip: "192.168.1.45" },
  { ts: "2022-11-05 10:00:00", adminId: "EC01", user: "Emma Curran", action: "RTB Registered", entity: "Tenancy t1", ip: "192.168.1.47" },
];

const TABS = [
  { key: "overview", label: "Overview", Icon: Home },
  { key: "finances", label: "Finances", Icon: TrendingUp },
  { key: "tenancies", label: "Tenancies", Icon: Users },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "maintenance", label: "Maintenance", Icon: Wrench },
];

const docTypeColors = {
  Lease: "bg-blue-50 text-blue-700",
  "RTB Registration": "bg-purple-50 text-purple-700",
  Statement: "bg-teal-50 text-teal-700",
  Inspection: "bg-amber-50 text-amber-700",
  Invoice: "bg-rose-50 text-rose-700",
  CONTRACT: "bg-teal-50 text-teal-700",
  REFERENCE: "bg-blue-50 text-blue-700",
  NOTICE: "bg-amber-50 text-amber-700",
  DEMAND: "bg-orange-50 text-orange-700",
  TERMINATION: "bg-red-50 text-red-700",
  WARNING: "bg-rose-50 text-rose-700",
};

const priorityColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

const statusColors = {
  Open: "bg-slate-100 text-slate-600",
  "In Progress": "bg-amber-100 text-amber-700",
  Closed: "bg-teal-100 text-teal-700",
};

const visColors = {
  Tenant: "bg-teal-100 text-teal-700",
  Landlord: "bg-amber-100 text-amber-700",
};

const EMPTY_FINANCE_SUMMARY = {
  monthlyRent: 0,
  rentDueDay: 0,
  year: 0,
  totalCollected: 0,
  monthsPaid: 0,
  totalMonths: 0,
  overdueCount: 0,
  pendingCount: 0,
  payments: [],
};

const FINANCE_HISTORY_ITEMS_PER_PAGE = 10;

function InfoRow({ label, value, mono = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      {children ?? <p className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>}
    </div>
  );
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPaymentMonth(rawMonth, fallbackDate) {
  if (rawMonth) {
    const monthValue = String(rawMonth);
    if (/^\d{4}-\d{2}$/.test(monthValue)) {
      const [year, month] = monthValue.split("-").map(Number);
      const monthDate = new Date(year, month - 1, 1);
      if (!Number.isNaN(monthDate.getTime())) {
        return monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
    }
    return monthValue;
  }

  if (fallbackDate) {
    const dateValue = new Date(fallbackDate);
    if (!Number.isNaN(dateValue.getTime())) {
      return dateValue.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
  }

  return "—";
}

function normalizeRentPayment(payment) {
  const tenantRecord = payment.tenant || payment.tenancy?.tenant || payment.tenancy?.user || null;
  const tenantId = String(
    payment.tenantId || tenantRecord?.id || tenantRecord?.userId || payment.tenancy?.tenantId || ""
  );
  const tenantName =
    tenantRecord?.name ||
    tenantRecord?.user?.name ||
    [tenantRecord?.firstName, tenantRecord?.lastName].filter(Boolean).join(" ").trim() ||
    payment.tenantName ||
    "—";

  const dueDate = payment.dueDate || payment.due_date || payment.expectedDate || null;
  const paidDate = payment.paidDate || payment.paymentDate || payment.paidAt || null;
  const monthRaw = payment.month || payment.monthKey || payment.billingMonth || payment.period || null;
  const status = String(payment.status || payment.paymentStatus || payment.rentStatus || "PENDING").toUpperCase();
  const amount = Number(payment.amount ?? payment.totalAmount ?? payment.rentAmount ?? payment.value ?? 0);
  const reference = payment.reference || payment.paymentReference || payment.transactionReference || payment.transactionId || "—";
  const fallbackId = [tenantId, monthRaw, dueDate, paidDate, String(amount), status].filter(Boolean).join("-");

  return {
    id: payment.id || payment.paymentId || fallbackId || "unknown-payment",
    propertyId: String(payment.propertyId || payment.property?.id || payment.tenancy?.propertyId || payment.tenancy?.property?.id || ""),
    tenancyId: String(payment.tenancyId || payment.tenancy?.id || ""),
    tenant: tenantId || tenantName !== "—" ? { id: tenantId, name: tenantName } : null,
    amount,
    status,
    dueDate,
    paidDate,
    createdAt: payment.createdAt || payment.updatedAt || null,
    monthRaw,
    month: formatPaymentMonth(monthRaw, dueDate || paidDate || payment.createdAt),
    reference,
  };
}

function getPaymentYear(payment) {
  const dateCandidates = [payment.dueDate, payment.paidDate, payment.createdAt].filter(Boolean);
  for (const value of dateCandidates) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getFullYear();
    }
  }

  const monthValue = String(payment.monthRaw || payment.month || "");
  const yearMatch = monthValue.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? Number(yearMatch[0]) : null;
}

function normalizeFinanceSummary(payload) {
  const rows = Array.isArray(payload?.payments) ? payload.payments : [];
  return {
    monthlyRent: toNumber(payload?.monthlyRent),
    rentDueDay: toNumber(payload?.rentDueDay),
    year: toNumber(payload?.year),
    totalCollected: toNumber(payload?.totalCollected),
    monthsPaid: toNumber(payload?.monthsPaid),
    totalMonths: toNumber(payload?.totalMonths),
    overdueCount: toNumber(payload?.overdueCount),
    pendingCount: toNumber(payload?.pendingCount),
    payments: rows,
  };
}

function formatCurrency(amount) {
  return `€${toNumber(amount).toLocaleString("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDisplayDate(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString();
}

function getPaymentStatusBadgeClass(status) {
  const normalized = String(status || "PENDING").toUpperCase();
  if (normalized === "PAID") return "bg-green-100 text-green-700";
  if (normalized === "OVERDUE") return "bg-red-100 text-red-700";
  if (normalized === "LATE") return "bg-orange-100 text-orange-700";
  return "bg-amber-100 text-amber-700";
}

function getSortableTimestamp(value) {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isFinite(ts) ? ts : 0;
}

export default function AdminPropertyProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [noteText, setNoteText] = useState("");
  const [selectedTenancyId, setSelectedTenancyId] = useState(null);
  const [fetchedTenancyDetails, setFetchedTenancyDetails] = useState(null);
  const [refreshTenancies, setRefreshTenancies] = useState(0);
  
  // Fetched data states
  const [fetchedProperty, setFetchedProperty] = useState(null);
  const [allRentPayments, setAllRentPayments] = useState([]);
  const [fetchedRentPayments, setFetchedRentPayments] = useState([]);
  const [financeSummary, setFinanceSummary] = useState(EMPTY_FINANCE_SUMMARY);
  const [fetchedTenancies, setFetchedTenancies] = useState(null);
  const [fetchedDocuments, setFetchedDocuments] = useState(null);
  const [fetchedMaintenance, setFetchedMaintenance] = useState(null);
  const [fetchedAuditLog, setFetchedAuditLog] = useState(null);
  const [isLoadingRentPayments, setIsLoadingRentPayments] = useState(false);
  const [financeFilters, setFinanceFilters] = useState({
    status: "ALL",
    year: "",
  });
  const [financeHistoryPage, setFinanceHistoryPage] = useState(1);

  const activeTenancy = Array.isArray(fetchedTenancies)
    ? fetchedTenancies.find((tenancy) => tenancy.status === "ACTIVE") || fetchedTenancies[0]
    : null;

  const fetchRentPaymentsSummary = async () => {
    if (!id) return;

    setIsLoadingRentPayments(true);
    try {
      const rentUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/landlord/property/${id}/summary`;
      const rentRes = await authenticatedFetch(rentUrl);

      if (rentRes.ok) {
        const data = await rentRes.json();
        const summary = normalizeFinanceSummary(data.data || {});
        const payments = summary.payments.map(normalizeRentPayment);

        setFinanceSummary(summary);
        setAllRentPayments(payments);
      } else {
        setFinanceSummary(EMPTY_FINANCE_SUMMARY);
        setAllRentPayments([]);
        setFetchedRentPayments([]);
      }
    } catch (err) {
      console.warn("Failed to fetch rent payments:", err);
      setFinanceSummary(EMPTY_FINANCE_SUMMARY);
      setAllRentPayments([]);
      setFetchedRentPayments([]);
    } finally {
      setIsLoadingRentPayments(false);
    }
  };

  // Fetch property data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property details
        const propertiesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/${id}`;
        const propertiesRes = await authenticatedFetch(propertiesUrl);
        if (propertiesRes.ok) {
          const data = await propertiesRes.json();
          setFetchedProperty(data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch property details:", err);
      }

      try {
        // Fetch tenancies for this property
        const tenancyParams = new URLSearchParams({ propertyId: String(id) });
        const tenanciesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies?${tenancyParams.toString()}`;
        const tenanciesRes = await authenticatedFetch(tenanciesUrl);
        if (tenanciesRes.ok) {
          const data = await tenanciesRes.json();
          const rawTenancies = Array.isArray(data.data) ? data.data : [];
          const normalizedTenancies = rawTenancies
            .filter((t) => String(t.propertyId || t.property?.id || "") === String(id))
            .map((t) => ({
              id: t.id,
              tenantId: t.tenantId || t.tenant?.id || t.tenant?.userId || "",
              tenantName:
                t.tenant?.name ||
                t.tenant?.user?.name ||
                `${t.tenantFirstName || ""} ${t.tenantLastName || ""}`.trim() ||
                "—",
              startDate: t.startDate || null,
              endDate: t.endDate || null,
              rent: t.rent ?? null,
              rtbNumber: t.rtbNumber || null,
              status: t.status || null,
            }));
          setFetchedTenancies(normalizedTenancies);
        } else {
          setFetchedTenancies([]);
        }
      } catch (err) {
        console.warn("Failed to fetch tenancies:", err);
        setFetchedTenancies([]);
      }

      try {
        // Fetch documents
        const docsUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents?propertyId=${id}`;
        const docsRes = await authenticatedFetch(docsUrl);
        if (docsRes.ok) {
          const data = await docsRes.json();
          setFetchedDocuments(data.data || []);
        }
      } catch (err) {
        console.warn("Failed to fetch documents:", err);
      }

      try {
        // Fetch maintenance
        const maintUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance?propertyId=${id}`;
        const maintRes = await authenticatedFetch(maintUrl);
        if (maintRes.ok) {
          const data = await maintRes.json();
          setFetchedMaintenance(data.data || []);
        }
      } catch (err) {
        console.warn("Failed to fetch maintenance:", err);
      }

      // Audit: No endpoint yet, using mock
      try {
        // TODO: Replace with actual audit endpoint when available
        // const auditUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/audit?propertyId=${id}`;
        // const auditRes = await authenticatedFetch(auditUrl);
        // if (auditRes.ok) {
        //   const data = await auditRes.json();
        //   setFetchedAuditLog(data.data || []);
        // }
        setFetchedAuditLog(null); // Using mock for now
      } catch (err) {
        console.warn("Failed to fetch audit log:", err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, refreshTenancies]);

  useEffect(() => {
    if (!id) {
      setFinanceSummary(EMPTY_FINANCE_SUMMARY);
      setAllRentPayments([]);
      setFetchedRentPayments([]);
      return;
    }

    fetchRentPaymentsSummary();
  }, [id]);

  useEffect(() => {
    const filteredPayments = allRentPayments.filter((payment) => {
      if (financeFilters.status !== "ALL" && payment.status !== financeFilters.status) {
        return false;
      }

      if (financeFilters.year) {
        const year = Number(financeFilters.year);
        if (!Number.isFinite(year)) {
          return false;
        }
        const paymentYear = getPaymentYear(payment);
        if (!paymentYear || paymentYear !== year) {
          return false;
        }
      }

      return true;
    });

    setFetchedRentPayments(filteredPayments);
  }, [allRentPayments, financeFilters.status, financeFilters.year]);

  useEffect(() => {
    setFinanceHistoryPage(1);
  }, [financeFilters.status, financeFilters.year, id]);

  const sortedRentPayments = [...fetchedRentPayments].sort((a, b) => {
    const aTs = getSortableTimestamp(a.dueDate || a.createdAt);
    const bTs = getSortableTimestamp(b.dueDate || b.createdAt);
    return bTs - aTs;
  });

  const paginatedRentPayments = sortedRentPayments.slice(
    (financeHistoryPage - 1) * FINANCE_HISTORY_ITEMS_PER_PAGE,
    financeHistoryPage * FINANCE_HISTORY_ITEMS_PER_PAGE,
  );

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(sortedRentPayments.length / FINANCE_HISTORY_ITEMS_PER_PAGE),
    );
    if (financeHistoryPage > totalPages) {
      setFinanceHistoryPage(totalPages);
    }
  }, [financeHistoryPage, sortedRentPayments.length]);

  // Fetch tenancy details when a tenancy is selected
  const fetchTenancyDetails = async (tenancyId) => {
    try {
      const tenancyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/${tenancyId}`;
      const res = await authenticatedFetch(tenancyUrl);
      if (res.ok) {
        const data = await res.json();
        setFetchedTenancyDetails(data.data);
        setSelectedTenancyId(tenancyId);
      }
    } catch (err) {
      console.warn("Failed to fetch tenancy details:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition">
        <ArrowLeft size={15} /> Back to Properties
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Home size={22} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">{fetchedProperty?.name || "—"}</h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5"><MapPin size={13} />{fetchedProperty?.address || "—"}</p>
              {fetchedProperty?.landlord && (
                <p className="text-xs text-slate-500 mt-2">Landlord: <strong>{fetchedProperty.landlord.name}</strong> • {fetchedProperty.landlord.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              fetchedProperty?.status === "LET" ? "bg-green-100 text-green-600" : 
              fetchedProperty?.status === "AVAILABLE" ? "bg-blue-100 text-blue-600" :
              fetchedProperty?.status === "Notice" ? "bg-orange-100 text-orange-600" : 
              "bg-slate-100 text-slate-600"
            }`}>{fetchedProperty?.status || "—"}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
              ${activeTab === key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><Home size={16} className="text-teal-600" />Property Details</h2>
            <InfoRow label="Type" value={fetchedProperty?.propertyType || "—"} />
            <InfoRow label="Bedrooms" value={fetchedProperty?.bedrooms ?? "—"} />
            <InfoRow label="Bathrooms" value={fetchedProperty?.bathrooms ?? "—"} />
            <InfoRow label="County / City" value={fetchedProperty?.county || "—"} />
            <InfoRow label="Eircode" value={fetchedProperty?.eircode || "—"} mono />
            <InfoRow label="MPRN" value={fetchedProperty?.mprn || "—"} mono />
            <InfoRow label="Address" value={fetchedProperty?.address || "—"} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><Euro size={16} className="text-teal-600" />Rent & Landlord</h2>
            <InfoRow label="Monthly Rent" value={`€${fetchedProperty?.rent || "—"}`} />
            <InfoRow label="Landlord">
              {fetchedProperty?.landlord ? (
                <Link href={`/admin/landlords/${fetchedProperty?.landlordId}`} className="text-base font-semibold text-teal-600 hover:underline">{fetchedProperty.landlord.name}</Link>
              ) : (
                <span>—</span>
              )}
            </InfoRow>
            <InfoRow label="Landlord Email" value={fetchedProperty?.landlord?.email || "—"} />
            <InfoRow label="Status">
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${fetchedProperty?.status === "LET" ? "bg-green-100 text-green-600" : fetchedProperty?.status === "AVAILABLE" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"}`}>{fetchedProperty?.status || "—"}</span>
            </InfoRow>
          </div>
        </div>
      )}

      {/* ── Finances ── */}
      {activeTab === "finances" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><TrendingUp size={20} className="text-teal-600" />Property Finances</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {isLoadingRentPayments ? "Loading..." : `${fetchedRentPayments.length} Payments`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              <select
                value={financeFilters.status}
                onChange={(e) => setFinanceFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700"
              >
                <option value="ALL">All Status</option>
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="OVERDUE">OVERDUE</option>
                <option value="LATE">LATE</option>
              </select>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Year (e.g. 2026)"
                value={financeFilters.year}
                onChange={(e) => {
                  const yearValue = e.target.value;
                  if (/^\d{0,4}$/.test(yearValue)) {
                    setFinanceFilters((prev) => ({ ...prev, year: yearValue }));
                  }
                }}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700"
              />

              <button
                onClick={() =>
                  setFinanceFilters({ status: "ALL", year: "" })
                }
                className="px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Reset Filters
              </button>
            </div>

            {(() => {
              const totalPending = allRentPayments
                .filter((p) => p.status === "PENDING")
                .reduce((sum, p) => sum + Number(p.amount || 0), 0);
              const paidRatio = `${financeSummary.monthsPaid}/${financeSummary.totalMonths}`;
              const dueDayLabel = financeSummary.rentDueDay > 0 ? `Due day: ${financeSummary.rentDueDay}` : "Due day: 0";

              return (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-2xl font-bold text-teal-600">{formatCurrency(financeSummary.monthlyRent)}</p>
                    <p className="text-sm text-slate-600 mt-1">Monthly Rent</p>
                    <p className="text-xs text-slate-500 mt-1">{dueDayLabel}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(financeSummary.totalCollected)}</p>
                    <p className="text-sm text-slate-600 mt-1">Total Collected</p>
                    <p className="text-xs text-slate-500 mt-1">Year: {financeSummary.year || 0}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-2xl font-bold text-amber-700">{formatCurrency(totalPending)}</p>
                    <p className="text-sm text-amber-700 mt-1">Pending Amount ({financeSummary.pendingCount})</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${financeSummary.overdueCount > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                    <p className={`text-2xl font-bold ${financeSummary.overdueCount > 0 ? "text-red-600" : "text-slate-800"}`}>{financeSummary.overdueCount}</p>
                    <p className="text-sm text-slate-600 mt-1">Overdue Payments</p>
                    <p className="text-xs text-slate-500 mt-1">Paid Months: {paidRatio}</p>
                  </div>
                </div>
              );
            })()}

            {fetchedProperty?.landlord && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700"><strong>Landlord:</strong> {fetchedProperty.landlord.name} ({fetchedProperty.landlord.email})</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-700">Rent Payment History</h3>
            </div>
            {isLoadingRentPayments ? (
              <div className="px-5 py-8 text-center text-slate-500">
                <p className="text-sm">Loading rent payments...</p>
              </div>
            ) : sortedRentPayments.length > 0 ? (
              <>
                <div className="sm:hidden p-4 space-y-3">
                  {paginatedRentPayments.map((p) => {
                    const statusBadge = getPaymentStatusBadgeClass(p.status);
                    return (
                      <article key={p.id} className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-700">{p.month || "—"}</p>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge}`}>
                            {p.status || "—"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-slate-400">Amount</p>
                            <p className="text-sm font-bold text-slate-700">{formatCurrency(p.amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Tenant</p>
                            <p className="text-sm text-slate-700">{p.tenant?.name || activeTenancy?.tenantName || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Due Date</p>
                            <p className="text-sm text-slate-700">{formatDisplayDate(p.dueDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Paid Date</p>
                            <p className="text-sm text-slate-700">{formatDisplayDate(p.paidDate)}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Reference</p>
                          <p className="text-xs font-mono text-slate-600 break-all">{p.reference || "—"}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                        <th className="text-left px-5 py-3">Month</th>
                        <th className="text-left px-5 py-3">Amount</th>
                        <th className="text-left px-5 py-3">Due Date</th>
                        <th className="text-left px-5 py-3">Paid Date</th>
                        <th className="text-left px-5 py-3">Tenant</th>
                        <th className="text-left px-5 py-3">Reference</th>
                        <th className="text-left px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRentPayments.map((p) => {
                        const statusBadge = getPaymentStatusBadgeClass(p.status);

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-4 text-sm font-semibold text-slate-700">{p.month || "—"}</td>
                            <td className="px-5 py-4 text-sm font-bold text-slate-700">{formatCurrency(p.amount)}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{formatDisplayDate(p.dueDate)}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{formatDisplayDate(p.paidDate)}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{p.tenant?.name || activeTenancy?.tenantName || "—"}</td>
                            <td className="px-5 py-4 text-xs font-mono text-slate-500">{p.reference || "—"}</td>
                            <td className="px-5 py-4">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge}`}>
                                {p.status || "—"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  total={sortedRentPayments.length}
                  itemsPerPage={FINANCE_HISTORY_ITEMS_PER_PAGE}
                  currentPage={financeHistoryPage}
                  onPageChange={setFinanceHistoryPage}
                  showItemsPerPage={false}
                />
              </>
            ) : (
              <div className="px-5 py-8 text-center text-slate-500">
                <p className="text-sm">No rent payments found for this property.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tenancies ── */}
      {activeTab === "tenancies" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Users size={16} className="text-teal-600" />Tenancies</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                    <th className="text-left px-5 py-3">Tenant</th>
                    <th className="text-left px-5 py-3">Start</th>
                    <th className="text-left px-5 py-3">End</th>
                    <th className="text-left px-5 py-3">Rent</th>
                    <th className="text-left px-5 py-3">RTB Number</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fetchedTenancies && fetchedTenancies.length > 0 ? (
                    fetchedTenancies.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer">
                        <td className="px-5 py-4 font-semibold text-slate-700">{t.tenantName || "—"}</td>
                        <td className="px-5 py-4 text-slate-600 text-sm">{t.startDate ? new Date(t.startDate).toLocaleDateString() : "—"}</td>
                        <td className="px-5 py-4 text-slate-600 text-sm">{t.endDate ? new Date(t.endDate).toLocaleDateString() : "—"}</td>
                        <td className="px-5 py-4 font-bold text-slate-700">€{t.rent || "—"}</td>
                        <td className="px-5 py-4 font-mono text-sm text-slate-500">{t.rtbNumber || "—"}</td>
                        <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.status === "ACTIVE" ? "bg-green-100 text-green-600" : t.status === "EXPIRED" || t.status === "TERMINATED" ? "bg-slate-100 text-slate-500" : "bg-orange-100 text-orange-600"}`}>{t.status || "—"}</span></td>
                        <td className="px-5 py-4 text-right">
                          <button 
                            onClick={() => fetchTenancyDetails(t.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"
                          >
                            <Eye size={13} /> View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-5 py-8 text-center text-slate-500">
                        <p className="text-sm">No tenancies found for this property.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tenancy Details Modal */}
          {fetchedTenancyDetails && selectedTenancyId && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2"><BadgeCheck size={20} className="text-teal-600" />Tenancy Details</h2>
                <button 
                  onClick={() => {
                    setFetchedTenancyDetails(null);
                    setSelectedTenancyId(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tenant Information */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-base font-bold text-slate-700 mb-4">Tenant Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Name</p>
                      <p className="text-sm font-semibold text-slate-700">{fetchedTenancyDetails?.tenant?.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Email</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.tenant?.email || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Rent Details */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-base font-bold text-slate-700 mb-4">Rent Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Rent Amount</p>
                      <p className="text-sm font-bold text-slate-700">€{fetchedTenancyDetails?.rent || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Rent Due Day</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.rentDueDay ? `${fetchedTenancyDetails.rentDueDay}th of month` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Rent Status</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${fetchedTenancyDetails?.rentStatus === "OVERDUE" ? "bg-red-100 text-red-600" : fetchedTenancyDetails?.rentStatus === "PAID" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                        {fetchedTenancyDetails?.rentStatus || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lease Dates */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-base font-bold text-slate-700 mb-4">Lease Dates</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Start Date</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.startDate ? new Date(fetchedTenancyDetails.startDate).toLocaleDateString() : "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">End Date</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.endDate ? new Date(fetchedTenancyDetails.endDate).toLocaleDateString() : "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Rent Review Date</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.rentReviewDate ? new Date(fetchedTenancyDetails.rentReviewDate).toLocaleDateString() : "—"}</p>
                    </div>
                  </div>
                </div>

                {/* RTB Registration */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-base font-bold text-slate-700 mb-4">RTB Registration</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">RTB Number</p>
                      <p className="text-sm font-mono text-slate-700">{fetchedTenancyDetails?.rtbNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">RTB Status</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${fetchedTenancyDetails?.rtbStatus === "Active" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600"}`}>
                        {fetchedTenancyDetails?.rtbStatus || "—"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Registration Status</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.rtbRegistration || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Registration Date</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.rtbRegistrationDate ? new Date(fetchedTenancyDetails.rtbRegistrationDate).toLocaleDateString() : "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Expiry Date</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.rtbExpiryDate ? new Date(fetchedTenancyDetails.rtbExpiryDate).toLocaleDateString() : "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Landlord Information */}
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-base font-bold text-slate-700 mb-4">Landlord Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Name</p>
                      <p className="text-sm font-semibold text-slate-700">{fetchedTenancyDetails?.landlord?.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Email</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.landlord?.email || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="text-base font-bold text-slate-700 mb-4">Property Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Address</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.property?.address || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Type</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.property?.propertyType || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Bedrooms</p>
                      <p className="text-sm text-slate-600">{fetchedTenancyDetails?.property?.bedrooms || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setFetchedTenancyDetails(null);
                    setSelectedTenancyId(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><FileText size={16} className="text-teal-600" />Documents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Document</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Size</th>
                  <th className="text-left px-5 py-3">Uploaded By</th>
                  <th className="text-left px-5 py-3">Visibility</th>
                  <th className="text-right px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fetchedDocuments && fetchedDocuments.length > 0 ? (
                  fetchedDocuments.map((d, i) => {
                    const displayTypes = {
                      LEASE: "Lease",
                      RTB_REGISTRATION: "RTB Registration",
                      INVOICE: "Invoice",
                      STATEMENT: "Statement",
                      CONTRACT: "Contract",
                      REFERENCE: "Reference",
                      NOTICE: "Notice",
                      DEMAND: "Demand",
                      TERMINATION: "Termination",
                      WARNING: "Warning",
                    };
                    const docType = d.type ? (displayTypes[d.type.toUpperCase()] || d.type) : d.type;
                    const docName = d.name;
                    const docDate = d.createdAt ? new Date(d.createdAt).toLocaleDateString() : d.date;
                    const docSize = d.fileSize || d.size;
                    const docUploader = d.uploadedBy?.name || d.uploader || "—";
                    const visibility = d.visibility?.map(v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()) || [];
                    const fileUrl = d.fileUrl || d.downloadUrl;
                    
                    return (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{docName}</td>
                        <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${docTypeColors[docType] || "bg-slate-100 text-slate-600"}`}>{docType}</span></td>
                        <td className="px-5 py-4 text-sm text-slate-500">{docDate}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{docSize}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{docUploader}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {visibility.length > 0 ? visibility.map((v) => <span key={v} className={`text-xs font-medium px-2 py-0.5 rounded-full ${visColors[v] || "bg-slate-100 text-slate-500"}`}>{v}</span>) : <span className="text-xs text-slate-400">—</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {fileUrl ? (
                            <a href={fileUrl} download className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"><Download size={13} />Download</a>
                          ) : (
                            <button disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed"><Download size={13} />No Link</button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-slate-500">
                      <p className="text-sm">No documents found for this property.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Maintenance ── */}
      {activeTab === "maintenance" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Wrench size={16} className="text-teal-600" />Maintenance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Issue</th>
                  <th className="text-left px-5 py-3">Priority</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Assigned To</th>
                  <th className="text-left px-5 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fetchedMaintenance && fetchedMaintenance.length > 0 ? (
                  fetchedMaintenance.map((m, i) => {
                    const title = m.title;
                    const priority = m.priority || "—";
                    const status = m.status === "IN_PROGRESS" ? "In Progress" : m.status === "CLOSED" ? "Closed" : m.status === "OPEN" ? "Open" : m.status || "—";
                    const assignee = m.assignedTo?.name || "—";
                    const updated = m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : "—";
                    const statusDisplay = statusColors[status] || "bg-slate-100 text-slate-600";
                    const priorityDisplay = priorityColors[priority] || "bg-slate-100 text-slate-600";
                    
                    return (
                      <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4 font-semibold text-slate-700">{title}</td>
                        <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityDisplay}`}>{priority}</span></td>
                        <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusDisplay}`}>{status}</span></td>
                        <td className="px-5 py-4 text-sm text-slate-600">{assignee}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{updated}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                      <p className="text-sm">No maintenance requests found for this property.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes tab removed */}

      {/* Audit tab removed per request */}
    </div>
  );
}
