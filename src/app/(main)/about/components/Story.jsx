export default function Story() {
  return (
    <section className="py-10 lg:py-20 px-6 lg:px-16 bg-white" id="story">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
            <span className="text-xs font-semibold text-primary-700 tracking-wide">Our History</span>
          </div>
          <h2 className="section-title font-bold text-dark-950 leading-tight mb-5">
            15 years of{" "}
            <span className="text-primary-600">trusted management.</span>
          </h2>
          <div className="space-y-4 section-desc text-dark-600 leading-relaxed">
            <p>
              Founded in 2010, McCann &amp; Curran began as a small lettings
              agency in Dublin with a simple belief: landlords deserve
              complete transparency and professional service.
            </p>
            <p>
              Over the years, we expanded into full property management,
              developing our own secure digital client portal to give
              landlords real-time access to financial statements, compliance
              documents, and maintenance logs.
            </p>
            <p>
              Today, we manage over 210+ properties across Ireland, combining
              hands-on expertise with modern technology to deliver a
              management experience that is both personal and efficient.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary-600/15 z-0" />
          <div className="relative z-10 h-[380px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=85"
              alt="Dublin office"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
