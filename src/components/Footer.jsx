import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f5f7fa] text-dark-600">
      <div className="container mx-auto px-6 lg:px-16 pt-10 lg:pt-16 pb-10 lg:pb-14">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="McCann & Curran"
              width={36}
              height={36}
            />
            <span className="text-base font-bold text-dark-900 tracking-tight">
              McCann &amp; Curran
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-[0.85rem]">
            {["Home", "Services", "About", "Privacy Policy"].map((t) => (
              <Link
                key={t}
                href={
                  t === "Privacy Policy"
                    ? "#"
                    : `/${t.toLowerCase() === "home" ? "" : t.toLowerCase()}`
                }
                className="text-dark-500 hover:text-dark-900 transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2.5 text-[0.85rem]">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-primary-500" />
              <span>+353 1 250 6013</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary-500" />
              <span>info@mccanncurran.ie</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-primary-500 mt-0.5" />
              <span>
                73284 McCann &amp; Curran
                <br />
                Property Management Ltd.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-200">
        <div className="container mx-auto px-6 lg:px-16 py-5 text-center text-xs text-dark-400">
          © 2026 McCann &amp; Curran Property Management Ltd. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
