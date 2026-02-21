import Image from "next/image";
import { Smartphone, Zap, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  { Icon: Smartphone, title: "Mobile-first portal", desc: "Full access on any device — phone, tablet or desktop." },
  { Icon: Zap, title: "Real-time updates", desc: "Rent receipts, maintenance status and documents update live." },
  { Icon: ShieldCheck, title: "Bank-level security", desc: "256-bit encryption and 2FA protect all your data." },
  { Icon: BarChart3, title: "Financial analytics", desc: "Visual reports showing yield, costs and trends at a glance." },
];

export default function DigitalExperience() {
  return (
    <section className="py-24 px-6 lg:px-16 bg-dark-950">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/20 border border-primary-600/30 mb-5">
              <Zap size={13} className="text-primary-400" />
              <span className="text-xs font-semibold text-primary-400 tracking-wide">Digital-First Management</span>
            </div>
            <h2 className="text-[2rem] lg:text-[2.4rem] font-bold text-white leading-tight mb-5">
              Technology that puts{" "}
              <span className="text-primary-400">you in control.</span>
            </h2>
            <p className="text-[0.95rem] text-dark-300 mb-10 leading-relaxed">
              Our secure online portal gives landlords and tenants 24/7 access to everything they need — no chasing, no paperwork, no delays.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                    <p className="text-xs text-dark-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary-600/10 z-0" />
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=85"
                alt="Digital property management"
                width={580}
                height={400}
                className="object-cover w-full h-full"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
