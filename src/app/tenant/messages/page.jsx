"use client";

import { useState } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { Send } from "lucide-react";

const thread = [
  {
    from: "agency",
    name: "McCann & Curran",
    text: "Hi Kevin, just a reminder that your February rent payment is now overdue. Please arrange payment at your earliest convenience.",
    time: "Feb 6, 2025 · 9:15 AM",
  },
  {
    from: "tenant",
    name: "Kevin Madden",
    text: "Hi, apologies for the delay — I'll arrange the bank transfer by end of week.",
    time: "Feb 6, 2025 · 11:42 AM",
  },
  {
    from: "agency",
    name: "McCann & Curran",
    text: "Thank you Kevin, appreciated. Also, a maintenance engineer will visit on Feb 24th between 10am–1pm to look at the boiler. Please ensure access.",
    time: "Feb 7, 2025 · 10:00 AM",
  },
  {
    from: "tenant",
    name: "Kevin Madden",
    text: "That works for me, I'll be home. Thanks for sorting that.",
    time: "Feb 7, 2025 · 10:22 AM",
  },
  {
    from: "agency",
    name: "McCann & Curran",
    text: "Your rent review is scheduled for May 2025. We will be in touch with more details closer to the time.",
    time: "Feb 10, 2025 · 2:00 PM",
  },
];

export default function TenantMessagesPage() {
  const [message, setMessage] = useState("");

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
        <p className="text-slate-500 mt-1 text-sm">Your conversation with McCann & Curran letting agency</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>
        {/* Thread header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
            MC
          </div>
          <div>
            <p className="text-base font-bold text-slate-800">McCann & Curran</p>
            <p className="text-xs text-teal-600 font-medium">Letting Agent · Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 xl:space-y-4">
          {thread.map((msg, i) => {
            const isMe = msg.from === "tenant";
            return (
              <div key={i} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? "bg-slate-200 text-slate-700" : "bg-teal-100 text-teal-700"}`}>
                  {isMe ? "KM" : "MC"}
                </div>
                <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-teal-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm"}`}>
                    {msg.text}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 px-1">{msg.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compose */}
        <div className="px-5 py-3 border-t border-slate-100">
          <div className="flex items-end gap-3">
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to your letting agent..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition resize-none"
            />
            <button className="w-11 h-11 flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </TenantShell>
  );
}
