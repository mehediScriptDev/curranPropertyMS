import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutDashboard, FileText, Bell, Lock } from "lucide-react";

const features = [
  { Icon: FileText, title: "Financial Statements", desc: "Download monthly rent statements and annual summaries instantly." },
  { Icon: Bell, title: "Real-time Notifications", desc: "Instant alerts for rent received, maintenance requests and lease events." },
  { Icon: Lock, title: "Secure Document Vault", desc: "Leases, RTB certs, inspection reports — all stored and accessible online." },
];

export default function Dashboard() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: portal mockup card */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-dark-900/5 z-0" />
            <div className="relative z-10 rounded-3xl overflow-hidden border border-dark-100 shadow-2xl bg-dark-950">
              {/* Mock dashboard header */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-white/40 font-mono">portal.mccannandcurran.ie</span>
              </div>
              {/* Mock portal content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Image src="/dashboardlogo.png" alt="Portal" width={32} height={32} className="rounded-lg" />
                  <div>
                    <p className="text-xs text-white/50">Welcome back</p>
                    <p className="text-sm font-semibold text-white">John Landlord</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Monthly Rent", value: "€1,850", up: true },
                    { label: "Properties", value: "3 Active", up: null },
                    { label: "Next Inspection", value: "Mar 12", up: null },
                    { label: "RTB Status", value: "Compliant", up: true },
                  ].map(({ label, value, up }) => (
                    <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                      <p className="text-[0.65rem] text-white/40 uppercase tracking-wide mb-1">{label}</p>
                      <p className="text-sm font-bold text-white">{value}</p>
                      {up !== null && (
                        <span className="text-[0.65rem] font-semibold text-primary-400">{up ? "↑ On track" : ""}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-primary-600/20 border border-primary-600/30 p-3.5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <Bell size={13} className="text-white" />
                  </div>
                  <p className="text-xs text-white/70">Rent received for <strong className="text-white">14 Oak Lane</strong> — Feb 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
              <LayoutDashboard size={13} className="text-primary-600" />
              <span className="text-xs font-semibold text-primary-700 tracking-wide">Client Portal</span>
            </div>
            <h2 className="section-title font-bold text-dark-950 leading-tight mb-5">
              Your property.{" "}
              <span className="text-primary-600">Your dashboard.</span>
            </h2>
            <p className="section-desc text-dark-500 mb-10 leading-relaxed">
              Everything about your property in one secure, beautifully designed portal — accessible anytime, anywhere.
            </p>

            <ul className="space-y-6 mb-10">
              {features.map(({ Icon, title, desc }) => (
                <li key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-[1.3rem] font-semibold text-dark-900 mb-0.5">{title}</p>
                    <p className="text-base text-dark-500 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all"
            >
              Access Client Portal
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
