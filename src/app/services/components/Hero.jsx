import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Building2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full pt-[72px] overflow-hidden px-6 lg:px-16 bg-gradient-to-br from-[#eef6fb] via-[#e4eff7] to-[#d6e7f3]">
      <div className="relative container mx-auto py-16 lg:py-28 flex flex-col lg:flex-row items-center gap-12">

        {/* Left: text */}
        <div className="flex-1 max-w-xl z-10">
          <div className="animate-fade-up-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-6">
            <ShieldCheck size={13} className="text-primary-600" />
            <span className="text-xs font-semibold text-primary-700 tracking-wide">RTB Compliant &middot; Fully Managed</span>
          </div>

          <h1 className="animate-fade-up-1 text-[2.8rem] lg:text-[3.6rem] leading-[1.08] font-bold text-dark-950 mb-6">
            Every service your
            <br />
            property{" "}
            <span className="text-primary-600">needs.</span>
          </h1>

          <p className="animate-fade-up-2 text-[1rem] text-dark-500 leading-relaxed mb-8 max-w-md">
            From finding the perfect tenant to full ongoing management, RTB compliance and maintenance coordination — all under one roof.
          </p>

          <div className="animate-fade-up-3 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all"
            >
              Request Consultation <ArrowRight size={16} />
            </Link>
            <Link
              href="#services"
              className="px-7 py-3.5 text-[0.9rem] font-semibold text-dark-800 bg-white border border-dark-200 rounded-lg hover:shadow-sm hover:border-dark-300 transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>

        {/* Right: image with frame */}
        <div className="animate-slide-right flex-1 relative min-h-[360px] lg:min-h-[480px] w-full animate-float">
          <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary-600/15 z-0" />
          <div className="relative w-full h-full min-h-[360px] lg:min-h-[480px] rounded-3xl overflow-hidden shadow-2xl z-10">
            <div className="absolute inset-0 animate-kenburns">
              <Image
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85"
                alt="Modern property"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Floating stat card */}
            <div className="animate-glow-pulse absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-dark-400 font-medium">Properties Managed</p>
                <p className="text-base font-bold text-dark-900">560+ Across Ireland</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
