"use client";
import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    enquiryType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.enquiryType || !formData.message) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Map enquiryType to backend enum
      const typeMap = {
        landlord: "LANDLORD",
        tenant: "TENANT",
        valuation: "FREE_VALUATION",
        other: "OTHER",
      };

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        enquiryType: typeMap[formData.enquiryType] || formData.enquiryType,
        message: formData.message,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data?.message || "Failed to send message. Please try again.";
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Success
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        enquiryType: "",
        message: "",
      });
      setLoading(false);

      // Reset success message after 4 seconds
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 border border-dark-100 rounded-xl text-sm text-dark-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all placeholder:text-dark-400 bg-white disabled:bg-slate-50 disabled:text-slate-400";

  return (
    <div className="bg-white border border-dark-100 rounded-3xl p-5 lg:p-8 shadow-xl shadow-dark-900/5">
      <h3 className="section-title font-bold text-dark-950 leading-tight mb-2">Send Us a Message</h3>
      <p className="section-desc text-dark-500 mb-8">Fill in the form and we&apos;ll get back to you within 24 hours.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            disabled={loading}
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            disabled={loading}
            className={inputClass}
          />
        </div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          disabled={loading}
          className={inputClass}
        />
        <select
          name="enquiryType"
          value={formData.enquiryType}
          onChange={handleChange}
          required
          disabled={loading}
          className={inputClass + " text-dark-400"}
        >
          <option value="" disabled>Enquiry Type</option>
          <option value="landlord">I&apos;m a Landlord</option>
          <option value="tenant">I&apos;m a Tenant</option>
          <option value="valuation">Free Valuation</option>
          <option value="other">Other</option>
        </select>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          rows={5}
          required
          disabled={loading}
          className={inputClass + " resize-y"}
        />

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {submitted && (
          <div className="flex items-start gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>Thank you! We&apos;ll get back to you within 24 hours.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.9rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-md shadow-primary-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : submitted ? (
            <><CheckCircle2 size={16} /> Sent!</>
          ) : (
            <><Send size={15} /> Send Message</>
          )}
        </button>
      </form>
    </div>
  );
}
