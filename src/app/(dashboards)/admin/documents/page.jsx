"use client";
import { useState, useEffect } from "react";
import {
  Plus, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, Download, FileText, Trash2
} from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "@/components/portal/Pagination";
import { authenticatedFetch } from "@/utils/authFetch";

const TYPE_STYLE = {
  LEASE: "bg-teal-100 text-teal-700",
  INVOICE: "bg-teal-100 text-teal-700",
  STATEMENT: "bg-indigo-100 text-indigo-700",
  CONTRACT: "bg-teal-100 text-teal-700",
  REFERENCE: "bg-blue-100 text-blue-700",
  NOTICE: "bg-amber-100 text-amber-700",
  DEMAND: "bg-orange-100 text-orange-700",
  TERMINATION: "bg-red-100 text-red-700",
  WARNING: "bg-rose-100 text-rose-700",
};

// Calculate relative time
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// Transform API response to UI format
function transformDocument(apiDoc) {
  const typeUpper = (apiDoc.type || "").toUpperCase();
  const displayTypes = {
    LEASE: "Lease",
    INVOICE: "Invoice",
    STATEMENT: "Statement",
    CONTRACT: "Contract",
    REFERENCE: "Reference",
    NOTICE: "Notice",
    DEMAND: "Demand",
    TERMINATION: "Termination",
    WARNING: "Warning",
  };
  return {
    id: apiDoc.id,
    propertyId: apiDoc.property?.id || "",
    icon: "teal",
    name: apiDoc.name,
    sub: apiDoc.property?.name || "Unknown Property",
    type: displayTypes[typeUpper] || apiDoc.type,
    typeStyle: TYPE_STYLE[typeUpper] || "bg-teal-100 text-teal-700",
    property: apiDoc.property?.name || "Unknown",
    visibility: apiDoc.visibility || [],
    uploader: apiDoc.uploadedBy?.name || "Unknown",
    age: getRelativeTime(apiDoc.createdAt),
    fileUrl: apiDoc.fileUrl,
    fileSize: apiDoc.fileSize,
    createdAt: apiDoc.createdAt,
  };
}

export default function AdminDocumentsPage() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState("All Properties");
  const [docs, setDocs] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState("LEASE");
  const [uploadPropertyId, setUploadPropertyId] = useState("");
  const [uploadVisibility, setUploadVisibility] = useState({ TENANT: true, LANDLORD: true, ADMIN: true });

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch documents: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          const transformed = data.data.map(doc => transformDocument(doc));
          setDocs(transformed);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(err.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          const propList = data.data.map(prop => ({
            id: prop.id,
            name: prop.name,
          }));
          setProperties(propList);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filtered = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.property.toLowerCase().includes(search.toLowerCase())
  ).filter((d) => (propertyFilter === "All Properties" ? true : d.property.includes(propertyFilter)))
    .filter((d) => (typeFilter === 'All' ? true : d.type === typeFilter));

  const openUpload = () => setUploadOpen(true);
  const closeUpload = () => {
    setUploadOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadFile(null);
    setPreviewUrl(null);
    setPreviewType(null);
    setUploadName("");
    setUploadType("LEASE");
    setUploadPropertyId("");
    setUploadVisibility({ TENANT: true, LANDLORD: true, ADMIN: true });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setUploadFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }
    setUploadFile(f);
    const isImage = f.type && f.type.startsWith("image/");
    if (isImage) {
      const url = URL.createObjectURL(f);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(url);
      setPreviewType("image");
    } else {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPreviewType("file");
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents/${doc.id}/download`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = doc.name || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Error downloading document:", err);
      Swal.fire("Error", err.message || "Failed to download document", "error");
    }
  };

  const handleDeleteDocument = async (doc) => {
    const result = await Swal.fire({
      title: "Delete Document?",
      text: `Are you sure you want to delete "${doc.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents/${doc.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      setDocs((prevDocs) => prevDocs.filter((d) => d.id !== doc.id));
      Swal.fire({icon: "success", title: "Deleted!", timer: 2000, showConfirmButton: false});
    } catch (err) {
      console.error("Error deleting document:", err);
      Swal.fire("Error", err.message || "Failed to delete document", "error");
    }
  };

  const exportSelected = () => {
    const rows = docs.filter((d) => selected.includes(d.id));
    if (rows.length === 0) {
      Swal.fire({
        title: 'No Selection',
        text: 'Please select documents to export',
        icon: 'info',
      });
      return;
    }
    const header = ['Name','Type','Property','Uploaded By','Age'];
    const csv = [header.join(',')].concat(
      rows.map(r => [r.name, r.type || '', r.property.replace(/\n/g,' '), r.uploader, r.age].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documents_export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const deleteSelected = () => {
    if (selected.length === 0) {
      Swal.fire({
        title: 'No Selection',
        text: 'Please select documents to delete',
        icon: 'info',
      });
      return;
    }
    if (!confirm(`Delete ${selected.length} selected document(s)? This is a client-side mock.`)) {
      return;
    }
    setDocs((d) => d.filter(x => !selected.includes(x.id)));
    setSelected([]);
  };

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((d) => d.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Documents</h1>
        <div className="flex items-center gap-2">
          <button onClick={openUpload} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            <Plus size={15} /> <span className="hidden sm:inline">Upload Document</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-slate-600">Loading documents...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-2xl border border-red-200 shadow-sm p-4">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {/* No Documents State */}
      {!loading && !error && filtered.length === 0 && docs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No documents found. Upload your first document to get started.</p>
        </div>
      )}

      {/* Filters - always visible when not loading */}
      {!loading && !error && (
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
          />
        </div>

        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400">
          <option>All Properties</option>
          {properties.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-36">
          <option value="All">All Types</option>
          <option value="LEASE">Lease</option>
          <option value="INVOICE">Invoice</option>
          <option value="STATEMENT">Statement</option>
          <option value="CONTRACT">Contract</option>
          <option value="REFERENCE">Reference</option>
          <option value="NOTICE">Notice</option>
          <option value="DEMAND">Demand</option>
          <option value="TERMINATION">Termination</option>
          <option value="WARNING">Warning</option>
        </select>
        {/* visibility select removed as requested */}
        {/* <div className="flex-1" /> */}
        {/* actions select removed as requested */}
      </div>
      )}

      {/* No Results State */}
      {!loading && !error && filtered.length === 0 && docs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No documents match your current filters.</p>
        </div>
      )}

      {/* Content - show when there is data OR when upload modal is open */}
      {!loading && !error && (filtered.length > 0 || uploadOpen) && (
      <div>
      {/* Upload modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeUpload} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Upload Document</h3>
                <p className="text-sm text-slate-500 mt-1">Add a new document to the system</p>
              </div>
              <button aria-label="Close" onClick={closeUpload} className="text-slate-500 hover:text-slate-700 text-2xl leading-none">×</button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!uploadFile) {
                  Swal.fire("Error", "Please select a file", "error");
                  return;
                }
                if (!uploadName) {
                  Swal.fire("Error", "Please enter a document name", "error");
                  return;
                }
                if (!uploadPropertyId) {
                  Swal.fire("Error", "Please select a property", "error");
                  return;
                }

                try {
                  const formData = new FormData();
                  formData.append("file", uploadFile);
                  formData.append("name", uploadName);
                  formData.append("type", uploadType);
                  formData.append("propertyId", uploadPropertyId);
                  
                  // Append visibility - ADMIN is always included
                  const visArray = Object.keys(uploadVisibility).filter(k => uploadVisibility[k]);
                  formData.append("visibility", visArray.join(","));

                  console.log("Uploading document:", {
                    name: uploadName,
                    type: uploadType,
                    propertyId: uploadPropertyId,
                    visibility: visArray.join(","),
                    fileSize: uploadFile.size,
                  });

                  const response = await authenticatedFetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMsg = errorData.message || `Upload failed (${response.status})`;
                    throw new Error(errorMsg);
                  }

                  const data = await response.json();
                  if (data.success && data.data) {
                    const newDoc = transformDocument(data.data);
                    setDocs((d) => [newDoc, ...d]);
                    Swal.fire({ icon: "success", title: "Uploaded!", timer: 2000, showConfirmButton: false });
                  } else {
                    throw new Error(data.message || "Upload failed");
                  }

                  closeUpload();
                } catch (err) {
                  console.error("Error uploading document:", err);
                  Swal.fire("Error", err.message || "Failed to upload document", "error");
                }
              }}
              className="space-y-4"
            >
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">File *</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => { e.preventDefault(); e.currentTarget.classList.add('ring-2','ring-teal-400'); }}
                  onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('ring-2','ring-teal-400'); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('ring-2','ring-teal-400');
                    const f = e.dataTransfer?.files?.[0];
                    if (f) {
                      const fakeEvent = { target: { files: [f] } };
                      onFileChange(fakeEvent);
                    }
                  }}
                  className="border-dashed border-2 border-slate-300 rounded-lg p-6 text-center bg-slate-50 cursor-pointer hover:border-teal-400 transition"
                >
                  {uploadFile ? (
                    <div className="flex items-center gap-3 justify-center">
                      <FileText size={20} className="text-teal-600" />
                      <div className="text-left">
                        <p className="font-medium text-slate-800 text-sm">{uploadFile.name}</p>
                        <p className="text-xs text-slate-500">{Math.round(uploadFile.size / 1024)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="file"
                        onChange={onFileChange}
                        className="hidden"
                        id="doc-file-input"
                      />
                      <label htmlFor="doc-file-input" className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg cursor-pointer transition">
                        Browse Files
                      </label>
                      <p className="text-xs text-slate-500">or drag and drop</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder={uploadFile?.name || "Enter name"}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  required
                />
              </div>

              {/* Type & Property Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  >
                    <option value="LEASE">Lease</option>
                    <option value="INVOICE">Invoice</option>
                    <option value="STATEMENT">Statement</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="REFERENCE">Reference</option>
                    <option value="NOTICE">Notice</option>
                    <option value="DEMAND">Demand</option>
                    <option value="TERMINATION">Termination</option>
                    <option value="WARNING">Warning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property *</label>
                  <select
                    value={uploadPropertyId}
                    onChange={(e) => setUploadPropertyId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visibility Section */}
              <div className="border-t border-slate-200 pt-4">
                <label className="block text-sm font-medium text-slate-700 mb-3">Document Visibility</label>
                <div className="space-y-2">
                  {/* TENANT */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadVisibility.TENANT}
                      onChange={(e) => setUploadVisibility({ ...uploadVisibility, TENANT: e.target.checked })}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">Tenant</span>
                  </label>
                  {/* LANDLORD */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadVisibility.LANDLORD}
                      onChange={(e) => setUploadVisibility({ ...uploadVisibility, LANDLORD: e.target.checked })}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">Landlord</span>
                  </label>
                  {/* ADMIN - Always checked and disabled */}
                  <label className="flex items-center gap-2 cursor-not-allowed">
                    <input
                      type="checkbox"
                      checked={uploadVisibility.ADMIN}
                      disabled
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-not-allowed opacity-75"
                    />
                    <span className="text-sm text-slate-700">Admin <span className="text-xs text-slate-500">(always selected)</span></span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 justify-end mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeUpload}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile cards — visible below lg */}
      <div className="lg:hidden space-y-3">
        {filtered.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.icon === "amber" ? "bg-amber-100" : "bg-teal-100"}`}>
                <FileText size={16} className={doc.icon === "amber" ? "text-amber-600" : "text-teal-600"} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm truncate">{doc.name}</p>
                <p className="text-xs text-slate-400 truncate">{doc.sub}</p>
              </div>
              {doc.type && (
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold flex-shrink-0 ${doc.typeStyle}`}>{doc.type}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Property</p>
                <p className="font-medium text-slate-700 text-xs">{doc.property.replace("\n", " ")}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Uploaded By</p>
                <p className="font-medium text-slate-700 text-xs">{doc.uploader}</p>
              </div>
            </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{doc.age}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDownload(doc)} className="h-8 px-3 inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-md transition text-xs font-medium border border-teal-200">
                    <Download size={12} /> Download
                  </button>
                  <button onClick={() => handleDeleteDocument(doc)} className="h-8 px-3 inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition text-xs font-medium border border-red-200">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={filtered.length} />
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
                <span className="flex items-center gap-1">File Name <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Type <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                <span className="flex items-center gap-1">Property <ArrowUpDown size={12} className="text-slate-400" /></span>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Uploaded By</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Uploaded</th>
              <th className="w-20 px-3 py-3 text-right font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((doc) => (
              <tr key={doc.id} className={`hover:bg-slate-50/60 transition ${selected.includes(doc.id) ? "bg-teal-50/40" : ""}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(doc.id)} onChange={() => toggleRow(doc.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.icon === "amber" ? "bg-amber-100" : "bg-teal-100"}`}>
                      <FileText size={15} className={doc.icon === "amber" ? "text-amber-600" : "text-teal-600"} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{doc.name}</p>
                      <p className="text-sm text-slate-400">{doc.sub}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {doc.type && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-semibold ${doc.typeStyle}`}>
                      <FileText size={11} />
                      {doc.type}
                    </span>
                  )}
                  {!doc.type && doc.visibility.includes("Landlord") && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-semibold bg-amber-100 text-amber-700">
                      Landlord
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {doc.property.split("\n").map((line, i) => (
                    <p key={i} className={`text-sm ${i === 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>{line}</p>
                  ))}
                </td>
                <td className="px-3 py-3 text-slate-700 text-sm font-medium">{doc.uploader}</td>
                <td className="px-3 py-3 text-slate-400 text-sm">{doc.age}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDownload(doc)} className="w-7 h-7 flex items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-md transition border border-teal-200" title="Download">
                      <Download size={13} />
                    </button>
                    <button onClick={() => handleDeleteDocument(doc)} className="w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition border border-red-200" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} />
      </div>
      </div>
      )}
    </div>
  );
}
