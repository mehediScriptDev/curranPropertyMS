"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 px-6 lg:px-16 transition-all duration-300 ${
        scrolled ? "h-[72px] bg-white shadow-sm" : "h-[72px] bg-white/60 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="McCann & Curran"
            width={38}
            height={38}
            priority
          />
          <span className="text-[1.1rem] font-bold text-dark-900 tracking-tight">
            McCann <span className="text-dark-900">&amp;</span> Curran
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.9rem] font-medium transition-colors"
            >
              <span className={`border-b-2 pb-1 ${
                pathname === l.href ? "text-dark-900 border-primary-400" : "text-dark-700 border-transparent hover:text-primary-600"
              }`}>
                {l.label}
              </span>
            </Link>
          ))}
          <Link
            href="/portal/login"
            className="ml-4 px-6 py-2.5 text-[0.85rem] font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Client Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-dark-800"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg md:hidden py-4 px-6 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-[0.95rem] font-medium border-l-3 ${
                pathname === l.href ? "text-primary-600 bg-primary-50 border-primary-400" : "text-dark-700 hover:bg-gray-50 border-transparent"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-2 px-6 py-3 text-center text-[0.9rem] font-semibold text-white bg-primary-600 rounded-full"
          >
            Client Login
          </Link>
        </div>
      )}
    </nav>
  );
}
