import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full pt-[72px] overflow-hidden px-6 lg:px-16 bg-gradient-to-br from-[#eef6fb] via-[#e4eff7] to-[#d6e7f3]">

      <div className="relative container mx-auto py-16 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: text content */}
        <div className="flex-1 max-w-4xl z-10">
          {/* Trust badge */}
          <div className="animate-fade-up-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-6">
            <ShieldCheck size={14} className="text-primary-600" />
            <span className="text-xs font-semibold text-primary-700 tracking-wide">RTB Compliant &amp; Fully Regulated</span>
          </div>

          <h1 className="animate-fade-up-1 text-[2.4rem] sm:text-[2.8rem] lg:text-[3.6rem] leading-[1.08] font-bold text-dark-950 mb-6">
            Professional
            <br />
            <span className="text-primary-600">Property Management.</span>
            <br />
            Total Transparency.
          </h1>

          <p className="animate-fade-up-2 text-[1rem] text-dark-500 leading-relaxed mb-8 max-w-md">
            Secure landlord &amp; tenant portal with real-time access to RTB
            information, financial statements and documentation.
          </p>

          <div className="animate-fade-up-3 flex flex-wrap items-center gap-3 mb-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all"
            >
              Client Login
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 text-[0.9rem] font-semibold text-dark-800 bg-white border border-dark-200 rounded-lg hover:shadow-sm hover:border-dark-300 transition-all"
            >
              Request Consultation
            </Link>
          </div>

          {/* Social proof */}
          <div className="animate-fade-up-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "1580489944761-15a19d654956",
                "1507003211169-0a1dd7228f2d",
                "1438761681033-6461ffad8d80"
              ].map((id) => (
                <div key={id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src={`https://images.unsplash.com/photo-${id}?w=64&q=70`}
                    alt="Client"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-primary-500 text-primary-500" />
              ))}
            </div>
            <span className="text-sm text-dark-500">Trusted by <strong className="text-dark-800">500+</strong> Clients</span>
          </div>
        </div>

        {/* Right: property image with decorative frame */}
        <div className="animate-slide-right flex-1 relative min-h-[360px] lg:min-h-[480px] w-full animate-float">
          {/* Decorative card behind image */}
          <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary-600/15 z-0" />
          <div className="relative w-full h-full min-h-[360px] lg:min-h-[480px] rounded-3xl overflow-hidden shadow-2xl z-10">
            {/* Ken Burns animated wrapper */}
            <div className="absolute inset-0 animate-kenburns">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85"
                alt="Modern apartment building"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Floating stat card */}
            <div className="animate-glow-pulse absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-dark-400 font-medium">Properties Managed</p>
                <p className="text-base font-bold text-dark-900">210+ Active Listings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
