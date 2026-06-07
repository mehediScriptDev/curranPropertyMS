"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Home,
  FileText,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Shield,
  TrendingUp,
} from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";

const TABS = [
  { key: "Details", label: "Details", Icon: User },
  { key: "tenancy", label: "Tenancy", Icon: Home },
  { key: "activity", label: "Activity", Icon: TrendingUp },
];

function InfoRow({ label, value, mono = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      {children ?? (
        <p
          className={`text-base text-slate-700 font-semibold ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

export default function TenantDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Details");
  const [showPps, setShowPps] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchTenant = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.message || `Failed to load tenant (${res.status})`
          );
        }
        const result = await res.json();
        if (result.success && result.data) {
          const user = result.data;
          // Generate initials
          const initials = (user.name && user.name.trim() ? user.name : "NA")
            .split(" ")
            .map((p) => p[0] || "")
            .join("")
            .toUpperCase()
            .substring(0, 2);
          // Get a color
          const colors = [
            "bg-teal-500",
            "bg-indigo-500",
            "bg-orange-500",
            "bg-sky-600",
            "bg-emerald-600",
          ];
          const colorIndex =
            (user.id ? user.id.charCodeAt(0) : 0) % colors.length;

          if (mounted) {
            setTenant({
              ...user,
              initials,
              color: colors[colorIndex],
            });
          }
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load tenant");
          console.error("Tenant fetch error:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTenant();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-slate-600">Loading tenant...</span>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/tenants"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition"
        >
          <ArrowLeft size={15} /> Back to Tenants
        </Link>
        <div className="bg-red-50 rounded-2xl border border-red-200 shadow-sm p-4">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Link
        href="/admin/tenants"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition"
      >
        <ArrowLeft size={15} /> Back to Tenants
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl ${tenant.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}
          >
            {tenant.initials}
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
              {tenant.name}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin size={13} />
              {tenant.address || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
              activeTab === key
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === "Details" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-teal-600" />
              Tenant Details
            </h2>
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={tenant.name || "N/A"} />
              <InfoRow label="Email" value={tenant.email || "N/A"} />
              <InfoRow label="Password" mono>
                {tenant.password ? (
                  <div className="flex items-center gap-3">
                    <p className="text-base font-semibold font-mono">
                      {showPassword ? tenant.password : "••••••••"}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                ) : (
                  <p className="text-base text-slate-500">N/A</p>
                )}
              </InfoRow>
              <InfoRow label="Phone" value={tenant.phone || "N/A"} />
              <InfoRow label="Address" value={tenant.address || "N/A"} />
              <InfoRow
                label="PPS Number"
                value={tenant.ppsNumber || "N/A"}
                mono
                masked={!showPps}
              >
                {tenant.ppsNumber && (
                  <div className="flex items-center gap-3">
                    <p className={`text-base font-semibold font-mono`}>
                      {showPps ? tenant.ppsNumber : "••••••••"}
                    </p>
                    <button
                      onClick={() => setShowPps(!showPps)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {showPps ? "Hide" : "Show"}
                    </button>
                  </div>
                )}
              </InfoRow>
              <InfoRow
                label="Status"
                value={tenant.profile?.status || "N/A"}
              />
              <InfoRow
                label="Date of Birth"
                value={
                  tenant.profile?.dateOfBirth
                    ? new Date(tenant.profile.dateOfBirth).toLocaleDateString("en-IE")
                    : "N/A"
                }
              />
              <InfoRow
                label="Member Since"
                value={
                  tenant.createdAt
                    ? new Date(tenant.createdAt).toLocaleDateString()
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Tenancy Tab */}
      {activeTab === "tenancy" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Home size={16} className="text-teal-600" />
              Current Tenancy
            </h2>
          </div>
          <div className="px-5 py-4">
            {tenant.profile?.currentTenancy ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow
                    label="Property"
                    value={tenant.profile.currentTenancy.property?.name || "N/A"}
                  />
                  <InfoRow
                    label="Address"
                    value={
                      tenant.profile.currentTenancy.property?.address || "N/A"
                    }
                  />
                  <InfoRow
                    label="Status"
                    value={tenant.profile.currentTenancy.status || "N/A"}
                  />
                  <InfoRow
                    label="Monthly Rent"
                    value={`€${tenant.profile.currentTenancy.rent || "0"}`}
                    mono
                  />
                  <InfoRow
                    label="Start Date"
                    value={
                      tenant.profile.currentTenancy.startDate
                        ? new Date(
                            tenant.profile.currentTenancy.startDate
                          ).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="End Date"
                    value={
                      tenant.profile.currentTenancy.endDate
                        ? new Date(
                            tenant.profile.currentTenancy.endDate
                          ).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  <InfoRow
                    label="Maintenance Requests"
                    value={
                      tenant.profile.maintenanceRequests?.toString() || "0"
                    }
                  />
                  <InfoRow
                    label="Rent Payments"
                    value={tenant.profile.rentPayments?.toString() || "0"}
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">
                  No active tenancy found.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-600" />
              Activity Statistics
            </h2>
          </div>
          <div className="p-5">
            {tenant.statistics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Documents
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {tenant.statistics.documentsUploaded || 0}
                  </p>
                </div>
                <div className="rounded-xl border border-teal-100 p-4 bg-teal-50/40">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Messages
                  </p>
                  <p className="text-2xl font-bold text-teal-700">
                    {tenant.statistics.messagesSent || 0}
                  </p>
                </div>
                <div className="rounded-xl border border-indigo-100 p-4 bg-indigo-50/40">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Audit Logs
                  </p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {tenant.statistics.auditLogs || 0}
                  </p>
                </div>
                <div className="rounded-xl border border-orange-100 p-4 bg-orange-50/40">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Conversations
                  </p>
                  <p className="text-2xl font-bold text-orange-700">
                    {tenant.statistics.conversations || 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-slate-500">
                  No activity statistics available.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
