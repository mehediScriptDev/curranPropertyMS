"use client";

import { useRouter } from "next/navigation";
import TENANCIES from "@/data/tenancies";
import {
  Building2,
  Users,
  Wrench,
  FolderOpen,
  Plus,
  AlertTriangle,
  Home,
  ChevronDown,
  Search,
  MoreHorizontal,
  FileText,
  Receipt,
  Upload,
  Eye,
} from "lucide-react";
import Image from "next/image";

/* ─── Static data ─────────────────────────────── */
const kpis = [
  {
    label: "Properties Under Management",
    value: "315",
    Icon: Building2,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    label: "Active Tenancies",
    value: "252",
    Icon: Users,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    label: "Open Maintenance",
    value: "16",
    Icon: Wrench,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    badge: "1",
    badgeColor: "bg-orange-500",
  },
  {
    label: "Documents Uploaded (30 days)",
    value: "342",
    Icon: FolderOpen,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

const _today = new Date();
const _in30  = new Date(); _in30.setDate(_today.getDate() + 30);
const rtbMissingCount  = TENANCIES.filter((t) => !t.rtb || t.rtb === "N/A").length;
const rentReviewCount  = TENANCIES.filter((t) => {
  if (!t.rentReviewDate) return false;
  const d = new Date(t.rentReviewDate);
  return d >= _today && d <= _in30;
}).length;

const alerts = [
  {
    id: 1,
    key: "rtb-missing",
    count: rtbMissingCount,
    countColor: "bg-blue-600",
    title: "RTB missing numbers",
    icon: null,
    iconBg: null,
  },
  {
    id: 2,
    key: "rent-reviews",
    count: rentReviewCount,
    countColor: "bg-orange-500",
    title: "Rent reviews due soon",
    icon: null,
    iconBg: null,
  },
  {
    id: 3,
    key: null,
    count: null,
    title: "Expiring tenancies",
    icon: <AlertTriangle size={18} className="text-amber-500" />,
    iconBg: "bg-amber-100",
  },
  {
    id: 4,
    key: null,
    count: null,
    title: "Vacant properties",
    icon: <Home size={18} className="text-red-500" />,
    iconBg: "bg-red-100",
  },
];

const activityIconMap = {
  lease:   { bg: "bg-teal-100",   Icon: FileText,  color: "text-teal-700" },
  rtb:     { bg: "bg-amber-100",  Icon: Receipt,   color: "text-amber-700" },
  maint:   { bg: "bg-sky-100",    Icon: Wrench,    color: "text-sky-700" },
  invoice: { bg: "bg-purple-100", Icon: Receipt,   color: "text-purple-700" },
  upload:  { bg: "bg-teal-100",   Icon: Upload,    color: "text-teal-700" },
};

const recentActivity = [
  { id: 1, type: "lease",   title: "Uploaded Lease – Apt 21C",         person: "John McCann",   time: "1 hour ago",  avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, type: "rtb",     title: "Updated RTB Number – Apt 7D",      person: "Emma Curran",   time: "yesterday",   avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, type: "maint",   title: "Closed Maintenance Request – Apt 33B", person: "Sarah Kelly", time: "2 days ago",  avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 4, type: "invoice", title: "Uploaded Rent Statement – Apt 12", person: "Mark Sheehan",  time: "3 days ago",  avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
  { id: 5, type: "upload",  title: "Added New Property – Apt 5B Rosewood Close", person: "John McCann", time: "5 days ago", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
];

/* ─── Sub-components ──────────────────────────── */
function KpiCard({ label, value, Icon, iconBg, iconColor, badge, badgeColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-slate-500 leading-tight">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function AlertCard({ alert, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm ${onClick ? "cursor-pointer hover:border-slate-300 hover:shadow-md transition" : ""}`}
    >
      {alert.count !== null ? (
        <span className={`w-8 h-8 rounded-md ${alert.countColor} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
          {alert.count}
        </span>
      ) : (
        <span className={`w-8 h-8 rounded-md ${alert.iconBg} flex items-center justify-center shrink-0`}>
          {alert.icon}
        </span>
      )}
      <span className="flex-1 text-base font-medium text-slate-700">{alert.title}</span>
      <button className="text-[0.78rem] border border-slate-200 rounded-md px-3 py-1 text-slate-600 hover:bg-slate-50 transition shrink-0">
        View
      </button>
    </div>
  );
}

function ActivityRow({ item }) {
  const meta = activityIconMap[item.type] || activityIconMap.upload;
  return (
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <meta.Icon size={16} className={meta.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
        <p className="text-sm text-slate-400 mt-0.5">{item.person} · {item.time}</p>
      </div>
      <span className="text-sm text-slate-400 shrink-0 mt-0.5">{item.time}</span>
    </div>
  );
}

function ActivityRowAvatar({ item }) {
  return (
    <div className="flex items-start gap-3">
      <Image
        src={item.avatar}
        alt={item.person}
        width={36}
        height={36}
        className="rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
        <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
          {item.person}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────── */
export default function AdminDashboardPage() {
  const router = useRouter();
  return (
    <div className="space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition">
            <Upload size={15} className="text-slate-500" />
            <span className="hidden sm:inline">Upload Document</span>
          </button>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition">
            <FileText size={15} className="text-slate-500" />
            <span className="hidden sm:inline">Add Tenancy</span>
          </button>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
            <Plus size={16} />
            <span className="hidden sm:inline">Add Property</span>
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mr-2">Alerts</h2>
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {["Status", "County/City", "Landlord"].map((f) => (
              <button key={f} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition bg-white">
                {f} <ChevronDown size={13} className="text-slate-400" />
              </button>
            ))}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-7 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white w-32"
              />
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition bg-white text-slate-700">
              <Plus size={13} /> New
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Alert cards body */}
        <div className="p-4 space-y-3">
          {/* Header alert row */}
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className="text-base font-bold text-slate-700">Alerts</h3>
            <button className="ml-auto text-[0.78rem] border border-slate-200 rounded-md px-3 py-1 text-slate-600 hover:bg-slate-50 transition">
              View
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alerts.map((a) => (
              <AlertCard
                key={a.id}
                alert={a}
                onClick={a.key ? () => router.push(`/admin/tenancies?filter=${a.key}`) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5">
            <Eye size={14} /> View all
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <ActivityRowAvatar key={item.id} item={item} />
          ))}
        </div>
      </div>

    </div>
  );
}
