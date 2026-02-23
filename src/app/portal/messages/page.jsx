"use client";

import { useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import Pagination from "@/components/portal/Pagination";
import { Search } from "lucide-react";
import Image from "next/image";

const threads = [
  {
    name: "Stephen Blake",
    property: "Apt 306 Fairview Rd",
    age: "Apt 6 days ago",
    subject: "No Heating",
    preview: "Hi Joe. I've been having trouble with the heating lately. The heaters aren't turning on correctly. Can you send somn. nome noke to take look?",
    time: "30 minutes ago",
    unread: 1,
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Edward Martin",
    property: "Apt 104 Elmwood Grove",
    age: "15 days ago",
    subject: "Leaky Sink",
    preview: "Hi Joe. There's a leak under the kitchen sink that needs fixingz. It's dripping all one coboard space below.",
    time: "2 hours ago",
    unread: 2,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Adam Walsh",
    property: "Apt 104 Elmwood Grove",
    age: "6 days ago",
    subject: "RTB Registration",
    preview: "Hi Joe. Have you procsd the RTB registration for my tenancy yet? Thank you.",
    time: "2 days ago",
    unread: null,
    badge: "Red",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Kevin Madden",
    property: "Apt 5B Rosewood Close",
    age: "6 days ago",
    subject: "Rent Payment",
    preview: "Hi Joe. The payment for the month will be delayed. I should been t to you in a few days. Apologies for any inconvenience.",
    time: "3 days ago",
    unread: null,
    badge: "Red",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "Sarah Quinn",
    property: "Apt 306 Fairview Rd",
    age: "6 days ago",
    subject: "Vacating Property",
    preview: "Hi Joe. My partner ad e planning to vacate the property at the end of next month. We'll send a formal notice shortly. Thanks.",
    time: "6 days ago",
    unread: null,
    badge: "Red",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export default function MessagesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  return (
    <PortalShell>
      <div className="mb-4 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Messages</h1>
      </div>

      {/* Search */}
      <div className="relative mb-3 lg:mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {threads.map((t, i) => (
            <div
              key={i}
              className="flex gap-3 lg:gap-4 px-4 lg:px-6 py-4 lg:py-5 hover:bg-slate-50/60 cursor-pointer transition-colors"
            >
              <Image
                src={t.avatar}
                alt={t.name}
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10 lg:w-12 lg:h-12 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm lg:text-base">{t.name}</p>
                    <p className="text-xs lg:text-sm text-slate-400">{t.property}</p>
                    <p className="text-xs lg:text-sm text-slate-400">{t.age}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 lg:gap-1.5 shrink-0">
                    <span className="text-xs lg:text-sm text-slate-400 whitespace-nowrap">{t.time}</span>
                    {t.unread && (
                      <span className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-teal-600 text-white text-xs font-bold">
                        {t.unread}
                      </span>
                    )}
                    {t.badge && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-400 text-white">
                        {t.badge}
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-semibold text-slate-700 text-sm lg:text-base">{t.subject}</p>
                <p className="text-xs lg:text-sm text-slate-400 line-clamp-2 mt-0.5 lg:mt-1">{t.preview}</p>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          total={threads.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>
    </PortalShell>
  );
}
