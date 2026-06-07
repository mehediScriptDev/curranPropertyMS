import { Linkedin } from "lucide-react";

export default function Team() {
  const people = [
    { name: "Sarah McCann", role: "Managing Director", image: "/images/sarah.jpg" },
    { name: "James Curran", role: "Operations Director", image: "/images/james.jpg" },
    { name: "Aoife Kelly", role: "Head of Lettings", image: "/images/aoife.jpg" },
  ];

  function initials(name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

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

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {people.map((person) => (
            <div key={person.name} className="group bg-white rounded-2xl border border-dark-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-400 ring-1 ring-transparent group-hover:ring-primary-200">
              <div className="relative w-full h-64 overflow-hidden bg-gray-50 rounded-t-2xl">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/12 to-transparent" /> */}
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-dark-900">{person.name}</h3>
                  <p className="text-sm text-dark-500 mt-1">{person.role}</p>
                </div>
                <a href="#" aria-label={`LinkedIn ${person.name}`} className="w-10 h-10 rounded-full bg-white border border-primary-100 flex items-center justify-center text-primary-700 shadow-sm hover:bg-primary-600 hover:text-white transition-colors">
                  <Linkedin size={14} />
                </a>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
