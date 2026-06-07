"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Edit2,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText
} from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";

const REG_STATUS_STYLE = {
  REGISTERED: { badge: "bg-teal-100 text-teal-700", label: "Registered", icon: CheckCircle2 },
  PENDING: { badge: "bg-amber-100 text-amber-700", label: "Pending", icon: Clock },
  MISSING: { badge: "bg-red-100 text-red-700", label: "Missing", icon: AlertCircle },
  UNKNOWN: { badge: "bg-slate-100 text-slate-700", label: "Unknown", icon: HelpCircle },
};

function AdminRTBInner() {
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTenancy, setCurrentTenancy] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch tenancies with RTB info
  useEffect(() => {
    const fetchRTBData = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch RTB data: ${response.statusText}`);
        }

        const json = await response.json();
        if (json.success && json.data) {
          setTenancies(json.data);
        }
      } catch (err) {
        console.error("Error fetching RTB data:", err);
        setError(err.message || "Failed to load RTB data");
      } finally {
        setLoading(false);
      }
    };

    fetchRTBData();
  }, []);

  const handleEditClick = (tenancy) => {
    setCurrentTenancy({
      id: tenancy.id,
      rtbNumber: tenancy.rtbNumber || "",
      rtbStatus: tenancy.rtbStatus || "Active",
      rtbRegistration: tenancy.rtbRegistration || "UNKNOWN",
      rtbRegistrationDate: tenancy.rtbRegistrationDate ? tenancy.rtbRegistrationDate.split("T")[0] : "",
      rtbExpiryDate: tenancy.rtbExpiryDate ? tenancy.rtbExpiryDate.split("T")[0] : "",
      propertyName: tenancy.property?.name || "Unknown Property",
      tenantName: tenancy.tenant?.name || "Unknown Tenant"
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateRTB = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/${currentTenancy.id}/rtb`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rtbNumber: currentTenancy.rtbNumber,
            rtbStatus: currentTenancy.rtbStatus,
            rtbRegistration: currentTenancy.rtbRegistration,
            rtbRegistrationDate: currentTenancy.rtbRegistrationDate || null,
            rtbExpiryDate: currentTenancy.rtbExpiryDate || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update RTB registration");
      }

      setTenancies(prev => prev.map(t => 
        t.id === currentTenancy.id 
          ? { 
              ...t, 
              rtbNumber: currentTenancy.rtbNumber,
              rtbStatus: currentTenancy.rtbStatus,
              rtbRegistration: currentTenancy.rtbRegistration,
              rtbRegistrationDate: currentTenancy.rtbRegistrationDate,
              rtbExpiryDate: currentTenancy.rtbExpiryDate
            } 
          : t
      ));

      setIsEditModalOpen(false);
      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "RTB registration details updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating RTB:", err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update RTB registration.",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const filtered = tenancies.filter((t) => {
    const matchSearch = 
      (t.tenant?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.property?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.rtbNumber || "").toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = statusFilter === "All Statuses" || t.rtbRegistration === statusFilter;
    
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">RTB Registration</h1>
        <p className="text-sm sm:text-base text-slate-500">Manage and track Residential Tenancies Board registrations.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Managed", value: tenancies.length, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Registered", value: tenancies.filter(t => t.rtbRegistration === "REGISTERED").length, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Pending", value: tenancies.filter(t => t.rtbRegistration === "PENDING").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Missing / Action Req.", value: tenancies.filter(t => t.rtbRegistration === "MISSING" || t.rtbRegistration === "UNKNOWN").length, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center`}>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-xl sm:text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search registrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
          />
        </div>
        <div className="w-full sm:w-[240px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium cursor-pointer"
          >
            <option value="All Statuses">All Registration Statuses</option>
            <option value="REGISTERED">Registered</option>
            <option value="PENDING">Pending</option>
            <option value="MISSING">Missing</option>
            <option value="UNKNOWN">Unknown</option>
          </select>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-medium tracking-tight">Loading records...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-800 font-semibold text-lg">Failed to load data</p>
          <p className="text-red-600 mt-1">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 font-semibold text-lg">No records found</p>
          <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile View — Cards (Hidden on Large Screens) */}
          <div className="lg:hidden space-y-3">
            {filtered.map((t) => {
              const style = REG_STATUS_STYLE[t.rtbRegistration] || REG_STATUS_STYLE.UNKNOWN;
              const StatusIcon = style.icon;
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-base leading-snug">{t.property?.name || "—"}</p>
                      <p className="text-sm text-slate-500 font-medium truncate mt-0.5">{t.tenant?.name || "—"}</p>
                    </div>
                    <button
                      onClick={() => handleEditClick(t)}
                      className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl border border-slate-100 transition-all flex-shrink-0"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-slate-100">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RTB Number</p>
                      <p className="text-xs font-mono bg-slate-50 px-2 py-1 rounded-md text-slate-700 font-semibold border border-slate-100 inline-block w-full text-center truncate">
                        {t.rtbNumber || "NOT SET"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expiry Date</p>
                      <p className="text-xs font-bold text-slate-700 h-6 flex items-center justify-center">
                        {t.rtbExpiryDate ? new Date(t.rtbExpiryDate).toLocaleDateString("en-IE") : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ring-1 ring-inset ${style.badge} ring-slate-200/50 shadow-sm`}>
                      <StatusIcon size={14} />
                      {style.label}
                    </span>
                    {t.rtbExpiryDate && new Date(t.rtbExpiryDate) < new Date() && (
                      <span className="text-[10px] text-red-600 font-bold uppercase tracking-tight bg-red-50 px-2.5 py-1 rounded-full ring-1 ring-red-100">Expired</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View — Table (Small screens hide this) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property & Tenant</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">RTB Number</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registration Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => {
                    const style = REG_STATUS_STYLE[t.rtbRegistration] || REG_STATUS_STYLE.UNKNOWN;
                    const StatusIcon = style.icon;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{t.property?.name || "—"}</span>
                            <span className="text-sm text-slate-500 font-medium">{t.tenant?.name || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-700 font-semibold">
                            {t.rtbNumber || "NOT ASSIGNED"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${style.badge} ring-slate-200/50 shadow-sm`}>
                            <StatusIcon size={14} />
                            {style.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {t.rtbExpiryDate ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">
                                {new Date(t.rtbExpiryDate).toLocaleDateString("en-IE", { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                              {new Date(t.rtbExpiryDate) < new Date() && (
                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-tight">Expired</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 font-medium italic">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEditClick(t)}
                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                            title="Update RTB Info"
                          >
                            <Edit2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination total={filtered.length} />
        </div>
      )}

      {/* Edit Modal (Stays responsive via max-w-lg) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 z-0 -top-6 bg-slate-900/60 backdrop-blur-[2px]" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative z-10 bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Update RTB Registration</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {currentTenancy.propertyName} · {currentTenancy.tenantName}
              </p>
            </div>
            
            <form onSubmit={handleUpdateRTB} className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">RTB Certificate Number</label>
                  <input
                    type="text"
                    required
                    value={currentTenancy.rtbNumber}
                    onChange={(e) => setCurrentTenancy({ ...currentTenancy, rtbNumber: e.target.value })}
                    placeholder="e.g. RTB-2024-XXXXX"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Registration Status</label>
                  <select
                    value={currentTenancy.rtbRegistration}
                    onChange={(e) => setCurrentTenancy({ ...currentTenancy, rtbRegistration: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="REGISTERED">Registered</option>
                    <option value="PENDING">Pending</option>
                    <option value="MISSING">Missing</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700">Registration Date</label>
                    <input
                      type="date"
                      value={currentTenancy.rtbRegistrationDate}
                      onChange={(e) => setCurrentTenancy({ ...currentTenancy, rtbRegistrationDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700">Expiry Date</label>
                    <input
                      type="date"
                      value={currentTenancy.rtbExpiryDate}
                      onChange={(e) => setCurrentTenancy({ ...currentTenancy, rtbExpiryDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-700">Tenancy Status</label>
                  <select
                    value={currentTenancy.rtbStatus}
                    onChange={(e) => setCurrentTenancy({ ...currentTenancy, rtbStatus: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Notice">Notice</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-bold text-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 disabled:opacity-70 order-1 sm:order-2"
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRTBPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading RTB Registration...</div>}>
      <AdminRTBInner />
    </Suspense>
  );
}
