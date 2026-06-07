"use client";

import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";
import Swal from "sweetalert2";

const DEFAULTS = {
  companyName: "",
  contactEmail: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AdminSettingsPage() {
  const [state, setState] = useState(DEFAULTS);
  const [initialState, setInitialState] = useState(DEFAULTS);
  const [dirty, setDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      setIsFetching(true);
      try {
        const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`);
        if (!response.ok) return;

        const payload = await response.json();
        const apiData = payload?.data;
        if (!apiData || !active) return;

        const next = {
          companyName: apiData.companyName ?? "",
          contactEmail: apiData.contactEmail ?? "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };

        setState(next);
        setInitialState(next);
        setDirty(false);
      } catch (e) {
        // ignore and keep empty defaults
      } finally {
        if (active) setIsFetching(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function update(k, v) {
    setState((s) => ({ ...s, [k]: v }));
    if (k === "currentPassword" || k === "newPassword" || k === "confirmPassword") {
      setPasswordDirty(true);
    } else {
      setDirty(true);
    }
  }

  async function save() {
    try {
      // Save company settings
      const companyBody = JSON.stringify({
        companyName: state.companyName,
        contactEmail: state.contactEmail,
      });

      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings/company`, {
        method: "PUT",
        body: companyBody,
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      setInitialState((prev) => ({
        ...prev,
        companyName: state.companyName,
        contactEmail: state.contactEmail,
      }));
      setDirty(false);
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Settings saved successfully",
        confirmButtonColor: "#0d9488",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to save settings",
        confirmButtonColor: "#0d9488",
      });
    }
  }

  async function savePassword() {
    try {
      const passwordBody = JSON.stringify({
        currentPassword: state.currentPassword || "",
        newPassword: state.newPassword || "",
        confirmPassword: state.confirmPassword || "",
      });

      const passwordResponse = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings/security`, {
        method: "PUT",
        body: passwordBody,
      });

      if (!passwordResponse.ok) {
        throw new Error("Failed to update password");
      }

      setState((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setInitialState((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setPasswordDirty(false);
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Password changed successfully",
        confirmButtonColor: "#0d9488",
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to change password",
        confirmButtonColor: "#0d9488",
      });
    }
  }

  function cancel() {
    setState((prev) => ({
      ...prev,
      companyName: initialState.companyName,
      contactEmail: initialState.contactEmail,
    }));
    setDirty(false);
  }

  return (
    <div className="min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-base text-slate-600">Manage account and system defaults</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={cancel} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition duration-200">
              <X size={16} /> Cancel
            </button>
            <button onClick={save} disabled={!dirty} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${dirty ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company & Contact Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition duration-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Company & Contact</h2>
              <div className="h-1 w-12 bg-teal-600 rounded-full mt-2"></div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">Company Name</label>
                {isFetching ? (
                  <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
                ) : (
                  <input
                    value={state.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2.5">Contact Email</label>
                {isFetching ? (
                  <div className="h-10 w-full rounded-lg bg-slate-100 animate-pulse" />
                ) : (
                  <input
                    value={state.contactEmail}
                    onChange={(e) => update("contactEmail", e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Roles & Permissions Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition duration-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Roles & Permissions</h2>
              <p className="text-sm text-slate-600 mt-1">Quick mock of roles. Manage access in a real app via backend.</p>
              <div className="h-1 w-12 bg-teal-600 rounded-full mt-2"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-200 rounded-lg bg-slate-50 transition duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Admin</p>
                    <p className="text-sm text-slate-600 mt-1">Full access</p>
                  </div>
                  <button disabled className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 transition">Non-Editable</button>
                </div>
              </div>
              <div className="p-5 border border-slate-200 rounded-lg bg-slate-50  transition duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">Landlords</p>
                    <p className="text-sm text-slate-600 mt-1">Limited admin</p>
                  </div>
                  <button disabled className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 transition">Non-Editable</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth & Security Section - Full Width */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6 transition duration-200">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">Auth & Security</h2>
              <div className="h-1 w-12 bg-teal-600 rounded-full mt-2"></div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button 
                onClick={() => {
                  setState((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }));
                  setPasswordDirty(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition duration-200">
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={savePassword} 
                disabled={!passwordDirty} 
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${passwordDirty ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
                <Save size={16} /> Save
              </button>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password" 
                value={state.currentPassword}
                onChange={(e) => update('currentPassword', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={state.newPassword}
                onChange={(e) => update('newPassword', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2.5">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm password" 
                value={state.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white focus:border-transparent transition" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
