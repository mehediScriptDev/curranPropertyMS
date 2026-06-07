"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Home,
  FileText,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Shield,
  Plus,
  Edit,
  Download,
  BadgeCheck,
  Key,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { authenticatedFetch } from "@/utils/authFetch";
import Pagination from "@/components/portal/Pagination";

/* ─── Mock data (replace with Supabase query) ─── */
const landlord = {
  id: "2",
  name: "Joan Doyle",
  initials: "JD",
  color: "bg-teal-500",
  dob: "14 Mar 1972",
  pps: "3276513B",
  email: "joan.doyle@email.com",
  mobile: "085-323-8927",
  address: "28 Perkside Plaza, Dublin 4",
};

// properties list is loaded from the API per-landlord (see fetch below)

const documents = [
  {
    name: "Landlord Agreement 2022.pdf",
    type: "Agreement",
    date: "Oct 10, 2022",
    size: "248 KB",
  },
  {
    name: "PPS Verification.pdf",
    type: "ID",
    date: "Sep 1, 2021",
    size: "90 KB",
  },
];

const auditLog = [
  {
    ts: "2024-03-01 09:14:22",
    adminId: "SQ01",
    user: "Sarah Quinn",
    action: "Updated Landlord Email",
    entity: "Landlord",
    ip: "192.168.1.45",
  },
  {
    ts: "2024-01-10 14:20:00",
    adminId: "JM01",
    user: "John McCann",
    action: "Added Landlord",
    entity: "Landlord",
    ip: "192.168.1.40",
  },
];

const TABS = [
  { key: "Details", label: "Details", Icon: User  },
  { key: "properties", label: "Properties", Icon: Home },
  { key: "finances", label: "Finances", Icon: TrendingUp },
  { key: "rtb", label: "RTB Registration", Icon: Key },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "audit", label: "Audit", Icon: ClipboardList },
];

const LANDLORD_FINANCE_MAP = {
  2: "landlord-1",
};

const PROPERTY_VALUATIONS = {
  1: 420000,
  2: 485000,
  3: 390000,
  4: 430000,
};

const rtbRegistrations = [
  {
    id: "1",
    property: "Apt 5B Rosewood Close",
    rtbNumber: "RTB-2022-10-456782",
    status: "Registered",
    regDate: "5 Nov 2022",
    expiryDate: "4 Nov 2026",
    tenant: "Kevin Madden",
    daysToExpiry: 238,
  },
  {
    id: "2",
    property: "Apt 306 Fairview Rd",
    rtbNumber: "RTB-2021-06-334411",
    status: "Registered",
    regDate: "12 Jun 2021",
    expiryDate: "11 Jun 2025",
    tenant: "Stephen Blake",
    daysToExpiry: -274,
  },
  {
    id: "3",
    property: "Apt 22 Parkside Plaza",
    rtbNumber: "—",
    status: "Pending",
    regDate: "—",
    expiryDate: "—",
    tenant: "—",
    daysToExpiry: null,
  },
];

const docTypeColors = {
  Agreement: "bg-blue-50 text-blue-700",
  ID: "bg-purple-50 text-purple-700",
};

function mapPropertyStatus(status) {
  const s = (status || "").toString().toUpperCase();
  if (s === "LET") return { label: "Let", color: "bg-teal-100 text-teal-700" };
  if (s === "NOTICE")
    return { label: "Notice", color: "bg-amber-100 text-amber-600" };
  if (s === "VACANT")
    return { label: "Vacant", color: "bg-slate-100 text-slate-500" };
  return {
    label: s ? s[0] + s.slice(1).toLowerCase() : "Unknown",
    color: "bg-slate-100 text-slate-500",
  };
}

function InfoRow({ label, value, mono = false, masked = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">
        {label}
      </p>
      {children ?? (
        <p
          className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}
        >
          {masked ? "••••••••" : value}
        </p>
      )}
    </div>
  );
}

export default function AdminLandlordProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Details");
  const [showPps, setShowPps] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Landlord data (fetched from API)
  const [landlord, setLandlord] = useState(null);
  const [landlordLoading, setLandlordLoading] = useState(false);
  const [landlordError, setLandlordError] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [landlordDetails, setLandlordDetails] = useState(null);

  // Handle starting a conversation
  const handleStartConversation = async () => {
    if (!landlord?.id) return;
    try {
      setContactLoading(true);
      const res = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId: landlord.id }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || `Failed to start conversation (${res.status})`,
        );
      }
      const result = await res.json();
      const conversationId = result.data?.id || result.data?.conversationId;
      if (conversationId) {
        router.push(`/admin/messages?conversationId=${conversationId}`);
      } else {
        throw new Error("No conversation ID returned");
      }
    } catch (err) {
      console.error("Error starting conversation:", err);
      alert(
        "Failed to start conversation: " + (err.message || "Unknown error"),
      );
    } finally {
      setContactLoading(false);
    }
  };

  // Fetch landlord details
  useEffect(() => {
    let mounted = true;
    const fetchLandlord = async () => {
      if (!id) return;
      try {
        setLandlordLoading(true);
        setLandlordError(null);
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`,
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message || `Failed to load landlord (${res.status})`,
          );
        }
        const result = await res.json();
        if (result.success && result.data) {
          const user = result.data;
          // Generate initials
          const initials = (user.name && user.name.trim() ? user.name : "NA")
            .split(" ")
            .map((p) => p[0] || "")
            .join("")
            .toUpperCase()
            .substring(0, 2);
          // Get a color (simple approach: use hash of id)
          const colors = [
            "bg-teal-500",
            "bg-indigo-500",
            "bg-orange-500",
            "bg-sky-600",
            "bg-emerald-600",
          ];
          const colorIndex =
            (user.id ? user.id.charCodeAt(0) : 0) % colors.length;
          if (mounted) {
            setLandlord({
              id: user.id,
              name: user.name || "N/A",
              initials,
              color: colors[colorIndex],
              email: user.email || "N/A",
              mobile: user.phone || "N/A",
              address: user.address || "N/A",
              dob: user.profile?.dateOfBirth
                ? new Date(user.profile.dateOfBirth).toLocaleDateString("en-IE")
                : "N/A",
              pps: user.ppsNumber || "N/A",
            });
            // Store full details for Details tab
            setLandlordDetails(result.data);
          }
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        if (mounted) {
          setLandlordError(err.message || "Failed to load landlord");
          console.error("Landlord fetch error:", err);
        }
      } finally {
        if (mounted) setLandlordLoading(false);
      }
    };
    fetchLandlord();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Landlord properties (loaded from API)
  const [landlordProperties, setLandlordProperties] = useState([]);
  const [propsLoading, setPropsLoading] = useState(false);
  const [propsError, setPropsError] = useState(null);
  const [propsPage, setPropsPage] = useState(1);
  const [propsItemsPerPage, setPropsItemsPerPage] = useState(10);
  const [propsTotalItems, setPropsTotalItems] = useState(0);
  const [propsTotalPages, setPropsTotalPages] = useState(1);

  // Tenancies (RTB) - server driven for RTB tab
  const [tenancies, setTenancies] = useState([]);
  const [tenanciesLoading, setTenanciesLoading] = useState(false);
  const [tenanciesError, setTenanciesError] = useState(null);
  const [tenanciesPage, setTenanciesPage] = useState(1);
  const [tenanciesItemsPerPage, setTenanciesItemsPerPage] = useState(10);
  const [tenanciesTotalItems, setTenanciesTotalItems] = useState(0);
  const [tenanciesTotalPages, setTenanciesTotalPages] = useState(1);
  const [rtbFilter, setRtbFilter] = useState("");
  const [financeOverview, setFinanceOverview] = useState(null);
  const [financeLoading, setFinanceLoading] = useState(false);
  const [financeError, setFinanceError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  // Per-property pagination (client-side)
  const [propPage, setPropPage] = useState(1);
  const [expandedProp, setExpandedProp] = useState(null);
  const PROP_ITEMS_PER_PAGE = 5;
  // Documents (server-driven)
  const [landlordDocuments, setLandlordDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState(null);
  const [docsPage, setDocsPage] = useState(1);
  const [docsItemsPerPage, setDocsItemsPerPage] = useState(10);
  const [docsTotalItems, setDocsTotalItems] = useState(0);
  const [docsTotalPages, setDocsTotalPages] = useState(1);

  // Audit logs (server-driven)
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState(null);
  const [auditPage, setAuditPage] = useState(1);
  const [auditItemsPerPage, setAuditItemsPerPage] = useState(10);
  const [auditTotalItems, setAuditTotalItems] = useState(0);
  const [auditTotalPages, setAuditTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetchOverview = async () => {
      setFinanceLoading(true);
      try {
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rent-payments/admin/landlord/${id}/overview`,
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message || `Failed to load finances (${res.status})`,
          );
        }
        const result = await res.json();
        const data = result.data || null;
        if (mounted) {
          setFinanceOverview(data);
          setSelectedYear(data?.year ?? new Date().getFullYear());
        }
      } catch (err) {
        console.error("Finance overview error:", err);
        if (mounted) setFinanceError(err.message || "Failed to load finances");
      } finally {
        if (mounted) setFinanceLoading(false);
      }
    };
    fetchOverview();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Fetch properties for this landlord (dynamic landlordId = route id) - server-side pagination
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const fetchProperties = async () => {
      setPropsLoading(true);
      setPropsError(null);
      try {
        const params = new URLSearchParams();
        if (id) params.append("landlordId", id);
        params.append("page", String(propsPage));
        params.append("limit", String(propsItemsPerPage));

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties?${params.toString()}`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message || `Failed to load properties (${res.status})`,
          );
        }
        const result = await res.json();
        const items = result.data || [];
        const mapped = items.map((p) => {
          const s = mapPropertyStatus(p.status);
          return {
            id: p.id,
            name: p.name || p.address || "",
            address: p.address || "",
            status: s.label,
            statusColor: s.color,
            eircode: p.eircode || "–",
            rent: Number(p.rent) || 0,
            rtb: p.rtbRegistration
              ? p.rtbRegistration === "REGISTERED"
                ? "Registered"
                : p.rtbRegistration[0] +
                  p.rtbRegistration.slice(1).toLowerCase()
              : "—",
          };
        });

        const pagination = result.meta?.pagination || {};
        const total = pagination.totalItems ?? items.length ?? 0;
        const totalPages =
          pagination.totalPages ??
          Math.max(1, Math.ceil(total / propsItemsPerPage));

        if (mounted) {
          setLandlordProperties(mapped);
          setPropsTotalItems(total);
          setPropsTotalPages(totalPages);
        }
      } catch (err) {
        if (err && err.name === "AbortError") return;
        if (mounted) setPropsError(err.message || "Failed to load properties");
        console.error("Properties fetch error:", err);
      } finally {
        if (mounted) setPropsLoading(false);
      }
    };
    if (id) fetchProperties();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, propsPage, propsItemsPerPage]);

  // Keep page within range when total items or itemsPerPage change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(propsTotalItems / propsItemsPerPage));
    if (propsPage > total) setPropsPage(1);
  }, [propsTotalItems, propsItemsPerPage]);

  // Reset page when landlord id changes
  useEffect(() => {
    setPropsPage(1);
  }, [id]);

  // Reset tenancies page when landlord id changes
  useEffect(() => {
    setTenanciesPage(1);
  }, [id]);

  // Reset tenancies page when filter changes
  useEffect(() => {
    setTenanciesPage(1);
  }, [rtbFilter]);

  // Fetch tenancies for RTB tab with optional rtbRegistration filter
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const fetchTenancies = async () => {
      setTenanciesLoading(true);
      setTenanciesError(null);
      try {
        const params = new URLSearchParams();
        if (id) params.append("landlordId", id);
        params.append("page", String(tenanciesPage));
        params.append("limit", String(tenanciesItemsPerPage));
        if (rtbFilter) params.append("rtbRegistration", rtbFilter);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies?${params.toString()}`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message || `Failed to load tenancies (${res.status})`,
          );
        }
        const result = await res.json();
        const items = result.data || [];
        const mapped = items.map((t) => {
          const expiry = t.rtbExpiryDate ? new Date(t.rtbExpiryDate) : null;
          const today = new Date();
          const daysToExpiry = expiry
            ? Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
            : null;
          return {
            id: t.id,
            propertyId: t.property?.id || null,
            propertyName: t.property?.name || t.property?.address || "",
            rtbNumber: t.rtbNumber || "—",
            tenantName: t.tenant?.name || "—",
            rtbRegistration: t.rtbRegistration || "—",
            createdAt: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString()
              : "—",
            daysToExpiry,
          };
        });

        const pagination = result.meta?.pagination || {};
        const total = pagination.totalItems ?? items.length ?? 0;
        const totalPages =
          pagination.totalPages ??
          Math.max(1, Math.ceil(total / tenanciesItemsPerPage));

        if (mounted) {
          setTenancies(mapped);
          setTenanciesTotalItems(total);
          setTenanciesTotalPages(totalPages);
        }
      } catch (err) {
        if (err && err.name === "AbortError") return;
        if (mounted)
          setTenanciesError(err.message || "Failed to load tenancies");
        console.error("Tenancies fetch error:", err);
      } finally {
        if (mounted) setTenanciesLoading(false);
      }
    };

    if (activeTab === "rtb" && id) fetchTenancies();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, activeTab, tenanciesPage, tenanciesItemsPerPage, rtbFilter]);

  // Keep tenancies page within range when totals change
  useEffect(() => {
    const total = Math.max(
      1,
      Math.ceil(tenanciesTotalItems / tenanciesItemsPerPage),
    );
    if (tenanciesPage > total) setTenanciesPage(1);
  }, [tenanciesTotalItems, tenanciesItemsPerPage]);

  // Fetch documents for landlord when Documents tab is active
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const fetchDocs = async () => {
      setDocsLoading(true);
      setDocsError(null);
      try {
        const params = new URLSearchParams();
        if (id) params.append("landlordId", id);
        params.append("page", String(docsPage));
        params.append("limit", String(docsItemsPerPage));

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents?${params.toString()}`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message || `Failed to load documents (${res.status})`,
          );
        }
        const result = await res.json();
        const items = result.data || [];
        const mapped = items.map((d) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          fileUrl: d.fileUrl,
          size: d.fileSize || d.size || "—",
          propertyId: d.propertyId,
          property: d.property || null,
          uploadedBy: d.uploadedBy || null,
          createdAt: d.createdAt
            ? new Date(d.createdAt).toLocaleDateString()
            : "—",
        }));

        const pagination = result.meta?.pagination || {};
        const total = pagination.totalItems ?? mapped.length ?? 0;
        const totalPages =
          pagination.totalPages ??
          Math.max(1, Math.ceil(total / docsItemsPerPage));

        if (mounted) {
          setLandlordDocuments(mapped);
          setDocsTotalItems(total);
          setDocsTotalPages(totalPages);
        }
      } catch (err) {
        if (err && err.name === "AbortError") return;
        console.error("Documents fetch error:", err);
        if (mounted) setDocsError(err.message || "Failed to load documents");
      } finally {
        if (mounted) setDocsLoading(false);
      }
    };

    if (activeTab === "documents" && id) fetchDocs();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, activeTab, docsPage, docsItemsPerPage]);

  // Keep documents page within range if totals change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(docsTotalItems / docsItemsPerPage));
    if (docsPage > total) setDocsPage(1);
  }, [docsTotalItems, docsItemsPerPage]);

  // Fetch audit logs for landlord when Audit tab is active
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const fetchAudit = async () => {
      setAuditLoading(true);
      setAuditError(null);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/audit-logs/user/${id}?page=${auditPage}&limit=${auditItemsPerPage}`;
        const res = await authenticatedFetch(url, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message || `Failed to load audit logs (${res.status})`,
          );
        }
        const result = await res.json();
        const items = result.data || [];
        const mapped = items.map((a) => ({
          id: a.id,
          action: a.action,
          target: a.target,
          createdAt: a.createdAt ? new Date(a.createdAt).toLocaleString() : "—",
          user: a.user || null,
        }));

        const pagination = result.meta?.pagination || {};
        const total = pagination.totalItems ?? mapped.length ?? 0;
        const totalPages =
          pagination.totalPages ??
          Math.max(1, Math.ceil(total / auditItemsPerPage));

        if (mounted) {
          setAuditLogs(mapped);
          setAuditTotalItems(total);
          setAuditTotalPages(totalPages);
        }
      } catch (err) {
        if (err && err.name === "AbortError") return;
        console.error("Audit fetch error:", err);
        if (mounted) setAuditError(err.message || "Failed to load audit logs");
      } finally {
        if (mounted) setAuditLoading(false);
      }
    };

    if (activeTab === "audit" && id) fetchAudit();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, activeTab, auditPage, auditItemsPerPage]);

  // Keep audit page within range if totals change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(auditTotalItems / auditItemsPerPage));
    if (auditPage > total) setAuditPage(1);
  }, [auditTotalItems, auditItemsPerPage]);

  const chartData = (financeOverview?.propertyBreakdown || []).map((p) => ({
    name: p.propertyName,
    collected: p.collected || 0,
    pending: p.pending || 0,
  }));

  const propertyRows = (financeOverview?.propertyBreakdown || []).map((p) => ({
    propertyId: p.propertyId,
    propertyName: p.propertyName,
    propertyAddress: p.propertyAddress,
    monthlyRent: p.monthlyRent,
    collected: p.collected,
    overdue: p.overdue,
    pending: p.pending,
    paymentsCount: p.paymentsCount,
  }));

  // Pagination helpers for per-property breakdown
  const totalProperties = propertyRows.length;
  const totalPropPages = Math.max(
    1,
    Math.ceil(totalProperties / PROP_ITEMS_PER_PAGE),
  );
  const propStartIndex = (propPage - 1) * PROP_ITEMS_PER_PAGE;
  const propEndIndex = Math.min(
    propStartIndex + PROP_ITEMS_PER_PAGE,
    totalProperties,
  );
  const paginatedProperties = propertyRows.slice(propStartIndex, propEndIndex);

  // Keep page within range if data changes
  useEffect(() => {
    if (propPage > totalPropPages) setPropPage(1);
  }, [totalProperties, totalPropPages]);

  const getPropPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, propPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPropPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPropPages) {
      if (end < totalPropPages - 1) pages.push("...");
      pages.push(totalPropPages);
    }
    return pages;
  };

  const totals = {
    rent: financeOverview?.totalCollected ?? 0,
    deductions: 0,
    net: financeOverview?.totalCollected ?? 0,
    maintenance: 0,
  };

  const portfolioValuation = propertyRows.reduce(
    (sum, r) => sum + (PROPERTY_VALUATIONS[r.propertyId] || 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link
        href="/admin/landlords"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition"
      >
        <ArrowLeft size={15} /> Back to Landlords
      </Link>

      {/* Loading State */}
      {landlordLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-slate-600">Loading landlord...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {landlordError && !landlordLoading && (
        <div className="bg-red-50 rounded-2xl border border-red-200 shadow-sm p-4">
          <p className="text-red-800 font-medium">Error: {landlordError}</p>
        </div>
      )}

      {/* Header */}
      {!landlordLoading && landlord && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${landlord.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}
            >
              {landlord.initials}
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
                {landlord.name}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin size={13} />
                {landlord.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartConversation}
              disabled={contactLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail size={14} className="text-teal-600" />{" "}
              {contactLoading ? "Starting..." : "Contact"}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      {!landlordLoading && landlord && (
        <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
              ${activeTab === key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Overview removed by request */}

      {/* ── Details Tab ── */}
      {activeTab === "Details" && landlordDetails && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-teal-600" />
              Landlord Details
            </h2>
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={landlordDetails.name || "N/A"} />
              <InfoRow label="Email" value={landlordDetails.email || "N/A"} />
              <InfoRow label="Password" mono>
                {landlordDetails.password ? (
                  <div className="flex items-center gap-3">
                    <p className="text-base font-semibold font-mono">
                      {showPassword ? landlordDetails.password : "••••••••"}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                ) : (
                  <p className="text-base text-slate-500">N/A</p>
                )}
              </InfoRow>
              <InfoRow label="Phone" value={landlordDetails.phone || "N/A"} />
              <InfoRow label="Address" value={landlordDetails.address || "N/A"} />
              <InfoRow 
                label="PPS Number" 
                value={landlordDetails.ppsNumber || "N/A"} 
                mono
                masked={!showPps}
              >
                {landlordDetails.ppsNumber && (
                  <div className="flex items-center gap-3">
                    <p className={`text-base font-semibold font-mono ${showPps ? "" : ""}`}>
                      {showPps ? landlordDetails.ppsNumber : "••••••••"}
                    </p>
                    <button
                      onClick={() => setShowPps(!showPps)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {showPps ? "Hide" : "Show"}
                    </button>
                  </div>
                )}
              </InfoRow>
              <InfoRow 
                label="Company Name" 
                value={landlordDetails.profile?.companyName || "N/A"} 
              />
              <InfoRow 
                label="CRO" 
                value={landlordDetails.profile?.pps2 || "N/A"} 
                mono
              />
              <InfoRow 
                label="Date of Birth" 
                value={landlordDetails.profile?.dateOfBirth 
                  ? new Date(landlordDetails.profile.dateOfBirth).toLocaleDateString()
                  : "N/A"} 
              />
              <InfoRow 
                label="Member Since" 
                value={landlordDetails.createdAt 
                  ? new Date(landlordDetails.createdAt).toLocaleDateString()
                  : "N/A"} 
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Properties ── */}
      {activeTab === "properties" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Home size={16} className="text-teal-600" />
              Properties
            </h2>
          </div>
          <div className="overflow-x-auto">
            {propsLoading ? (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">Loading properties...</p>
              </div>
            ) : propsError ? (
              <div className="p-6 text-center">
                <p className="text-sm text-rose-600">
                  Failed to load properties: {propsError}
                </p>
              </div>
            ) : (
              <>
                {landlordProperties.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No data found for this section.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile cards (visible on small screens) */}
                    <div className="lg:hidden p-3 space-y-3">
                      {landlordProperties.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {p.name || p.address}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {p.address}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${p.statusColor}`}
                              >
                                {p.status}
                              </div>
                              <div className="text-sm font-bold text-slate-900">
                                €{(p.rent ?? 0).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                              Eircode:{" "}
                              <span className="text-slate-700 font-medium">
                                {p.eircode}
                              </span>
                            </div>
                            <Link
                              href={`/admin/properties/${p.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"
                            >
                              <BadgeCheck size={13} /> View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mobile pagination for properties */}
                    {propsTotalItems > propsItemsPerPage && (
                      <div className="lg:hidden mt-2">
                        <div className="flex items-center justify-between px-3 py-3 border-t border-slate-100">
                          <div className="text-sm text-slate-500">
                            {Math.max(
                              1,
                              (propsPage - 1) * propsItemsPerPage + 1,
                            )}
                            -
                            {Math.min(
                              propsPage * propsItemsPerPage,
                              propsTotalItems,
                            )}{" "}
                            of {propsTotalItems}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setPropsPage((p) => Math.max(1, p - 1))
                              }
                              disabled={propsPage === 1}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 rounded-lg"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 text-white font-semibold text-sm">
                              {propsPage}
                            </span>
                            <button
                              onClick={() =>
                                setPropsPage((p) =>
                                  Math.min(propsTotalPages, p + 1),
                                )
                              }
                              disabled={propsPage === propsTotalPages}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 rounded-lg"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Desktop table (hidden on small screens) */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                            <th className="text-left px-5 py-3">Address</th>
                            <th className="text-left px-5 py-3">Status</th>
                            <th className="text-left px-5 py-3">Eircode</th>
                            <th className="text-left px-5 py-3">Rent</th>
                            <th className="text-left px-5 py-3">RTB</th>
                            <th className="text-right px-5 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {landlordProperties.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-5 py-4 font-semibold text-slate-700">
                                {p.name || p.address}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.statusColor}`}
                                >
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-slate-600 text-sm">
                                {p.eircode}
                              </td>
                              <td className="px-5 py-4 font-bold text-slate-700">
                                €{(p.rent ?? 0).toLocaleString()}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">
                                {p.rtb}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <Link
                                  href={`/admin/properties/${p.id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"
                                >
                                  <BadgeCheck size={13} /> View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <Pagination
                        total={propsTotalItems}
                        itemsPerPage={propsItemsPerPage}
                        currentPage={propsPage}
                        onPageChange={(p) => setPropsPage(p)}
                        onItemsPerPageChange={(n) => setPropsItemsPerPage(n)}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Finances ── */}
      {activeTab === "finances" && (
        <div className="space-y-4">
          {financeLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <p className="text-sm text-slate-500">Loading finances...</p>
            </div>
          ) : financeError ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <p className="text-sm text-rose-600">
                Failed to load finances: {financeError}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <TrendingUp size={16} className="text-teal-600" /> Landlord
                    Finances
                  </h2>
                  <div className="px-3 py-2 rounded-lg text-sm text-slate-700 border border-slate-200">
                    {selectedYear ??
                      financeOverview?.year ??
                      new Date().getFullYear()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Rent Collected
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      €{(financeOverview?.totalCollected ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-100 p-4 bg-rose-50/40">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Total Overdue
                    </p>
                    <p className="text-2xl font-bold text-rose-600 mt-1">
                      €{(financeOverview?.totalOverdue ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-teal-100 p-4 bg-teal-50/40">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Total Pending
                    </p>
                    <p className="text-2xl font-bold text-teal-700 mt-1">
                      €{(financeOverview?.totalPending ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-100 p-4 bg-amber-50/40">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Properties
                    </p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">
                      {financeOverview?.totalProperties ?? 0}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      All units combined
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  Per-Property Collected vs Pending
                </h3>
                {chartData.length === 0 ? (
                  <div className="h-[260px] flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/40">
                    <p className="text-sm text-slate-500">
                      No finance data found for this section.
                    </p>
                  </div>
                ) : (
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="#eef2f7"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [
                            `€${value.toLocaleString()}`,
                            "",
                          ]}
                        />
                        <Bar
                          dataKey="collected"
                          fill="#14b8a6"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="pending"
                          fill="#0f766e"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-700">
                    Per-Property Breakdown (
                    {selectedYear ??
                      financeOverview?.year ??
                      new Date().getFullYear()}
                    )
                  </h3>
                  <p className="text-sm text-slate-500">
                    Total Pending: €
                    {(financeOverview?.totalPending ?? 0).toLocaleString()}
                  </p>
                </div>

                {totalProperties === 0 ? (
                  <div className="p-5 text-center text-sm text-slate-500">
                    No per-property finance data found for this section.
                  </div>
                ) : (
                  <>
                    {/* Accordion mobile list */}
                    <div className="p-2 lg:hidden space-y-2">
                      {paginatedProperties.map((row) => {
                        const isOpen = expandedProp === row.propertyId;
                        return (
                          <div
                            key={row.propertyId}
                            className="border border-slate-100 rounded-lg overflow-hidden bg-white"
                          >
                            <button
                              onClick={() =>
                                setExpandedProp(isOpen ? null : row.propertyId)
                              }
                              className="w-full p-3 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0 text-left">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {row.propertyName}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {row.propertyAddress}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-semibold">
                                  €{(row.monthlyRent ?? 0).toLocaleString()}
                                </div>
                                <ChevronRight
                                  size={18}
                                  className={`text-slate-400 transition-transform ${isOpen ? "rotate-90" : "rotate-0"}`}
                                />
                              </div>
                            </button>

                            {isOpen && (
                              <div className="px-3 pb-3 pt-0 border-t border-slate-100">
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <div className="text-slate-400">
                                      Collected
                                    </div>
                                    <div className="font-semibold text-slate-800">
                                      €{(row.collected ?? 0).toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400">
                                      Overdue
                                    </div>
                                    <div className="font-semibold text-rose-600">
                                      €{(row.overdue ?? 0).toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-slate-400">
                                      Pending
                                    </div>
                                    <div className="font-semibold text-amber-700">
                                      €{(row.pending ?? 0).toLocaleString()}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                                  <span>
                                    Payments: {row.paymentsCount ?? 0}
                                  </span>
                                  <Link
                                    href={`/admin/properties/${row.propertyId}`}
                                    className="text-teal-600 font-semibold text-sm"
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Pagination for mobile */}
                      {totalProperties > PROP_ITEMS_PER_PAGE && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between px-2 py-3 border-t border-slate-100">
                            <div className="text-sm text-slate-500">
                              {propStartIndex + 1}-{propEndIndex} of{" "}
                              {totalProperties}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setPropPage((p) => Math.max(1, p - 1))
                                }
                                disabled={propPage === 1}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 rounded-lg"
                              >
                                <ChevronLeft size={18} />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 text-white font-semibold text-sm">
                                {propPage}
                              </span>
                              <button
                                onClick={() =>
                                  setPropPage((p) =>
                                    Math.min(totalPropPages, p + 1),
                                  )
                                }
                                disabled={propPage === totalPropPages}
                                className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 rounded-lg"
                              >
                                <ChevronRight size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                            <th className="text-left px-5 py-3">Property</th>
                            <th className="text-right px-5 py-3">
                              Monthly Rent
                            </th>
                            <th className="text-right px-5 py-3">Collected</th>
                            <th className="text-right px-5 py-3">Overdue</th>
                            <th className="text-right px-5 py-3">Pending</th>
                            <th className="text-right px-5 py-3">Payments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedProperties.map((row) => (
                            <tr
                              key={row.propertyId}
                              className="hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-5 py-4 font-semibold text-slate-700 text-sm">
                                {row.propertyName}
                                <div className="text-xs text-slate-400">
                                  {row.propertyAddress}
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right text-slate-700">
                                €{(row.monthlyRent ?? 0).toLocaleString()}
                              </td>
                              <td className="px-5 py-4 text-right text-slate-700">
                                €{(row.collected ?? 0).toLocaleString()}
                              </td>
                              <td className="px-5 py-4 text-right text-rose-600">
                                €{(row.overdue ?? 0).toLocaleString()}
                              </td>
                              <td className="px-5 py-4 text-right text-amber-700">
                                €{(row.pending ?? 0).toLocaleString()}
                              </td>
                              <td className="px-5 py-4 text-right text-slate-700">
                                {row.paymentsCount ?? 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Desktop pagination */}
                      {totalProperties > PROP_ITEMS_PER_PAGE && (
                        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="text-sm text-slate-500">
                            {propStartIndex + 1}-{propEndIndex} of{" "}
                            {totalProperties}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setPropPage((p) => Math.max(1, p - 1))
                              }
                              disabled={propPage === 1}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 rounded-lg"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <div className="hidden sm:flex items-center gap-1">
                              {getPropPageNumbers().map((page, idx) =>
                                page === "..." ? (
                                  <span
                                    key={`ellipsis-${idx}`}
                                    className="px-2 py-1.5 text-slate-400 font-medium"
                                  >
                                    …
                                  </span>
                                ) : (
                                  <button
                                    key={page}
                                    onClick={() => setPropPage(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold text-sm transition ${propPage === page ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
                                  >
                                    {page}
                                  </button>
                                ),
                              )}
                            </div>
                            <span className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 text-white font-semibold text-sm">
                              {propPage}
                            </span>
                            <button
                              onClick={() =>
                                setPropPage((p) =>
                                  Math.min(totalPropPages, p + 1),
                                )
                              }
                              disabled={propPage === totalPropPages}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 disabled:text-slate-300 rounded-lg"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── RTB Registration ── */}
      {activeTab === "rtb" && (
        <div className="space-y-4">
          {/* Summary banner */}
          {tenancies.some(
            (t) =>
              t.daysToExpiry !== null &&
              t.daysToExpiry <= 30 &&
              t.daysToExpiry >= 0,
          ) && (
            <div className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertTriangle
                size={18}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <p className="text-sm text-amber-800 font-medium">
                One or more RTB registrations expire within 30 days. Please
                renew promptly to avoid compliance issues.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <Key size={16} className="text-teal-600" />
                <h2 className="text-base font-bold text-slate-700 truncate">
                  RTB Registrations per Property
                </h2>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                <div className="text-sm text-slate-500">Filter:</div>
                <select
                  value={rtbFilter}
                  onChange={(e) => setRtbFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition hover:border-slate-400 w-full sm:w-40"
                >
                  <option value="">All</option>
                  <option value="REGISTERED">Registered</option>
                  <option value="MISSING">Missing</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              {tenanciesLoading ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500">Loading tenancies...</p>
                </div>
              ) : tenanciesError ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-rose-600">
                    Failed to load tenancies: {tenanciesError}
                  </p>
                </div>
              ) : tenancies.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500">No tenancies found.</p>
                </div>
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="lg:hidden p-3 space-y-3">
                    {tenancies.map((t) => {
                      const expiring =
                        t.daysToExpiry !== null &&
                        t.daysToExpiry <= 30 &&
                        t.daysToExpiry >= 0;
                      const expired =
                        t.daysToExpiry !== null && t.daysToExpiry < 0;
                      return (
                        <div
                          key={t.id}
                          className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm ${expiring ? "bg-amber-50/40" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {t.propertyName}
                              </p>
                              <p className="text-xs text-slate-400 font-mono truncate mt-1">
                                {t.rtbNumber}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {t.tenantName}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-xs text-slate-400">
                                {t.createdAt}
                              </div>
                              <div>
                                {t.rtbRegistration === "REGISTERED" ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 size={12} /> Registered
                                  </span>
                                ) : t.rtbRegistration === "PENDING" ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                                    Missing
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="text-xs text-slate-500 mb-2">
                              {expired && (
                                <span className="text-red-600 font-semibold">
                                  Expired
                                </span>
                              )}
                              {expiring && !expired && (
                                <span className="text-amber-600 font-semibold">
                                  Expires soon
                                </span>
                              )}
                            </div>
                            {t.propertyId ? (
                              <Link
                                href={`/admin/properties/${t.propertyId}`}
                                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-semibold rounded-lg transition"
                              >
                                <BadgeCheck size={13} /> View
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop table (hidden on small screens) */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                          <th className="text-left px-5 py-3">Property</th>
                          <th className="text-left px-5 py-3">RTB Number</th>
                          <th className="text-left px-5 py-3">
                            Current Tenant
                          </th>
                          <th className="text-left px-5 py-3">Created</th>
                          <th className="text-left px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {tenancies.map((t) => {
                          const expiring =
                            t.daysToExpiry !== null &&
                            t.daysToExpiry <= 30 &&
                            t.daysToExpiry >= 0;
                          const expired =
                            t.daysToExpiry !== null && t.daysToExpiry < 0;
                          return (
                            <tr
                              key={t.id}
                              className={`hover:bg-slate-50/60 transition-colors ${expiring ? "bg-amber-50/40" : ""}`}
                            >
                              <td className="px-5 py-4 font-semibold text-slate-700 text-sm">
                                {t.propertyName}
                              </td>
                              <td className="px-5 py-4 font-mono text-xs text-slate-600">
                                {t.rtbNumber}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-600">
                                {t.tenantName}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">
                                {t.createdAt}
                              </td>
                              <td className="px-5 py-4">
                                {t.rtbRegistration === "REGISTERED" ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 size={12} /> Registered
                                  </span>
                                ) : t.rtbRegistration === "PENDING" ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                                    Missing
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination (shared component) */}
                  <Pagination
                    total={tenanciesTotalItems}
                    itemsPerPage={tenanciesItemsPerPage}
                    currentPage={tenanciesPage}
                    onPageChange={(p) => setTenanciesPage(p)}
                    onItemsPerPageChange={(n) => setTenanciesItemsPerPage(n)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" />
              Documents
            </h2>
          </div>
          <div className="overflow-x-auto">
            {docsLoading ? (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">Loading documents...</p>
              </div>
            ) : docsError ? (
              <div className="p-6 text-center">
                <p className="text-sm text-rose-600">
                  Failed to load documents: {docsError}
                </p>
              </div>
            ) : landlordDocuments.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">No documents found.</p>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="lg:hidden p-3 space-y-3">
                  {landlordDocuments.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {d.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-1">
                            {d.property?.name ?? ""}
                          </p>
                        </div>
                        <div className="text-xs text-slate-400">
                          {d.createdAt}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${docTypeColors[d.type] || "bg-slate-100 text-slate-500"}`}
                          >
                            {d.type}
                          </span>
                          <div className="text-sm text-slate-500">{d.size}</div>
                        </div>
                        <a
                          href={d.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"
                        >
                          <Download size={13} /> Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table (hidden on small screens) */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                        <th className="text-left px-5 py-3">Document</th>
                        <th className="text-left px-5 py-3">Type</th>
                        <th className="text-left px-5 py-3">Date</th>
                        <th className="text-left px-5 py-3">Size</th>
                        <th className="text-right px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {landlordDocuments.map((d) => (
                        <tr
                          key={d.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-5 py-4 font-semibold text-slate-700 text-sm">
                            {d.name}
                            <div className="text-xs text-slate-400">
                              {d.property?.name ?? ""}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${docTypeColors[d.type] || "bg-slate-100 text-slate-600"}`}
                            >
                              {d.type}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {d.createdAt}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-400">
                            {d.size}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <a
                              href={d.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"
                            >
                              <Download size={13} />
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Documents pagination */}
                {docsTotalItems > docsItemsPerPage && (
                  <div className="px-4 py-3 border-t border-slate-100">
                    <Pagination
                      total={docsTotalItems}
                      itemsPerPage={docsItemsPerPage}
                      currentPage={docsPage}
                      onPageChange={(p) => setDocsPage(p)}
                      onItemsPerPageChange={(n) => setDocsItemsPerPage(n)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Audit ── */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <ClipboardList size={16} className="text-teal-600" />
              Audit Log
            </h2>
          </div>
          <div className="overflow-x-auto">
            {auditLoading ? (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">Loading audit logs...</p>
              </div>
            ) : auditError ? (
              <div className="p-6 text-center">
                <p className="text-sm text-rose-600">
                  Failed to load audit logs: {auditError}
                </p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">
                  No audit entries found.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="lg:hidden p-3 space-y-3">
                  {auditLogs.map((a) => (
                    <div
                      key={a.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {a.action}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            By: {a.user?.name ?? a.user?.email ?? "System"}
                          </p>
                        </div>
                        <div className="text-xs text-slate-400">
                          {a.createdAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table (hidden on small screens) */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                        <th className="text-left px-5 py-3">Timestamp</th>
                        <th className="text-left px-5 py-3">User ID</th>
                        <th className="text-left px-5 py-3">User</th>
                        <th className="text-left px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.map((a) => (
                        <tr
                          key={a.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-5 py-4 text-sm font-mono text-slate-600">
                            {a.createdAt}
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-slate-500">
                            {a.user?.id ?? ""}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                            {a.user?.name ?? a.user?.email ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {a.action}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination (shared component) */}
                <div className="px-4 py-3 border-t border-slate-100">
                  <Pagination
                    total={auditTotalItems}
                    itemsPerPage={auditItemsPerPage}
                    currentPage={auditPage}
                    onPageChange={(p) => setAuditPage(p)}
                    onItemsPerPageChange={(n) => setAuditItemsPerPage(n)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
