"use client";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputClass = "w-full px-4 py-3.5 border border-dark-100 rounded-xl text-sm text-dark-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-dark-400 bg-white";

  return (
    <div className="bg-white border border-dark-100 rounded-3xl p-8 shadow-xl shadow-dark-900/5">
      <h3 className="section-title font-bold text-dark-950 leading-tight mb-2">Send Us a Message</h3>
      <p className="section-desc text-dark-500 mb-8">Fill in the form and we&apos;ll get back to you within 24 hours.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" required className={inputClass} />
          <input type="email" placeholder="Email Address" required className={inputClass} />
        </div>
        <input type="tel" placeholder="Phone Number" className={inputClass} />
        <select defaultValue="" className={inputClass + " text-dark-400"}>
          <option value="" disabled>Enquiry Type</option>
          <option value="landlord">I&apos;m a Landlord</option>
          <option value="tenant">I&apos;m a Tenant</option>
          <option value="valuation">Free Valuation</option>
          <option value="other">Other</option>
        </select>
        <textarea placeholder="Your message..." rows={5} className={inputClass + " resize-y"} />
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all"
        >
          {submitted ? (
            <><CheckCircle2 size={16} /> Sent!</>
          ) : (
            <><Send size={15} /> Send Message</>
          )}
        </button>
        {submitted && (
          <p className="text-sm text-primary-600 font-medium">Thank you! We&apos;ll get back to you within 24 hours.</p>
        )}
      </form>
    </div>
  );
}
