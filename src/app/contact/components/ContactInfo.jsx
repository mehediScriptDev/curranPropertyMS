import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Clock } from "lucide-react";

export default function ContactInfo() {
  const contacts = [
    { Icon: Mail, label: "Email", value: "info@mccanncurran.ie", href: "mailto:info@mccanncurran.ie" },
    { Icon: Phone, label: "Phone", value: "+353 1 250 6013", href: "tel:+35312506013" },
    { Icon: MapPin, label: "Address", value: "73284 McCann & Curran Property Management Ltd., Dublin, D01 P123, Ireland", href: "#" },
    { Icon: Clock, label: "Office Hours", value: "Monday – Friday, 9am – 6pm", href: null },
  ];

  return (
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
        <span className="text-xs font-semibold text-primary-700 tracking-wide">Contact Details</span>
      </div>
      <h2 className="section-title font-bold text-dark-950 leading-tight mb-3">
        We&apos;d love to{" "}
        <span className="text-primary-600">hear from you.</span>
      </h2>
      <p className="section-desc text-dark-500 mb-8 leading-relaxed">
        Reach out by phone, email or fill in the form. No obligation — just a friendly conversation.
      </p>

      <div className="space-y-4 mb-10">
        {contacts.map(({ Icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-4 p-4 rounded-2xl border border-dark-100 bg-white hover:border-primary-200 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-dark-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
              {href && href !== "#" ? (
                <a href={href} className="section-desc font-medium text-dark-800 hover:text-primary-600 transition-colors leading-snug">{value}</a>
              ) : (
                <p className="section-desc font-medium text-dark-800 leading-snug">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {[{ Icon: Facebook, label: "Facebook" }, { Icon: Twitter, label: "Twitter" }, { Icon: Linkedin, label: "LinkedIn" }, { Icon: Instagram, label: "Instagram" }].map(({ Icon, label }) => (
          <a key={label} href="#" aria-label={label} className="w-10 h-10 rounded-xl bg-dark-100 flex items-center justify-center text-dark-500 hover:bg-primary-600 hover:text-white transition-colors">
            <Icon size={16} />
          </a>
        ))}
      </div>
    </div>
  );
}
