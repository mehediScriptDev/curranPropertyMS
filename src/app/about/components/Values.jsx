import { ShieldCheck, Eye, Award, Monitor, Users, HeartHandshake } from "lucide-react";

export default function Values() {
  const values = [
    { Icon: ShieldCheck, title: "Trust & Integrity", desc: "Honest communication and ethical practices form the foundation of every client relationship." },
    { Icon: Eye, title: "Transparency", desc: "Real-time access to reports and data. No hidden fees, no surprises — ever." },
    { Icon: Award, title: "Excellence", desc: "The highest standards in tenant vetting, property care, and regulatory compliance." },
    { Icon: Monitor, title: "Innovation", desc: "Our digital-first approach with secure portals sets us apart from traditional managers." },
    { Icon: Users, title: "Client Focus", desc: "Dedicated account managers who treat your property as their own." },
    { Icon: HeartHandshake, title: "Partnership", desc: "We work alongside landlords as long-term partners, not just service providers." },
  ];

  return (
    <section className="py-24 px-6 lg:px-16 bg-white">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
            <span className="text-xs font-semibold text-primary-700 tracking-wide">What We Stand For</span>
          </div>
          <h2 className="section-title font-bold text-dark-950 leading-tight mb-4">
            Values that guide{" "}
            <span className="text-primary-600">everything we do.</span>
          </h2>
          <p className="section-desc text-dark-500 leading-relaxed">
            Our culture is built on accountability, modern technology, and a genuine commitment to every landlord and tenant we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map(({ Icon, title, desc }) => (
            <div key={title} className="group relative flex flex-col gap-4 rounded-2xl border border-dark-100 bg-white p-7 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary-200 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative w-11 h-11 rounded-xl bg-primary-600/10 flex items-center justify-center">
                <Icon size={22} className="text-primary-600" />
              </div>
              <div className="relative">
                <h3 className="text-[0.95rem] font-bold text-dark-900 mb-2">{title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
