"use client";
import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function AddTenancyModal({ isOpen, onClose, onSubmit, properties = [], tenants = [], propertyMap = {} }) {
    const [formData, setFormData] = useState({
        tenantId: "",
        property: "",
        propertyId: "",
        status: "",
        startDate: "",
        endDate: "",
        // rent: "",
        rentDueDay: "",
        rtbNumber: "",
        rtbStatus: "",
        rtbRegistration: "",
        rentReviewDate: "",
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "tenantId") {
            const selectedTenant = tenants.find((tenant) => String(tenant.id) === String(value));
            const selectedProperty = selectedTenant?.property || "";
            setFormData((prev) => ({
                ...prev,
                tenantId: value,
                property: prev.property || selectedProperty,
                propertyId: prev.propertyId || propertyMap[prev.property || selectedProperty] || "",
            }));
            return;
        }
        if (name === "property") {
            // Get propertyId from the propertyMap
            const propertyId = propertyMap[value] || "";
            setFormData((prev) => ({
                ...prev,
                property: value,
                propertyId: propertyId,
            }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.tenantId || !formData.property || !formData.status || !formData.rentDueDay) {
            Swal.fire({
              title: 'Incomplete Form',
              text: 'Please fill in all required fields',
              icon: 'warning',
            });
            return;
        }
        const resolvedPropertyId = formData.propertyId || propertyMap[formData.property] || "";
        if (!resolvedPropertyId) {
            Swal.fire({
              title: 'Invalid Selection',
              text: 'Selected property is missing an ID. Please reselect property.',
              icon: 'error',
            });
            return;
        }

        const didSucceed = await onSubmit({ ...formData, propertyId: resolvedPropertyId });
        if (!didSucceed) return;

        setFormData({
            tenantId: "",
            property: "",
            propertyId: "",
            status: "",
            startDate: "",
            endDate: "",
            // rent: "",
            rentDueDay: "",
            rtbNumber: "",
            rtbStatus: "",
            rtbRegistration: "",
            rentReviewDate: "",
        });
        onClose();
    };

    if (!isOpen) return null;

    const propertyOptions = Array.from(new Set([
        ...properties,
        formData.property,
    ].filter(Boolean)));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" />
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 flex flex-col max-h-[90vh]">
                {/* Sticky Header */}
                <div className="sticky top-0 flex items-start justify-between p-6 border-b border-slate-200 bg-white rounded-t-xl">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">Add New Tenancy</h3>
                        <p className="text-base text-slate-500 mt-1">Fill in the tenancy details below</p>
                    </div>
                    <button aria-label="Close" onClick={onClose} className="text-slate-500 hover:text-slate-700 flex-shrink-0">
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <form id="addTenancyForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Tenant <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="tenantId"
                            value={formData.tenantId}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="">Select a tenant</option>
                            {tenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Property */}
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Property <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="property"
                            value={formData.property}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="">Select a property</option>
                            {propertyOptions.map((property) => (
                                <option key={property} value={property}>{property}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="">Select a status</option>
                            <option value="Let">Let</option>
                            <option value="Notice">Notice</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>

                    {/* Start Date & End Date */}
                    <div className="grid grid-cols-2 gap-4">
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

                    {/* Monthly Rent */}
                    {/* <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Monthly Rent <span className="text-xs text-slate-500">(optional)</span>
                        </label>
                        <input
                            type="number"
                            name="rent"
                            value={formData.rent}
                            onChange={handleFormChange}
                            placeholder="e.g., 1500"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div> */}

                    {/* Rent Due Day */}
                    <div>
                        <label className="block text-base font-medium text-slate-700 mb-1">
                            Rent Due Day <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="rentDueDay"
                            value={formData.rentDueDay}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                            <option value="">Select day</option>
                            {[...Array(31)].map((_, i) => {
                                const day = i + 1;
                                return (
                                    <option key={day} value={String(day)}>{day}</option>
                                );
                            })}
                        </select>
                    </div>

                    {/* RTB Fields */}
                    {/* <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">RTB Number <span className="text-xs text-slate-500">(optional)</span></label>
                            <input
                                type="text"
                                name="rtbNumber"
                                value={formData.rtbNumber}
                                onChange={handleFormChange}
                                placeholder="e.g., 1234598"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">RTB Status <span className="text-xs text-slate-500">(optional)</span></label>
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
                    </div> */}

                    {/* RTB Registration & Rent Review Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">RTB Registration <span className="text-xs text-slate-500">(optional)</span></label>
                            <select
                                name="rtbRegistration"
                                value={formData.rtbRegistration}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            >
                                <option value="">Select registration</option>
                                <option value="REGISTERED">Registered</option>
                                <option value="UNREGISTERED">Unregistered</option>
                                <option value="UNKNOWN">Unknown</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-base font-medium text-slate-700 mb-1">Rent Review Date <span className="text-xs text-slate-500">(optional)</span></label>
                            <input
                                type="date"
                                name="rentReviewDate"
                                value={formData.rentReviewDate}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </form>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 flex gap-3 justify-end p-6 border-t border-slate-200 bg-white rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="addTenancyForm"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
                    >
                        Add Tenancy
                    </button>
                </div>
            </div>
        </div>
    );
}
