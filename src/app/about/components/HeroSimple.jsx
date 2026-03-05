import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full pt-[72px]">
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80"
          alt="About background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 container mx-auto h-full flex items-center">
          <div className="text-white max-w-2xl px-6">
            <p className="text-sm uppercase tracking-wide mb-2 text-white/80">About Us</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">Built on trust and local expertise</h1>
            <p className="mt-4 text-base md:text-lg text-white/90">Over a decade serving Irish landlords with clarity and care.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
