import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="py-16 px-6 lg:px-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Your Property. Your Dashboard.</h2>
        <p className="text-[0.95rem] text-dark-500 mb-6">All your property info in one place.</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 text-[0.85rem] font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
        >
          Access Client Portal
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
