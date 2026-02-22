import Image from "next/image";
import {
  Home as HomeIcon,
  Building2,
  ShieldCheck,
  Wrench,
  Users,
  FileText,
  Search,
  Calendar,
  ClipboardCheck,
  DollarSign,
  Eye,
  Truck,
  BellRing,
  Gavel,
} from "lucide-react";

const services = [
  {
    Icon: HomeIcon,
    title: "Residential Lettings",
    desc: "Expert lettings and tenant sourcing with thorough vetting processes to find reliable, long-term tenants for your property.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80",
    features: [
      { icon: Users, text: "Tenant sourcing & advertising" },
      { icon: Search, text: "Comprehensive referencing" },
      { icon: FileText, text: "Lease agreement preparation" },
      { icon: ClipboardCheck, text: "RTB registration assistance" },
      { icon: Calendar, text: "Move-in coordination" },
    ],
  },
  {
    Icon: Building2,
    title: "Full Property Management",
    desc: "Complete management and inspections for your entire portfolio. We handle the day-to-day so you don't have to.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=80",
    features: [
      { icon: DollarSign, text: "Monthly rent collection" },
      { icon: Eye, text: "Arrears monitoring & follow-up" },
      { icon: Truck, text: "Contractor coordination" },
      { icon: Calendar, text: "Inspection scheduling" },
      { icon: BellRing, text: "Ongoing tenancy support" },
    ],
  },
  {
    Icon: ShieldCheck,
    title: "RTB Compliance",
    desc: "Ensuring full regulatory adherence with up-to-date legislative tracking. Stay compliant without the complexity.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80",
    features: [
      { icon: ClipboardCheck, text: "Tenancy registration management" },
      { icon: Gavel, text: "Rent review compliance" },
      { icon: FileText, text: "Notice period management" },
      { icon: BellRing, text: "Legislative update advisory" },
      { icon: Search, text: "Documentation control" },
    ],
  },
  {
    Icon: Wrench,
    title: "Maintenance Coordination",
    desc: "Efficient repairs and support with full issue tracking, from initial report to completion verification.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80",
    features: [
      { icon: BellRing, text: "24/7 issue reporting via portal" },
      { icon: Truck, text: "Vetted contractor dispatch" },
      { icon: DollarSign, text: "Competitive quote management" },
      { icon: Eye, text: "Real-time job tracking" },
      { icon: ClipboardCheck, text: "Completion verification" },
    ],
  },
];

export default function ServiceList() {
  return (
    <section className="py-24 px-6 lg:px-16 bg-white" id="services">
      <div className="container mx-auto space-y-28">
        {services.map((service, idx) => (
          <div
            key={service.title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${
              idx % 2 === 1 ? "lg:[direction:rtl]" : ""
            }`}
          >
            {/* Image */}
            <div className={`relative ${idx % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
              <div
                className={`absolute ${
                  idx % 2 === 1 ? "-bottom-4 -left-4" : "-bottom-4 -right-4"
                } w-full h-full rounded-3xl bg-primary-600/15 z-0`}
              />
              <div className="relative z-10 h-[320px] lg:h-[380px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Content */}
            <div className={idx % 2 === 1 ? "lg:[direction:ltr]" : ""}>
              <div className="w-11 h-11 rounded-xl bg-primary-600/10 flex items-center justify-center mb-5">
                <service.Icon size={22} className="text-primary-600" />
              </div>
              <h2 className="section-title font-bold text-dark-950 leading-tight mb-4">{service.title}</h2>
              <p className="section-desc text-dark-500 leading-relaxed mb-7">{service.desc}</p>
              <ul className="space-y-3">
                {service.features.map(({ icon: FeatIcon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-600/10 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <FeatIcon size={15} />
                    </div>
                    <span className="text-sm text-dark-700">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
