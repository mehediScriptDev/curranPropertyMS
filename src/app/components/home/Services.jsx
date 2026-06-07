import { Home as HomeIcon, Building2, ShieldCheck, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

const items = [
  {
    Icon: HomeIcon,
    title: "Residential Lettings",
    desc: "Expert tenant sourcing, rigorous vetting, and seamless onboarding so your property is always earning.",
    stat: "98% occupancy rate",
  },
  {
    Icon: Building2,
    title: "Property Management",
    desc: "Full-service day-to-day management — inspections, rent collection, tenant communication and more.",
    stat: "210+ properties managed",
  },
  {
    Icon: ShieldCheck,
    title: "RTB Compliance",
    desc: "Stay 100% compliant with RTB regulations. We handle notices, dispute resolution and documentation.",
    stat: "Zero compliance fines",
  },
  {
    Icon: Wrench,
    title: "Maintenance Coordination",
    desc: "Fast, reliable repair coordination with vetted contractors. Issues resolved with minimum disruption.",
    stat: "<24h response time",
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-white" id="services">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
            <ShieldCheck size={13} className="text-primary-600" />
            <span className="text-xs font-semibold text-primary-700 tracking-wide">What We Offer</span>
          </div>
          <h2 className="section-title font-bold text-dark-950 leading-tight mb-4">
            Everything your property needs,{" "}
            <span className="text-primary-600">handled for you.</span>
          </h2>
          <p className="section-desc text-dark-500 leading-relaxed">
            From finding the right tenant to staying RTB-compliant — we cover every aspect of property management so you don&apos;t have to.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ Icon, title, desc, stat }) => (
            <div
              key={title}
              className="group relative flex flex-col gap-4 rounded-2xl border border-dark-100 bg-white p-7 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary-200 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative w-11 h-11 rounded-xl bg-primary-600/10 flex items-center justify-center">
                <Icon size={22} className="text-primary-600" />
              </div>

              <div className="relative flex-1">
                <h3 className="text-[1.3rem] font-bold text-dark-900 mb-2 leading-snug">{title}</h3>
                <p className="text-base text-dark-500 leading-relaxed">{desc}</p>
              </div>

              <div className="relative pt-4 border-t border-dark-100">
                <span className="text-xs lg:text-sm font-semibold text-primary-600">{stat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center gap-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm lg:text-base font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all services <ArrowRight size={15} />
          </Link>
          <span className="text-sm lg:text-base text-dark-400">or <Link href="/contact" className="underline underline-offset-2 hover:text-dark-700 transition-colors">speak to our team</Link></span>
        </div>
      </div>
    </section>
  );
}
