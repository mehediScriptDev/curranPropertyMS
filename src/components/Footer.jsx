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
              alt="McCann & Curran Reality"
              width={36}
              height={36}
            />
            <span className="text-base font-bold text-dark-900 tracking-tight">
              McCann &amp; Curran Reality
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-[0.85rem]">
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "About", href: "/about" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Cookie Policy", href: "/cookie-policy" },
              { label: "Terms of Use", href: "/terms-of-use" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-dark-500 hover:text-dark-900 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2.5 text-[0.85rem]">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-primary-500" />
              <span>049-899-1111</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-primary-500" />
              <span>info@mccannandcurran.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-primary-500 mt-0.5" />
              <span>
                Lower Camden St
                <br />
                Dublin, D02XE80
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-200">
        <div className="container mx-auto px-6 lg:px-16 py-5 text-center text-xs text-dark-400">
          © 2026 McCann &amp; Curran Reality. All rights reserved. &nbsp;·&nbsp; PSRA Lic. No. 004008
        </div>
      </div>
    </footer>
  );
}
