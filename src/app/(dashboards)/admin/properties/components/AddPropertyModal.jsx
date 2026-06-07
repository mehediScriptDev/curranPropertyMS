"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

const INITIAL_FORM_DATA = {
  name: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  address: "",
  county: "",
  eircode: "",
  landlordId: "",
  status: "VACANT",
  rent: "",
  image: null,
};

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Semi-D",
  "Townhouse",
  "Studio",
  "Other",
];

const STATUS_OPTIONS = [
  { value: "LET", label: "Let" },
  { value: "NOTICE", label: "Notice" },
  { value: "VACANT", label: "Vacant" },
  { value: "MANAGED", label: "Managed" },
];

export default function AddPropertyModal({
  isOpen,
  onClose,
  onSubmit,
  landlords = [],
  submitting = false,
}) {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ ...INITIAL_FORM_DATA });
      setImagePreview(null);
    }
  }, [isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.propertyType || !formData.landlordId) {
      Swal.fire({
        title: "Incomplete Form",
        text: "Please fill in all required fields",
        icon: "warning",
      });
      return;
    }

    const success = await onSubmit({
      ...formData,
      status: formData.status,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      rent: Number(formData.rent) || 0,
    });

    if (success) {
      setFormData({ ...INITIAL_FORM_DATA });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => !submitting && onClose()}
      />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 flex items-start justify-between p-6 border-b border-slate-200 bg-white rounded-t-xl">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              Add New Property
            </h3>
            <p className="text-base text-slate-500 mt-1">
              Fill in the property details below
            </p>
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

        {/* Scrollable Content */}
        <form
          id="addPropertyForm"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-base font-medium text-slate-700 mb-1">
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., Apt 12, Grand Canal..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-base font-medium text-slate-700 mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleFormChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleFormChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-base font-medium text-slate-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Street address"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* County/City & Eircode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">
                County/City
              </label>
              <input
                type="text"
                name="county"
                value={formData.county}
                onChange={handleFormChange}
                placeholder="e.g., Dublin"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">
                Eircode
              </label>
              <input
                type="text"
                name="eircode"
                value={formData.eircode}
                onChange={handleFormChange}
                placeholder="e.g., D01 1AA"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Assigned Landlord */}
          <div>
            <label className="block text-base font-medium text-slate-700 mb-1">
              Assigned Landlord <span className="text-red-500">*</span>
            </label>
            <select
              name="landlordId"
              value={formData.landlordId}
              onChange={handleFormChange}
              disabled={landlords.length === 0}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">
                {landlords.length === 0
                  ? "No landlords found"
                  : "Select a landlord"}
              </option>
              {landlords.map((landlord) => (
                <option key={landlord.id} value={landlord.id}>
                  {landlord.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status & Rent */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-slate-700 mb-1">
                Rent
              </label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleFormChange}
                min="0"
                step="0.01"
                placeholder="e.g., 2500"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Optional Image */}
          <div>
            <label className="block text-base font-medium text-slate-700 mb-1">
              Property Image{" "}
              <span className="text-slate-500 text-sm font-normal">
                (Optional)
              </span>
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
              />
              {imagePreview && (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-54 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 flex gap-3 justify-end p-6 border-t border-slate-200 bg-white rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="addPropertyForm"
            disabled={submitting}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
          >
            {submitting ? "Adding..." : "Add Property"}
          </button>
        </div>
      </div>
    </div>
  );
}
