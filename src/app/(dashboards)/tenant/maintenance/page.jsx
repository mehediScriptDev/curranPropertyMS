"use client";

import { useState, useEffect } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import Pagination from "@/components/portal/Pagination";
import { Wrench, Plus, Clock, CheckCircle2, AlertCircle, X, Eye } from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const statusIcon = {
  "In Progress": <Clock size={14} className="text-blue-600" />,
  "Resolved": <CheckCircle2 size={14} className="text-teal-600" />,
  "Open": <AlertCircle size={14} className="text-amber-600" />,
};

// Helper: Map API status to display status
const mapStatus = (apiStatus) => {
  const statusMap = {
    "OPEN": "Open",
    "IN_PROGRESS": "In Progress",
    "CLOSED": "Closed"
  };
  return statusMap[apiStatus] || apiStatus;
};

// Helper: Get status color
const getStatusColor = (status) => {
  const colors = {
    "Open": "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Closed": "bg-teal-100 text-teal-700"
  };
  return colors[status] || "bg-slate-100 text-slate-600";
};

// Helper: Map priority to display format
const mapPriority = (apiPriority) => {
  const priorityMap = {
    "LOW": "Low",
    "MEDIUM": "Medium",
    "HIGH": "High"
  };
  return priorityMap[apiPriority] || apiPriority;
};

// Helper: Get priority color
const getPriorityColor = (priority) => {
  const colors = {
    "High": "bg-red-100 text-red-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Low": "bg-slate-100 text-slate-600"
  };
  return colors[priority] || "bg-slate-100 text-slate-600";
};

const mapMaintenanceRequest = (req) => ({
  id: req.id,
  title: req.title,
  desc: req.description,
  date: new Date(req.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
  status: mapStatus(req.status),
  statusColor: getStatusColor(mapStatus(req.status)),
  priority: mapPriority(req.priority),
  priorityColor: getPriorityColor(mapPriority(req.priority)),
  apiStatus: req.status,
  propertyName: req.property?.name || "Unknown Property",
  cost: req.cost,
  isCharged: req.isCharged,
  chargeNote: req.chargeNote,
});

const extractPropertyFromTenancyResponse = (tenancyData) => {
  if (!tenancyData?.success || !tenancyData?.data) return null;

  if (Array.isArray(tenancyData.data) && tenancyData.data.length > 0) {
    return tenancyData.data[0]?.property || null;
  }

  if (typeof tenancyData.data === "object") {
    return tenancyData.data.property || null;
  }

  return null;
};

const resolvePropertyId = (property) => property?.id || property?.propertyId || null;

export default function TenantMaintenancePage() {
  const { user } = usePortalAuth();
  const [showForm, setShowForm] = useState(false);
  const isReadOnly = user?.role?.toLowerCase() === "tenant";
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Form state for new request
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "LOW"
  });
  const [submitting, setSubmitting] = useState(false);
  const [tenantProperty, setTenantProperty] = useState(null);
  const [summary, setSummary] = useState({ totalCostCharged: 0, chargedRequestsCount: 0 });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch maintenance requests and tenancy property from API.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [requestsResponse, tenancyResponse] = await Promise.all([
          authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/tenant`),
          authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/my`),
        ]);

        if (!requestsResponse.ok) {
          throw new Error(`Failed to fetch requests: ${requestsResponse.statusText}`);
        }

        const requestsData = await requestsResponse.json();
        const tenancyData = tenancyResponse.ok ? await tenancyResponse.json().catch(() => null) : null;
        const tenancyProperty = extractPropertyFromTenancyResponse(tenancyData);
        
        if (requestsData.success && requestsData.data) {
          // capture summary if present
          const s = requestsData.data?.summary;
          setSummary({
            totalCostCharged: s?.totalCostCharged ?? 0,
            chargedRequestsCount: s?.chargedRequestsCount ?? 0,
          });

          // Prefer 'requests' array inside data when present
          const raw = Array.isArray(requestsData.data.requests)
            ? requestsData.data.requests
            : Array.isArray(requestsData.data)
            ? requestsData.data
            : [];

          // Transform API response to match UI format
          const transformed = raw.map(mapMaintenanceRequest);

          setRequests(transformed);

          // Resolve property from tenancy first, then fallback to first request.
          setTenantProperty(tenancyProperty || raw[0]?.property || null);
        } else {
          setRequests([]);
          setTenantProperty(tenancyProperty || null);
        }
      } catch (err) {
        console.warn("Error fetching data:", err);
        setError(err.message);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      Swal.fire("Validation Error", "Please fill all required fields", "warning");
      return;
    }

    const propertyId = resolvePropertyId(tenantProperty);
    if (!propertyId) {
      Swal.fire(
        "Property Missing",
        "Unable to identify your tenancy property. Please refresh and try again.",
        "warning"
      );
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        propertyId,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to submit request: ${errorData || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        Swal.fire("Success", "Maintenance request submitted successfully", "success");
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          priority: "LOW"
        });
        setShowForm(false);
        
        // Refresh requests list
        const refreshResponse = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/tenant`
        );
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            const raw = Array.isArray(refreshData.data.requests)
              ? refreshData.data.requests
              : Array.isArray(refreshData.data)
              ? refreshData.data
              : [];

              const transformed = raw.map(mapMaintenanceRequest);
            setRequests(transformed);

              if (!resolvePropertyId(tenantProperty) && raw.length > 0 && raw[0].property) {
              setTenantProperty(raw[0].property);
            }
          }
        }
      } else {
        throw new Error(data.message || "Failed to submit request");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Fetch and show request details in a modal
  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/${id}`);
      if (!res.ok) throw new Error('Failed to fetch details');
      const result = await res.json();
      if (result.success && result.data) {
        setSelectedRequest(result.data);
        setDetailsOpen(true);
      } else {
        Swal.fire('Error', 'Failed to load details', 'error');
      }
    } catch (err) {
      console.error('Error fetching details:', err);
      Swal.fire('Error', 'Failed to load details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <TenantShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 xl:mb-5 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Maintenance</h1>
          <p className="text-slate-500 mt-1 text-sm">Submit and track maintenance requests for your property</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus size={15} /> Report Issue
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase mb-2">Total Charged</p>
          <div className="text-2xl font-semibold text-slate-800">€{Number(summary.totalCostCharged ?? 0).toLocaleString()}</div>
          <p className="text-sm text-slate-400 mt-1">Total amount charged across requests</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase mb-2">Charged Requests</p>
          <div className="text-2xl font-semibold text-slate-800">{summary.chargedRequestsCount ?? 0}</div>
          <p className="text-sm text-slate-400 mt-1">Requests marked as charged</p>
        </div>
      </div>

      {/* New Request Form (inline) */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">New Maintenance Request</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Property</label>
              <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50">
                {tenantProperty ? (
                  <p>{tenantProperty.name || "Property"} - {tenantProperty.address || "Address unavailable"}</p>
                ) : (
                  <p className="text-slate-400">Loading property...</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Issue Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g. Broken heating unit"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold rounded-lg transition"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600 font-medium">No maintenance requests found</p>
        </div>
      ) : (
        <>
          {/* Requests table (lg+) */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Issue</th>
                <th className="text-left px-5 py-4">Submitted</th>
                <th className="text-left px-5 py-4">Cost</th>
                <th className="text-left px-5 py-4">Priority</th>
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRequests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Wrench size={17} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-700">{r.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5 max-w-xs truncate">{r.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">{r.date}</td>
                  <td className="px-5 py-5 text-sm text-slate-700">€{r.cost ? Number(r.cost).toLocaleString() : '0'}</td>
                  <td className="px-5 py-5">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.priorityColor}`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    {isReadOnly ? (
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.statusColor}`}>
                        {r.status}
                      </span>
                    ) : (
                      <select value={r.status} onChange={(e) => setRequests(requests.map(req => req.id === r.id ? {...req, status: e.target.value, statusColor: e.target.value === "Open" ? "bg-slate-100 text-slate-600" : e.target.value === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"} : req))} className={`text-xs font-semibold px-3 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer ${r.statusColor}`}>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => handleViewDetails(r.id)} aria-label="View maintenance details" className="inline-flex items-center justify-center px-3 py-2 bg-[#f0fdfa] text-gray-800 rounded-lg transition hover:bg-teal-100">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-2">
        {paginatedRequests.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <Wrench size={17} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{r.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{r.desc}</div>
                    <div className="mt-2 text-xs text-slate-400">Submitted: {r.date}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.priorityColor}`}>{r.priority}</span>
                {isReadOnly ? (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.statusColor}`}>
                    {r.status}
                  </span>
                ) : (
                  <select value={r.status} onChange={(e) => setRequests(requests.map(req => req.id === r.id ? {...req, status: e.target.value, statusColor: e.target.value === "Open" ? "bg-slate-100 text-slate-600" : e.target.value === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"} : req))} className={`text-xs font-semibold px-2 py-1 rounded-full border-0 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer ${r.statusColor}`}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">€{r.cost ? Number(r.cost).toLocaleString() : '0'}</div>
              {r.isCharged && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Charged</span>}
            </div>

            <button onClick={() => handleViewDetails(r.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition mt-3">
              <Eye size={13} /> View Details
            </button>
          </div>
        ))}\n      </div>

      {/* Pagination */}
      {requests.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-3 xl:mt-4">
          <Pagination
            total={requests.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

      {/* Details Modal */}
      {detailsOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/35" onClick={() => setDetailsOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg z-50 overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Maintenance Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Request information and charge note</p>
              </div>
              <button onClick={() => setDetailsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition">
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex items-center justify-center py-12 px-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Title</p>
                  <p className="text-sm text-slate-700 font-medium">{selectedRequest.title}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedRequest.description}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Property</p>
                  <p className="text-sm text-slate-700">{selectedRequest.property?.address || selectedRequest.property?.name || "N/A"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Priority</p>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getPriorityColor(mapPriority(selectedRequest.priority))}`}>
                      {mapPriority(selectedRequest.priority)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(mapStatus(selectedRequest.status))}`}>
                      {mapStatus(selectedRequest.status)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Reported By</p>
                  <p className="text-sm text-slate-700">{selectedRequest.reportedBy?.user?.name || selectedRequest.reportedBy?.user?.email || "Unknown"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Created</p>
                    <p className="text-sm text-slate-700">{selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Updated</p>
                    <p className="text-sm text-slate-700">{selectedRequest.updatedAt ? new Date(selectedRequest.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Cost</p>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-slate-700">{selectedRequest.cost != null ? `€${Number(selectedRequest.cost).toLocaleString()}` : '€0'}</div>
                    {selectedRequest.isCharged && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Charged</span>}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Charge Note</p>
                  <p className="text-sm text-slate-600">{selectedRequest.chargeNote ?? 'No charge note'}</p>
                </div>
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setDetailsOpen(false)} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition">Close</button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </TenantShell>
  );
}
