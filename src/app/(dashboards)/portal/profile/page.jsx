"use client";

import PortalShell from "@/components/portal/PortalShell";
import Image from "next/image";
import { Lock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/profile`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const result = await response.json();
        if (result.success && result.data) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load profile",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <PortalShell>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </PortalShell>
    );
  }

  if (!profile) {
    return (
      <PortalShell>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No profile data available</p>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
      </div>

      <div className="max-w-3xl space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
            <div className="w-[72px] h-[72px] rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-3xl font-bold shrink-0">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{profile.role}</p>
            </div>
          </div>

          {/* Admin-only notice */}
          <div className="mx-6 my-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Lock size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-semibold text-amber-800">Edit Only by Admin</p>
              <p className="text-sm text-amber-700 mt-1">
                Contact McCann &amp; Curran for any changes to your profile.<br />
                Editing is restricted to administrators.
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="px-6 py-4">
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Email</p>
                <p className="text-base text-slate-700">{profile.email}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Address</p>
                <p className="text-base font-semibold text-slate-700">{profile.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-t border-slate-100">
              <div className="px-6 py-4">
                <p className="text-base text-slate-700">{profile.phone}</p>
              </div>
              <div className="px-6 py-4">
                <p className="text-base font-bold text-slate-700">{profile.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact admin card */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-amber-200 flex items-center gap-2.5">
            <Lock size={18} className="text-amber-600" />
            <p className="text-base font-semibold text-amber-800">
              Only McCann &amp; Curran administrators can{" "}
              <span className="font-bold">edit this information</span>
            </p>
          </div>
          <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-base text-amber-700">
              Need any changes made to your profile? Please contact McCann &amp; Curran for assistance.
            </p>
            <button
              type="button"
              onClick={() => {
                if (profile?.role && profile.role.toLowerCase() === "landlord") {
                  router.push("/portal/messages");
                } else {
                  router.push("/contact");
                }
              }}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition"
            >
              Contact Us <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
