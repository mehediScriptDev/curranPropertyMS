import Image from "next/image";
import { CheckCircle2, TrendingUp, Users, Award } from "lucide-react";

const benefits = [
  { title: "Dedicated landlord support", desc: "A named contact for every landlord — always reachable, always responsive." },
  { title: "Transparent financial reporting", desc: "Monthly statements with full breakdowns, available in your portal 24/7." },
  { title: "RTB expertise", desc: "In-house compliance team handling all RTB registrations, notices and queries." },
  { title: "Secure digital client portal", desc: "Real-time access to documents, financials and communications in one place." },
];

const stats = [
  { Icon: Users, value: "500+", label: "Landlords" },
  { Icon: TrendingUp, value: "98%", label: "Renewal rate" },
  { Icon: Award, value: "12+", label: "Years experience" },
];

export default function Why() {
  return (
    <section className="py-24 px-6 lg:px-16 bg-gradient-to-br from-[#eef6fb] via-[#e4eff7] to-[#d6e7f3]" id="why">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
              <Award size={13} className="text-primary-600" />
              <span className="text-xs font-semibold text-primary-700 tracking-wide">Why Choose Us</span>
            </div>
            <h2 className="text-[2rem] lg:text-[2.4rem] font-bold text-dark-950 leading-tight mb-5">
              The smarter way to manage{" "}
              <span className="text-primary-600">your property.</span>
            </h2>
            <p className="text-[0.95rem] text-dark-500 mb-10 leading-relaxed">
              McCann &amp; Curran combines local expertise with modern technology to deliver property management that genuinely works for landlords.
            </p>

            <ul className="space-y-5 mb-12">
              {benefits.map(({ title, desc }) => (
                <li key={title} className="flex gap-4">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-600/15 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-semibold text-dark-900 mb-0.5">{title}</p>
                    <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="flex gap-8 pt-8 border-t border-dark-200/60">
              {stats.map(({ Icon, value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[1.6rem] font-bold text-dark-950">{value}</span>
                  <span className="text-xs text-dark-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
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
