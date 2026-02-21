import { Search, FileSignature, KeyRound, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    num: "01",
    Icon: Search,
    title: "Property Assessment",
    desc: "We visit your property, assess its condition and current market position, and present a clear rental valuation report.",
  },
  {
    num: "02",
    Icon: FileSignature,
    title: "Agreement & Listing",
    desc: "Sign a transparent management agreement, then we professionally photograph and list your property across all major platforms.",
  },
  {
    num: "03",
    Icon: KeyRound,
    title: "Tenant Placement",
    desc: "Rigorous credit, employment and reference checks ensure only the best tenants are placed in your property.",
  },
  {
    num: "04",
    Icon: HeartHandshake,
    title: "Ongoing Management",
    desc: "From rent collection to inspections and RTB compliance — we handle everything so you don't have to think about it.",
  },
];

export default function Process() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-gradient-to-br from-[#eef6fb] via-[#e4eff7] to-[#d6e7f3]">
      <div className="container mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
            <ArrowRight size={13} className="text-primary-600" />
            <span className="text-xs font-semibold text-primary-700 tracking-wide">How It Works</span>
          </div>
          <h2 className="section-title font-bold text-dark-950 leading-tight mb-4">
            From listing to managed —{" "}
            <span className="text-primary-600">in four steps.</span>
          </h2>
          <p className="section-desc text-dark-500 leading-relaxed">
            A straightforward process designed to get your property earning quickly and keep it running smoothly.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-dark-200 z-0" />

          {steps.map(({ num, Icon, title, desc }, i) => (
            <div key={num} className="relative z-10 bg-white rounded-2xl p-7 border border-dark-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              {/* Step number + icon */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center shadow-md shadow-primary-600/30">
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-2xl font-black text-dark-100 select-none">{num}</span>
              </div>
              <h3 className="text-[1.3rem] font-bold text-dark-900 mb-2">{title}</h3>
              <p className="text-base text-dark-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all"
          >
            Start the process <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
