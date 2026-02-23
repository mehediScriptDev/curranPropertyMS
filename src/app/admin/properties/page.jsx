"use client";
import { useState } from "react";
import {
  Plus, ChevronDown, Eye, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown
} from "lucide-react";
import Pagination from "@/components/portal/Pagination";

const PROPERTIES = [
  { id: 1,  img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&q=60", name: "Apt 12, Grand Canal...", area: "Dublin · 10:2",  statusProp: "Let",    statusRTB: "Let",    landlord: "Edward O'Neill", landlordSub: "John Dyea",    tenant: "Sarah Kelly",          rent: "€2,200", mprn: "100093319", rtb: "Missing",    rtbStyle: "text-slate-500" },
  { id: 2,  img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=60", name: "Apt 5B, Rosewood Close", area: "Dublin · 10:5", statusProp: "Notice",  statusRTB: "Notice",  landlord: "Joan Doyle",      landlordSub: "Kem hetan",     tenant: "Kevin Madden",         rent: "€1,950", mprn: "100093357", rtb: "Pending",    rtbStyle: "text-amber-600" },
  { id: 3,  img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=80&q=60", name: "Apt 4, Lis Na Dara",  area: "Dublin · 10:9",  statusProp: "Vacant",  statusRTB: null,      landlord: "Zoe Finnegan",    landlordSub: "Emma Curran",   tenant: "–",                    rent: "€1,850", mprn: "100093352", rtb: "Unknown",    rtbStyle: "text-slate-500" },
  { id: 4,  img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=60", name: "Apt 21C, Harbour View", area: "Dublin · 10:68", statusProp: "Let",   statusRTB: "Let",    landlord: "Edward O'Neill", landlordSub: "John Dyea",    tenant: "Reginald Spencer",     rent: "€2,350", mprn: "100093118", rtb: "Registered", rtbStyle: "text-teal-600" },
  { id: 5,  img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=80&q=60", name: "Apt 65, Southern Cross", area: "Dublin · 10:11", statusProp: "Let",  statusRTB: "Let",    landlord: "Brendan Walsh",  landlordSub: "Deancer",       tenant: "Adam Walsh",           rent: "€2,400", mprn: "1000989721", rtb: "Registered", rtbStyle: "text-teal-600" },
  { id: 6,  img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=60", name: "Apt 306, Fairview Road", area: "Dublin · 10:65", statusProp: "Let",  statusRTB: "Let",    landlord: "Mary Bennett",   landlordSub: "Mary Surran",   tenant: "Peter Hughes",         rent: "€2,100", mprn: "1000992929", rtb: "Registered", rtbStyle: "text-teal-600" },
  { id: 7,  img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=80&q=60", name: "Apt 7D, Hanover Quay",  area: "Dublin · 10:46", statusProp: "Let",  statusRTB: "Let",    landlord: "Mark Sheehan",   landlordSub: "Mark Sheehan",  tenant: "Emma Curran",          rent: "€2,250", mprn: "1000992654", rtb: "Registered", rtbStyle: "text-teal-600" },
  { id: 8,  img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=80&q=60", name: "Apt 104, Elmwood Grove", area: "Dublin · 10:69", statusProp: "Notice", statusRTB: "Let",   landlord: "Edward O'Neill", landlordSub: "Mark Sheehan",  tenant: "Leanne Byrne",         rent: "€1,800", mprn: "1000993381", rtb: "Pending",    rtbStyle: "text-amber-600" },
  { id: 9,  img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80&q=60", name: "Apt 5, City Square",    area: "Dublin · 10:57", statusProp: "Let",   statusRTB: "Let",    landlord: "Joan Doyle",     landlordSub: "John Doyle",    tenant: "Steven Keane",         rent: "€2,100", mprn: "1000932619", rtb: "Registered", rtbStyle: "text-teal-600" },
  { id: 10, img: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=80&q=60", name: "Apt 399, Pearse Street", area: "Dublin · 10:23", statusProp: "Notice", statusRTB: "Notice", landlord: "Tony Brennan",   landlordSub: "Leo Mohan",     tenant: "Dean Lyons",           rent: "€1,650", mprn: "1000993537", rtb: "Unknown",    rtbStyle: "text-slate-500" },
];

const PROP_STATUS = {
  Let:    "bg-teal-500 text-white",
  Notice: "bg-orange-100 text-orange-600 border border-orange-300",
  Vacant: "bg-teal-100 text-teal-700",
};
const RTB_STATUS = {
  Let:    "bg-teal-500 text-white",
  Notice: "bg-orange-400 text-white",
};

export default function AdminPropertiesPage() {
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProp, setActiveProp] = useState(null);

  const filtered = PROPERTIES;

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));
  const toggleRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Properties</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition">
          <Plus size={15} /> Add Property
        </button>
      </div>

      {/* Mobile cards — visible below lg */}
      <div className="lg:hidden space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img src={p.img} alt={p.name} className="w-14 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100" onError={(e) => { e.target.style.display='none'; }} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm truncate">{p.name}</p>
                <p className="text-xs text-slate-400">{p.area}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${PROP_STATUS[p.statusProp]}`}>
                {p.statusProp !== "Vacant" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
                {p.statusProp}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Landlord</p>
                <p className="font-medium text-slate-700 truncate">{p.landlord}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Tenant</p>
                <p className="font-medium text-slate-700 truncate">{p.tenant}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">Rent</p>
                <p className="font-semibold text-slate-800">{p.rent}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-xs text-slate-400 mb-0.5">RTB #</p>
                <p className={`font-medium flex items-center gap-1 ${p.rtbStyle}`}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />{p.rtb}
                </p>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100">
              <button
                aria-label="View"
                onClick={() => { setActiveProp(p); setModalOpen(true); }}
                className="w-full h-9 inline-flex items-center justify-center gap-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md transition text-xs font-medium"
              >
                <Eye size={14} /> View Details
              </button>
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Pagination total={PROPERTIES.length} />
        </div>
      </div>

      {/* Table — visible lg+ */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">Photo </span>
              </th>
              <th className="w-48 px-3 py-3 text-center font-semibold text-slate-600 text-sm">
                <span className="flex items-center justify-center gap-1">Status</span>
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">Landlord </span>
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">Tenant </span>
              </th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">Rent</th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">MPRN</th>
              <th className="w-48 px-3 py-3 text-left font-semibold text-slate-600 text-base">
                <span className="flex items-center gap-1">RTB # </span>
              </th>
              <th className="w-48 px-3 py-3 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className={`hover:bg-slate-50/60 transition ${selected.includes(p.id) ? "bg-teal-50/40" : ""}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleRow(p.id)} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                </td>
                <td className="w-48 px-3 py-3">
                  <div className="flex items-center gap-4">
                    <img src={p.img} alt={p.name} className="w-14 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100" onError={(e) => { e.target.style.display='none'; }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-base leading-tight truncate">{p.name}</p>
                      <p className="text-sm text-slate-400">{p.area}</p>
                    </div>
                  </div>
                </td>
                <td className="w-48 px-3 py-3 text-center">
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold w-fit ${PROP_STATUS[p.statusProp]}`}>
                      {p.statusProp !== "Vacant" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
                      {p.statusProp}
                    </span>
                  </div>
                </td>
                <td className="w-48 px-3 py-3">
                  <p className="text-slate-800 font-medium text-base truncate">{p.landlord}</p>
                  <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                    <span className="inline-block w-3 h-3 rounded-sm bg-slate-200" />
                    {p.landlordSub}
                  </p>
                </td>
                <td className="w-48 px-3 py-3">
                  <p className="text-slate-700 text-base font-medium truncate">{p.tenant}</p>
                </td>
                <td className="w-48 px-3 py-3 font-semibold text-slate-800 text-base">{p.rent}</td>
                <td className="w-48 px-3 py-3 text-slate-600 text-base">{p.mprn}</td>
                <td className="w-48 px-3 py-3">
                  <span className={`flex items-center gap-1 text-base font-medium ${p.rtbStyle}`}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
                    {p.rtb}
                  </span>
                </td>
                <td className="w-48 px-3 py-3 text-right">
                  <div>
                    <button
                      aria-label="View"
                      onClick={() => { setActiveProp(p); setModalOpen(true); }}
                      className="w-9 h-9 inline-flex items-center justify-center bg-teal-100 hover:bg-teal-700 text-teal-700 hover:text-white rounded-md transition"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={PROPERTIES.length} />
      </div>

      {/* Modal: Property details */}
      {modalOpen && activeProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => { setModalOpen(false); setActiveProp(null); }} />
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 z-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{activeProp.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{activeProp.area}</p>
              </div>
              <button aria-label="Close" onClick={() => { setModalOpen(false); setActiveProp(null); }} className="text-slate-500 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <img src={activeProp.img} alt={activeProp.name} className="w-full h-40 object-cover rounded-md sm:col-span-1" />
              <div className="sm:col-span-2 space-y-2">
                <p className="text-sm"><strong>Landlord:</strong> {activeProp.landlord} <span className="text-xs text-slate-400">({activeProp.landlordSub})</span></p>
                <p className="text-sm"><strong>Tenant:</strong> {activeProp.tenant}</p>
                <p className="text-sm"><strong>Rent:</strong> {activeProp.rent}</p>
                <p className="text-sm"><strong>MPRN:</strong> {activeProp.mprn}</p>
                <p className="text-sm"><strong>RTB #:</strong> <span className={activeProp.rtbStyle}>{activeProp.rtb}</span></p>
                <p className="text-sm"><strong>Status:</strong> {activeProp.statusProp}</p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => { setModalOpen(false); setActiveProp(null); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

