"use client";

import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

const STORAGE_KEY = "admin_settings_v1";

const DEFAULTS = {
  companyName: "McCann & Curran",
  contactEmail: "admin@example.com",
  notifyRTB: true,
  notifyRentReview: true,
  
};

export default function AdminSettingsPage() {
  const [state, setState] = useState(DEFAULTS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  function update(k, v) {
    setState((s) => ({ ...s, [k]: v }));
    setDirty(true);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setDirty(false);
      alert("Settings saved (local only)");
    } catch (e) {
      alert("Failed to save settings");
    }
  }

  function cancel() {
    setState(DEFAULTS);
    setDirty(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage account, notifications and system defaults</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={cancel} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700">
            <X size={14} /> Cancel
          </button>
          <button onClick={save} disabled={!dirty} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white ${dirty ? 'bg-teal-600 hover:bg-teal-700' : 'bg-slate-300 cursor-not-allowed'}`}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-800">Company & Contact</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-slate-600">Company name</label>
            <input value={state.companyName} onChange={(e) => update('companyName', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md" />

            <label className="block text-sm text-slate-600">Contact email</label>
            <input value={state.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.notifyRTB} onChange={(e) => update('notifyRTB', e.target.checked)} />
              <span className="text-sm text-slate-700">Alert when RTB number missing</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={state.notifyRentReview} onChange={(e) => update('notifyRentReview', e.target.checked)} />
              <span className="text-sm text-slate-700">Notify for rent reviews due</span>
            </label>
            {/* 2FA setup handled by backend; removed toggle from demo UI */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-800">Auth & Security</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-slate-600">Change password</label>
            <input type="password" placeholder="New password" className="w-full px-3 py-2 border border-slate-200 rounded-md" />
            <input type="password" placeholder="Confirm password" className="w-full px-3 py-2 border border-slate-200 rounded-md" />
          </div>
        </div>

        {/* Integrations & API keys removed from frontend demo to avoid backend complexity */}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-800">Roles & Permissions</h2>
        <p className="text-sm text-slate-500 mt-1">Quick mock of roles. Manage access in a real app via backend.</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Admin</p>
                <p className="text-sm text-slate-400">Full access</p>
              </div>
              <div>
                <button className="text-xs px-2 py-1 rounded bg-slate-100">Edit</button>
              </div>
            </div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Manager</p>
                <p className="text-sm text-slate-400">Limited admin</p>
              </div>
              <div>
                <button className="text-xs px-2 py-1 rounded bg-slate-100">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
