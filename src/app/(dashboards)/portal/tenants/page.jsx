"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import { Eye, Search, ChevronDown } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";

const mockTenants = [
  { id: 1, name: "Ellis Davis", property: "Apt 4 Willow Court", start: "Aug 1, 2023", pps: "1234567SA", status: "Let", statusColor: "bg-teal-100 text-teal-700" },
  { id: 2, name: "Stephen Blake", property: "Apt 306 Fairview Rd", start: "May 19, 2023", pps: "8765432TA", status: "Let", statusColor: "bg-teal-100 text-teal-700" },
  { id: 3, name: "Kevin Madden", property: "Apt 5B Rosewood Close", start: "Oct 10, 2022", pps: "—", status: "Notice Served", statusColor: "bg-amber-100 text-amber-700", late: "Rent 5 Days Late" },
  { id: 4, name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Aug 3, 2023", pps: "9876543L", status: "Let", statusColor: "bg-teal-100 text-teal-700" },
  { id: 5, name: "Adam Walsh", property: "Apt 104 Elmwood Grove", start: "Jul 15, 2021", pps: "9876543L", status: "Ended", statusColor: "bg-slate-100 text-slate-500" },
];

export default function TenantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: Map tenancy status to display status
  const mapTenancyStatus = (status) => {
    const statusMap = {
      "ACTIVE": "Active",
      "NOTICE": "Notice Served",
      "ENDED": "Ended"
    };
    return statusMap[status] || status;
  };

  // Helper: Get status color
  const getStatusColor = (tenancyStatus, rentStatus) => {
    if (tenancyStatus === "NOTICE") return "bg-amber-100 text-amber-700";
    if (tenancyStatus === "ENDED") return "bg-slate-100 text-slate-500";
    if (rentStatus === "OVERDUE") return "bg-red-100 text-red-700";
    return "bg-teal-100 text-teal-700";
  };

  // Fetch tenants from API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/landlord/tenants`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch tenants: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          // Transform API response to match UI format
          const transformed = data.data.map((tenant) => ({
            id: tenant.tenantId,
            tenancyId: tenant.tenancyId,
            name: tenant.user?.name || "Unknown",
            email: tenant.user?.email || "",
            property: tenant.property?.address || tenant.property?.name || "Unknown Property",
            start: tenant.startDate ? new Date(tenant.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
            tenancyStatus: tenant.tenancyStatus,
            rentStatus: tenant.rentStatus,
            rent: tenant.rent,
            status: mapTenancyStatus(tenant.tenancyStatus),
            statusColor: getStatusColor(tenant.tenancyStatus, tenant.rentStatus),
          }));
          setTenants(transformed);
        } else {
          setError("No tenants found");
          setTenants([]);
        }
      } catch (err) {
        console.warn("Error fetching tenants:", err);
        setError(err.message);
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Delete tenant handler
  const handleDeleteTenant = async (tenant) => {
    const result = await Swal.fire({
      title: "Delete Tenant?",
      text: `Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenants/${tenant.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      setTenants((prevTenants) => prevTenants.filter((t) => t.id !== tenant.id));
      Swal.fire({ icon: "success", title: "Deleted!", timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error("Error deleting tenant:", err);
      Swal.fire("Error", err.message || "Failed to delete tenant", "error");
    }
  };

  return (
    <PortalShell>
      <div className="mb-3 lg:mb-5">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Tenants</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 lg:gap-3 mb-2 lg:mb-4">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition shadow-sm">
          All Statuses <ChevronDown size={15} />
        </button>
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : tenants.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600 font-medium">No tenants found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {tenants.map((t) => (
            <div key={t.id} className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-700">{t.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${t.statusColor}`}>{t.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <p className="text-slate-400">Property</p>
                  <p className="text-slate-700">{t.property}</p>
                </div>
                <div>
                  <p className="text-slate-400">Start Date</p>
                  <p className="text-slate-700">{t.start}</p>
                </div>

              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/portal/tenants/${t.tenancyId}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg transition font-medium"
                  aria-label={`View ${t.name} details`}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-4">Property Address</th>
                <th className="text-left px-5 py-4">Tenancy Start</th>
                {/* <th className="text-left px-5 py-4">P.P.S. Number</th> */}
                <th className="text-left px-5 py-4">Status</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 text-base font-semibold text-slate-700">{t.name}</td>
                  <td className="px-5 py-5 text-base text-slate-600">{t.property}</td>
                  <td className="px-5 py-5 text-base text-slate-600">{t.start}</td>
                  {/* <td className="px-5 py-5 font-mono text-sm text-slate-600">{t.pps}</td> */}
                  <td className="px-5 py-5">
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${t.statusColor}`}>
                      {t.status}
                    </span>

                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/portal/tenants/${t.tenancyId}`}
                        className="inline-flex items-center justify-center px-3 py-2 bg-teal-50 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700 rounded-lg transition"
                        aria-label={`View ${t.name} details`}
                        title="View tenant details"
                      >
                        <Eye size={16} />
                      </Link>
                      {/* delete button removed for landlord view */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          total={tenants.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
        </div>
      )}
    </PortalShell>
  );
}
