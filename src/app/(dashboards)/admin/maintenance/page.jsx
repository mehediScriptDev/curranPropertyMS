"use client";
import { useState, useEffect } from "react";
import {
  Plus, ChevronDown, Search, ArrowUpDown, Eye, Trash2, CheckCircle2
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";
import Swal from "sweetalert2";
import { authenticatedFetch } from "@/utils/authFetch";

const STATUS_STYLE = {
  "Open":        "bg-slate-100 text-slate-600",
  "In Progress": "bg-amber-100 text-amber-700",
  "Closed":      "bg-teal-100 text-teal-700",
};

const PRIORITY_STYLE = {
  High:   "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low:    "bg-green-100 text-green-700",
};

export default function AdminMaintenancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggerFetch, setTriggerFetch] = useState(0);
  
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [costAmount, setCostAmount] = useState("");
  const [costVendor, setCostVendor] = useState("");
  const [costDate, setCostDate] = useState("");
  const [costs, setCosts] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Helper: Generate initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Helper: Get consistent color for name
  const getNameColor = (name) => {
    const colors = ["bg-teal-500", "bg-orange-500", "bg-rose-500", "bg-emerald-600", "bg-indigo-500", "bg-sky-600", "bg-pink-500", "bg-amber-600", "bg-violet-500", "bg-cyan-600"];
    return colors[(name || "").charCodeAt(0) % colors.length];
  };

  // Helper: Map backend status to frontend status
  const mapStatus = (backendStatus) => {
    const mapping = {
      "OPEN": "Open",
      "IN_PROGRESS": "In Progress",
      "CLOSED": "Closed"
    };
    return mapping[backendStatus] || backendStatus;
  };

  // Helper: Map backend priority to frontend priority
  const mapPriority = (backendPriority) => {
    return backendPriority.charAt(0) + backendPriority.slice(1).toLowerCase();
  };

  // Helper: Compute relative time
  const computeAge = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Fetch maintenance requests from API
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance`
        );
        if (!response.ok) throw new Error("Failed to fetch maintenance");
        const result = await response.json();
        if (result.success && result.data) {
          const mapped = result.data.map((item) => ({
            id: item.id,
            col: mapStatus(item.status),
            title: item.title,
            description: item.description,
            priority: mapPriority(item.priority),
            assignee: {
              initials: getInitials(item.reportedBy?.user?.name),
              color: getNameColor(item.reportedBy?.user?.name || "")
            },
            name: item.reportedBy?.user?.name || "Unknown",
            property: item.property?.address || item.property?.name || "Unknown Property",
            propertyRaw: item.property || null,
            reportedByRaw: item.reportedBy || null,
            age: computeAge(item.createdAt),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            closedAt: item.closedAt,
            cost: item.cost != null ? Number(item.cost) : null,
            isCharged: !!item.isCharged,
            chargeNote: item.chargeNote || null,
          }));
          setRequests(mapped);
        }
      } catch (error) {
        console.error("Error fetching maintenance:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load maintenance requests",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, [triggerFetch]);

  // Load costs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("maintenanceCosts");
    if (stored) setCosts(JSON.parse(stored));
  }, []);

  // Save costs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("maintenanceCosts", JSON.stringify(costs));
  }, [costs]);

  const openCostModal = (requestId) => {
    setSelectedRequestId(requestId);
    const existing = costs[requestId];
    if (existing) {
      setCostAmount(existing.amount || "");
      setCostVendor(existing.vendor || "");
      setCostDate(existing.date || "");
    } else {
      setCostAmount("");
      setCostVendor("");
      setCostDate("");
    }
    setCostModalOpen(true);
  };

  const closeCostModal = () => {
    setCostModalOpen(false);
    setSelectedRequestId(null);
    setCostAmount("");
    setCostVendor("");
    setCostDate("");
  };

  const handleSaveCost = async (e) => {
    e.preventDefault();
    if (!costAmount || !costDate) {
      Swal.fire("Error", "Amount and Date are required", "error");
      return;
    }
    try {
      const newCosts = {
        ...costs,
        [selectedRequestId]: {
          amount: parseFloat(costAmount),
          vendor: costVendor,
          date: costDate,
          savedAt: new Date().toISOString(),
        },
      };
      setCosts(newCosts);
      Swal.fire({ icon: "success", title: "Cost saved!", timer: 2000, showConfirmButton: false });
      closeCostModal();
    } catch (err) {
      Swal.fire("Error", "Failed to save cost", "error");
    }
  };

  const getCostForRequest = (requestId) => costs[requestId];

  // Handle delete maintenance request
  const handleDeleteMaintenance = async (requestId, title) => {
    const confirmed = await Swal.fire({
      title: "Delete Maintenance Request?",
      text: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/${requestId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete maintenance");
      Swal.fire({
        title: "Deleted!",
        text: "Maintenance request has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      setTriggerFetch(prev => prev + 1);
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      Swal.fire("Error!", "Failed to delete maintenance request", "error");
    }
  };

  // Handle status change with API update
  const handleStatusChange = async (requestId, newFrontendStatus) => {
    // Map frontend status to backend status
    const statusMap = {
      "Open": "OPEN",
      "In Progress": "IN_PROGRESS",
      "Closed": "CLOSED"
    };

    const backendStatus = statusMap[newFrontendStatus];
    if (!backendStatus) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/${requestId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: backendStatus })
        }
      );

      if (!response.ok) throw new Error("Failed to update maintenance status");
      Swal.fire({
        title: "Updated!",
        text: `Status changed to ${newFrontendStatus}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      setTriggerFetch(prev => prev + 1);
    } catch (error) {
      console.error("Error updating maintenance status:", error);
      Swal.fire("Error!", "Failed to update maintenance status", "error");
    }
  };

  // Fetch maintenance details for modal
  const handleViewDetails = async (requestId) => {
    try {
      setDetailsLoading(true);
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/maintenance/${requestId}`);
      if (!res.ok) throw new Error('Failed to fetch details');
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedDetails(json.data);
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

  

  const filtered = requests.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.property.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.col === statusFilter;
    const matchPriority = priorityFilter === "All" || r.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Maintenance</h1>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading maintenance requests...</p>
        </div>
      )}

      {!loading && (
        <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[180px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tenant, issue or property…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">
          <option value="All">Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {/* three-dots removed per request */}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-800 text-sm">{r.title}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${PRIORITY_STYLE[r.priority]}`}>
                {r.priority}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full ${r.assignee.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {r.assignee.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                <p className="text-xs text-slate-400">{r.property}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <select value={r.col} onChange={(e) => handleStatusChange(r.id, e.target.value)} className="text-xs font-semibold px-2.5 py-1 rounded-full border-0 focus:outline-none ring-1 ring-teal-400 cursor-pointer" style={{backgroundColor: STATUS_STYLE[r.col].split(' ')[0], color: STATUS_STYLE[r.col].split(' ')[1]}}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm font-semibold text-slate-700">€{r.cost ? Number(r.cost).toLocaleString() : '0'}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleViewDetails(r.id)} className="p-2 bg-[#f0fdfa] text-teal-700 rounded-md hover:bg-teal-100 transition" title="View details">
                  <Eye size={14} />
                </button>
                <button onClick={() => handleDeleteMaintenance(r.id, r.title)} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition" title="Delete maintenance request">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={filtered.length} />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">
                <span className="flex items-center gap-1">Issue </span>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Tenant</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Property</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Reported</th>
                <th className="px-4 py-3 text-left font-semibold text-base text-slate-600">Cost</th>
                <th className="px-4 py-3 text-right font-semibold text-base text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition">
                <td className="px-4 py-3">
                  <p className="font-semibold text-base text-slate-800">{r.title}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${r.assignee.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {r.assignee.initials}
                    </div>
                    <span className="font-medium text-slate-700">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.property}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLE[r.priority]}`}>
                    {r.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select value={r.col} onChange={(e) => handleStatusChange(r.id, e.target.value)} className="text-xs font-semibold px-2.5 py-1 rounded-full border-0 focus:outline-none ring-1 ring-teal-400 cursor-pointer" style={{backgroundColor: STATUS_STYLE[r.col].split(' ')[0], color: STATUS_STYLE[r.col].split(' ')[1]}}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400">{r.age}</td>
                <td className="px-4 py-3 text-slate-700">€{r.cost ? Number(r.cost).toLocaleString() : '0'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <button onClick={() => handleViewDetails(r.id)} className="w-9 h-9 inline-flex items-center justify-center bg-[#f0fdfa] hover:bg-teal-100 text-teal-700 rounded-md transition" title="View details">
                      <Eye size={15} />
                    </button>
                    <button onClick={() => handleDeleteMaintenance(r.id, r.title)} className="w-9 h-9 inline-flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition" title="Delete maintenance request">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} />
      </div>

        </>
      )}

      {/* Record Cost Modal */}
      {costModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeCostModal} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 z-50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Record Maintenance Cost</h3>
                <p className="text-sm text-slate-500 mt-1">Add cost details for this maintenance request.</p>
              </div>
              <button aria-label="Close" onClick={closeCostModal} className="text-slate-500 hover:text-slate-700 text-lg">✕</button>
            </div>
            <form onSubmit={handleSaveCost} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costAmount}
                  onChange={(e) => setCostAmount(e.target.value)}
                  placeholder="e.g., 150.00"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vendor / Contractor</label>
                <input
                  type="text"
                  value={costVendor}
                  onChange={(e) => setCostVendor(e.target.value)}
                  placeholder="e.g., Local Plumber Ltd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={costDate}
                  onChange={(e) => setCostDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>
              <div className="flex items-center gap-3 justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeCostModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Save Cost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Details Modal */}
      {detailsOpen && selectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDetailsOpen(false)} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Maintenance Details</h3>
                <p className="text-sm text-slate-500 mt-1">Request information and charge note</p>
              </div>
              <button aria-label="Close" onClick={() => setDetailsOpen(false)} className="text-slate-500 hover:text-slate-700 text-lg">✕</button>
            </div>

            {detailsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Title</p>
                  <p className="text-sm text-slate-700 font-medium">{selectedDetails.title}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Description</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedDetails.description}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Property</p>
                  <p className="text-sm text-slate-700">{selectedDetails.property?.address || selectedDetails.property?.name || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Priority</p>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLE[mapPriority(selectedDetails.priority)]}`}>
                      {mapPriority(selectedDetails.priority)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[mapStatus(selectedDetails.status)]}`}>
                      {mapStatus(selectedDetails.status)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Reported By</p>
                  <p className="text-sm text-slate-700">{selectedDetails.reportedBy?.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{selectedDetails.reportedBy?.user?.email || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Created</p>
                    <p className="text-sm text-slate-700">{selectedDetails.createdAt ? new Date(selectedDetails.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Updated</p>
                    <p className="text-sm text-slate-700">{selectedDetails.updatedAt ? new Date(selectedDetails.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Cost</p>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-slate-700">{selectedDetails.cost != null ? `€${Number(selectedDetails.cost).toLocaleString()}` : '€0'}</div>
                    {selectedDetails.isCharged && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Charged</span>}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Charge Note</p>
                  <p className="text-sm text-slate-600">{selectedDetails.chargeNote ?? 'No charge note'}</p>
                </div>

                {selectedDetails.closedAt && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Closed</p>
                    <p className="text-sm text-slate-700">{new Date(selectedDetails.closedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-slate-200">
              <button onClick={() => setDetailsOpen(false)} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
