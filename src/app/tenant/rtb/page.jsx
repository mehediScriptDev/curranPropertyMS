"use client";

import TenantShell from "@/components/tenant/TenantShell";
import { Shield, CheckCircle2, Hash, FileText, Download, AlertCircle, Info } from "lucide-react";

const rtb = {
  rtbNumber:        "RTB-2022-10-456782",
  registrationDate: "5 November 2022",
  status:           "Registered",
  tenancyStart:     "10 October 2022",
  property:         "Apt 5B Rosewood Close, Dublin 9",
  landlord:         "McCann & Curran Realty (acting agent)",
  certificate:      { name: "RTB Registration Certificate.pdf", size: "134 KB" },
};

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export default function TenantRTBPage() {
  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">RTB Registration</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Your tenancy registration with the Residential Tenancies Board (RTB)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Status card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                <Shield size={26} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-800">Registration Status</h2>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700">
                    <CheckCircle2 size={14} /> {rtb.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1.5">
                  Your tenancy is registered with the RTB as required under the Residential Tenancies Act.
                  This confirms you have the full legal rights and protections of a registered tenant.
                </p>
              </div>
            </div>
          </div>

          {/* Registration details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
              <Hash size={16} className="text-teal-600" />
              <h3 className="text-base font-bold text-slate-800">Registration Details</h3>
            </div>
            <div className="px-5 py-2">
              <InfoRow label="RTB Registration Number" value={rtb.rtbNumber} mono />
              <InfoRow label="Registration Date"       value={rtb.registrationDate} />
              <InfoRow label="Tenancy Start Date"      value={rtb.tenancyStart} />
              <InfoRow label="Property"                value={rtb.property} />
              <InfoRow label="Registered Agent"        value={rtb.landlord} />
            </div>
          </div>

          {/* Certificate download */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <FileText size={16} className="text-teal-600" />
              <h3 className="text-base font-bold text-slate-800">RTB Certificate</h3>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{rtb.certificate.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">PDF · {rtb.certificate.size}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 rounded-lg transition">
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* What is RTB */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Info size={16} className="text-slate-500" />
              <h3 className="text-base font-bold text-slate-800">What is the RTB?</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The <strong className="text-slate-700">Residential Tenancies Board (RTB)</strong> is Ireland&apos;s
              independent statutory body that regulates the rental sector. All private tenancies must be
              registered with the RTB within one month of a tenancy commencing.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {[
                "Dispute resolution between landlords and tenants",
                "Maintains a register of tenancies nationwide",
                "Enforces tenants' and landlords' rights",
                "Provides free guidance and information",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-teal-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://www.rtb.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              Visit rtb.ie →
            </a>
          </div>

          {/* Tenant rights */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Shield size={16} className="text-teal-600" />
              <h3 className="text-base font-bold text-teal-800">Your Tenant Rights</h3>
            </div>
            <ul className="space-y-2 text-sm text-teal-700">
              {[
                "Right to peaceful occupation",
                "Right to adequate notice before termination",
                "Right to a rent review not more than once per year",
                "Right to refer disputes to the RTB",
              ].map((right) => (
                <li key={right} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
                  {right}
                </li>
              ))}
            </ul>
          </div>

          {/* Dispute info */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Need help with a dispute?</p>
                <p className="text-xs text-amber-700 mt-1">
                  Contact your letting agent or visit rtb.ie to submit a dispute application free of charge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
