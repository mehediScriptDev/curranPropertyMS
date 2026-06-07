import Link from "next/link";
import { ArrowRight, Phone, Calendar } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-gradient-to-br from-[#1a3a5c] via-[#1e4472] to-[#163860] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary-600/8 blur-3xl pointer-events-none" />

      <div className="relative container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/80 tracking-wide">Currently accepting new landlords</span>
          </div>

          <h2 className="section-title font-bold text-white leading-tight mb-5">
            Ready to simplify your{" "}
            <span className="text-primary-400">property management?</span>
          </h2>

          <p className="section-desc text-dark-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Join 500+ clients who trust McCann &amp; Curran Reality for stress-free, fully transparent property management across Ireland.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition-all"
            >
              <Calendar size={16} />
              Book a Free Consultation
            </Link>
            <Link
              href="tel:+0498991111"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[0.9rem] font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-all"
            >
              <Phone size={16} />
              Call Us Today
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-xs text-dark-400">
            No obligation &nbsp;·&nbsp; Free valuation &nbsp;·&nbsp; Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
