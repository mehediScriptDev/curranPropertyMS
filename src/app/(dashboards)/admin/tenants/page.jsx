"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ArrowUpDown,
  Edit,
  Trash,
  Eye,
  EyeOff,
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const STATUS_STYLES = {
  ACTIVE: "bg-teal-100 text-teal-800 font-semibold",
  INACTIVE: "bg-gray-100 text-gray-800 font-semibold",
};

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTenant, setEditingTenant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Debounce search to reduce API calls
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Fetch tenants from server with pagination
  useEffect(() => {
    const controller = new AbortController();

    const fetchTenants = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("role", "TENANT");
        params.append("page", String(currentPage));
        params.append("limit", String(itemsPerPage));
        if (debouncedSearch) params.append("search", debouncedSearch);

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tenants");
        }

        const result = await response.json();
        if (result.success && result.data) {
          const users = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.users)
            ? result.data.users
            : [];

          const tenantUsers = users
            .filter((user) => !user.role || (user.role || "").toUpperCase() === "TENANT")
            .map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || "N/A",
              status: user.profileSummary?.status || "ACTIVE",
              createdAt: user.createdAt,
            }));

          const pagination = result.meta?.pagination || result.data?.pagination || {};
          const total = pagination.totalItems ?? tenantUsers.length ?? 0;

          setTenants(tenantUsers);
          setSelectedTenants([]);
          setTotalItems(total);
          setTotalPages(
            pagination.totalPages ?? Math.max(1, Math.ceil(total / itemsPerPage))
          );
        } else {
          setTenants([]);
          setSelectedTenants([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching tenants:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to load tenants",
            icon: "error",
          });
          setTenants([]);
          setSelectedTenants([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
    return () => controller.abort();
  }, [currentPage, itemsPerPage, debouncedSearch, triggerFetch]);

  // Ensure current page is valid when totals change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (currentPage > total) setCurrentPage(1);
  }, [totalItems, itemsPerPage]);

  // Reset to first page when search changes
  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [debouncedSearch]);

  // Current page data is already server-filtered and server-paginated
  const filtered = tenants;

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleAddNewTenant = async (newTenantData) => {
    try {
      const payload = {
        ...newTenantData,
        role: "TENANT",
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to create tenant");
      }

      setShowAddModal(false);
      Swal.fire({
        title: "Success!",
        text: "Tenant created successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setTriggerFetch((prev) => prev + 1); // Refresh the list
    } catch (e) {
      console.error("Add error:", e);
      Swal.fire({
        title: "Error!",
        text: `Failed to create tenant: ${e.message}`,
        icon: "error",
      });
    }
  };

  const handleEdit = async (updated) => {
    try {
      const payload = {
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        ppsNumber: updated.ppsNumber || null,
        dateOfBirth: updated.dateOfBirth ? new Date(updated.dateOfBirth).toISOString() : null,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${updated.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to update tenant");
      }

      setTenants((prev) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...payload } : t))
      );

      setShowEditModal(false);
      setEditingTenant(null);

      Swal.fire({
        title: "Success!",
        text: "Tenant updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (e) {
      console.error("Edit error:", e);
      Swal.fire({
        title: "Error!",
        text: `Failed to update tenant: ${e.message}`,
        icon: "error",
      });
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${tenantId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to delete tenant");
      }

      Swal.fire({
        title: "Success!",
        text: "Tenant deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTriggerFetch((prev) => prev + 1);
    } catch (e) {
      console.error("Delete error:", e);
      Swal.fire({
        title: "Error!",
        text: `Failed to delete tenant: ${e.message}`,
        icon: "error",
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTenants.length === 0) {
      Swal.fire({
        title: "No Selection",
        text: "Please select tenants to delete",
        icon: "info",
      });
      return;
    }

    const confirmed = await Swal.fire({
      title: "Delete Tenants?",
      text: `Are you sure you want to delete ${selectedTenants.length} tenant(s)? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!confirmed.isConfirmed) return;

    const deletePromises = selectedTenants.map(handleDeleteTenant);
    await Promise.all(deletePromises);

    setSelectedTenants([]);
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedTenants(paginatedTenants.map((t) => t.id));
    } else {
      setSelectedTenants([]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedTenants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openEditModal = (tenant) => {
    setEditingTenant(tenant);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingTenant(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleEdit({
      id: editingTenant.id,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      ppsNumber: formData.get("ppsNumber"),
      dateOfBirth: formData.get("dateOfBirth"),
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleAddNewTenant({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      ppsNumber: formData.get("ppsNumber"),
      dateOfBirth: formData.get("dateOfBirth"),
      pps2: formData.get("pps2"),
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorForInitials = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Tenants
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          aria-label="Add new tenant"
        >
          <Plus size={15} aria-hidden="true" /> <span className="hidden sm:inline">Add Tenant</span>
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading tenants...</p>
        </div>
      )}

      {!loading && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tenants…"
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              aria-label="Search tenants by name or email"
            />
          </div>
        </div>
      )}

      {!loading && totalItems === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No tenants found.</p>
        </div>
      )}

      {!loading && totalItems > 0 && (
        <>

          {/* Mobile cards — visible below lg */}
          <div className="lg:hidden space-y-3">
            {filtered.map((tenant) => (
              <div
                key={tenant.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${getColorForInitials(
                      tenant.name
                    )} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                  >
                    {getInitials(tenant.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {tenant.name}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      {tenant.email}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      STATUS_STYLES[tenant.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <Link
                    href={`/admin/tenants/${tenant.id}`}
                    aria-label={`View ${tenant.name}`}
                    className="flex-1 h-8 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700 rounded transition text-xs gap-1 font-medium"
                    title="View tenant"
                  >
                    <Eye size={13} aria-hidden="true" /> View
                  </Link>
                  <button
                    aria-label={`Edit ${tenant.name}`}
                    onClick={() => openEditModal(tenant)}
                    className="flex-1 h-8 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-600 rounded transition text-xs gap-1 font-medium"
                    title="Edit tenant"
                  >
                    <Edit size={13} aria-hidden="true" /> Edit
                  </button>
                  <button
                    aria-label={`Delete ${tenant.name}`}
                    onClick={() => {
                      Swal.fire({
                        title: "Delete Tenant?",
                        text: `Are you sure you want to delete ${tenant.name}? This action cannot be undone.`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#dc2626",
                        cancelButtonColor: "#6b7280",
                        confirmButtonText: "Delete",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handleDeleteTenant(tenant.id);
                        }
                      });
                    }}
                    className="flex-1 h-8 inline-flex items-center justify-center bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-600 rounded transition text-xs gap-1 font-medium"
                    title="Delete tenant"
                  >
                    <Trash size={13} aria-hidden="true" /> Delete
                  </button>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Pagination
                total={totalItems}
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-base table-fixed">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedTenants.length === filtered.length &&
                          filtered.length > 0
                        }
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                        aria-label="Select all tenants"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="w-28 px-4 py-3 text-right font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className={`hover:bg-slate-50/70 transition ${
                        selectedTenants.includes(tenant.id) ? "bg-teal-50/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTenants.includes(tenant.id)}
                          onChange={() => toggleSelectRow(tenant.id)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                          aria-label={`Select ${tenant.name}`}
                        />
                      </td>
                      <td className="px-4 py-3 truncate">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full ${getColorForInitials(
                              tenant.name
                            )} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                          >
                            {getInitials(tenant.name)}
                          </div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {tenant.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm truncate">
                        {tenant.email}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm truncate">
                        {tenant.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-1.5 py-1 rounded-full text-[10px] font-semibold ${
                            STATUS_STYLES[tenant.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/tenants/${tenant.id}`}
                            aria-label={`View ${tenant.name}`}
                            className="p-2 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700 rounded transition"
                            title="View tenant"
                          >
                            <Eye size={16} aria-hidden="true" />
                          </Link>
                          <button
                            aria-label={`Edit ${tenant.name}`}
                            onClick={() => openEditModal(tenant)}
                            className="p-2 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-600 rounded transition"
                            title="Edit tenant"
                          >
                            <Edit size={16} aria-hidden="true" />
                          </button>
                          <button
                            aria-label={`Delete ${tenant.name}`}
                            onClick={() => {
                              Swal.fire({
                                title: "Delete Tenant?",
                                text: `Are you sure you want to delete ${tenant.name}? This action cannot be undone.`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#dc2626",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Delete",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleDeleteTenant(tenant.id);
                                }
                              });
                            }}
                            className="p-2 inline-flex items-center justify-center bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-600 rounded transition"
                            title="Delete tenant"
                          >
                            <Trash size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <Pagination
                total={totalItems}
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

            </>
      )}

      {/* Add Modal */}
          {showAddModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              role="dialog"
              aria-labelledby="addDialogTitle"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/40"
                onClick={() => setShowAddModal(false)}
              />
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      id="addDialogTitle"
                      className="text-xl font-semibold text-slate-900"
                    >
                      Add New Tenant
                    </h3>
                  </div>
                  <button
                    aria-label="Close modal"
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor="addName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Full name
                    </label>
                    <input
                      id="addName"
                      name="name"
                      placeholder="e.g., John Doe"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addEmail"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="addEmail"
                      name="email"
                      type="email"
                      placeholder="e.g., john@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addPassword"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="addPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="e.g., SecurePass123!"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="addPhone"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      id="addPhone"
                      name="phone"
                      type="tel"
                      placeholder="e.g., +353 87 123 4567"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addAddress"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      id="addAddress"
                      name="address"
                      placeholder="e.g., 123 Main Street, Dublin, D01 1AA"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addPpsNumber"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      PPS Number
                    </label>
                    <input
                      id="addPpsNumber"
                      name="ppsNumber"
                      placeholder="e.g., 1234567AB"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addPps2"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      PPS2
                    </label>
                    <input
                      id="addPps2"
                      name="pps2"
                      placeholder="e.g., 7654321"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addDateOfBirth"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="addDateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      placeholder="mm/dd/yyyy"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end mt-4 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white rounded-md font-medium"
                    >
                      Add Tenant
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editingTenant && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              role="dialog"
              aria-labelledby="editDialogTitle"
              aria-modal="true"
            >
              <div
                className="fixed inset-0 bg-black/40"
                onClick={closeEditModal}
              />
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 z-50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      id="editDialogTitle"
                      className="text-xl font-semibold text-slate-900"
                    >
                      Edit Tenant
                    </h3>
                  </div>
                  <button
                    aria-label="Close modal"
                    onClick={closeEditModal}
                    className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor="editName"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Full name
                    </label>
                    <input
                      id="editName"
                      name="name"
                      defaultValue={editingTenant.name}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editEmail"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="editEmail"
                      name="email"
                      type="email"
                      defaultValue={editingTenant.email}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editPhone"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      id="editPhone"
                      name="phone"
                      type="tel"
                      defaultValue={editingTenant.phone === "N/A" ? "" : editingTenant.phone}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editPpsNumber"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      PPS Number
                    </label>
                    <input
                      id="editPpsNumber"
                      name="ppsNumber"
                      defaultValue={editingTenant.ppsNumber === "N/A" ? "" : editingTenant.ppsNumber}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editDateOfBirth"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="editDateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      defaultValue={editingTenant.dateOfBirth ? editingTenant.dateOfBirth : ""}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end mt-4">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white rounded-md font-medium"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    </div>
  );
}
