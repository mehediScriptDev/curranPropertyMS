import { ShieldCheck, Eye, Award, Monitor, Users, HeartHandshake } from "lucide-react";

export default function Values() {
  return (
    <section className="py-20 px-6 lg:px-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-dark-900 mb-10">Our Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { Icon: ShieldCheck, title: "Trust & Integrity", desc: "Honest communication and ethical practices form the foundation of every client relationship." },
            { Icon: Eye, title: "Transparency", desc: "Real-time access to reports and data. No hidden fees, no surprises — ever." },
            { Icon: Award, title: "Excellence", desc: "The highest standards in tenant vetting, property care, and regulatory compliance." },
            { Icon: Monitor, title: "Innovation", desc: "Our digital-first approach with secure portals sets us apart from traditional managers." },
            { Icon: Users, title: "Client Focus", desc: "Dedicated account managers who treat your property as their own." },
            { Icon: HeartHandshake, title: "Partnership", desc: "We work alongside landlords as long-term partners, not just service providers." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
                <Icon size={22} />
              </div>
              <h3 className="text-base font-bold text-dark-900 mb-2">{title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
