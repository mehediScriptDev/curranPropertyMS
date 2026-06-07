"use client";

import { useState, use } from "react";
import { ChevronDown, Edit2, Check, X, Trash2, Plus } from "lucide-react";
import { PROPERTY_FINANCES } from "@/data/finances";

export default function PropertyFinancesPage({ params }) {
  const { id } = use(params);
  const property = PROPERTY_FINANCES[id];

  const [months, setMonths] = useState(property?.months || []);
  const [editingMonthIndex, setEditingMonthIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Property not found</p>
      </div>
    );
  }

  // Calculate totals
  const totalRent = months.reduce((sum, m) => sum + m.rentCollected, 0);
  const totalDeductions = months.reduce((sum, m) => sum + m.deductionTotal, 0);
  const totalNetAmount = months.reduce((sum, m) => sum + m.netAmount, 0);
  const paidCount = months.filter((m) => m.isPaid).length;

  const openEdit = (index) => {
    setEditingMonthIndex(index);
    setEditFormData({ ...months[index] });
  };

  const closeEdit = () => {
    setEditingMonthIndex(null);
    setEditFormData({});
  };

  const saveEdit = () => {
    const updated = [...months];
    updated[editingMonthIndex] = editFormData;
    setMonths(updated);
    closeEdit();
  };

  const togglePaid = (index) => {
    const updated = [...months];
    updated[index].isPaid = !updated[index].isPaid;
    updated[index].status = updated[index].isPaid ? "Paid" : "Pending";
    setMonths(updated);
  };

  const deleteDeduction = (monthIndex, deductionIndex) => {
    const updated = [...months];
    updated[monthIndex].deductions.splice(deductionIndex, 1);
    updated[monthIndex].deductionTotal = updated[monthIndex].deductions.reduce(
      (sum, d) => sum + d.amount,
      0
    );
    updated[monthIndex].netAmount = updated[monthIndex].rentCollected - updated[monthIndex].deductionTotal;
    setMonths(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {property.propertyName} - Finances
        </h1>
        <p className="text-slate-600 mt-2">Manage rent, deductions, and payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm font-medium text-slate-600 mb-2">Total Rent</p>
          <p className="text-3xl font-bold text-slate-900">€{totalRent.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">{months.length} months</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm font-medium text-slate-600 mb-2">Total Deductions</p>
          <p className="text-3xl font-bold text-red-600">-€{totalDeductions.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">{months.length} months</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm font-medium text-slate-600 mb-2">Net Amount</p>
          <p className="text-3xl font-bold text-teal-600">€{totalNetAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">After deductions</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm font-medium text-slate-600 mb-2">Status</p>
          <p className="text-3xl font-bold text-slate-900">{paidCount}</p>
          <p className="text-xs text-slate-500 mt-2">Months paid ({paidCount}/{months.length})</p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Monthly Breakdown</h2>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {months.map((month, idx) => (
            <div key={idx} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{month.month}</p>
                  <p className="text-sm text-slate-500">
                    Rent: €{month.rentCollected} | Net: €{month.netAmount}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    month.isPaid
                      ? "bg-teal-100 text-teal-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {month.status}
                </span>
              </div>

              {month.deductions.length > 0 && (
                <div className="bg-slate-50 rounded p-3 space-y-2">
                  <p className="text-xs font-medium text-slate-600">Deductions: -€{month.deductionTotal}</p>
                  {month.deductions.map((ded, didx) => (
                    <div key={didx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        {ded.type}: €{ded.amount}
                      </span>
                      <button
                        onClick={() => deleteDeduction(idx, didx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(idx)}
                  className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition"
                >
                  <Edit2 size={14} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => togglePaid(idx)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition ${
                    month.isPaid
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : "bg-teal-50 hover:bg-teal-100 text-teal-700"
                  }`}
                >
                  {month.isPaid ? "Mark Pending" : "Mark Paid"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600 font-semibold">
                <th className="text-left px-6 py-3">Month</th>
                <th className="text-right px-6 py-3">Rent Collected</th>
                <th className="text-right px-6 py-3">Total Deductions</th>
                <th className="text-right px-6 py-3">Net Amount</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {months.map((month, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-800">{month.month}</td>
                  <td className="px-6 py-4 text-right text-slate-700">€{month.rentCollected.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-red-600 font-medium">
                    -€{month.deductionTotal.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-teal-600 font-semibold">
                    €{month.netAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        month.isPaid
                          ? "bg-teal-100 text-teal-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {month.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(idx)}
                        className="p-2 hover:bg-blue-50 rounded text-blue-600 transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => togglePaid(idx)}
                        className={`p-2 rounded transition ${
                          month.isPaid
                            ? "hover:bg-slate-200 text-slate-600"
                            : "hover:bg-teal-100 text-teal-600"
                        }`}
                        title={month.isPaid ? "Mark pending" : "Mark paid"}
                      >
                        {month.isPaid ? <X size={16} /> : <Check size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingMonthIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={closeEdit} />
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-50 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Edit: {editFormData.month}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rent Collected (€)
                  </label>
                  <input
                    type="number"
                    value={editFormData.rentCollected || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        rentCollected: parseInt(e.target.value) || 0,
                        netAmount:
                          (parseInt(e.target.value) || 0) - editFormData.deductionTotal,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Deductions (€)
                  </label>
                  <input
                    type="number"
                    value={editFormData.deductionTotal || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        deductionTotal: parseInt(e.target.value) || 0,
                        netAmount:
                          editFormData.rentCollected -
                          (parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Deductions Breakdown
                </label>
                <div className="space-y-2 mb-3">
                  {editFormData.deductions?.map((ded, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded"
                    >
                      <input
                        type="text"
                        placeholder="Type"
                        value={ded.type}
                        onChange={(e) => {
                          const updated = [...editFormData.deductions];
                          updated[idx].type = e.target.value;
                          setEditFormData({
                            ...editFormData,
                            deductions: updated,
                          });
                        }}
                        className="flex-1 px-2 py-1 border border-slate-200 rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={ded.amount}
                        onChange={(e) => {
                          const updated = [...editFormData.deductions];
                          updated[idx].amount = parseInt(e.target.value) || 0;
                          const newTotal = updated.reduce(
                            (sum, d) => sum + d.amount,
                            0
                          );
                          setEditFormData({
                            ...editFormData,
                            deductions: updated,
                            deductionTotal: newTotal,
                            netAmount:
                              editFormData.rentCollected - newTotal,
                          });
                        }}
                        className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
                      />
                      <button
                        onClick={() => {
                          const updated = editFormData.deductions.filter(
                            (_, i) => i !== idx
                          );
                          const newTotal = updated.reduce(
                            (sum, d) => sum + d.amount,
                            0
                          );
                          setEditFormData({
                            ...editFormData,
                            deductions: updated,
                            deductionTotal: newTotal,
                            netAmount:
                              editFormData.rentCollected - newTotal,
                          });
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
