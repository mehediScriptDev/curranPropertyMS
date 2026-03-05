import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f8]">
      {/* Logo + spinning ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <span className="absolute w-20 h-20 rounded-full border-4 border-teal-600/20 border-t-teal-600 animate-spin" />
        {/* Inner static ring */}
        <span className="absolute w-14 h-14 rounded-full border-2 border-teal-400/20" />
        {/* Logo */}
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="McCann & Curran"
            width={32}
            height={32}
            priority
          />
        </div>
      </div>

      {/* Brand name */}
      <p className="mt-6 text-sm font-semibold text-slate-600 tracking-wide">
        McCann <span className="text-teal-600">&amp;</span> Curran
      </p>
    </div>
  );
}
