"use client";

import Hero from "./components/Hero";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";
import Map from "./components/Map";
import CTA from "./components/CTA";

export default function ContactPage() {
  return (
    <>
      <Hero />

      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      <section className="px-6 lg:px-16 pb-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <Map />
        </div>
      </section>

      <CTA />
    </>
  );
}
