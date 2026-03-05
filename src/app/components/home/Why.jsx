import Image from "next/image";
import { Headphones, BarChart3, Shield, Lock, TrendingUp, Award } from "lucide-react";

const benefits = [
  { icon: Headphones, title: "Dedicated landlord support", desc: "A named contact for every landlord — always reachable, always responsive." },
  { icon: BarChart3, title: "Transparent financial reporting", desc: "Monthly statements with full breakdowns, available in your portal 24/7." },
  { icon: Shield, title: "RTB expertise", desc: "In-house compliance team handling all RTB registrations, notices and queries." },
  { icon: Lock, title: "Secure digital client portal", desc: "Real-time access to documents, financials and communications in one place." },
];


export default function Why() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-gradient-to-br from-[#eef6fb] via-[#e4eff7] to-[#d6e7f3]" id="why">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
              <Award size={13} className="text-primary-600" />
              <span className="text-xs font-semibold text-primary-700 tracking-wide">Why Choose Us</span>
            </div>
            <h2 className="section-title font-bold text-dark-950 leading-tight mb-5">
              The smarter way to manage{" "}
              <span className="text-primary-600">your property.</span>
            </h2>
            <p className="section-desc text-dark-500 mb-10 leading-relaxed">
              McCann &amp; Curran combines local expertise with modern technology to deliver property management that genuinely works for landlords.
            </p>

            <ul className="space-y-5 mb-12">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="mt-0.5 w-7 lg:w-10 lg:h-10 h-7 rounded-full bg-primary-600/15 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-[1.3rem] font-semibold text-dark-900 mb-0.5">{title}</p>
                    <p className="text-base text-dark-500 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Stats removed per design — kept layout concise */}
          </div>

          {/* Right: image with decorative offset */}
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary-600/15 z-0" />
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl z-10">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=85"
                alt="Property management"
                width={600}
                height={440}
                className="object-cover w-full h-full"
              />
              {/* Floating badge */}
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                  <TrendingUp size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-dark-400 font-medium">Avg. rental yield</p>
                  <p className="text-base font-bold text-dark-900">+12% above market</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
