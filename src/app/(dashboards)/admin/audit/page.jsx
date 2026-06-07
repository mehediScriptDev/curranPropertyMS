"use client";
import { useState, useEffect } from "react";
import { Search, Download, Trash2 } from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const ACTION_TYPES = ["All Actions", "User Login", "User Registration", "Profile Update", "User Deletion", "Tenancy Creation", "Tenancy Update", "Users List"];

export default function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [dateFrom, setDateFrom] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input to avoid excessive requests
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // Fetch audit logs from server with pagination and optional filters
  useEffect(() => {
    const controller = new AbortController();

    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", String(currentPage));
        params.append("limit", String(itemsPerPage));
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (actionFilter && actionFilter !== "All Actions")
          params.append("action", actionFilter);
        if (dateFrom) params.append("dateFrom", dateFrom);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/audit-logs?${params.toString()}`;
        const response = await authenticatedFetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch audit logs");
        const result = await response.json();
        if (result.success && result.data) {
          setLogs(result.data);
          const pagination = result.meta?.pagination || {};
          setTotalItems(pagination.totalItems ?? result.data.length ?? 0);
          setTotalPages(pagination.totalPages ?? Math.max(1, Math.ceil((pagination.totalItems ?? result.data.length ?? 0) / itemsPerPage)));
        } else {
          setLogs([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching audit logs:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to load audit logs",
            icon: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
    return () => controller.abort();
  }, [currentPage, itemsPerPage, debouncedSearch, actionFilter, dateFrom, triggerFetch]);

  const handleDeleteLog = async (logId) => {
    const confirm = await Swal.fire({
      title: "Delete Audit Log?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/audit-logs/${logId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete audit log");
      }
      Swal.fire({
        title: "Deleted!",
        text: "Audit log has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setTriggerFetch((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting audit log:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete audit log",
        icon: "error",
      });
    }
  };

  // Ensure current page is valid when total items or itemsPerPage change
  useEffect(() => {
    const total = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (currentPage > total) setCurrentPage(1);
  }, [totalItems, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [debouncedSearch, actionFilter, dateFrom]);

  const handleExport = async () => {
    try {
      setLoading(true);
      const exportLimit = totalItems > 0 ? totalItems : 10000;
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", String(exportLimit));
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (actionFilter && actionFilter !== "All Actions") params.append("action", actionFilter);
      if (dateFrom) params.append("dateFrom", dateFrom);

      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/audit-logs?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to export audit logs");
      const result = await response.json();
      const dataToExport = result.data || [];

      const header = "Timestamp,User,User Email,User Role,Action,Target";
      const rows = dataToExport.map((l) =>
        `"${new Date(l.createdAt).toLocaleString()}","${l.user?.name || "System"}","${l.user?.email || "N/A"}","${l.user?.role || "N/A"}","${l.action}","${l.target}"`
      );
      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      Swal.fire({
        title: "Success!",
        text: "Audit logs exported successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to export audit logs",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes("Deletion") || action.includes("Delete"))
      return "bg-red-100 text-red-700";
    if (action.includes("Creation") || action.includes("Registration"))
      return "bg-teal-100 text-teal-700";
    if (action.includes("Login")) return "bg-blue-100 text-blue-700";
    if (action.includes("Update")) return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Audit Log
          </h1>
          <p className="text-base text-slate-500 mt-0.5">
            Track all system actions and changes
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Download size={15} /> <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        >
          {ACTION_TYPES.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
      </div>

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading audit logs...</p>
        </div>
      )}

      {!loading && logs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No audit logs found.</p>
        </div>
      )}

      {!loading && logs.length > 0 && (
        <>
          {/* Table lg+ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hidden lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">
                    User
                  </th>
                  <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">
                    Action
                  </th>
                  <th className="px-4 py-3 text-base text-left font-semibold text-slate-600">
                    Target
                  </th>
                  <th className="w-20 px-4 py-3 text-base text-right font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
                <tbody className="divide-y divide-slate-100">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-mono text-sm text-slate-600">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 text-sm">
                      {l.user?.name || "System"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {l.user?.email || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-sm font-semibold ${getActionColor(
                          l.action
                        )}`}
                      >
                        {l.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 text-sm">
                      {l.target}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteLog(l.id)}
                        className="inline-flex items-center justify-center w-9 h-9 bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-600 rounded-md transition"
                        title="Delete log"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Mobile cards — visible below lg */}
          <div className="lg:hidden space-y-3">
            {logs.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">
                      {l.action}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {l.target}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteLog(l.id)}
                    className="ml-2 w-9 h-9 inline-flex items-center justify-center bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-rose-600 rounded-md transition flex-shrink-0"
                    title="Delete log"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">User</p>
                    <p className="font-medium text-slate-900 text-sm">
                      {l.user?.name || "System"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">Email</p>
                    <p className="text-xs text-slate-700">
                      {l.user?.email || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">Time</p>
                    <p className="font-mono text-xs text-slate-700">
                      {new Date(l.createdAt).toLocaleString()}
                    </p>
                  </div>
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
        </>
      )}
    </div>
  );
}
