"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Search, ArrowLeft } from "lucide-react";

const CONVERSATIONS = [
  {
    id: 1, name: "Kevin Madden", role: "Tenant",
    preview: "Hi, I've a question about my rent...", unread: 2,
    messages: [
      { from: "tenant", name: "Kevin Madden", text: "Hi, I've a question about my rent.", time: "Feb 22 · 9:12 AM" },
      { from: "admin",  name: "Admin",        text: "Hi Kevin — what's the question?",   time: "Feb 22 · 9:30 AM" },
      { from: "tenant", name: "Kevin Madden", text: "Is the March rent still €1,950 or has it been reviewed?", time: "Feb 22 · 9:45 AM" },
    ],
  },
  {
    id: 2, name: "Joan Doyle", role: "Landlord",
    preview: "Property 5B — maintenance update needed", unread: 0,
    messages: [
      { from: "landlord", name: "Joan Doyle", text: "Please confirm the contractor visit date for Apt 5B.", time: "Feb 21 · 2:02 PM" },
      { from: "admin",    name: "Admin",      text: "Hi Joan, the contractor is confirmed for Feb 28th, 10am–1pm.", time: "Feb 21 · 3:15 PM" },
    ],
  },
  {
    id: 3, name: "Edward O'Neill", role: "Landlord",
    preview: "RTB registration query", unread: 1,
    messages: [
      { from: "landlord", name: "Edward O'Neill", text: "What is the status of the RTB registration for Apt 25, Grand Dock?", time: "Feb 20 · 11:00 AM" },
    ],
  },
];

export default function AdminMessagesPage() {
  const [convos, setConvos]   = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [text, setText]       = useState("");
  const [search, setSearch]   = useState("");
  const [showChat, setShowChat] = useState(false);
  const scrollRef             = useRef(null);

  const active = convos.find((c) => c.id === activeId);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeId, convos]);

  function sendMessage() {
    if (!text.trim()) return;
    const now = new Date();
    const label = now.toLocaleDateString("en-GB", { month: "short", day: "numeric" }) + " · " +
      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, preview: text.trim(), messages: [...c.messages, { from: "admin", name: "Admin", text: text.trim(), time: label }] }
          : c
      )
    );
    setText("");
  }

  const filtered = convos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.preview.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) =>
    role === "Tenant"
      ? "bg-teal-100 text-teal-700"
      : "bg-purple-100 text-purple-700";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
        <p className="text-sm text-slate-500 mt-0.5">Respond to tenant and landlord enquiries</p>
      </div>

      {/* Chat shell */}
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex"
        style={{ height: "calc(100vh - 200px)", minHeight: 520 }}
      >
        {/* ── Left: conversation list ───────────────────────── */}
        <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-72 shrink-0 border-r border-slate-100 flex-col`}>
          {/* search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/30"
              />
            </div>
          </div>

          {/* list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveId(c.id); setShowChat(true); }}
                className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 text-left transition ${c.id === activeId ? "bg-slate-50 border-l-2 border-purple-500" : "border-l-2 border-transparent"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${roleBadge(c.role)}`}>
                  {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                    {c.unread > 0 && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{c.role}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: chat area ──────────────────────────────── */}
        <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0`}>
          {/* chat header */}
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 shrink-0">
            <button
              onClick={() => setShowChat(false)}
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} />
            </button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${roleBadge(active.role)}`}>
              {active.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{active.name}</p>
              <p className="text-xs text-purple-600">{active.role}</p>
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {active.messages.map((m, i) => {
              const isAdmin = m.from === "admin";
              return (
                <div key={i} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isAdmin ? "bg-slate-200 text-slate-600" : roleBadge(active.role)}`}>
                    {isAdmin ? "AD" : active.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className={`max-w-[68%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAdmin ? "bg-purple-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm"}`}>
                      {m.text}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 px-1">{m.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* compose */}
          <div className="px-6 py-4 border-t border-slate-100 shrink-0">
            <div className="flex items-end gap-3">
              <textarea
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={`Message ${active.name}…`}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition resize-none"
              />
              <button
                onClick={sendMessage}
                className="w-11 h-11 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
