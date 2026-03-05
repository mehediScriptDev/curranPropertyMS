import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full pt-[72px]">
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1600&q=80"
          alt="Contact background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 container mx-auto h-full flex items-center">
          <div className="text-white max-w-2xl px-6">
            <p className="text-sm uppercase tracking-wide mb-2 text-white/80">Get In Touch</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">We're here to help with your property</h1>
            <p className="mt-4 text-base md:text-lg text-white/90">Reach out for a consultation, question, or support — we'll respond promptly.</p>
          </div>
          </div>

      </div>
    </section>
  );
}
