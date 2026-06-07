"use client";
import { useEffect, useState, Suspense } from "react";
import {
  Plus, Search,
  ArrowUpDown, Trash2, Eye, Edit2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Pagination from "@/components/portal/Pagination";
import AddTenancyModal from "./components/AddTenancyModal";
import EditTenancyModal from "./components/EditTenancyModal";
import { authenticatedFetch } from "@/utils/authFetch";

const ITEMS_PER_PAGE = 10;
const REFERENCE_PAGE_LIMIT = 100;

const TENANCY_STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Notice", value: "NOTICE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Terminated", value: "TERMINATED" },
];

const RENT_STATUS_FILTER_OPTIONS = [
  { label: "All Rent Status", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Late", value: "LATE" },
  { label: "Overdue", value: "OVERDUE" },
];

const TENANCY_STATUS_STYLE = {
  ACTIVE: { badge: "bg-teal-100 text-teal-700", label: "Active" },
  NOTICE: { badge: "bg-orange-100 text-orange-700", label: "Notice" },
  EXPIRED: { badge: "bg-slate-200 text-slate-700", label: "Expired" },
  TERMINATED: { badge: "bg-red-100 text-red-700", label: "Terminated" },
  UNKNOWN: { badge: "bg-slate-100 text-slate-700", label: "Unknown" },
};

const RENT_STYLE = {
  PAID: { badge: "bg-teal-100 text-teal-700", label: "Paid" },
  OVERDUE: { badge: "bg-red-100 text-red-700", label: "Overdue" },
  PENDING: { badge: "bg-amber-100 text-amber-700", label: "Pending" },
  LATE: { badge: "bg-orange-100 text-orange-700", label: "Late" },
  UNKNOWN: { badge: "bg-slate-100 text-slate-700", label: "Unknown" },
};

const STATUS_LET = {
  Let: "bg-teal-500 text-white",
  Notice: "bg-orange-100 text-orange-600 border border-orange-300",
};
const BADGE = {
  Notice: "bg-orange-400 text-white",
  Active: "bg-teal-500 text-white",
};
const RTB_STATUS = {
  Active: "bg-teal-600 text-white",
  Notice: "bg-orange-400 text-white",
};

const COLOR_PALETTE = [
  "bg-teal-500", "bg-orange-400", "bg-slate-500", "bg-sky-600",
  "bg-emerald-500", "bg-teal-700", "bg-slate-400", "bg-indigo-400",
  "bg-pink-400", "bg-violet-400"
];

// Transform API response to UI format
function transformTenancy(apiTenancy, colorIndex) {
  const tenant = apiTenancy.tenant || {};
  const property = apiTenancy.property || {};
  const landlord = apiTenancy.landlord || {};
  
  // Extract initials from tenant name
  const initials = (tenant.name || "?")
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  
  return {
    id: apiTenancy.id,
    propertyId: property.id || "",
    tenantId: tenant.id || "",
    initials,
    color: COLOR_PALETTE[colorIndex % COLOR_PALETTE.length],
    name: tenant.name || "Unknown Tenant",
    sub: `${property.name || "Unknown"} · ${property.county || ""}`,
    property: property.name || "Unknown",
    statusLet: apiTenancy.status === "ACTIVE" ? "Let" : "Notice",
    statusBadge: null,
    county: property.county || null,
    status: String(apiTenancy.status || "UNKNOWN").toUpperCase(),
    landlord: landlord.name || "Unknown",
    landlordSub: landlord.county || "",
    startDate: apiTenancy.startDate?.split("T")[0] || "",
    endDate: apiTenancy.endDate?.split("T")[0] || "",
    rent: `€${apiTenancy.rent}`,
    rtb: apiTenancy.rtbNumber || "N/A",
    rtbDate: apiTenancy.rtbRegistration?.split("T")[0] || null,
    rtbStatus: apiTenancy.rtbStatus || "Unknown",
    rtbReg: apiTenancy.rtbRegistration || null,
    rtbRegistrationDate: apiTenancy.rtbRegistrationDate?.split("T")[0] || "",
    rtbExpiryDate: apiTenancy.rtbExpiryDate?.split("T")[0] || "",
    rentReviewDate: apiTenancy.rentReviewDate?.split("T")[0] || null,
    rentStatus: (apiTenancy.rentStatus || "PENDING").toUpperCase(),
  };
}

function getRentBadgeMeta(status) {
  const normalizedStatus = String(status || "UNKNOWN").toUpperCase();
  return RENT_STYLE[normalizedStatus] || RENT_STYLE.UNKNOWN;
}

function getTenancyStatusMeta(status) {
  const normalizedStatus = String(status || "UNKNOWN").toUpperCase();
  return TENANCY_STATUS_STYLE[normalizedStatus] || TENANCY_STATUS_STYLE.UNKNOWN;
}

function AdminTenanciesInner() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [addTenancyModalOpen, setAddTenancyModalOpen] = useState(false);
  const [editTenancyModalOpen, setEditTenancyModalOpen] = useState(false);
  const [editingTenancy, setEditingTenancy] = useState(null);
  const [updatingTenancy, setUpdatingTenancy] = useState(false);
  const [tenancies, setTenancies] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [propertyIdMap, setPropertyIdMap] = useState({}); // Map property names to IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rentStatusFilter, setRentStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: 0,
    totalPages: 1,
  });

  // Fetch static reference data used by the add-tenancy modal.
  useEffect(() => {
    const controller = new AbortController();

    const fetchReferenceData = async () => {
      try {
        const fetchAllReferenceItems = async (endpointPath, collectionKey) => {
          const allItems = [];
          let page = 1;
          let totalPages = 1;

          while (page <= totalPages) {
            const separator = endpointPath.includes("?") ? "&" : "?";
            const response = await authenticatedFetch(
              `${process.env.NEXT_PUBLIC_API_URL}${endpointPath}${separator}page=${page}&limit=${REFERENCE_PAGE_LIMIT}`,
              { signal: controller.signal }
            );

            if (!response.ok) {
              throw new Error(`Failed to fetch ${collectionKey}: ${response.statusText}`);
            }

            const responseData = await response.json();
            if (!responseData?.success) {
              throw new Error(responseData?.message || `Failed to fetch ${collectionKey}`);
            }

            const payload = responseData?.data;
            const pageItems = Array.isArray(payload)
              ? payload
              : Array.isArray(payload?.[collectionKey])
                ? payload[collectionKey]
                : Array.isArray(payload?.items)
                  ? payload.items
                  : [];

            allItems.push(...pageItems);

            const pageMeta = payload?.pagination || responseData?.meta?.pagination;
            const serverTotalPages = Number(pageMeta?.totalPages);

            if (Number.isFinite(serverTotalPages) && serverTotalPages > 0) {
              totalPages = serverTotalPages;
            } else {
              // Fallback when API omits pagination metadata.
              totalPages = pageItems.length === REFERENCE_PAGE_LIMIT ? page + 1 : page;
            }

            page += 1;
          }

          return allItems;
        };

        const [tenantUsers, propertiesList] = await Promise.all([
          fetchAllReferenceItems("/api/v1/users?role=TENANT", "users"),
          fetchAllReferenceItems("/api/v1/properties", "properties"),
        ]);

        const allTenants = tenantUsers
          .filter((user) => !user?.role || user.role === "TENANT")
          .map((user) => ({
            id: user.id,
            name: user.name,
            property: "", // No property directly from users endpoint
          }));
        setTenants(allTenants);

        const propNames = propertiesList
          .map((prop) => prop?.name)
          .filter(Boolean);
        setAvailableProperties(propNames);

        // Build map of property name to ID
        const idMap = {};
        propertiesList.forEach((prop) => {
          if (prop?.name && prop?.id) {
            idMap[prop.name] = prop.id;
          }
        });
        setPropertyIdMap(idMap);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching reference data:", err);
      }
    };

    fetchReferenceData();
    return () => controller.abort();
  }, []);

  // Fetch paginated tenancies from API with server-side tenancy status filtering.
  useEffect(() => {
    const controller = new AbortController();

    const fetchTenancies = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("page", String(currentPage));
        params.append("limit", String(ITEMS_PER_PAGE));

        if (statusFilter !== "ALL") {
          params.append("status", statusFilter);
        }

        if (rentStatusFilter !== "ALL") {
          params.append("rentStatus", rentStatusFilter);
        }

        if (search.trim()) {
          params.append("search", search.trim());
        }

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch tenancies: ${response.statusText}`);
        }

        const tenanciesData = await response.json();
        if (!tenanciesData?.success || !Array.isArray(tenanciesData?.data)) {
          throw new Error(tenanciesData?.message || "Failed to load tenancies");
        }

        const transformed = tenanciesData.data.map((tenancy, idx) =>
          transformTenancy(tenancy, idx + (currentPage - 1) * ITEMS_PER_PAGE)
        );
        setTenancies(transformed);
        setSelected([]);

        const pageMeta = tenanciesData?.meta?.pagination || {};
        const totalItems = Number(pageMeta.totalItems ?? tenanciesData.data.length);
        const itemsPerPage = Number(pageMeta.itemsPerPage ?? ITEMS_PER_PAGE);
        const totalPages = Number(pageMeta.totalPages ?? Math.max(1, Math.ceil(totalItems / itemsPerPage)));

        setPagination({
          currentPage: Number(pageMeta.currentPage ?? currentPage),
          itemsPerPage,
          totalItems,
          totalPages,
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching tenancies:", err);
        setError(err.message || "Failed to load tenancies");
        setTenancies([]);
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

    fetchTenancies();
    return () => controller.abort();
  }, [currentPage, statusFilter, rentStatusFilter, search, reloadKey]);

  const handleAddTenancy = async (formData) => {
    try {
      // Map form data to backend format
      const statusMap = { "Let": "ACTIVE", "Notice": "NOTICE", "Active": "ACTIVE" };
      
      // Parse rent value only if provided - remove currency symbols and spaces
      let rentValue = null;
      if (formData.rent && formData.rent.toString().trim()) {
        rentValue = formData.rent.toString().replace(/[€$,\s]/g, "");
        rentValue = parseInt(rentValue) || null;
      }
      
      const payload = {
        propertyId: formData.propertyId,
        tenantId: formData.tenantId,
        status: statusMap[formData.status] || "ACTIVE",
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        rent: rentValue,
        rentDueDay: parseInt(formData.rentDueDay) || 1,
        rentStatus: formData.rentStatus || "PAID",
        rtbNumber: formData.rtbNumber || null,
        rtbStatus: formData.rtbStatus || null,
        rtbRegistration: formData.rtbRegistration || null,
        rentReviewDate: formData.rentReviewDate || null,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("Full API Error Response:", errorData);
        } catch (parseErr) {
          console.error("Error parsing response:", parseErr);
          errorData = { message: response.statusText };
        }
        throw new Error(errorData.message || `Failed to create tenancy: ${response.statusText}`);
      }

      await response.json().catch(() => null);

      setAddTenancyModalOpen(false);
      setCurrentPage(1);
      setReloadKey((prev) => prev + 1);

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Created!",
        text: "Tenancy has been created successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      return true;
    } catch (err) {
      console.error("Error adding tenancy:", err);
      console.error("Full error details:", {
        message: err.message,
        stack: err.stack,
        formData: formData
      });
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to create tenancy. Please try again.",
      });
      return false;
    }
  };

  const handleDeleteTenancy = async (tenancyId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Delete Tenancy?",
      text: "Are you sure you want to delete this tenancy? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/${tenancyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // Check if API returned success: false
      if (!data.success) {
        await Swal.fire({
          icon: "error",
          title: "Cannot Delete Tenancy",
          text: data.message || "Failed to delete tenancy",
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to delete tenancy: ${response.statusText}`);
      }

      if (tenancies.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
      setReloadKey((prev) => prev + 1);

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Tenancy has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error deleting tenancy:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to delete tenancy. Please try again.",
      });
    }
  };

  const openEditTenancyModal = (tenancy) => {
    setEditingTenancy(tenancy);
    setEditTenancyModalOpen(true);
  };

  const closeEditTenancyModal = () => {
    if (updatingTenancy) return;
    setEditTenancyModalOpen(false);
    setEditingTenancy(null);
  };

  const handleEditTenancy = async (formData) => {
    if (!editingTenancy?.id) {
      return false;
    }

    try {
      setUpdatingTenancy(true);

      const payload = {};

      const setField = (key, value) => {
        if (typeof value !== "string") return;
        const trimmedValue = value.trim();
        if (trimmedValue) {
          payload[key] = trimmedValue;
        }
      };

      setField("status", String(formData.status || editingTenancy.status || "").toUpperCase());
      setField("startDate", formData.startDate);
      setField("endDate", formData.endDate);
      setField("rtbNumber", formData.rtbNumber);
      setField("rtbRegistration", String(formData.rtbRegistration || "").toUpperCase());
      setField("rtbStatus", formData.rtbStatus);
      setField("rtbRegistrationDate", formData.rtbRegistrationDate);
      setField("rtbExpiryDate", formData.rtbExpiryDate);

      if (Object.keys(payload).length === 0) {
        await Swal.fire({
          icon: "warning",
          title: "No Changes",
          text: "Please update at least one field before saving.",
        });
        return false;
      }

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/${editingTenancy.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        throw new Error(errorData.message || `Failed to update tenancy: ${response.statusText}`);
      }

      await response.json().catch(() => null);

      setEditTenancyModalOpen(false);
      setEditingTenancy(null);
      setReloadKey((prev) => prev + 1);

      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Tenancy has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (err) {
      console.error("Error updating tenancy:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update tenancy. Please try again.",
      });
      return false;
    } finally {
      setUpdatingTenancy(false);
    }
  };

  const filtered = tenancies;

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((t) => t.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-4">
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading tenancies: {error}</p>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading tenancies...</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Tenancies</h1>
            <button onClick={() => setAddTenancyModalOpen(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
              <Plus size={15} /> <span className="hidden sm:inline">New Tenancy</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search tenancies…"
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                aria-label="Search tenancies by tenant, landlord, or property"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-[190px] px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                aria-label="Filter by tenancy status"
              >
                {TENANCY_STATUS_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={rentStatusFilter}
                onChange={(e) => {
                  setRentStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-[190px] px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                aria-label="Filter by rent status"
              >
                {RENT_STATUS_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <p className="text-slate-600">
                {search.trim() || statusFilter !== "ALL" || rentStatusFilter !== "ALL"
                  ? "No tenancies match your current filters."
                  : "No tenancies found."}
              </p>
            </div>
          ) : (
            <>
      <div className="lg:hidden space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            {(() => {
              const tenancyStatusMeta = getTenancyStatusMeta(t.status);
              const rentMeta = getRentBadgeMeta(t.rentStatus);

              return (
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${tenancyStatusMeta.badge}`}>
                    {tenancyStatusMeta.label}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${rentMeta.badge}`}>
                    {rentMeta.label}
                  </span>
                </div>
              );
            })()}

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 text-sm truncate">{t.name}</p>
                  <p className="text-xs text-slate-400 truncate">{t.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => router.push(`/admin/tenancies/${t.id}/rent-payments`)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                  aria-label="View tenancy rent payments"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => openEditTenancyModal(t)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition"
                  aria-label="Edit tenancy"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTenancy(t.id)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition"
                  aria-label="Delete tenancy"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Landlord</p>
                <p className="font-medium text-slate-700 truncate">{t.landlord}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Rent</p>
                <p className="font-semibold text-slate-800">{t.rent}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">County/City</p>
                <p className="font-medium text-slate-700">{t.county}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">End Date</p>
                <p className="font-medium text-slate-700">{t.endDate ? new Date(t.endDate).toLocaleDateString() : "N/A"}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">RTB #</p>
                <p className="font-medium text-slate-700">{t.rtb}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination
            total={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={() => {}}
            showItemsPerPage={false}
          />
        </div>
      </div>

      {/* Table — visible lg+ */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Tenant <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">County/City <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Landlord <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Rent</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">End Date</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Status</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <tr key={t.id} className={`hover:bg-slate-50/60 transition ${selected.includes(t.id) ? "bg-teal-50/40" : ""}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleRow(t.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-base">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-slate-600 text-sm">{t.county}</td>
                <td className="px-3 py-3">
                  <p className="text-slate-800 font-medium text-sm">{t.landlord}</p>
                  <p className="text-sm text-slate-400">{t.landlordSub}</p>
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800 text-sm">{t.rent}</td>
                <td className="px-3 py-3 text-slate-600 text-sm">{t.endDate ? new Date(t.endDate).toLocaleDateString() : "N/A"}</td>
                <td className="px-3 py-3 text-sm">
                  {(() => {
                    const tenancyStatusMeta = getTenancyStatusMeta(t.status);
                    return (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${tenancyStatusMeta.badge}`}>
                        {tenancyStatusMeta.label}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/tenancies/${t.id}/rent-payments`)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                      aria-label="View tenancy rent payments"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEditTenancyModal(t)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition"
                      aria-label="Edit tenancy"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTenancy(t.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition"
                      aria-label="Delete tenancy"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          total={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={() => {}}
          showItemsPerPage={false}
        />
      </div>

            </>
          )}

      <AddTenancyModal
        isOpen={addTenancyModalOpen}
        onClose={() => setAddTenancyModalOpen(false)}
        onSubmit={handleAddTenancy}
        tenants={tenants}
        tenancies={tenancies}
        propertyMap={propertyIdMap}
        properties={availableProperties}
      />

      <EditTenancyModal
        isOpen={editTenancyModalOpen}
        onClose={closeEditTenancyModal}
        onSubmit={handleEditTenancy}
        tenancy={editingTenancy}
        submitting={updatingTenancy}
      />
        </>
      )}
    </div>
  );
}

export default function AdminTenanciesPage() {
  return (
    <Suspense fallback={null}>
      <AdminTenanciesInner />
    </Suspense>
  );
}

// using shared Pagination component from components/portal/Pagination
