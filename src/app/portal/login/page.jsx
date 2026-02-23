"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function LoginPage() {
  const { login } = usePortalAuth();
  const router = useRouter();
  const [role, setRole] = useState("landlord");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password, role);
    if (ok) {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "tenant") {
        router.push("/tenant/dashboard");
      } else {
        router.push("/portal/dashboard");
      }
    } else {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-white">
      <div className="container mx-auto px-6 py-10 lg:py-0">
        <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-10 items-center">

          {/* Left: Brand / illustration */}
          <div className="flex flex-col justify-center gap-6 p-8 order-2 lg:order-1">
            
            {/* Demo credentials panel */}
            <div className="mt-6 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
              <h5 className="text-base font-semibold text-slate-800 mb-3">Demo accounts</h5>
              <div className="space-y-3 text-base text-slate-700">
                {[
                  { r: "admin",    e: "admin@mccannandcurran.ie", p: "admin1234" },
                  { r: "landlord", e: "joe.doyle@email.com",      p: "demo1234" },
                  { r: "tenant",   e: "tenant@example.com",       p: "tenant123" },
                ].map((a) => (
                  <div key={a.r} className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-medium text-slate-800">{a.r.charAt(0).toUpperCase() + a.r.slice(1)}</div>
                      <div className="text-xs text-slate-500">{a.e} · {a.p}</div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setRole(a.r);
                          setEmail(a.e);
                          setPassword(a.p);
                        }}
                        className="px-3 py-1 rounded-md bg-primary-50 border border-primary-100 text-sm text-primary-700 hover:bg-primary-100"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Login card */}
          <div className="relative z-10 order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-8 sm:p-10">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-700 mb-6 transition-colors group"
                >
                  <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back to home
                </Link>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Image src="/logo.png" alt="McCann & Curran" width={40} height={40} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">McCann &amp; Curran</h2>
                    <p className="text-xs uppercase text-slate-400 tracking-wide">Landlord portal</p>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Welcome back</h3>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Role selector + demo autofill */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-2 px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    >
                      <option value="admin">Admin</option>
                      <option value="landlord">Landlord</option>
                      <option value="tenant">Tenant</option>
                    </select>
                  </div>
                  <div>
                    <label className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      Remember me
                    </label>

                    <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Forgot password?
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-base hover:from-primary-700 hover:to-primary-800 transition-shadow shadow-sm flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Login
                        </>
                      )}
                    </button>
                  </div>
                </form>

                
              </div>

              <div className="bg-slate-50 px-6 py-4 text-center border-t border-slate-100">
                <p className="text-xs text-slate-400">© 2024 McCann &amp; Curran. Confidential and Proprietary.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
