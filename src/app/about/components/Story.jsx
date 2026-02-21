export default function Story() {
  return (
    <section className="py-20 px-6 lg:px-16 bg-white">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-2xl font-bold text-dark-900 mb-5">Our Story</h2>
          <div className="space-y-4 text-[0.95rem] text-dark-600 leading-relaxed">
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
              Today, we manage over 560 properties across Ireland, combining
              hands-on expertise with modern technology to deliver a
              management experience that is both personal and efficient.
            </p>
          </div>
        </div>

        <div className="relative h-[360px] rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80"
            alt="Dublin office"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
