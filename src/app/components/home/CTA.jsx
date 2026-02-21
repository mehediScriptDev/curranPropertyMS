import Link from "next/link";

export default function CTA() {
  return (
    <section className="pt-20 pb-0 px-6 lg:px-16 bg-gradient-to-br from-[#1a3a5c] via-[#1e4472] to-[#163860]">
      <div className="container mx-auto text-center">
        <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">Get started today</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to simplify your property management?</h2>
        <p className="text-dark-400 text-[0.95rem] mb-8 max-w-xl mx-auto">Join hundreds of landlords who trust McCann &amp; Curran for stress-free, transparent property management.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-all">Get in Touch</Link>
      </div>
    </section>
  );
}
