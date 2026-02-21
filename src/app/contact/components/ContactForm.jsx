"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h3 className="text-xl font-bold text-dark-900 mb-6">Send Us a Message</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-dark-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-dark-400" />
          <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-dark-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-dark-400" />
        </div>
        <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-dark-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-dark-400" />
        <textarea placeholder="Message" rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-dark-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-dark-400 resize-y" />
        <button type="submit" className="inline-flex items-center gap-2 px-7 py-3 text-[0.88rem] font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
          {submitted ? (
            "Sent ✓"
          ) : (
            <>
              Submit <Send size={15} />
            </>
          )}
        </button>
        {submitted && (
          <p className="text-sm text-primary-600 font-medium">Thank you! We&apos;ll get back to you within 24 hours.</p>
        )}
      </form>
    </div>
  );
}
