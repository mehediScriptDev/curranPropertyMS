"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  ChevronDown,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Edit2,
  Trash2,
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import AddPropertyModal from "./components/AddPropertyModal";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const PROPERTY_STATUS_OPTIONS = [
  { value: "LET", label: "Let" },
  { value: "NOTICE", label: "Notice" },
  { value: "VACANT", label: "Vacant" },
  { value: "MANAGED", label: "Managed" },
];

const DEFAULT_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&q=60";

function normalizePropertyStatus(statusStr) {
  const statusUpper = String(statusStr || "").toUpperCase();
  if (statusUpper === "NOTICE" || statusUpper === "NOTICE_SERVED") return "NOTICE";
  if (statusUpper === "LET") return "LET";
  if (statusUpper === "VACANT" || statusUpper === "AVAILABLE") return "VACANT";
  if (statusUpper === "MANAGED") return "MANAGED";
  return "VACANT";
}

// Status mapping helper
function getStatusFromString(statusStr) {
  const status = normalizePropertyStatus(statusStr);
  if (status === "LET") return "Let";
  if (status === "VACANT") return "Vacant";
  if (status === "NOTICE") return "Notice Served";
  if (status === "MANAGED") return "Managed";
  return "Unknown";
}

// Transform API response to UI format
function transformProperty(apiProp) {
  const status = normalizePropertyStatus(apiProp.status);
  const statusProp = getStatusFromString(status);
  const rawImageUrl = apiProp.image || apiProp.imageUrl || "";
  let rtb = "Unknown";
  let rtbStyle = "text-slate-500";

  if (apiProp.rtbRegistration === "REGISTERED") {
    rtb = "Registered";
    rtbStyle = "text-teal-600";
  } else if (apiProp.rtbRegistration === "UNKNOWN") {
    rtb = "Unknown";
    rtbStyle = "text-slate-500";
  } else if (apiProp.rtbRegistration === "PENDING") {
    rtb = "Pending";
    rtbStyle = "text-amber-600";
  }

  return {
    id: apiProp.id,
    img: rawImageUrl || DEFAULT_PROPERTY_IMAGE,
    name: apiProp.name,
    area: `${apiProp.county || "Dublin"} · ${apiProp.bedrooms || "0"}+${apiProp.bathrooms || "0"}`,
    statusProp,
    statusRTB: statusProp,
    landlord: apiProp.landlord?.name || "Unknown",
    rent: `€${apiProp.rent || "0"}`,
    rtb,
    rtbStyle,
    bedrooms: apiProp.bedrooms,
    bathrooms: apiProp.bathrooms,
    address: apiProp.address,
    county: apiProp.county || "",
    eircode: apiProp.eircode,
    propertyType: apiProp.propertyType,
    status,
    rtbNumberRaw: apiProp.rtbNumber || "",
    mprnRaw: apiProp.mprn || "",
  };
}

function handlePropertyImageError(event) {
  if (event.currentTarget.dataset.fallbackApplied === "true") {
    return;
  }

  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.style.display = "";
  event.currentTarget.src = DEFAULT_PROPERTY_IMAGE;
}

const PROP_STATUS = {
  Let: "bg-teal-500 text-white",
  "Notice Served": "bg-orange-100 text-orange-600 border border-orange-300",
  Vacant: "bg-slate-100 text-slate-600",
  Managed: "bg-blue-100 text-blue-600 border border-blue-300",
};

export default function AdminPropertiesPage() {
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProp, setActiveProp] = useState(null);
  const [addPropertyModalOpen, setAddPropertyModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [landlords, setLandlords] = useState([]);
  const [creatingProperty, setCreatingProperty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reloadKey, setReloadKey] = useState(0);
  const [localImageOverrides, setLocalImageOverrides] = useState({});
  const localImageOverridesRef = useRef({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const setLocalImageOverrideForProperty = (propertyId, file) => {
    if (!propertyId || !file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalImageOverrides((prev) => {
      const next = { ...prev };
      if (next[propertyId]) {
        URL.revokeObjectURL(next[propertyId]);
      }
      next[propertyId] = objectUrl;
      localImageOverridesRef.current = next;
      return next;
    });
  };

  const clearLocalImageOverrideForProperty = (propertyId) => {
    if (!propertyId) return;

    setLocalImageOverrides((prev) => {
      if (!prev[propertyId]) {
        return prev;
      }

      const next = { ...prev };
      URL.revokeObjectURL(next[propertyId]);
      delete next[propertyId];
      localImageOverridesRef.current = next;
      return next;
    });
  };

  const loadProperties = async ({ page = currentPage, showLoader = false, signal } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
        setError(null);
      }

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(itemsPerPage));

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties?${params.toString()}`,
        { signal },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        const rows = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.properties)
            ? data.data.properties
            : [];
        const transformed = rows.map((prop) => transformProperty(prop));
        setProperties(transformed);

        // Once backend image URLs are available, release local blob previews for those properties.
        setLocalImageOverrides((prev) => {
          let hasChanges = false;
          const next = { ...prev };

          rows.forEach((row) => {
            const rowId = row?.id;
            const hasServerImage = Boolean(row?.image || row?.imageUrl);
            if (rowId && hasServerImage && next[rowId]) {
              URL.revokeObjectURL(next[rowId]);
              delete next[rowId];
              hasChanges = true;
            }
          });

          if (!hasChanges) {
            return prev;
          }

          localImageOverridesRef.current = next;
          return next;
        });

        const paginationMeta = data.meta?.pagination || data.data?.pagination || {};
        const totalItems = Number(paginationMeta.totalItems ?? rows.length);
        const resolvedItemsPerPage = Number(paginationMeta.itemsPerPage ?? itemsPerPage);
        const totalPages = Number(
          paginationMeta.totalPages ?? Math.max(1, Math.ceil(totalItems / resolvedItemsPerPage)),
        );

        setPagination({
          currentPage: Number(paginationMeta.currentPage ?? page),
          itemsPerPage: resolvedItemsPerPage,
          totalItems,
          totalPages,
        });
      } else {
        setProperties([]);
        setPagination({
          currentPage: page,
          itemsPerPage,
          totalItems: 0,
          totalPages: 1,
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to load properties");
        setProperties([]);
        setPagination({
          currentPage: page,
          itemsPerPage,
          totalItems: 0,
          totalPages: 1,
        });
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const loadLandlords = async ({ signal } = {}) => {
    try {
      let page = 1;
      const limit = 100;
      let hasNextPage = true;
      const allLandlords = [];

      while (hasNextPage) {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/role/LANDLORD?${params.toString()}`,
          { signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch landlords");
        }

        const result = await response.json();
        if (!result.success || !result.data) {
          break;
        }

        const users = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.users)
            ? result.data.users
            : [];

        allLandlords.push(...users);

        const pagination =
          result.meta?.pagination || result.data?.pagination || {};
        if (typeof pagination.hasNextPage === "boolean") {
          hasNextPage = pagination.hasNextPage;
        } else if (pagination.currentPage && pagination.totalPages) {
          hasNextPage = pagination.currentPage < pagination.totalPages;
        } else {
          hasNextPage = users.length === limit;
        }

        page += 1;
        if (page > 50) hasNextPage = false;
      }

      const uniqueLandlords = Array.from(
        new Map(
          allLandlords
            .filter((user) => user?.id)
            .map((user) => [
              user.id,
              {
                id: user.id,
                name: user.name || user.email || "Unknown Landlord",
              },
            ]),
        ).values(),
      ).sort((a, b) => a.name.localeCompare(b.name));

      setLandlords(uniqueLandlords);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching landlords:", err);
        setLandlords([]);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadProperties({ page: currentPage, showLoader: true, signal: controller.signal });
    return () => controller.abort();
  }, [currentPage, reloadKey, itemsPerPage]);

  useEffect(() => {
    const controller = new AbortController();
    loadLandlords({ signal: controller.signal });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(localImageOverridesRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const filtered = properties;

  const toggleAll = () =>
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((p) => p.id),
    );
  const toggleRow = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const handleAddProperty = async (formData) => {
    try {
      setCreatingProperty(true);

      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("propertyType", formData.propertyType);
      payload.append("bedrooms", String(Number(formData.bedrooms) || 0));
      payload.append("bathrooms", String(Number(formData.bathrooms) || 0));
      payload.append("address", (formData.address || "").trim());
      payload.append("county", (formData.county || "").trim());
      payload.append("eircode", (formData.eircode || "").trim());
      payload.append("landlordId", formData.landlordId);
      payload.append("status", "VACANT");
      payload.append("rent", String(Number(formData.rent) || 0));

      // Append image if provided
      if (formData.image) {
        payload.append("image", formData.image);
      }

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties`,
        {
          method: "POST",
          body: payload,
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.message || `Failed to create property (${response.status})`,
        );
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to create property");
      }

      const createdProperty = data?.data?.property || data?.data || null;
      if (createdProperty?.id) {
        if (formData.image) {
          setLocalImageOverrideForProperty(createdProperty.id, formData.image);
        }

        const createdRow = transformProperty(createdProperty);
        if (currentPage === 1) {
          setProperties((prev) => {
            const withoutDuplicate = prev.filter(
              (prop) => String(prop.id) !== String(createdRow.id),
            );
            return [createdRow, ...withoutDuplicate].slice(0, itemsPerPage);
          });
        }

        setPagination((prev) => {
          const totalItems = Math.max(0, Number(prev.totalItems) || 0) + 1;
          const resolvedItemsPerPage = Number(prev.itemsPerPage) || itemsPerPage;
          return {
            ...prev,
            totalItems,
            totalPages: Math.max(1, Math.ceil(totalItems / resolvedItemsPerPage)),
          };
        });
      }

      setCurrentPage(1);
      window.setTimeout(() => {
        loadProperties({ page: 1, showLoader: false });
      }, 1500);
      await Swal.fire({
        icon: "success",
        title: "Property Added!",
        text: "Property has been created successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    } catch (err) {
      console.error("Error creating property:", err);
      await Swal.fire(
        "Error",
        err.message || "Failed to create property",
        "error",
      );
      return false;
    } finally {
      setCreatingProperty(false);
    }
  };

  const openEditModal = (prop) => {
    setEditingProp(prop);
    setEditFormData({
      name: prop.name,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      address: prop.address,
      county: prop.county,
      eircode: prop.eircode,
      propertyType: prop.propertyType,
      rent: prop.rent.replace("€", "").trim(),
      mprn: prop.mprnRaw || "",
      status: prop.status || "VACANT",
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingProp(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProp) return;

    try {
      setEditLoading(true);
      const payload = new FormData();
      payload.append("name", editFormData.name);
      payload.append("bedrooms", String(parseInt(editFormData.bedrooms) || 0));
      payload.append("bathrooms", String(parseInt(editFormData.bathrooms) || 0));
      payload.append("address", editFormData.address);
      payload.append("county", editFormData.county);
      payload.append("eircode", editFormData.eircode);
      payload.append("propertyType", editFormData.propertyType);
      payload.append("rent", String(parseFloat(editFormData.rent) || 0));
      payload.append("status", normalizePropertyStatus(editFormData.status));
      if (editFormData.mprn) {
        payload.append("mprn", editFormData.mprn);
      }
      if (editFormData.image) {
        payload.append("image", editFormData.image);
      }

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/${editingProp.id}`,
        {
          method: "PUT",
          body: payload,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update property");
      }

      const data = await response.json();
      if (data.success) {
        const nextStatus = normalizePropertyStatus(editFormData.status);
        const nextStatusProp = getStatusFromString(nextStatus);
        const parsedBedrooms = Number.parseInt(editFormData.bedrooms, 10) || 0;
        const parsedBathrooms = Number.parseInt(editFormData.bathrooms, 10) || 0;
        const parsedRent = Number.parseFloat(editFormData.rent) || 0;

        if (editFormData.image) {
          setLocalImageOverrideForProperty(editingProp.id, editFormData.image);
        }

        // Optimistically update row values so the edit is immediately visible.
        setProperties((prev) =>
          prev.map((prop) => {
            if (prop.id !== editingProp.id) return prop;
            return {
              ...prop,
              name: editFormData.name,
              bedrooms: parsedBedrooms,
              bathrooms: parsedBathrooms,
              address: editFormData.address,
              county: editFormData.county,
              eircode: editFormData.eircode,
              propertyType: editFormData.propertyType,
              rent: `€${parsedRent}`,
              status: nextStatus,
              statusProp: nextStatusProp,
              area: `${editFormData.county || "Dublin"} · ${parsedBedrooms}+${parsedBathrooms}`,
              mprnRaw: editFormData.mprn || "",
            };
          }),
        );

        // Background sync after upload so eventual backend changes are pulled in.
        window.setTimeout(() => {
          loadProperties({ page: currentPage, showLoader: false });
        }, 1500);

        Swal.fire({
          icon: "success",
          title: "Property Updated!",
          text: "Property has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        closeEditModal();
      }
    } catch (err) {
      console.error("Error updating property:", err);
      Swal.fire("Error", err.message || "Failed to update property", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProperty = async (propId, propName) => {
    const result = await Swal.fire({
      title: "Delete Property?",
      text: `Are you sure you want to delete "${propName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setDeleteLoading(propId);
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/${propId}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      // Check if API returned success: false
      if (!data.success) {
        Swal.fire({
          icon: "error",
          title: "Cannot Delete Property",
          text: data.message || "Failed to delete property",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      Swal.fire({
        icon: "success",
        title: "Property Deleted!",
        text: "Property has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      clearLocalImageOverrideForProperty(propId);

      if (properties.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      } else {
        setReloadKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      Swal.fire("Error", err.message || "Failed to delete property", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Properties
        </h1>
        <button
          onClick={() => setAddPropertyModalOpen(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus size={15} />{" "}
          <span className="hidden sm:inline">Add Property</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-slate-600">Loading properties...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-2xl border border-red-200 shadow-sm p-4">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {/* No Properties State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">
            No properties found. Add your first property to get started.
          </p>
        </div>
      )}

      {/* Mobile cards — visible below lg */}
      <div className="lg:hidden space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              {/* <img src={p.img} alt={p.name} className="w-14 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100" onError={(e) => { e.target.style.display = 'none'; }} /> */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  {p.name}
                </p>
                <p className="text-xs text-slate-400">{p.area}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${PROP_STATUS[p.statusProp]}`}
              >
                {p.statusProp !== "Vacant" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                )}
                {p.statusProp}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Landlord</p>
                <p className="font-medium text-slate-700 truncate">
                  {p.landlord}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Rent</p>
                <p className="font-semibold text-slate-800">{p.rent}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">RTB #</p>
                <p
                  className={`font-medium flex items-center gap-1 ${p.rtbStyle}`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                  {p.rtb}
                </p>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100 flex gap-2">
              <Link
                href={`/admin/properties/${p.id}`}
                className="flex-1 h-9 inline-flex items-center justify-center gap-1 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md transition text-xs font-medium"
              >
                <Eye size={14} /> View
              </Link>
              <button
                onClick={() => openEditModal(p)}
                className="flex-1 h-9 inline-flex items-center justify-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition text-xs font-medium"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => handleDeleteProperty(p.id, p.name)}
                disabled={deleteLoading === p.id}
                className="flex-1 h-9 inline-flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition text-xs font-medium disabled:opacity-50"
              >
                <Trash2 size={14} /> {deleteLoading === p.id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination
            total={pagination.totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table — visible lg+ */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selected.length === filtered.length && filtered.length > 0
                  }
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">Images </span>
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">Name </span>
              </th>
              <th className="w-48 px-3 py-3 text-center font-semibold text-slate-600 text-sm">
                <span className="flex items-center justify-center gap-1">
                  Status
                </span>
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">Landlord </span>
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                Rent
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">RTB # </span>
              </th>
              <th className="w-48 px-3 py-3 text-right font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr
                key={p.id}
                className={`hover:bg-slate-50/60 transition ${selected.includes(p.id) ? "bg-teal-50/40" : ""}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleRow(p.id)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </td>
                <td className="w-48 px-3 py-3">
                  <img src={localImageOverrides[p.id] || p.img} alt={p.name} className="w-32 h-20 rounded-lg object-cover flex-shrink-0 bg-slate-100" onError={handlePropertyImageError} />
                </td>
                <td className="w-48 px-3 py-3">
                  <div className="flex items-center gap-4">
                    {/* <img src={p.img} alt={p.name} className="w-14 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100" onError={(e) => { e.target.style.display = 'none'; }} /> */}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-base leading-tight truncate">
                        {p.name}
                      </p>
                      <p className="text-sm text-slate-400">{p.area}</p>
                    </div>
                  </div>
                </td>
                <td className="w-48 px-3 py-3 text-center">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${PROP_STATUS[p.statusProp]}`}
                    >
                      {p.statusProp !== "Vacant" && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      )}
                      {p.statusProp}
                    </span>
                  </div>
                </td>
                <td className="w-48 px-3 py-3">
                  <p className="text-slate-800 font-medium text-base truncate">
                    {p.landlord}
                  </p>
                </td>
                <td className="w-48 px-3 py-3 font-semibold text-slate-800 text-base">
                  {p.rent}
                </td>
                <td className="w-48 px-3 py-3">
                  <span
                    className={`flex items-center gap-1 text-base font-medium ${p.rtbStyle}`}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                    {p.rtb}
                  </span>
                </td>
                <td className="w-48 px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/properties/${p.id}`}
                      aria-label="View"
                      className="w-9 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-700 text-teal-700 hover:text-white rounded-md transition"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => openEditModal(p)}
                      aria-label="Edit"
                      className="w-9 h-9 inline-flex items-center justify-center bg-blue-100 hover:bg-blue-700 text-blue-700 hover:text-white rounded-md transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(p.id, p.name)}
                      disabled={deleteLoading === p.id}
                      aria-label="Delete"
                      className="w-9 h-9 inline-flex items-center justify-center bg-red-100 hover:bg-red-700 text-red-700 hover:text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Modal: Property details */}
      {modalOpen && activeProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => {
              setModalOpen(false);
              setActiveProp(null);
            }}
          />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {activeProp.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{activeProp.area}</p>
              </div>
              <button
                aria-label="Close"
                onClick={() => {
                  setModalOpen(false);
                  setActiveProp(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <img
                src={activeProp.img}
                alt={activeProp.name}
                className="w-full h-40 object-cover rounded-md sm:col-span-1"
              />
              <div className="sm:col-span-2 space-y-2">
                <p className="text-sm">
                  <strong>Landlord:</strong> {activeProp.landlord}
                </p>
                <p className="text-sm">
                  <strong>Rent:</strong> {activeProp.rent}
                </p>
                <p className="text-sm">
                  <strong>RTB #:</strong>{" "}
                  <span className={activeProp.rtbStyle}>{activeProp.rtb}</span>
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {activeProp.statusProp}
                </p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setActiveProp(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AddPropertyModal
        isOpen={addPropertyModalOpen}
        onClose={() => setAddPropertyModalOpen(false)}
        onSubmit={handleAddProperty}
        landlords={landlords}
        submitting={creatingProperty}
      />

      {/* Edit Property Modal */}
      {editModalOpen && editingProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeEditModal} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 p-6">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                Edit Property
              </h3>
              <button
                aria-label="Close"
                onClick={closeEditModal}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Property Type
                  </label>
                  <input
                    type="text"
                    name="propertyType"
                    value={editFormData.propertyType || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editFormData.status || "VACANT"}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {PROPERTY_STATUS_OPTIONS.map((statusOption) => (
                      <option key={statusOption.value} value={statusOption.value}>
                        {statusOption.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={editFormData.bedrooms || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={editFormData.bathrooms || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    County
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={editFormData.county || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Eircode
                  </label>
                  <input
                    type="text"
                    name="eircode"
                    value={editFormData.eircode || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Rent (€)
                  </label>
                  <input
                    type="number"
                    name="rent"
                    value={editFormData.rent || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    MPRN
                  </label>
                  <input
                    type="text"
                    name="mprn"
                    value={editFormData.mprn || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Property Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  {editingProp.img && !editFormData.image && (
                    <p className="mt-1 text-xs text-slate-500">
                      Current image: {editingProp.img.split("/").pop()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
