"use client";

import { useEffect, useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { authenticatedFetch } from "@/utils/authFetch";
import {
  Home,
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Clock,
} from "lucide-react";

export default function TenantPropertyPage() {
  const [tenancy, setTenancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenancy = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenancies/my`,
        );
        if (!res.ok)
          throw new Error(`Failed to load tenancy: ${res.statusText}`);
        const body = await res.json();
        if (body.success && Array.isArray(body.data) && body.data.length > 0) {
          setTenancy(body.data[0]);
        } else {
          // No error thrown here to prevent the call stack overlay
          setError("No tenancy found");
        }
      } catch (err) {
        console.error("Error fetching tenancy:", err);
        setError(err.message || "Failed to load tenancy");
      } finally {
        setLoading(false);
      }
    };
    fetchTenancy();
  }, []);

  const details = tenancy
    ? [
        { label: "Property Address", value: tenancy.property?.address || "—" },
        {
          label: "Property Type",
          value: tenancy.property?.propertyType || "—",
        },
        { label: "Bedrooms", value: tenancy.property?.bedrooms || "—" },
        { label: "Monthly Rent", value: `€${tenancy.rent}` },
        {
          label: "Tenancy Start",
          value: tenancy.startDate
            ? new Date(tenancy.startDate).toLocaleDateString()
            : "—",
        },
        { label: "RTB Status", value: tenancy.rtbRegistration || "—" },
        { label: "MPRN", value: tenancy.property?.mprn || "—" },
        { label: "Landlord", value: tenancy.landlord?.name || "—" },
        { label: "Managing Agent", value: tenancy.landlord?.name || "—" },
        { label: "Agent Phone", value: "—" },
        { label: "Agent Email", value: tenancy.landlord?.email || "—" },
      ]
    : [];

  const timeline = tenancy
    ? [
        {
          date: tenancy.startDate
            ? new Date(tenancy.startDate).toLocaleDateString()
            : "—",
          event: "Tenancy commenced",
          Icon: CheckCircle2,
          color: "text-teal-600 bg-teal-50",
        },
        {
          date: tenancy.rentReviewDate
            ? new Date(tenancy.rentReviewDate).toLocaleDateString()
            : "—",
          event: "Annual rent review",
          Icon: CreditCard,
          color: "text-blue-600 bg-blue-50",
        },
        {
          date: tenancy.rtbRegistrationDate
            ? new Date(tenancy.rtbRegistrationDate).toLocaleDateString()
            : "—",
          event: "RTB Registration",
          Icon: FileText,
          color: "text-purple-600 bg-purple-50",
        },
        {
          date: tenancy.endDate
            ? new Date(tenancy.endDate).toLocaleDateString()
            : "—",
          event: "Lease expiry date",
          Icon: Calendar,
          color: "text-amber-600 bg-amber-50",
        },
      ]
    : [];
  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">My Property</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Full details about your rented property and tenancy
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : error === "No tenancy found" ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
            <Clock size={40} className="text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            Tenancy Information Pending
          </h1>
          <p className="text-slate-600 leading-relaxed font-medium">
            We couldn't find your active tenancy details in our system yet.
          </p>
          <p className="text-slate-500 text-sm mt-3">
            Our administrators are currently connecting your property and tenant
            profile. Once connected, your full dashboard will be visible here.
          </p>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-400 text-xs italic">
              This process usually takes a few hours. Please check back later or
              contact your agent if you have questions.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-600/20"
          >
            Refresh Dashboard
          </button>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Home size={24} className="text-red-600" />
          </div>
          <p className="text-red-700 font-bold text-lg mb-1">
            Unable to load data
          </p>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-bold text-red-700 hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Details card */}
          <div className="lg:col-span-2 space-y-3 xl:space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Property banner */}
              <div className="w-full h-44 bg-gradient-to-br from-teal-100 via-slate-100 to-blue-50 flex items-center justify-center relative">
                <Home size={72} className="text-teal-200" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-600 text-white">
                    Let
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3 mb-5">
                  <MapPin size={18} className="text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {tenancy?.property?.name || "—"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                      {tenancy?.property?.county ||
                        tenancy?.property?.address ||
                        "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {details.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between border-b border-slate-50 pb-3"
                    >
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                Tenancy Timeline
              </h3>
            </div>
            <div className="px-8 py-3">
              <ol className="relative border-l-2 border-slate-100 space-y-6">
                {timeline.map((item, i) => (
                  <li key={i} className="pl-6 relative">
                    <span
                      className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}
                    >
                      <item.Icon size={15} />
                    </span>
                    <p className="text-sm font-semibold text-slate-700">
                      {item.event}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </TenantShell>
  );
}
