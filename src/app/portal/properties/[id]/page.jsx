"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PortalShell from "@/components/portal/PortalShell";
import {
  Home,
  User,
  FileText,
  Wrench,
  StickyNote,
  ArrowLeft,
  MapPin,
  Zap,
  Euro,
  BadgeCheck,
  Clock,
  CalendarDays,
  AlertCircle,
  Download,
  Tag,
} from "lucide-react";
import Link from "next/link";

/* ─── Mock data (replace with Supabase query keyed on params.id) ─── */
const property = {
  id: "1",
  status: "Notice Served",
  statusColor: "bg-red-100 text-red-700",
  address: "Apt 5B Rosewood Close",
  area: "Blackrock, Co. Dublin",
  type: "Apartment",
  bedrooms: 2,
  bathrooms: 1,
  mprn: "10623847501",
  rent: "€1,750",
  rentDue: "1st of each month",
  rentLate: "5 Days Late",
  tenant: {
    name: "Kevin Madden",
    email: "kevin.madden@email.com",
    phone: "+353 87 123 4567",
    since: "Oct 10, 2022",
  },
  tenancy: {
    rtbNumber: "RTB-2022-10-456782",
    registrationDate: "Nov 5, 2022",
    leaseStart: "Oct 10, 2022",
    leaseEnd: "Oct 9, 2024",
    rentReviewDate: "Apr 10, 2024",
    rentReviewFrequency: "Annual",
    noticeGiven: "Mar 1, 2024",
    noticePeriod: "90 days",
  },
};

const documents = [
  { name: "Lease Agreement 2022.pdf", type: "Lease", date: "Oct 10, 2022", size: "248 KB" },
  { name: "RTB Registration Cert.pdf", type: "RTB Registration", date: "Nov 5, 2022", size: "134 KB" },
  { name: "Plumbing Invoice #0042.pdf", type: "Invoice", date: "Feb 28, 2024", size: "72 KB" },
  { name: "Annual Inspection Report.pdf", type: "Inspection", date: "Jan 15, 2024", size: "320 KB" },
];

const maintenance = [
  { issue: "Shower broken", priority: "Medium", status: "In Progress", updated: "1 day ago" },
  { issue: "Leaky kitchen sink pipe", priority: "High", status: "Scheduled (30 Apr 2024)", updated: "8 days ago" },
];

const notes = [
  { date: "Mar 1, 2024", author: "Sarah Quinn", role: "Staff", text: "Notice to vacate received from tenant. 90-day notice period begins today." },
  { date: "Feb 28, 2024", author: "Ciarán Byrne", role: "Staff", text: "Plumbing contractor invoice processed and filed. Work completed satisfactorily." },
  { date: "Jan 15, 2024", author: "Sarah Quinn", role: "Staff", text: "Annual inspection completed. Minor issues noted — property generally in good condition." },
  { date: "Nov 5, 2022", author: "David McCann", role: "Staff", text: "RTB registration confirmed. Certificate uploaded to documents." },
];

const TABS = [
  { key: "overview", label: "Overview", Icon: Home },
  { key: "tenancy", label: "Tenancy", Icon: BadgeCheck },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "maintenance", label: "Maintenance", Icon: Wrench },
  { key: "notes", label: "Notes", Icon: StickyNote },
];

const docTypeColors = {
  Lease: "bg-blue-50 text-blue-700",
  "RTB Registration": "bg-purple-50 text-purple-700",
  Statement: "bg-teal-50 text-teal-700",
  Inspection: "bg-amber-50 text-amber-700",
  Invoice: "bg-rose-50 text-rose-700",
};

const priorityColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      <p className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function PropertyProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PortalShell>
      {/* Back link */}
      <Link
        href="/portal/properties"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium mb-4 transition"
      >
        <ArrowLeft size={15} /> Back to My Properties
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Home size={22} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">
                {property.address}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin size={13} /> {property.area}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${property.statusColor}`}>
              {property.status}
            </span>
            {property.rentLate && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                <Clock size={11} /> Rent {property.rentLate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-4 overflow-x-auto shadow-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
              ${activeTab === key
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Property Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Home size={16} className="text-teal-600" /> Property Details
            </h2>
            <InfoRow label="Type" value={property.type} />
            <InfoRow label="Bedrooms" value={property.bedrooms} />
            <InfoRow label="Bathrooms" value={property.bathrooms} />
            <InfoRow label="Address" value={property.address} />
            <InfoRow label="Area" value={property.area} />
            <InfoRow label="MPRN" value={property.mprn} mono />
          </div>

          {/* Rent */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Euro size={16} className="text-teal-600" /> Rent
            </h2>
            <InfoRow label="Monthly Rent" value={property.rent} />
            <InfoRow label="Due Date" value={property.rentDue} />
            {property.rentLate && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3">
                <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">Status</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full">
                  <AlertCircle size={13} /> Rent {property.rentLate}
                </span>
              </div>
            )}
          </div>

          {/* Assigned Tenant */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-2">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <User size={16} className="text-teal-600" /> Assigned Tenant
            </h2>
            <InfoRow label="Name" value={property.tenant.name} />
            <InfoRow label="Email" value={property.tenant.email} />
            <InfoRow label="Phone" value={property.tenant.phone} />
            <InfoRow label="Tenant Since" value={property.tenant.since} />
          </div>
        </div>
      )}

      {/* Tab: Tenancy */}
      {activeTab === "tenancy" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 max-w-2xl">
          <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
            <BadgeCheck size={16} className="text-teal-600" /> Tenancy Details
          </h2>
          <InfoRow label="RTB Number" value={property.tenancy.rtbNumber} mono />
          <InfoRow label="RTB Registration Date" value={property.tenancy.registrationDate} />
          <InfoRow label="Lease Start" value={property.tenancy.leaseStart} />
          <InfoRow label="Lease End" value={property.tenancy.leaseEnd} />
          <InfoRow label="Rent Review Date" value={property.tenancy.rentReviewDate} />
          <InfoRow label="Review Frequency" value={property.tenancy.rentReviewFrequency} />
          <InfoRow label="Notice Given" value={property.tenancy.noticeGiven} />
          <InfoRow label="Notice Period" value={property.tenancy.noticePeriod} />
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" /> Documents
            </h2>
          </div>
          {/* Mobile */}
          <div className="lg:hidden divide-y divide-slate-100">
            {documents.map((d, i) => (
              <div key={i} className="px-5 py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700">{d.name}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${docTypeColors[d.type] || "bg-slate-100 text-slate-600"}`}>{d.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{d.date}</span><span>{d.size}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition">
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Document</th>
                  <th className="text-left px-5 py-4">Type</th>
                  <th className="text-left px-5 py-4">Date</th>
                  <th className="text-left px-5 py-4">Size</th>
                  <th className="text-right px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-base font-semibold text-slate-700">{d.name}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${docTypeColors[d.type] || "bg-slate-100 text-slate-600"}`}>{d.type}</span>
                    </td>
                    <td className="px-5 py-4 text-base text-slate-500">{d.date}</td>
                    <td className="px-5 py-4 text-base text-slate-400">{d.size}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition">
                        <Download size={15} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Maintenance */}
      {activeTab === "maintenance" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
              <Wrench size={16} className="text-teal-600" /> Maintenance
            </h2>
          </div>

          {/* Notice */}
          <div className="mx-5 mt-4 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500">Maintenance requests are submitted by tenants only. You can view status below.</p>
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y divide-slate-100 mt-4">
            {maintenance.map((m, i) => (
              <div key={i} className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700">{m.issue}</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${priorityColors[m.priority]}`}>{m.priority}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{m.status}</span><span>{m.updated}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Issue</th>
                  <th className="text-left px-5 py-4">Priority</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenance.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-base font-semibold text-slate-700">{m.issue}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${priorityColors[m.priority]}`}>{m.priority}</span>
                    </td>
                    <td className="px-5 py-4 text-base text-slate-600">{m.status}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{m.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === "notes" && (
        <div className="space-y-3">
          {/* Notice */}
          <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 font-medium">These notes are entered by McCann &amp; Curran staff and are read-only.</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />

            <div className="space-y-3">
              {notes.map((n, i) => (
                <div key={i} className="relative sm:pl-14">
                  {/* Dot */}
                  <div className="hidden sm:flex absolute left-3 top-4 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-sm items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="text-sm font-bold text-slate-700">{n.author}</p>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700">{n.role}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CalendarDays size={11} /> {n.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
