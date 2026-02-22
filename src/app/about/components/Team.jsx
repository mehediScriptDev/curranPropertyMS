import Image from "next/image";
import { Linkedin } from "lucide-react";

export default function Team() {
  const people = [
    { name: "Sarah McCann", role: "Managing Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
    { name: "James Curran", role: "Operations Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name: "Aoife Kelly", role: "Head of Lettings", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
    { name: "David Murphy", role: "Compliance Manager", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  ];

  return (
    <section className="py-10 lg:py-20 px-6 lg:px-16 bg-gradient-to-br from-[#eef6fb] via-[#e4eff7] to-[#d6e7f3]" id="team">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-7 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
            <span className="text-xs font-semibold text-primary-700 tracking-wide">The People Behind It</span>
          </div>
          <h2 className="section-title font-bold text-dark-950 leading-tight mb-4">
            Meet our{" "}
            <span className="text-primary-600">leadership team.</span>
          </h2>
          <p className="section-desc text-dark-500 leading-relaxed">
            Experienced professionals who are passionate about delivering the best outcome for every landlord and tenant.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {people.map((person) => (
            <div key={person.name} className="group bg-white rounded-2xl border border-dark-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative w-full h-56 overflow-hidden">
                <Image src={person.image} alt={person.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[0.9rem] font-bold text-dark-900">{person.name}</h3>
                  <p className="text-xs text-dark-500 mt-0.5">{person.role}</p>
                </div>
                <a href="#" className="w-8 h-8 rounded-lg bg-dark-100 flex items-center justify-center text-dark-500 hover:bg-primary-600 hover:text-white transition-colors">
                  <Linkedin size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
