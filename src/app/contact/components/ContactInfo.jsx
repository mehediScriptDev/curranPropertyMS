import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function ContactInfo() {
  return (
    <div>
      <h2 className="text-xl font-bold text-dark-900 mb-6">Contact Information</h2>

      <div className="space-y-5">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-[0.95rem] font-medium text-dark-800">info@mccanncurran.ie</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-[0.95rem] font-medium text-dark-800">+353 1 250 6013</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[0.95rem] font-medium text-dark-800 leading-relaxed">
              73284 McCann &amp; Curran
              <br />
              Property Management Ltd.
              <br />
              Dublin, D01 P123,
              <br />
              Ireland
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        {[{ Icon: Facebook, label: "Facebook" }, { Icon: Twitter, label: "Twitter" }, { Icon: Linkedin, label: "LinkedIn" }, { Icon: Instagram, label: "Instagram" }].map(({ Icon, label }) => (
          <a key={label} href="#" aria-label={label} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-dark-500 hover:bg-primary-600 hover:text-white transition-colors">
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  );
}
