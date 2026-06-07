"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const EMPTY_FORM = {
  status: "ACTIVE",
  startDate: "",
  endDate: "",
  rtbNumber: "",
  rtbRegistration: "",
  rtbStatus: "",
  rtbRegistrationDate: "",
  rtbExpiryDate: "",
};

function buildInitialForm(tenancy) {
  if (!tenancy) return { ...EMPTY_FORM };

  return {
    status: String(tenancy.status || "ACTIVE").toUpperCase(),
    startDate: tenancy.startDate || "",
    endDate: tenancy.endDate || "",
    rtbNumber: tenancy.rtb && tenancy.rtb !== "N/A" ? tenancy.rtb : "",
    rtbRegistration: String(tenancy.rtbReg || "").toUpperCase(),
    rtbStatus: tenancy.rtbStatus && tenancy.rtbStatus !== "Unknown" ? tenancy.rtbStatus : "",
    rtbRegistrationDate: tenancy.rtbRegistrationDate || "",
    rtbExpiryDate: tenancy.rtbExpiryDate || "",
  };
}

export default function EditTenancyModal({
  isOpen,
  onClose,
  onSubmit,
  tenancy,
  submitting = false,
}) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialForm(tenancy));
      return;
    }
    setFormData({ ...EMPTY_FORM });
  }, [isOpen, tenancy]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (!success) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => !submitting && onClose()} />

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 flex flex-col max-h-[90vh]">
        <div className="sticky top-0 flex items-start justify-between p-6 border-b border-slate-200 bg-white rounded-t-xl">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Edit Tenancy</h3>
            <p className="text-base text-slate-500 mt-1">Update status, dates, and RTB details</p>
          </div>
          <button
            aria-label="Close"
            onClick={() => !submitting && onClose()}
            className="text-slate-500 hover:text-slate-700 flex-shrink-0"
            disabled={submitting}
          >
            <X size={18} />
          </button>
        </div>

        <form id="editTenancyForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-base font-medium text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="NOTICE">NOTICE</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">RTB Number</label>
              <input
                type="text"
                name="rtbNumber"
                value={formData.rtbNumber}
                onChange={handleFormChange}
                placeholder="e.g., 100999118"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">RTB Registration</label>
              <select
                name="rtbRegistration"
                value={formData.rtbRegistration}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select registration</option>
                <option value="REGISTERED">REGISTERED</option>
                <option value="UNREGISTERED">UNREGISTERED</option>
                <option value="UNKNOWN">UNKNOWN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base font-medium text-slate-700 mb-1">RTB Status</label>
            <select
              name="rtbStatus"
              value={formData.rtbStatus}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Notice">Notice</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">RTB Registration Date</label>
              <input
                type="date"
                name="rtbRegistrationDate"
                value={formData.rtbRegistrationDate}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">RTB Expiry Date</label>
              <input
                type="date"
                name="rtbExpiryDate"
                value={formData.rtbExpiryDate}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </form>

        <div className="sticky bottom-0 flex gap-3 justify-end p-6 border-t border-slate-200 bg-white rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="editTenancyForm"
            disabled={submitting}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
