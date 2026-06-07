"use client";

import { useState, useEffect } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { User, Mail, Phone, Lock, Save } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

export default function TenantProfilePage() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
          setEditData({
            name: result.data.name,
            phone: result.data.phone || "",
            address: result.data.address || "",
          });
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

  const handleUpdateProfile = async () => {
    try {
      const payload = {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/profile`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setProfile(result.data);
        setEditing(false);
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update profile",
        icon: "error",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "New passwords do not match",
        icon: "error",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Swal.fire({
        title: "Error!",
        text: "New password must be at least 6 characters",
        icon: "error",
      });
      return;
    }

    try {
      const payload = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/change-password`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to change password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Password changed successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to change password",
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <TenantShell>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </TenantShell>
    );
  }

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your personal details and account settings</p>
      </div>

      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Avatar + quick info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center text-center gap-3 h-fit">
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-3xl font-bold">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{profile.role}</p>
            </div>
            <div className="w-full space-y-2 text-sm text-left">
              {[
                { label: "Email", value: profile.email },
                { label: "Phone", value: profile.phone || "N/A" },
                { label: "Role", value: profile.role },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-700 truncate">{value}</span>
                </div>
              ))}
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-100">
              Active User
            </span>
          </div>

          {/* Edit form */}
          <div className="lg:col-span-2 space-y-3 xl:space-y-4">
            {/* Personal details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">Personal Details</h3>
                <button
                  onClick={() => {
                    if (editing) {
                      setEditData({
                        name: profile.name,
                        phone: profile.phone || "",
                        address: profile.address || "",
                      });
                    }
                    setEditing(!editing);
                  }}
                  className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { label: "Full Name", key: "name", Icon: User, type: "text" },
                  { label: "Email Address", key: "email", Icon: Mail, type: "email" },
                  { label: "Phone Number", key: "phone", Icon: Phone, type: "tel" },
                  { label: "Address", key: "address", Icon: User, type: "text" },
                ].map(({ label, key, Icon, type }) => (
                  <div key={label}>
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      {label}
                    </label>
                    <div className="relative">
                      <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={type}
                        value={
                          key === "email"
                            ? profile.email
                            : editData[key] || ""
                        }
                        onChange={(e) => {
                          if (key !== "email") {
                            setEditData((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }));
                          }
                        }}
                        disabled={!editing || key === "email"}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
                      />
                    </div>
                  </div>
                ))}
                {editing && (
                  <button
                    onClick={handleUpdateProfile}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition"
                  >
                    <Save size={14} /> Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* Change password */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">Change Password</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  {
                    label: "Current Password",
                    key: "currentPassword",
                  },
                  {
                    label: "New Password",
                    key: "newPassword",
                  },
                  {
                    label: "Confirm New Password",
                    key: "confirmPassword",
                  },
                ].map(({ label, key }) => (
                  <div key={label}>
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      {label}
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordData[key]}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleChangePassword}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition"
                >
                  <Lock size={14} /> Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TenantShell>
  );
}