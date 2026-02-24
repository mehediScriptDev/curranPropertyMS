"use client";

import TenantShell from "@/components/tenant/TenantShell";
import { Home, CheckCircle2, MapPin, Calendar, CreditCard, FileText } from "lucide-react";

const details = [
  { label: "Property Address",  value: "Apt 5B Rosewood Close, Dublin 9" },
  { label: "Property Type",     value: "Apartment" },
  { label: "Bedrooms",          value: "2" },
  { label: "Monthly Rent",      value: "€1,750" },
  { label: "Tenancy Start",     value: "Oct 10, 2022" },
  { label: "Lease End",         value: "Oct 10, 2025" },
  { label: "RTB Status",        value: "Registered" },
  { label: "MPRN",              value: "10623847501" },
  { label: "Landlord",          value: "Joe Landlord" },
  { label: "Managing Agent",    value: "McCann & Curran Realty" },
  { label: "Agent Phone",       value: "+353 1 234 5678" },
  { label: "Agent Email",       value: "info@mccannandcurran.ie" },
];

const timeline = [
  { date: "Oct 10, 2022", event: "Tenancy commenced", Icon: CheckCircle2, color: "text-teal-600 bg-teal-50" },
  { date: "Oct 10, 2023", event: "Annual rent review — no increase", Icon: CreditCard, color: "text-blue-600 bg-blue-50" },
  { date: "May 15, 2024", event: "Lease renewal signed for another year", Icon: FileText, color: "text-purple-600 bg-purple-50" },
  { date: "Oct 10, 2025", event: "Lease expiry date", Icon: Calendar, color: "text-amber-600 bg-amber-50" },
];

export default function TenantPropertyPage() {
  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">My Property</h1>
        <p className="text-slate-500 mt-1 text-sm">Full details about your rented property and tenancy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Details card */}
        <div className="lg:col-span-2 space-y-3 xl:space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Property banner */}
            <div className="w-full h-44 bg-gradient-to-br from-teal-100 via-slate-100 to-blue-50 flex items-center justify-center relative">
              <Home size={72} className="text-teal-200" />
              <div className="absolute bottom-4 left-6">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-600 text-white">
                  Occupied
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3 mb-5">
                <MapPin size={18} className="text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Apt 5B Rosewood Close</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Dublin 9, Ireland</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {details.map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Tenancy Timeline</h3>
          </div>
          <div className="p-4">
            <ol className="relative border-l-2 border-slate-100 space-y-6">
              {timeline.map((item, i) => (
                <li key={i} className="pl-6 relative">
                  <span className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                    <item.Icon size={15} />
                  </span>
                  <p className="text-sm font-semibold text-slate-700">{item.event}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
