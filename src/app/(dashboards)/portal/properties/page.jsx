"use client";

import { useState, useEffect } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { Eye } from "lucide-react";
import Link from "next/link";
import { authenticatedFetch } from "@/utils/authFetch";
import { usePortalAuth } from "@/context/PortalAuthContext";
import Pagination from "@/components/portal/Pagination";

// Transform API response to UI format
function transformProperty(apiProp) {
  const statusMap = {
    "LET": "Let",
    "VACANT": "Vacant",
    "NOTICE_SERVED": "Notice Served",
  };
  
  const status = statusMap[apiProp.status] || apiProp.status;
  
  const statusColorMap = {
    "Let": "bg-teal-100 text-teal-700",
    "Vacant": "bg-slate-100 text-slate-600",
    "Notice Served": "bg-orange-100 text-orange-600",
  };

  return {
    id: apiProp.id,
    status: status,
    statusColor: statusColorMap[status] || "bg-slate-100 text-slate-600",
    address: apiProp.address || "Unknown Address",
    tenant: "–", // Will fetch from tenancies if available
    rent: `€${apiProp.rent || "0"}`,
    rtb: apiProp.rtbRegistration === "REGISTERED" ? "Registered" : (apiProp.rtbRegistration === "PENDING" ? "Pending" : "Unknown"),
    rtbExpiry: apiProp.rtbNumber ? null : null, // Will need to calculate from backend if available
    mprn: apiProp.mprn || "N/A",
    bedrooms: apiProp.bedrooms,
    bathrooms: apiProp.bathrooms,
    county: apiProp.county,
    eircode: apiProp.eircode,
    propertyType: apiProp.propertyType,
    rtbNumber: apiProp.rtbNumber,
  };
}

export default function PropertiesPage() {
  const { user, loading: authLoading } = usePortalAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertiesPage, setPropertiesPage] = useState(1);
  const [propertiesLimit, setPropertiesLimit] = useState(10);
  const [propertiesTotal, setPropertiesTotal] = useState(0);

  // Fetch properties from API (server-side pagination)
  useEffect(() => {
    const fetchProperties = async () => {
      if (authLoading) return;

      if (!user) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", String(propertiesPage));
        params.append("limit", String(propertiesLimit));

        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties/my?${params.toString()}`
        );

        if (!response.ok) {
          let message = "Failed to fetch properties";
          let errData = null;
          try {
            errData = await response.json();
            message = errData?.message || errData?.error || message;
          } catch {
            if (response.status === 401) {
              message = "Session expired. Please log in again.";
            } else if (response.status) {
              message = `Failed to fetch properties (HTTP ${response.status})`;
            }
          }

          // Fallback: some accounts may not have a landlord profile row,
          // but can still access properties via the generic properties endpoint.
          if ((response.status === 404 || response.status === 400) && /landlord profile not found/i.test(message)) {
            const fallbackRes = await authenticatedFetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/properties?page=${propertiesPage}&limit=${propertiesLimit}`
            );

            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const allProps = Array.isArray(fallbackData?.data) ? fallbackData.data : [];
              const mine = allProps.filter(
                (prop) =>
                  prop?.landlord?.userId === user?.id ||
                  prop?.landlordId === user?.id ||
                  prop?.landlord?.id === user?.id
              );

              setProperties(mine.map((prop) => transformProperty(prop)));
              setPropertiesTotal(mine.length);
              return;
            }
          }

          setError(message);
          return;
        }

        const data = await response.json();
        const rows = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        const transformed = rows.map((prop) => transformProperty(prop));
        setProperties(transformed);

        // Try to read pagination info defensively
        const pagination = data.meta?.pagination || data.data?.pagination || {};
        setPropertiesTotal(pagination.totalItems || pagination.total || transformed.length);
      } catch (err) {
        console.warn("Properties fetch warning:", err?.message || err);
        setError(err.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [authLoading, user, propertiesPage, propertiesLimit]);
  const getRTBExpiryColor = (expiryDate) => {
    if (!expiryDate) return "";
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 30) {
      return "bg-red-50 text-red-700"; // Expiring soon
    } else if (daysUntilExpiry <= 90) {
      return "bg-amber-50 text-amber-700"; // Expiring in 3 months
    }
    return "bg-teal-50 text-teal-700"; // Valid for longer
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IE", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <PortalShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-2xl xl:text-3xl font-bold text-slate-800">My Properties</h1>
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

      {/* Empty State */}
      {!loading && !error && properties.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No properties found. You don't have any properties yet.</p>
        </div>
      )}

      {/* Properties Display */}
      {!loading && !error && properties.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile / tablet cards */}
        <div className="xl:hidden divide-y divide-slate-100">
          {properties.map((p, i) => (
            <div key={i} className="px-4 py-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-700">{p.address}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${p.statusColor}`}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-slate-400">Rent</p>
                  <p className="text-slate-700 font-bold">{p.rent}</p>
                </div>
                <div>
                  <p className="text-slate-400">RTB Status</p>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${p.rtb === "Registered" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>{p.rtb}</span>
                </div>
                <div>
                  <p className="text-slate-400">MPRN</p>
                  <p className="font-mono text-slate-600">{p.mprn}</p>
                </div>
              </div>
              <button aria-label="View property" className="w-full flex items-center justify-center px-3 py-2 text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                <Link href={`/portal/properties/${p.id}`} className="w-full text-center">View property</Link>
              </button>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-4">Property Address</th>
                  <th className="text-left px-5 py-4">Rent</th>
                  <th className="text-left px-5 py-4">RTB Status</th>
                  <th className="text-left px-5 py-4">MPRN</th>
                  <th className="text-right px-5 py-3">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-base font-semibold text-slate-700">{p.address}</p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-base font-bold text-slate-700">{p.rent}</p>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${p.rtb === "Registered" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"}`}>
                      {p.rtb}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-slate-500 font-mono text-sm">{p.mprn}</td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/portal/properties/${p.id}`} aria-label="View property" className="inline-flex items-center justify-center px-3 py-2 bg-[#f0fdfa] text-gray-800 rounded-lg transition hover:bg-teal-100">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          total={propertiesTotal}
          itemsPerPage={propertiesLimit}
          currentPage={propertiesPage}
          onPageChange={setPropertiesPage}
          onItemsPerPageChange={(value) => {
            setPropertiesLimit(value);
            setPropertiesPage(1);
          }}
        />
      </div>
      )}
    </PortalShell>
  );
}
