"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, Home, FileText, ClipboardList,
  MapPin, Phone, Mail, CalendarDays, Shield, Plus,
  Edit, Download, BadgeCheck,
} from "lucide-react";

/* ─── Mock data (replace with Supabase query) ─── */
const landlord = {
  id: "2",
  name: "Joan Doyle",
  initials: "JD",
  color: "bg-teal-500",
  dob: "14 Mar 1972",
  pps: "3276513B",
  email: "joan.doyle@email.com",
  mobile: "085-323-8927",
  address: "28 Perkside Plaza, Dublin 4",
};

const properties = [
  { id: "1", address: "Apt 5B Rosewood Close", status: "Notice", statusColor: "bg-orange-100 text-orange-600", tenant: "Kevin Madden", rent: "€1,750", rtb: "Registered" },
  { id: "2", address: "Apt 306 Fairview Rd", status: "Let", statusColor: "bg-teal-100 text-teal-700", tenant: "Stephen Blake", rent: "€1,850", rtb: "Registered" },
  { id: "3", address: "Apt 22 Parkside Plaza", status: "Vacant", statusColor: "bg-slate-100 text-slate-500", tenant: "–", rent: "€1,500", rtb: "Pending" },
];

const documents = [
  { name: "Landlord Agreement 2022.pdf", type: "Agreement", date: "Oct 10, 2022", size: "248 KB" },
  { name: "PPS Verification.pdf", type: "ID", date: "Sep 1, 2021", size: "90 KB" },
];

const auditLog = [
  { ts: "2024-03-01 09:14:22", adminId: "SQ01", user: "Sarah Quinn", action: "Updated Landlord Email", entity: "Landlord", ip: "192.168.1.45" },
  { ts: "2024-01-10 14:20:00", adminId: "JM01", user: "John McCann", action: "Added Landlord", entity: "Landlord", ip: "192.168.1.40" },
];

const TABS = [
  { key: "overview", label: "Overview", Icon: User },
  { key: "properties", label: "Properties", Icon: Home },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "audit", label: "Audit", Icon: ClipboardList },
];

const docTypeColors = {
  Agreement: "bg-blue-50 text-blue-700",
  ID: "bg-purple-50 text-purple-700",
};

function InfoRow({ label, value, mono = false, masked = false, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-400 sm:w-44 shrink-0">{label}</p>
      {children ?? (
        <p className={`text-base text-slate-700 font-semibold ${mono ? "font-mono" : ""}`}>
          {masked ? "••••••••" : value}
        </p>
      )}
    </div>
  );
}

export default function AdminLandlordProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPps, setShowPps] = useState(false);

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link href="/admin/landlords" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 font-medium transition">
        <ArrowLeft size={15} /> Back to Landlords
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${landlord.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
              {landlord.initials}
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800">{landlord.name}</h1>
              <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5"><MapPin size={13} />{landlord.address}</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition">
            <Edit size={14} /> Edit Landlord
          </button>
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
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><User size={16} className="text-teal-600" />Personal Details</h2>
            <InfoRow label="Full Name" value={landlord.name} />
            <InfoRow label="Date of Birth" value={landlord.dob} />
            <InfoRow label="PPS Number">
              <div className="flex items-center gap-2">
                <p className="text-base font-mono font-semibold text-slate-700">
                  {showPps ? landlord.pps : "••••••••"}
                </p>
                <button
                  onClick={() => setShowPps(!showPps)}
                  className="text-xs text-teal-600 hover:text-teal-700 font-semibold border border-teal-200 px-2 py-0.5 rounded-md"
                >
                  {showPps ? "Hide" : "Reveal"}
                </button>
              </div>
            </InfoRow>
            <InfoRow label="Address" value={landlord.address} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><Mail size={16} className="text-teal-600" />Contact</h2>
            <InfoRow label="Email" value={landlord.email} />
            <InfoRow label="Mobile" value={landlord.mobile} />
            <div className="mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <Shield size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">PPS and DOB are encrypted at database level. Only Admin/Staff can reveal these fields.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Properties ── */}
      {activeTab === "properties" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-700 flex items-center gap-2"><Home size={16} className="text-teal-600" />Properties</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Address</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Current Tenant</th>
                  <th className="text-left px-5 py-3">Rent</th>
                  <th className="text-left px-5 py-3">RTB</th>
                  <th className="text-right px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-700">{p.address}</td>
                    <td className="px-5 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.statusColor}`}>{p.status}</span></td>
                    <td className="px-5 py-4 text-slate-600 text-sm">{p.tenant}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{p.rent}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{p.rtb}</td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/properties/${p.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg transition">
                        <BadgeCheck size={13} /> View
                      </Link>
                    </td>
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
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition"><Plus size={14} />Upload</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-slate-400 font-semibold bg-slate-50/80">
                  <th className="text-left px-5 py-3">Document</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Size</th>
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

      {/* ── Audit ── */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
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
                    <td className="px-5 py-4 text-xs font-mono text-slate-500">{l.adminId}</td>
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
