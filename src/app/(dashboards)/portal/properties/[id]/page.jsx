"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authenticatedFetch } from "@/utils/authFetch";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import {
  Home,
  User,
  FileText,
  Wrench,
  ArrowLeft,
  MapPin,
  Zap,
  Euro,
  BadgeCheck,
  Clock,
  CalendarDays,
  AlertCircle,
  Download,
  Tag,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

/* ─── Empty fallback for when API data isn't available ─── */
const EMPTY_PROPERTY = {
  id: "",
  name: "N/A",
  address: "N/A",
  area: "N/A",
  propertyType: "N/A",
  type: "N/A",
  bedrooms: "N/A",
  bathrooms: "N/A",
  mprn: "N/A",
  rent: "N/A",
  rentDue: "N/A",
  rentLate: "N/A",
  tenant: {
    name: "N/A",
    email: "N/A",
    phone: "N/A",
    since: "N/A",
  },
  tenancy: {
    rtbNumber: "N/A",
    registrationDate: "N/A",
    expiryDate: "N/A",
    leaseStart: "N/A",
    leaseEnd: "N/A",
    rentReviewDate: "N/A",
    rentReviewFrequency: "N/A",
    noticeGiven: "N/A",
    noticePeriod: "N/A",
  },
  image: null,
};

const TABS = [
  { key: "overview", label: "Overview", Icon: Home },
  { key: "tenancy", label: "Tenancy", Icon: BadgeCheck },
  { key: "rent", label: "Rent Payments", Icon: Euro },
  { key: "rtb", label: "RTB Registration", Icon: CheckCircle },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "maintenance", label: "Maintenance", Icon: Wrench },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const rentTracker = [
  {
    month: "Jan",
    amount: "€0",
    status: "Paid",
    date: "Jan 1, 2025",
    ref: "#0",
  },
  {
    month: "Feb",
    amount: "€0",
    status: "Overdue",
    date: "Feb 1, 2025",
    ref: "#0",
  },
  {
    month: "Mar",
    amount: "€",
    status: "Pending",
    date: "Mar 1, 2025",
    ref: "#0",
  },
  {
    month: "Apr",
    amount: "€0",
    status: "Pending",
    date: "Apr 1, 2025",
    ref: "#0",
  },
  {
    month: "May",
    amount: "€0",
    status: "Pending",
    date: "May 1, 2025",
    ref: "#0",
  },
  {
    month: "Jun",
    amount: "€0",
    status: "Pending",
    date: "Jun 1, 2025",
    ref: "#0",
  },
  {
    month: "Jul",
    amount: "€0",
    status: "Pending",
    date: "Jul 1, 2025",
    ref: "#0",
  },
  {
    month: "Aug",
    amount: "€0",
    status: "Pending",
    date: "Aug 1, 2025",
    ref: "#0",
  },
  {
    month: "Sep",
    amount: "€0",
    status: "Pending",
    date: "Sep 1, 2025",
    ref: "#0",
  },
  {
    month: "Oct",
    amount: "€0",
    status: "Pending",
    date: "Oct 1, 2025",
    ref: "#0",
  },
  {
    month: "Nov",
    amount: "€0",
    status: "Pending",
    date: "Nov 1, 2025",
    ref: "#0",
  },
  {
    month: "Dec",
    amount: "€0",
    status: "Pending",
    date: "Dec 1, 2025",
    ref: "#0",
  },
];

const rentStatusStyle = {
  Paid: { dot: "bg-teal-500", badge: "bg-teal-100 text-teal-700" },
  Overdue: { dot: "bg-red-500", badge: "bg-red-100 text-red-700" },
  Pending: { dot: "bg-slate-300", badge: "bg-slate-100 text-slate-500" },
};

const docTypeColors = {
  LEASE: "bg-blue-50 text-blue-700",
  RTB_REGISTRATION: "bg-purple-50 text-purple-700",
  STATEMENT: "bg-teal-50 text-teal-700",
  INSPECTION: "bg-amber-50 text-amber-700",
  INVOICE: "bg-rose-50 text-rose-700",
  Lease: "bg-blue-50 text-blue-700",
  "RTB Registration": "bg-purple-50 text-purple-700",
  Statement: "bg-teal-50 text-teal-700",
  Inspection: "bg-amber-50 text-amber-700",
  Invoice: "bg-rose-50 text-rose-700",
};

const priorityColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">
        {label}
      </p>
      <p
        className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyTabState({ message = "Not found" }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function formatDisplayDate(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PropertyProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [fetchedProperty, setFetchedProperty] = useState(null);
  const [fetchedTenants, setFetchedTenants] = useState(null);
  const [fetchedRentSummary, setFetchedRentSummary] = useState(null);
  const [fetchedRentCalendar, setFetchedRentCalendar] = useState(null);
  const [fetchedRentPayments, setFetchedRentPayments] = useState(null);
  const [fetchedRtb, setFetchedRtb] = useState(null);
  const [fetchedMaintenance, setFetchedMaintenance] = useState(null);
  const [fetchedDocuments, setFetchedDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rtbLoading, setRtbLoading] = useState(false);
  const [rtbError, setRtbError] = useState(null);

  // Server-side pagination & filter state for payments
  const [rentPaymentsPage, setRentPaymentsPage] = useState(1);
  const [rentPaymentsLimit, setRentPaymentsLimit] = useState(5);
  const [rentPaymentsTotal, setRentPaymentsTotal] = useState(0);
  const [rentPaymentsTotalPages, setRentPaymentsTotalPages] = useState(0);
  const [rentPaymentsLoading, setRentPaymentsLoading] = useState(false);
  const [rentPaymentsError, setRentPaymentsError] = useState(null);
  const [rentPaymentsStatus, setRentPaymentsStatus] = useState("ALL");

  // Server-side pagination state for documents
  const [documentsPage, setDocumentsPage] = useState(1);
  const [documentsLimit] = useState(5);
  const [documentsTotal, setDocumentsTotal] = useState(0);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState(null);

  // Server-side pagination state for maintenance requests
  const [maintenancePage, setMaintenancePage] = useState(1);
  const [maintenanceLimit] = useState(5);
  const [maintenanceTotal, setMaintenanceTotal] = useState(0);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState(null);

  useEffect(() => {
    setDocumentsPage(1);
  }, [id]);

  useEffect(() => {
    setMaintenancePage(1);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch properties
        const propsUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/properties/my`;
        const propsRes = await authenticatedFetch(propsUrl);
        if (!propsRes.ok) throw new Error("Failed to fetch properties");
        const propsData = await propsRes.json();
        const properties = propsData.data || [];

        // Find property matching the current ID
        const found = properties.find((p) => p.id === id);
        if (found) {
          setFetchedProperty(found);
        } else {
          setError("Property not found");
          setFetchedProperty(null);
        }

        // Fetch tenants for this property
        const tenantsUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/tenancies/landlord/tenants`;
        const tenantsRes = await authenticatedFetch(tenantsUrl);
        if (tenantsRes.ok) {
          const tenantsData = await tenantsRes.json();
          const tenants = tenantsData.data || [];
          // Filter tenants for this property
          const propertyTenants = tenants.filter(
            (t) => t.property && t.property.id === id,
          );
          setFetchedTenants(propertyTenants);
        }

        // Fetch rent payment summary
        const rentSummaryUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/rent-payments/landlord/property/${id}/summary`;
        try {
          const rentSummaryRes = await authenticatedFetch(rentSummaryUrl);
          if (rentSummaryRes.ok) {
            const rentSummaryData = await rentSummaryRes.json();
            setFetchedRentSummary(rentSummaryData.data);
          }
        } catch (err) {
          console.warn("Failed to fetch rent summary:", err);
        }

        // Fetch rent payment calendar
        const rentCalendarUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/rent-payments/landlord/property/${id}/calendar`;
        try {
          const rentCalendarRes = await authenticatedFetch(rentCalendarUrl);
          if (rentCalendarRes.ok) {
            const rentCalendarData = await rentCalendarRes.json();
            setFetchedRentCalendar(rentCalendarData.data?.calendar || []);
          }
        } catch (err) {
          console.warn("Failed to fetch rent calendar:", err);
        }

        // Rent payments are fetched separately with server-side pagination

        // Documents are fetched separately with server-side pagination
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || String(err));
        setFetchedProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch rent payments (server-side pagination + status filter)
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const fetchPayments = async () => {
      setRentPaymentsLoading(true);
      setRentPaymentsError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", String(rentPaymentsPage));
        params.append("limit", String(rentPaymentsLimit));
        if (rentPaymentsStatus && rentPaymentsStatus !== "ALL") {
          params.append("status", rentPaymentsStatus);
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/rent-payments/landlord/property/${id}?${params.toString()}`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok)
          throw new Error(res.statusText || "Failed to fetch payments");
        const json = await res.json();
        const items = Array.isArray(json.data) ? json.data : [];
        setFetchedRentPayments(items);

        const pagination = json.meta?.pagination || {};
        setRentPaymentsTotal(pagination.totalItems || items.length);
        setRentPaymentsTotalPages(
          pagination.totalPages || (items.length ? 1 : 0),
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching rent payments:", err);
          setRentPaymentsError(err.message || String(err));
          setFetchedRentPayments([]);
        }
      } finally {
        setRentPaymentsLoading(false);
      }
    };

    fetchPayments();
    return () => controller.abort();
  }, [id, rentPaymentsPage, rentPaymentsLimit, rentPaymentsStatus]);

  // Fetch documents (server-side pagination + property filter)
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchDocuments = async () => {
      setDocumentsLoading(true);
      setDocumentsError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", String(documentsPage));
        params.append("limit", String(documentsLimit));
        params.append("propertyId", id);

        const url = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/documents?${params.toString()}`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(res.statusText || "Failed to fetch documents");
        }

        const json = await res.json();
        const rows = Array.isArray(json.data) ? json.data : [];
        // Keep a client-side guard in case backend returns mixed properties.
        const propertyRows = rows.filter(
          (d) => d.propertyId === id || d.property?.id === id,
        );
        setFetchedDocuments(propertyRows);

        const pagination = json.meta?.pagination || {};
        setDocumentsTotal(pagination.totalItems || propertyRows.length);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching documents:", err);
          setDocumentsError(err.message || String(err));
          setFetchedDocuments([]);
          setDocumentsTotal(0);
        }
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
    return () => controller.abort();
  }, [id, documentsPage, documentsLimit]);

  // Fetch maintenance requests (server-side pagination + property filter)
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchMaintenance = async () => {
      setMaintenanceLoading(true);
      setMaintenanceError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", String(maintenancePage));
        params.append("limit", String(maintenanceLimit));
        params.append("propertyId", id);

        const url = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/maintenance/landlord?${params.toString()}`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(
            res.statusText || "Failed to fetch maintenance requests",
          );
        }

        const json = await res.json();
        const payload = json.data;
        const rows = Array.isArray(payload?.requests)
          ? payload.requests
          : Array.isArray(payload)
            ? payload
            : [];

        // Keep a guard in case backend returns mixed properties.
        const propertyRows = rows.filter(
          (m) => m.propertyId === id || m.property?.id === id,
        );
        setFetchedMaintenance(propertyRows);

        const pagination = payload?.pagination || json.meta?.pagination || {};
        setMaintenanceTotal(pagination.totalItems || propertyRows.length);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching maintenance requests:", err);
          setMaintenanceError(err.message || String(err));
          setFetchedMaintenance([]);
          setMaintenanceTotal(0);
        }
      } finally {
        setMaintenanceLoading(false);
      }
    };

    fetchMaintenance();
    return () => controller.abort();
  }, [id, maintenancePage, maintenanceLimit]);

  // Get the first active tenant for this property
  const activeTenant =
    fetchedTenants && fetchedTenants.length > 0
      ? fetchedTenants.find((t) => t.tenancyStatus === "ACTIVE") ||
        fetchedTenants[0]
      : null;
  const activeTenancyId = activeTenant?.tenancyId || activeTenant?.id || null;

  // Fetch RTB details by tenancy id
  useEffect(() => {
    if (!activeTenancyId) {
      setFetchedRtb(null);
      setRtbError(null);
      return;
    }

    const controller = new AbortController();

    const fetchRtbDetails = async () => {
      setRtbLoading(true);
      setRtbError(null);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/tenancies/${activeTenancyId}/rtb`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(res.statusText || "Failed to fetch RTB details");
        }

        const json = await res.json();
        if (json.success && json.data) {
          setFetchedRtb(json.data);
        } else {
          setFetchedRtb(null);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching RTB details:", err);
          setRtbError(err.message || String(err));
          setFetchedRtb(null);
        }
      } finally {
        setRtbLoading(false);
      }
    };

    fetchRtbDetails();
    return () => controller.abort();
  }, [activeTenancyId]);

  // Map API response to component property format
  const displayProperty = fetchedProperty
    ? {
        id: fetchedProperty.id,
        name: fetchedProperty.name,
        address: fetchedProperty.address,
        area: fetchedProperty.area || fetchedProperty.county || "Dublin",
        type: fetchedProperty.propertyType,
        bedrooms: fetchedProperty.bedrooms,
        bathrooms: fetchedProperty.bathrooms,
        mprn: fetchedProperty.mprn,
        rent: `€${fetchedProperty.rent}`,
        eircode: fetchedProperty.eircode,
        status:
          fetchedProperty.status === "LET" ? "Let" : fetchedProperty.status,
        statusColor:
          fetchedProperty.status === "LET"
            ? "bg-teal-100 text-teal-700"
            : "bg-slate-100 text-slate-600",
        rtbNumber: fetchedProperty.rtbNumber,
        rtbRegistration: fetchedProperty.rtbRegistration,
        image: fetchedProperty.image,
        // Use fetched tenant data or fallback to mock
        rentDue: "1st of each month",
        rentLate:
          activeTenant?.rentStatus === "OVERDUE"
            ? `${Math.floor(Math.random() * 30)} Days Late`
            : null,
        tenant: activeTenant
          ? {
              name: activeTenant.user.name,
              email: activeTenant.user.email,
              phone: activeTenant.user.phone,
              since: new Date(activeTenant.startDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" },
              ),
            }
          : EMPTY_PROPERTY.tenant,
        tenancy: activeTenant
          ? {
              rtbNumber: activeTenant.tenancyId,
              registrationDate: new Date(
                activeTenant.startDate,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              expiryDate: new Date(activeTenant.endDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" },
              ),
              leaseStart: new Date(activeTenant.startDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" },
              ),
              leaseEnd: new Date(activeTenant.endDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" },
              ),
              rentReviewDate: "TBD",
              rentReviewFrequency: "Annual",
              noticeGiven:
                activeTenant.tenancyStatus === "NOTICE" ? "Yes" : "No",
              noticePeriod: "90 days",
            }
          : EMPTY_PROPERTY.tenancy,
      }
    : EMPTY_PROPERTY;

  const documentRows = Array.isArray(fetchedDocuments) ? fetchedDocuments : [];
  const maintenanceRows = Array.isArray(fetchedMaintenance)
    ? fetchedMaintenance
    : [];
  console.log(fetchedRtb);
  console.log(displayProperty);
  return (
    <PortalShell>
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">
              Loading property details...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-red-700">Error: {error}</p>
          <p className="text-xs text-red-600 mt-1">
            Unable to load property details. Please try again.
          </p>
        </div>
      )}

      {/* Content - show when loaded */}
      {!loading && (
        <>
          {/* Back link */}
          <Link
            href="/portal/properties"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium mb-4 transition"
          >
            <ArrowLeft size={15} /> Back to My Properties
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Home size={22} className="text-teal-600" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">
                    {displayProperty.address}
                  </h1>
                  <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <MapPin size={13} /> {displayProperty.area}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${displayProperty.statusColor}`}
                >
                  {displayProperty.status}
                </span>
                {displayProperty.rentLate && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                    <Clock size={11} /> Rent {displayProperty.rentLate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-4 overflow-x-auto shadow-sm">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
              ${
                activeTab === key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Property Details */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Home size={16} className="text-teal-600" /> Property Details
                </h2>
                <InfoRow label="Type" value={displayProperty.type} />
                <InfoRow label="Bedrooms" value={displayProperty.bedrooms} />
                <InfoRow label="Bathrooms" value={displayProperty.bathrooms} />
                <InfoRow label="Address" value={displayProperty.address} />
                <InfoRow label="Area" value={displayProperty.area} />
                <InfoRow label="MPRN" value={displayProperty.mprn} mono />
              </div>

              {/* Rent */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Euro size={16} className="text-teal-600" /> Rent
                </h2>
                <InfoRow label="Monthly Rent" value={displayProperty.rent} />
                <InfoRow label="Due Date" value={displayProperty.rentDue} />
                {displayProperty.rentLate && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3">
                    <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">
                      Status
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                      <AlertCircle size={13} /> Rent {displayProperty.rentLate}
                    </span>
                  </div>
                )}
              </div>

              {/* Assigned Tenant */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-2">
                <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <User size={16} className="text-teal-600" /> Assigned Tenant
                </h2>
                <InfoRow label="Name" value={displayProperty.tenant.name} />
                <InfoRow label="Email" value={displayProperty.tenant.email} />
                <InfoRow label="Phone" value={displayProperty.tenant.phone} />
                <InfoRow
                  label="Tenant Since"
                  value={displayProperty.tenant.since}
                />
              </div>
            </div>
          )}

          {/* Tab: Tenancy */}
          {activeTab === "tenancy" &&
            (activeTenant || fetchedRtb ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 max-w-2xl">
                <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <BadgeCheck size={16} className="text-teal-600" /> Tenancy
                  Details
                </h2>
                <InfoRow
                  label="RTB Number"
                  value={fetchedRtb?.rtbNumber || "—"}
                  mono
                />
                <InfoRow
                  label="RTB Registration Date"
                  value={formatDisplayDate(fetchedRtb?.rtbRegistrationDate)}
                />
                <InfoRow
                  label="Lease Start"
                  value={
                    fetchedRtb?.startDate
                      ? formatDisplayDate(fetchedRtb.startDate)
                      : displayProperty.tenancy.leaseStart
                  }
                />
                <InfoRow
                  label="Lease End"
                  value={displayProperty.tenancy.leaseEnd}
                />
                <InfoRow
                  label="Rent Review Date"
                  value={displayProperty.tenancy.rentReviewDate}
                />
                <InfoRow
                  label="Review Frequency"
                  value={displayProperty.tenancy.rentReviewFrequency}
                />
                <InfoRow
                  label="Notice Given"
                  value={displayProperty.tenancy.noticeGiven}
                />
                <InfoRow
                  label="Notice Period"
                  value={displayProperty.tenancy.noticePeriod}
                />
              </div>
            ) : (
              <EmptyTabState message="Not found" />
            ))}

          {/* Tab: Rent Payments */}
          {activeTab === "rent" &&
            (() => {
              const displayRentSummary = fetchedRentSummary || {
                monthlyRent: 0,
                totalCollected: 0,
                monthsPaid: 0,
                totalMonths: 0,
                overdueCount: 0,
                pendingCount: 0,
                rentDueDay: 0,
                year: new Date().getFullYear(),
              };

              const displayRentCalendar =
                fetchedRentCalendar && fetchedRentCalendar.length > 0
                  ? fetchedRentCalendar
                      .map((item) => ({
                        id: item.id,
                        month: item.month,
                        monthKey: item.monthKey,
                        amount: item.amount ? `€${item.amount}` : null,
                        status: item.status || "PENDING",
                        dueDate: item.dueDate,
                        paidDate: item.paidDate,
                        reference: item.reference,
                      }))
                      .filter((it) => it.id != null)
                  : [];

              const totalCollected =
                parseInt(displayRentSummary.totalCollected) || 0;
              const overdueCount =
                Number(displayRentSummary.overdueCount) || 0;
              const monthlyRent =
                parseInt(displayRentSummary.monthlyRent) || 0;
              const rentDueDay = Number(displayRentSummary.rentDueDay) || 0;

              const hasRentData =
                displayRentCalendar.length > 0 ||
                (Array.isArray(fetchedRentPayments) && fetchedRentPayments.length > 0) ||
                totalCollected > 0 ||
                monthlyRent > 0 ||
                overdueCount > 0 ||
                (Number(displayRentSummary.pendingCount) || 0) > 0;

              if (!rentPaymentsLoading && !hasRentData) {
                return <EmptyTabState message="Not found" />;
              }

              return (
                <div className="space-y-4">
                  {/* Monthly calendar grid */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <CalendarDays size={16} className="text-teal-600" />{" "}
                      Monthly Rent Calendar —{" "}
                      {displayRentSummary.year || new Date().getFullYear()}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {displayRentCalendar.map((r) => {
                        const status =
                          r.status === "PAID"
                            ? "Paid"
                            : r.status === "OVERDUE"
                              ? "Overdue"
                              : "Pending";
                        const s = rentStatusStyle[status];
                        const bgClass =
                          status === "Overdue"
                            ? "border-red-200 bg-red-50"
                            : status === "Paid"
                              ? "border-teal-100 bg-teal-50/50"
                              : "border-slate-100 bg-slate-50/40";
                        return (
                          <div
                            key={r.monthKey || r.month}
                            className={`rounded-xl border p-3 flex flex-col gap-1.5 ${bgClass}`}
                          >
                            <p className="text-xs font-bold text-slate-500">
                              {r.month}
                            </p>
                            <p className="text-sm font-bold text-slate-800">
                              {r.amount || "—"}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${s.badge}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                              />
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                      <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                        <Euro size={16} className="text-teal-600" /> Payment
                        History
                      </h2>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="payments-filter"
                          className="text-sm text-slate-500 hidden sm:block"
                        >
                          Filter:
                        </label>
                        <select
                          id="payments-filter"
                          value={rentPaymentsStatus}
                          onChange={(e) => {
                            setRentPaymentsStatus(e.target.value);
                            setRentPaymentsPage(1);
                          }}
                          className="text-sm px-3 py-1 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        >
                          <option value="ALL">All</option>
                          <option value="PAID">Paid</option>
                          <option value="PENDING">Pending</option>
                          <option value="OVERDUE">Overdue</option>
                        </select>
                      </div>
                    </div>
                    {/* Mobile: cards */}
                    <div className="lg:hidden divide-y divide-slate-100">
                      {rentPaymentsLoading ? (
                        <div className="px-5 py-8 text-center">
                          <div className="inline-flex items-center gap-3">
                            <div className="w-6 h-6 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-500">
                              Loading payments...
                            </p>
                          </div>
                        </div>
                      ) : Array.isArray(fetchedRentPayments) &&
                        fetchedRentPayments.length > 0 ? (
                        fetchedRentPayments.map((r, i) => {
                          const status =
                            r.status === "PAID"
                              ? "Paid"
                              : r.status === "OVERDUE"
                                ? "Overdue"
                                : "Pending";
                          const s = rentStatusStyle[status];
                          const dueDate = r.dueDate
                            ? new Date(r.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—";
                          const monthYear = r.month || "—";
                          const amount = r.amount ? `€${r.amount}` : "—";
                          return (
                            <div key={r.id || i} className="px-5 py-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-700">
                                    {monthYear}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {dueDate}
                                  </p>
                                  <p className="text-xs font-mono text-slate-400 mt-1">
                                    {r.reference || "—"}
                                  </p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                  <span className="text-sm font-bold text-slate-800">
                                    {amount}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.badge}`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                                    />
                                    {status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-5 py-8 text-center text-slate-500">
                          Not found
                        </div>
                      )}
                    </div>

                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                            <th className="text-left px-5 py-3">Month</th>
                            <th className="text-left px-5 py-3">Due Date</th>
                            <th className="text-left px-5 py-3">Reference</th>
                            <th className="text-left px-5 py-3">Status</th>
                            <th className="text-right px-5 py-3">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rentPaymentsLoading ? (
                            <tr>
                              <td colSpan={5} className="px-5 py-8 text-center">
                                <div className="inline-flex items-center gap-3">
                                  <div className="w-6 h-6 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                                  <p className="text-sm text-slate-500">
                                    Loading payments...
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : Array.isArray(fetchedRentPayments) &&
                            fetchedRentPayments.length > 0 ? (
                            fetchedRentPayments.map((r, i) => {
                              const status =
                                r.status === "PAID"
                                  ? "Paid"
                                  : r.status === "OVERDUE"
                                    ? "Overdue"
                                    : "Pending";
                              const s = rentStatusStyle[status];
                              const dueDate = r.dueDate
                                ? new Date(r.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "—";
                              const monthYear = r.month || "—";
                              const amount = r.amount ? `€${r.amount}` : "—";
                              return (
                                <tr
                                  key={r.id || i}
                                  className="hover:bg-slate-50/60 transition-colors"
                                >
                                  <td className="px-5 py-3 text-sm font-semibold text-slate-700">
                                    {monthYear}
                                  </td>
                                  <td className="px-5 py-3 text-sm text-slate-500">
                                    {dueDate}
                                  </td>
                                  <td className="px-5 py-3 font-mono text-xs text-slate-400">
                                    {r.reference || "—"}
                                  </td>
                                  <td className="px-5 py-3">
                                    <span
                                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badge}`}
                                    >
                                      {status}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3 text-right font-bold text-slate-800">
                                    {amount}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-5 py-8 text-center text-slate-500"
                              >
                                Not found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div>
                      <Pagination
                        total={rentPaymentsTotal}
                        itemsPerPage={rentPaymentsLimit}
                        currentPage={rentPaymentsPage}
                        onPageChange={(p) => setRentPaymentsPage(p)}
                        showItemsPerPage={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Tab: RTB Registration */}
          {activeTab === "rtb" &&
            (() => {
              if (!rtbLoading && !rtbError && !fetchedRtb) {
                return <EmptyTabState message="Not found" />;
              }

              const rtbRegistrationCode = fetchedRtb?.rtbRegistration;
              const registrationDate = formatDisplayDate(
                fetchedRtb?.rtbRegistrationDate,
              );
              const expiryDate = fetchedRtb?.rtbExpiryDate
                ? formatDisplayDate(fetchedRtb.rtbExpiryDate)
                : displayProperty.tenancy.expiryDate || "—";
              const rtbNumber =
                fetchedRtb?.rtbNumber ||
                displayProperty.tenancy.rtbNumber ||
                "—";
              const statusLabel =
                fetchedRtb?.rtbStatus ||
                (rtbRegistrationCode === "REGISTERED"
                  ? "Registered"
                  : rtbRegistrationCode || "Unknown");

              const statusStyles =
                rtbRegistrationCode === "REGISTERED"
                  ? {
                      card: "bg-teal-50 border-teal-200",
                      label: "text-teal-600",
                      value: "text-teal-700",
                      icon: <CheckCircle size={18} />,
                    }
                  : rtbRegistrationCode === "PENDING"
                    ? {
                        card: "bg-amber-50 border-amber-200",
                        label: "text-amber-600",
                        value: "text-amber-700",
                        icon: <AlertCircle size={18} />,
                      }
                    : {
                        card: "bg-slate-50 border-slate-200",
                        label: "text-slate-600",
                        value: "text-slate-700",
                        icon: <AlertCircle size={18} />,
                      };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* RTB Status Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <CheckCircle size={16} className="text-teal-600" /> RTB
                      Registration Status
                    </h2>
                    <div className="space-y-4">
                      {rtbLoading ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-sm text-slate-500">
                            Loading RTB details...
                          </p>
                        </div>
                      ) : rtbError ? (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                          <p className="text-sm font-semibold text-red-700">
                            Unable to load RTB details.
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            {rtbError}
                          </p>
                        </div>
                      ) : (
                        <div
                          className={`p-4 rounded-xl border ${statusStyles.card}`}
                        >
                          <p
                            className={`text-xs font-semibold uppercase mb-1 ${statusStyles.label}`}
                          >
                            Status
                          </p>
                          <p
                            className={`text-lg font-bold flex items-center gap-2 ${statusStyles.value}`}
                          >
                            {statusStyles.icon} {statusLabel}
                          </p>
                        </div>
                      )}

                      <InfoRow label="RTB Number" value={rtbNumber} mono />
                      <InfoRow
                        label="Registration Date"
                        value={registrationDate}
                      />
                      <InfoRow label="Expiry Date" value={expiryDate} />
                      <InfoRow
                        label="Tenancy ID"
                        value={fetchedRtb?.tenancyId || activeTenancyId || "—"}
                        mono
                      />
                    </div>
                  </div>

                  {/* Renewal & Documents removed per request */}
                </div>
              );
            })()}

          {/* Tab: Documents */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-teal-600" /> Documents
                </h2>
              </div>
              {/* Mobile */}
              <div className="lg:hidden divide-y divide-slate-100">
                {documentsLoading ? (
                  <div className="px-5 py-8 text-center">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-6 h-6 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                      <p className="text-sm text-slate-500">
                        Loading documents...
                      </p>
                    </div>
                  </div>
                ) : documentsError ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm font-semibold text-red-700">
                      Unable to load documents.
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {documentsError}
                    </p>
                  </div>
                ) : documentRows.length > 0 ? (
                  documentRows.map((d, i) => {
                    const displayType =
                      d.type === "LEASE"
                        ? "Lease"
                        : d.type === "RTB_REGISTRATION"
                          ? "RTB Registration"
                          : d.type || "—";
                    const docDate = d.createdAt
                      ? new Date(d.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";
                    const docSize = d.fileSize || "—";
                    const docUrl = d.fileUrl;
                    return (
                      <div key={d.id || i} className="px-5 py-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-700">
                            {d.name}
                          </p>
                          <span
                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${docTypeColors[d.type] || docTypeColors[displayType] || "bg-slate-100 text-slate-600"}`}
                          >
                            {displayType}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{docDate}</span>
                          <span>{docSize}</span>
                        </div>
                        {docUrl ? (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition"
                          >
                            <Download size={13} /> Download
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
                          >
                            <Download size={13} /> No Link
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-slate-500">Not found</p>
                  </div>
                )}
              </div>
              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                      <th className="text-left px-5 py-3">Document</th>
                      <th className="text-left px-5 py-4">Type</th>
                      <th className="text-left px-5 py-4">Date</th>
                      <th className="text-left px-5 py-4">Size</th>
                      <th className="text-right px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documentsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center">
                          <div className="inline-flex items-center gap-3">
                            <div className="w-6 h-6 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-500">
                              Loading documents...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : documentsError ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center">
                          <p className="text-sm font-semibold text-red-700">
                            Unable to load documents.
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            {documentsError}
                          </p>
                        </td>
                      </tr>
                    ) : documentRows.length > 0 ? (
                      documentRows.map((d, i) => {
                        const displayType =
                          d.type === "LEASE"
                            ? "Lease"
                            : d.type === "RTB_REGISTRATION"
                              ? "RTB Registration"
                              : d.type || "—";
                        const docDate = d.createdAt
                          ? new Date(d.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—";
                        const docSize = d.fileSize || "—";
                        const docUrl = d.fileUrl;
                        return (
                          <tr
                            key={d.id || i}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-5 py-4 text-base font-semibold text-slate-700">
                              {d.name}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`text-sm font-medium px-3 py-1 rounded-full ${docTypeColors[d.type] || docTypeColors[displayType] || "bg-slate-100 text-slate-600"}`}
                              >
                                {displayType}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-base text-slate-500">
                              {docDate}
                            </td>
                            <td className="px-5 py-4 text-base text-slate-400">
                              {docSize}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {docUrl ? (
                                <a
                                  href={docUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition"
                                >
                                  <Download size={15} /> Download
                                </a>
                              ) : (
                                <button
                                  disabled
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
                                >
                                  <Download size={15} /> No Link
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-8 text-center text-slate-500"
                        >
                          Not found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {documentsTotal > 0 && (
                <div>
                  <Pagination
                    total={documentsTotal}
                    itemsPerPage={documentsLimit}
                    currentPage={documentsPage}
                    onPageChange={(p) => setDocumentsPage(p)}
                    showItemsPerPage={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab: Maintenance */}
          {activeTab === "maintenance" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                  <Wrench size={16} className="text-teal-600" /> Maintenance
                </h2>
              </div>

              {/* Notice */}
              <div className="mx-5 mt-4 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <AlertCircle
                  size={16}
                  className="text-slate-400 shrink-0 mt-0.5"
                />
                <p className="text-sm text-slate-500">
                  Maintenance requests are submitted by tenants only. You can
                  view status below.
                </p>
              </div>

              {/* Mobile */}
              <div className="lg:hidden divide-y divide-slate-100 mt-4">
                {maintenanceLoading ? (
                  <div className="px-5 py-8 text-center">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-6 h-6 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                      <p className="text-sm text-slate-500">
                        Loading maintenance requests...
                      </p>
                    </div>
                  </div>
                ) : maintenanceError ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm font-semibold text-red-700">
                      Unable to load maintenance requests.
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {maintenanceError}
                    </p>
                  </div>
                ) : maintenanceRows.length > 0 ? (
                  maintenanceRows.map((m, i) => {
                    const status =
                      m.status === "IN_PROGRESS"
                        ? "In Progress"
                        : m.status === "CLOSED"
                          ? "Closed"
                          : "Pending";
                    const lastUpdated = m.updatedAt
                      ? new Date(m.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";
                    const assignedTo = m.assignedTo || "Unassigned";
                    return (
                      <div key={m.id || i} className="px-5 py-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-700">
                            {m.title || m.issue}
                          </p>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${priorityColors[m.priority] || "bg-slate-100 text-slate-600"}`}
                          >
                            {m.priority || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{status}</span>
                          <span>{lastUpdated}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Assigned: {assignedTo}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-slate-500">Not found</p>
                  </div>
                )}
              </div>

              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                      <th className="text-left px-5 py-3">Issue</th>
                      <th className="text-left px-5 py-4">Priority</th>
                      <th className="text-left px-5 py-4">Status</th>
                      <th className="text-left px-5 py-4">Assigned To</th>
                      <th className="text-left px-5 py-4">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {maintenanceLoading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center">
                          <div className="inline-flex items-center gap-3">
                            <div className="w-6 h-6 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-500">
                              Loading maintenance requests...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : maintenanceError ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center">
                          <p className="text-sm font-semibold text-red-700">
                            Unable to load maintenance requests.
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            {maintenanceError}
                          </p>
                        </td>
                      </tr>
                    ) : maintenanceRows.length > 0 ? (
                      maintenanceRows.map((m, i) => {
                        const status =
                          m.status === "IN_PROGRESS"
                            ? "In Progress"
                            : m.status === "CLOSED"
                              ? "Closed"
                              : "Pending";
                        const lastUpdated = m.updatedAt
                          ? new Date(m.updatedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—";
                        return (
                          <tr
                            key={m.id || i}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-5 py-4 text-base font-semibold text-slate-700">
                              {m.title || m.issue}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${priorityColors[m.priority] || "bg-slate-100 text-slate-600"}`}
                              >
                                {m.priority || "—"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-base text-slate-600">
                              {status}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-500">
                              {m.assignedTo || "Unassigned"}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-400">
                              {lastUpdated}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-8 text-center text-slate-500"
                        >
                          Not found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {maintenanceTotal > 0 && (
                <div>
                  <Pagination
                    total={maintenanceTotal}
                    itemsPerPage={maintenanceLimit}
                    currentPage={maintenancePage}
                    onPageChange={(p) => setMaintenancePage(p)}
                    showItemsPerPage={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Notes tab removed for landlord view */}
        </>
      )}
    </PortalShell>
  );
}
