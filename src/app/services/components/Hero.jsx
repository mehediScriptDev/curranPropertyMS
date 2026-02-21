import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-[72px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7fa] via-[#e8f1f6] to-[#dce9f1]" />
        <div className="relative container mx-auto px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 max-w-lg z-10">
          <h1 className="text-[2.4rem] lg:text-[3rem] leading-[1.12] font-bold text-dark-950 mb-5">
            Comprehensive Property
            <br />
            Management Services
          </h1>
          <p className="text-[0.95rem] text-dark-500 leading-relaxed mb-8 max-w-md">
            Professional lettings and management with secure digital reporting
            and RTB compliance built in.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 text-[0.88rem] font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            Request Consultation
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex-1 relative min-h-[320px] lg:min-h-[400px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"
            alt="Modern property"
            fill
            className="object-cover rounded-2xl"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
