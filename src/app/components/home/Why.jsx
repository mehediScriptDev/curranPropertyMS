import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function Why() {
  return (
    <section className="py-20 px-6 lg:px-16 bg-white" id="why">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-2xl font-bold text-dark-900 mb-8">Why McCann &amp; Curran</h2>
            <ul className="space-y-4">
              {[
                "Dedicated landlord support",
                "Transparent financial reporting",
                "RTB expertise",
                "Secure digital client portal",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary-600 flex-shrink-0" />
                  <span className="text-[0.95rem] text-dark-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
              alt="Property management dashboard"
              width={600}
              height={400}
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
