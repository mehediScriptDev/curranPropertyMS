import { Home as HomeIcon, Building2, ShieldCheck, Wrench } from "lucide-react";

export default function ServicesGrid() {
  const items = [
    { Icon: HomeIcon, title: "Residential\nLettings", desc: "Expert lettings & tenant sourcing", color: "bg-primary-50 text-primary-700" },
    { Icon: Building2, title: "Property\nManagement", desc: "Full-service management & inspections", color: "bg-primary-50 text-primary-700" },
    { Icon: ShieldCheck, title: "RTB\nCompliance", desc: "Ensuring full regulatory adherence", color: "bg-primary-50 text-primary-700" },
    { Icon: Wrench, title: "Maintenance\nCoordination", desc: "Efficient repairs & support", color: "bg-primary-50 text-primary-700" },
  ];

  return (
    <section className="py-20 px-6 lg:px-16 bg-white" id="services">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-dark-900 mb-10">Our Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ Icon, title, desc, color }) => (
            <div key={title} className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}><Icon size={24} /></div>
              <h3 className="text-[0.95rem] font-bold text-dark-900 whitespace-pre-line leading-snug mb-2">{title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
