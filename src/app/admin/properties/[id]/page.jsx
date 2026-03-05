"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Home, BadgeCheck, FileText, Wrench,
  StickyNote, ClipboardList, MapPin, Euro, Zap,
  AlertCircle, Download, Eye, Edit, Plus,
  CalendarDays, Clock, User, Users, Shield,
} from "lucide-react";

/* ─── Mock data ─── */
const property = {
  id: "1",
  name: "Apt 5B, Rosewood Close",
  area: "Blackrock, Co. Dublin",
  type: "Apartment",
  bedrooms: 2,
  bathrooms: 1,
  eircode: "D12 XY34",
  county: "Dublin",
  mprn: "10623847501",
  status: "Notice",
  statusColor: "bg-orange-100 text-orange-600",
  landlord: "Joan Doyle",
  landlordId: "2",
  rent: "€1,950",
  rentDue: "1st of month",
};

const tenancies = [
  { id: "t1", tenant: "Kevin Madden", start: "Oct 10, 2022", end: "Oct 9, 2024", rent: "€1,750", rtb: "RTB-2022-10-456782", status: "Notice", statusColor: "bg-orange-100 text-orange-600" },
  { id: "t2", tenant: "Sarah Kelly", start: "Jan 1, 2021", end: "Sep 30, 2022", rent: "€1,600", rtb: "RTB-2021-01-112233", status: "Ended", statusColor: "bg-slate-100 text-slate-500" },
];

const documents = [
  { name: "Lease Agreement 2022.pdf", type: "Lease", date: "Oct 10, 2022", size: "248 KB", uploader: "John McCann", visibility: ["Tenant", "Landlord"] },
  { name: "RTB Registration Cert.pdf", type: "RTB Registration", date: "Nov 5, 2022", size: "134 KB", uploader: "Emma Curran", visibility: ["Landlord"] },
  { name: "Plumbing Invoice #0042.pdf", type: "Invoice", date: "Feb 28, 2024", size: "72 KB", uploader: "Mark Sheehan", visibility: ["Landlord"] },
  { name: "Annual Inspection Report.pdf", type: "Inspection", date: "Jan 15, 2024", size: "320 KB", uploader: "Sarah Kelly", visibility: ["Tenant", "Landlord"] },
];

const maintenance = [
  { issue: "Shower broken", priority: "Medium", status: "In Progress", assignee: "Contractor A", updated: "1 day ago" },
  { issue: "Heating issue", priority: "High", status: "Open", assignee: "Maintenance Team", updated: "2 hours ago" },
  { issue: "Leaky kitchen sink", priority: "High", status: "Closed", assignee: "Contractor B", updated: "3 weeks ago" },
];

const notes = [
  { date: "Mar 1, 2024", author: "Sarah Quinn", staffId: "SQ01", text: "Notice to vacate received from tenant. 90-day notice period begins today." },
  { date: "Feb 28, 2024", author: "Ciarán Byrne", staffId: "CB02", text: "Plumbing contractor invoice processed and filed." },
  { date: "Jan 15, 2024", author: "Sarah Quinn", staffId: "SQ01", text: "Annual inspection completed. Minor issues noted — property generally in good condition." },
];

const auditLog = [
  { ts: "2024-03-01 09:14:22", adminId: "SQ01", user: "Sarah Quinn", action: "Added Note", entity: "Property", ip: "192.168.1.45" },
  { ts: "2024-02-28 11:02:10", adminId: "CB02", user: "Ciarán Byrne", action: "Uploaded Document", entity: "Invoice #0042", ip: "192.168.1.46" },
  { ts: "2024-01-15 14:30:05", adminId: "SQ01", user: "Sarah Quinn", action: "Inspection Logged", entity: "Property", ip: "192.168.1.45" },
  { ts: "2022-11-05 10:00:00", adminId: "EC01", user: "Emma Curran", action: "RTB Registered", entity: "Tenancy t1", ip: "192.168.1.47" },
];

const TABS = [
  { key: "overview", label: "Overview", Icon: Home },
  { key: "tenancies", label: "Tenancies", Icon: Users },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "maintenance", label: "Maintenance", Icon: Wrench },
  { key: "notes", label: "Notes", Icon: StickyNote },
  { key: "audit", label: "Audit", Icon: ClipboardList },
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

const statusColors = {
  Open: "bg-slate-100 text-slate-600",
  "In Progress": "bg-amber-100 text-amber-700",
  Closed: "bg-teal-100 text-teal-700",
};

const visColors = {
  Tenant: "bg-teal-100 text-teal-700",
  Landlord: "bg-amber-100 text-amber-700",
};

function InfoRow({ label, value, mono = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      {children ?? <p className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>}
    </div>
  );
}

export default function AdminPropertyProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [noteText, setNoteText] = useState("");

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition">
        <ArrowLeft size={15} /> Back to Properties
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Home size={22} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800 leading-tight">{property.name}</h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5"><MapPin size={13} />{property.area}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${property.statusColor}`}>{property.status}</span>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
              <Edit size={14} /> Edit Property
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
              ${activeTab === key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><Home size={16} className="text-teal-600" />Property Details</h2>
            <InfoRow label="Type" value={property.type} />
            <InfoRow label="Bedrooms" value={property.bedrooms} />
            <InfoRow label="Bathrooms" value={property.bathrooms} />
            <InfoRow label="County / City" value={property.county} />
            <InfoRow label="Eircode" value={property.eircode} mono />
            <InfoRow label="MPRN" value={property.mprn} mono />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><Euro size={16} className="text-teal-600" />Rent & Landlord</h2>
            <InfoRow label="Rent" value={property.rent} />
            <InfoRow label="Rent Due" value={property.rentDue} />
            <InfoRow label="Landlord">
              <Link href={`/admin/landlords/${property.landlordId}`} className="text-base font-semibold text-teal-600 hover:underline">{property.landlord}</Link>
            </InfoRow>
            <InfoRow label="Status">
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${property.statusColor}`}>{property.status}</span>
            </InfoRow>
          </div>
        </div>
      )}

      {/* ── Tenancies ── */}
      {activeTab === "tenancies" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Users size={16} className="text-teal-600" />Tenancies</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition"><Plus size={14} />Add Tenancy</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Tenant</th>
                  <th className="text-left px-5 py-3">Start</th>
                  <th className="text-left px-5 py-3">End</th>
                  <th className="text-left px-5 py-3">Rent</th>
                  <th className="text-left px-5 py-3">RTB Number</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenancies.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-700">{t.tenant}</td>
                    <td className="px-5 py-4 text-slate-600 text-sm">{t.start}</td>
                    <td className="px-5 py-4 text-slate-600 text-sm">{t.end}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{t.rent}</td>
                    <td className="px-5 py-4 font-mono text-sm text-slate-500">{t.rtb}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.statusColor}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><FileText size={16} className="text-teal-600" />Documents</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition"><Plus size={14} />Upload Document</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Document</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Size</th>
                  <th className="text-left px-5 py-3">Uploaded By</th>
                  <th className="text-left px-5 py-3">Visibility</th>
                  <th className="text-right px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-700 text-sm">{d.name}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${docTypeColors[d.type] || "bg-slate-100 text-slate-600"}`}>{d.type}</span></td>
                    <td className="px-5 py-4 text-sm text-slate-500">{d.date}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{d.size}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{d.uploader}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {d.visibility.map((v) => <span key={v} className={`text-xs font-medium px-2 py-0.5 rounded-full ${visColors[v] || "bg-slate-100 text-slate-500"}`}>{v}</span>)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition"><Download size={13} />Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Maintenance ── */}
      {activeTab === "maintenance" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Wrench size={16} className="text-teal-600" />Maintenance</h2>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition"><Plus size={14} />New Request</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Issue</th>
                  <th className="text-left px-5 py-3">Priority</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Assigned To</th>
                  <th className="text-left px-5 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenance.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-700">{m.issue}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityColors[m.priority]}`}>{m.priority}</span></td>
                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[m.status]}`}>{m.status}</span></td>
                    <td className="px-5 py-4 text-sm text-slate-600">{m.assignee}</td>
                    <td className="px-5 py-4 text-sm text-slate-400">{m.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Notes ── */}
      {activeTab === "notes" && (
        <div className="space-y-3">
          {/* Add note */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><StickyNote size={16} className="text-teal-600" />Add Note</h2>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              placeholder="Enter staff note…"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
                <Plus size={14} /> Save Note
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Shield size={11} />Notes are immutable once saved.</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />
            <div className="space-y-3">
              {notes.map((n, i) => (
                <div key={i} className="relative sm:pl-14">
                  <div className="hidden sm:flex absolute left-3 top-4 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-sm items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="text-sm font-bold text-slate-700">{n.author}</p>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{n.staffId}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><CalendarDays size={11} />{n.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Audit ── */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><ClipboardList size={16} className="text-teal-600" />Audit Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Timestamp</th>
                  <th className="text-left px-5 py-3">Staff ID</th>
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Action</th>
                  <th className="text-left px-5 py-3">Entity</th>
                  <th className="text-left px-5 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLog.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-slate-600">{l.ts}</td>
                    <td className="px-5 py-4 text-xs font-mono bg-slate-50 text-slate-500 rounded">{l.adminId}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{l.user}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{l.action}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{l.entity}</td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-400">{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
