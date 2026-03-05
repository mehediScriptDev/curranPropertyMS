"use client";

import { useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { Key, Percent, FileText, Download, CheckCircle2 } from "lucide-react";

const mock = {
  eligible: true,
  yearsTenancy: 7,
  purchasePrice: 250000,
  currentStep: 1, // 0: Submitted, 1: Valuation, 2: Offer Sent, 3: Completion
  documents: [
    { name: "RTB Application Form", href: "/docs/rtb-application.pdf" },
    { name: "RTB Guidance Notes", href: "/docs/rtb-guidance.pdf" },
    { name: "Valuation Report (sample)", href: "/docs/rtb-valuation.pdf" },
  ],
};

function formatCurrency(value) {
  try {
    return value.toLocaleString("en-US", { style: "currency", currency: "EUR" });
  } catch (e) {
    return `€${value.toFixed(2)}`;
  }
}

export default function TenantRTBPage() {
  const [years, setYears] = useState(mock.yearsTenancy);

  const discountPercent = Math.min(Math.max(Math.round(years * 1), 0), 70); // 1% per year, capped at 70%
  const discountAmount = Math.round((mock.purchasePrice * discountPercent) / 100);

  const steps = [
    "Application Submitted",
    "Valuation",
    "Offer Sent",
    "Completion",
  ];

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Right to Buy</h1>
        <p className="text-slate-500 mt-1 text-sm">Information about your Right to Buy entitlement and application progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-3 xl:space-y-4">
          {/* Eligibility */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Key size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Eligibility Status</h2>
                  <p className="text-sm text-slate-500 mt-1">A quick summary of whether you are currently eligible for Right to Buy.</p>
                </div>
              </div>

              <div className="text-right">
                {mock.eligible ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600">
                    <CheckCircle2 size={18} className="text-teal-600" /> Eligible
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-slate-500">Not eligible</span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-slate-500">Years of tenancy</div>
                <div className="text-lg font-semibold text-slate-800">{years} years</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="text-sm text-slate-500">Estimated purchase price</div>
                <div className="text-lg font-semibold text-slate-800">{formatCurrency(mock.purchasePrice)}</div>
              </div>
            </div>
          </div>

          {/* Discount Calculator */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Percent size={18} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Discount Calculator</h3>
                <p className="text-sm text-slate-500 mt-1">Estimate your Right to Buy discount based on years of tenancy.</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={70}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full"
                />
                <div className="w-24 text-right text-sm font-semibold">{years}y</div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-sm text-slate-500">Discount</div>
                  <div className="text-lg font-bold text-slate-800">{discountPercent}%</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-sm text-slate-500">Estimated Saving</div>
                  <div className="text-lg font-bold text-slate-800">{formatCurrency(discountAmount)}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-sm text-slate-500">Price After Discount</div>
                  <div className="text-lg font-bold text-slate-800">{formatCurrency(mock.purchasePrice - discountAmount)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Documents */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
                <FileText size={18} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Important Documents</h3>
                <p className="text-sm text-slate-500 mt-1">Download RTB forms and guidance.</p>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {mock.documents.map((d) => (
                <li key={d.href} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-md">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{d.name}</div>
                    <div className="text-xs text-slate-400">PDF · 120 KB</div>
                  </div>
                  <a
                    href={d.href}
                    download
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-teal-50 text-teal-700 font-semibold hover:bg-teal-600 hover:text-white transition"
                  >
                    <Download size={14} /> Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column: Application Steps */}
        <div className="space-y-3 xl:space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-fit">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Application Steps</h3>
            <ol className="relative border-l-2 border-slate-100 space-y-6">
              {steps.map((label, i) => {
                const done = i < mock.currentStep;
                const active = i === mock.currentStep;
                return (
                  <li key={label} className="pl-6 relative">
                    <span className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center ${done || active ? "bg-teal-600 text-white" : "bg-white text-slate-400 border border-slate-100"}`}>
                      {done ? <CheckCircle2 size={14} /> : i + 1}
                    </span>
                    <p className={`text-sm font-semibold ${active ? "text-teal-600" : "text-slate-700"}`}>{label}</p>
                    <p className="text-xs text-slate-400 mt-1">{active ? "In progress" : done ? "Completed" : "Pending"}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-semibold text-slate-700">Next actions</h4>
            <p className="text-sm text-slate-500 mt-2">If your application is progressing, our team will contact you with valuation details and next steps.</p>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
