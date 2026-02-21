import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-[72px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f7fa] via-[#e8f1f6] to-[#dce9f1]" />
      <div className="relative container mx-auto px-6 lg:px-16 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 max-w-lg z-10">
          <h1 className="text-[2.4rem] lg:text-[3rem] leading-[1.12] font-bold text-dark-950 mb-5">
            Contact McCann
            <br />
            &amp; Curran Realty
          </h1>
          <p className="text-[0.95rem] text-dark-500 leading-relaxed max-w-md">
            Get in touch for professional property management services or
            schedule a consultation.
          </p>
        </div>
        <div className="flex-1 relative min-h-[280px] lg:min-h-[360px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80"
            alt="Professional team meeting"
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
