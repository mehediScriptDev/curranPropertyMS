"use client";

import { useState, useEffect } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import Pagination from "@/components/portal/Pagination";
import { FileText, Download } from "lucide-react";
import Swal from "sweetalert2";
import { authenticatedFetch } from "@/utils/authFetch";

// Type styling
const TYPE_STYLE = {
  LEASE: { label: "Lease", style: "bg-blue-50 text-blue-700" },
  INVOICE: { label: "Invoice", style: "bg-teal-50 text-teal-700" },
  STATEMENT: { label: "Statement", style: "bg-teal-50 text-teal-700" },
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

// Format file size
function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// Transform API response to UI format
function transformDocument(apiDoc) {
  const typeUpper = (apiDoc.type || "").toUpperCase();
  const typeInfo = TYPE_STYLE[typeUpper] || { label: apiDoc.type || "Unknown", style: "bg-slate-50 text-slate-600" };

  return {
    id: apiDoc.id,
    name: apiDoc.name,
    type: typeInfo.label,
    typeStyle: typeInfo.style,
    fileUrl: apiDoc.fileUrl,
    fileSize: formatFileSize(apiDoc.fileSize),
    uploadedAt: getRelativeTime(apiDoc.createdAt),
    createdAt: apiDoc.createdAt,
  };
}

export default function TenantDocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Pagination logic
  const totalPages = Math.ceil(docs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocs = docs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
        <p className="text-slate-500 mt-1 text-sm">All documents related to your tenancy</p>
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
      {!loading && !error && docs.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No documents found for your tenancy.</p>
        </div>
      )}

      {/* Table (lg+) */}
      {!loading && !error && docs.length > 0 && (
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Document</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Date</th>
                
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDocs.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-slate-500" />
                      </div>
                      <span className="text-base font-semibold text-slate-700">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${d.typeStyle}`}>{d.type}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{d.uploadedAt}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleDownload(d)} title="Download" className="inline-flex items-center justify-center p-2.5 text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-lg transition">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Mobile cards */}
      {!loading && !error && docs.length > 0 && (
      <div className="lg:hidden space-y-2">
        {paginatedDocs.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{d.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{d.uploadedAt}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${d.typeStyle}`}>{d.type}</span>
                </div>
              </div>
              <button onClick={() => handleDownload(d)} title="Download" className="flex-shrink-0 inline-flex items-center justify-center p-2.5 text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-lg transition">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Pagination */}
      {docs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-3 xl:mt-4">
          <Pagination
            total={docs.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

    </TenantShell>
  );
}
