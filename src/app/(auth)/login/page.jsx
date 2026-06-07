"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function LoginPage() {
  const { login } = usePortalAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.ok) {
      if (result.role === "admin") {
        router.push("/admin/dashboard");
      } else if (result.role === "tenant") {
        router.push("/tenant/dashboard");
      } else {
        router.push("/portal/dashboard");
      }
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg py-8 sm:py-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 w-full">
          <div className="px-5 pt-8 sm:px-10 sm:pt-10 pb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-700 mb-6 transition-colors group"
            >
              <ArrowLeft
                size={15}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Back to home
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="McCann & Curran Reality"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  McCann &amp; Curran
                </h2>
                <p className="text-xs uppercase text-slate-400 tracking-wide">
                  Landlord portal
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-800 mb-4">
              Welcome back
            </h3>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mb-3">
              <div>
                <label className="relative block">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm lg:text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
                  />
                </label>
              </div>

              <div>
                <label className="relative block">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 text-sm lg:text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs lg:text-sm  text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-slate-300  text-primary-600 focus:ring-primary-500"
                  />
                  Remember me
                </label>

                {/* <button
                  type="button"
                  className="text-xs lg:text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button> */}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm lg:text-base hover:from-primary-700 hover:to-primary-800 transition-shadow shadow-sm flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Login</>
                  )}
                </button>
              </div>
            </form>

            {/* <p className="mt-5 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" " }
              <Link
                href="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Register
              </Link>
            </p> */}
          </div>

          <div className="bg-slate-50 px-5 sm:px-6 py-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">
              © 2026 McCann &amp; Curran. Confidential and Proprietary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
