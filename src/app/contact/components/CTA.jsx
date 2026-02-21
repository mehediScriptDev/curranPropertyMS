import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-dark-950">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Ready to simplify your property management?
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-[0.9rem] font-semibold text-white border-2 border-primary-500 rounded-full hover:bg-primary-600 hover:border-primary-600 transition-all"
        >
          Request Consultation
        </Link>
      </div>
    </section>
  );
}
