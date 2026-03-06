"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function RegisterPage() {
  const { login } = usePortalAuth();
  const router = useRouter();
  const [role, setRole] = useState("LANDLORD");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, role }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data?.errors?.length) {
          const details = data.errors.map((e) => e.message).join(" · ");
          setError(details);
        } else {
          setError(data?.message || "Registration failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      setSuccess("Account created! Taking you to your dashboard…");

      const result = await login(email, password);
      if (result.ok) {
        if (result.role === "tenant") {
          router.push("/tenant/dashboard");
        } else {
          router.push("/portal/dashboard");
        }
      } else {
        setTimeout(() => router.push("/login"), 1000);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
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
                  <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back to home
                </Link>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Image src="/logo.png" alt="McCann & Curran" width={40} height={40} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">McCann &amp; Curran</h2>
                    <p className="text-xs uppercase text-slate-400 tracking-wide">Client portal</p>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Create account</h3>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Role */}
                  {/* <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-2 px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    >
                      <option value="LANDLORD">Landlord</option>
                      <option value="TENANT">Tenant</option>
                    </select>
                  </div> */}

                  {/* Full Name */}
                  <div>
                    <label className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm lg:text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
                      />
                    </label>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm lg:text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
                      />
                    </label>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock size={18} />
                      </span>
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

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm lg:text-base hover:from-primary-700 hover:to-primary-800 transition-shadow shadow-sm flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </div>
                </form>

                <p className="mt-5 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="bg-slate-50 px-5 sm:px-6 py-4 text-center border-t border-slate-100">
                <p className="text-xs text-slate-400">© 2024 McCann &amp; Curran. Confidential and Proprietary.</p>
              </div>
            </div>
      </div>
    </div>
  );
}
