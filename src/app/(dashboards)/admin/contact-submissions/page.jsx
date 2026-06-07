"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Search, Eye, Trash2, MessageSquare, AlertCircle, Loader } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";

const TYPE_COLORS = {
  LANDLORD: "bg-purple-100 text-purple-700",
  TENANT: "bg-teal-100 text-teal-700",
  FREE_VALUATION: "bg-blue-100 text-blue-700",
  OTHER: "bg-slate-100 text-slate-600",
};

const TYPE_LABELS = {
  LANDLORD: "Landlord Inquiry",
  TENANT: "Tenant Inquiry",
  FREE_VALUATION: "Property Valuation",
  OTHER: "Other",
};

const STATUS_COLORS = {
  NEW: "bg-blue-100 text-blue-700",
  READ: "bg-slate-100 text-slate-700",
  REPLIED: "bg-teal-100 text-teal-700",
  CLOSED: "bg-slate-200 text-slate-600",
};

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch submissions on mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      const contactsArray = Array.isArray(data?.data) ? data.data : [];
      
      // Transform API response to UI format
      const transformed = contactsArray.map((contact) => ({
        id: contact.id,
        name: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        type: (contact.enquiryType || "OTHER").toLowerCase(),
        enquiryType: contact.enquiryType,
        message: contact.message,
        date: new Date(contact.createdAt).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: contact.status,
        adminNote: contact.adminNote,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      }));

      setSubmissions(transformed);
    } catch (err) {
      setError(err.message || "Failed to load submissions");
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const selected = submissions.find((s) => s.id === selectedId);

  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.message.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || s.enquiryType === typeFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  function openDetails(id) {
    setSelectedId(id);
    setShowDetails(true);
    // Mark as READ when opened
    markAsRead(id);
  }

  function closeDetails() {
    setSelectedId(null);
    setShowDetails(false);
  }

  function markAsRead(id) {
    // Update local state to mark as READ
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id && s.status === "NEW" ? { ...s, status: "READ" } : s
      )
    );
  }

  const unreadCount = submissions.filter((s) => s.status === "NEW").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Contact Submissions</h1>
          <p className="text-slate-500 mt-1 text-sm lg:text-base">Manage inquiries from your landing page contact form</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load submissions</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchSubmissions}
              className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader size={32} className="mx-auto text-slate-300 mb-3 animate-spin" />
            <p className="text-slate-500">Loading submissions...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <div className="flex-1 min-w-[260px] relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search submissions…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="All">All Types</option>
              <option value="LANDLORD">Landlord Inquiry</option>
              <option value="TENANT">Tenant Inquiry</option>
              <option value="FREE_VALUATION">Property Valuation</option>
              <option value="OTHER">Other</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="All">All Status</option>
              <option value="NEW">New</option>
              <option value="READ">Read</option>
              <option value="REPLIED">Replied</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Submissions List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">
                    {submissions.length === 0 ? "No submissions yet" : "No submissions match your filters"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => openDetails(s.id)}
                      style={{ borderLeftColor: selectedId === s.id ? '#0d9488' : '#e2e8f0' }}
                      className={`w-full text-left px-4 py-4 sm:px-5 sm:py-4 hover:bg-slate-50 transition border-l-4 ${s.status === "NEW" ? "bg-blue-50/30" : ""} ${selectedId === s.id ? "bg-slate-50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-base lg:text-lg text-slate-800 truncate">{s.name}</p>
                            {s.status === "NEW" && <span className="shrink-0 w-2 h-2 rounded-full bg-blue-600"></span>}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{s.email}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_COLORS[s.enquiryType]}`}
                            >
                              {TYPE_LABELS[s.enquiryType]}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[s.status]}`}
                            >
                              {s.status}
                            </span>
                            <span className="text-xs text-slate-400">{s.date}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit lg:sticky lg:top-4">
              {selectedId ? (
                <>
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <MessageSquare size={16} className="text-teal-600" />
                      Message Details
                    </h2>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Contact Info */}
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Name</p>
                      <p className="text-sm font-semibold text-slate-800">{selected?.name}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Email</p>
                      <a href={`mailto:${selected?.email}`} className="text-sm text-teal-600 hover:underline break-all">
                        {selected?.email}
                      </a>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Phone</p>
                      <a href={`tel:${selected?.phone}`} className="text-sm text-teal-600 hover:underline">
                        {selected?.phone}
                      </a>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Type</p>
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[selected?.enquiryType]}`}
                      >
                        {TYPE_LABELS[selected?.enquiryType]}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Status</p>
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[selected?.status]}`}
                      >
                        {selected?.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Date</p>
                      <p className="text-sm text-slate-600">{selected?.date}</p>
                    </div>

                    {selected?.adminNote && (
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Admin Note</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selected?.adminNote}</p>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Message</p>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">{selected?.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={closeDetails}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      <Eye size={14} />
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Eye size={24} className="mx-auto text-slate-300 mb-2 opacity-50" />
                  <p className="text-sm">Select a submission to view details</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
