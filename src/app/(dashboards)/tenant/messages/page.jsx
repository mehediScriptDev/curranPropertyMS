"use client";

import { useState, useRef, useEffect } from "react";
import TenantShell from "@/components/tenant/TenantShell";
import { Send, Search, ArrowLeft } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";
import { usePortalAuth } from "@/context/PortalAuthContext";

export default function TenantMessagesPage() {
  const { user: currentUser } = usePortalAuth();
  const [convos, setConvos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendError, setSendError] = useState(null);
  const scrollRef = useRef(null);

  const active = convos.find((c) => c.id === activeId);

  // Helper to safely convert values to text
  const asText = (value, fallback = "") => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "object" && value?.text) return String(value.text);
    if (typeof value === "object" && value?.content) return String(value.content);
    return fallback;
  };

  // Helper to transform raw messages to UI format
  const formatMessages = (messagesArray, currentUserId) => {
    if (!Array.isArray(messagesArray)) return [];
    
    // Sort messages by timestamp (oldest first, so newest appear at bottom)
    const sortedMessages = [...messagesArray].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
      const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
      return timeA - timeB;
    });
    
    return sortedMessages.map((m) => {
      const content = m.content || m.text || '';
      const timestamp = m.createdAt || m.timestamp || new Date().toISOString();
      const senderRole = m.sender?.role || m.senderRole || '';
      
      const timeStr = new Date(timestamp).toLocaleDateString("en-GB", { month: "short", day: "numeric" }) +
                      " · " +
                      new Date(timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      
      // Message is from tenant if sender role is TENANT
      const isTenant = senderRole.toUpperCase() === 'TENANT';
      
      return {
        from: isTenant ? 'tenant' : 'other',
        name: m.sender?.name || m.senderName || m.sender_name || 'User',
        text: String(content),
        time: timeStr,
      };
    });
  };

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`
        );
        if (!response.ok) throw new Error(`Failed to fetch conversations: ${response.statusText}`);
        const data = await response.json();

        console.log("Conversations API response:", data);

        let conversationsArray = [];
        if (Array.isArray(data)) {
          conversationsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          conversationsArray = data.data;
        } else if (data.conversations && Array.isArray(data.conversations)) {
          conversationsArray = data.conversations;
        }

        const formattedConvos = conversationsArray.map((c) => {
          const participants = Array.isArray(c.participants) ? c.participants : [];
          const otherParticipant = participants.find(p => p.id !== currentUser?.id) || participants[0];
          const previewSource = c.lastMessage || c.preview || c.message;
          
          return {
            id: c.id,
            name: otherParticipant?.name || c.name || 'User',
            role: otherParticipant?.role || c.role || 'PARTICIPANT',
            avatar: otherParticipant?.name?.split(" ").map((n) => n[0]).slice(0, 1).join("").toUpperCase() || "?",
            preview: asText(previewSource, "No messages"),
            unread: Number(c.unreadCount || c.unread || 0),
            messages: formatMessages(c.messages, currentUser?.id) || [],
          };
        });

        // Ensure admin conversation is always first
        const hasAdminConvo = formattedConvos.some(c => c.role === 'ADMIN');
        if (!hasAdminConvo) {
          const adminConvo = {
            id: 'admin-default',
            name: 'Support',
            role: 'ADMIN',
            avatar: 'AD',
            preview: 'Start a conversation with our support team',
            unread: 0,
            messages: [],
          };
          formattedConvos.unshift(adminConvo);
        } else {
          // Move admin conversation to the top
          const adminConvo = formattedConvos.find(c => c.role === 'ADMIN');
          const otherConvos = formattedConvos.filter(c => c.role !== 'ADMIN');
          formattedConvos.length = 0;
          formattedConvos.push(adminConvo, ...otherConvos);
        }

        setConvos(formattedConvos);
        setActiveId(formattedConvos[0].id);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConvos();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeId || activeId === 'admin-default') return; // Skip if admin-default placeholder

    const fetchMessages = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${activeId}/messages`
        );
        if (!response.ok) throw new Error(`Failed to fetch messages: ${response.statusText}`);
        const data = await response.json();
        
        console.log("Messages API response:", data);

        let messagesArray = [];
        if (Array.isArray(data)) {
          messagesArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          messagesArray = data.data;
        } else if (data.messages && Array.isArray(data.messages)) {
          messagesArray = data.messages;
        }

        const formattedMessages = formatMessages(messagesArray, currentUser?.id);

        setConvos((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: formattedMessages,
                }
              : c
          )
        );

        // Mark as read if unread
        if (active?.unread > 0) {
          await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${activeId}/read`,
            { method: "PATCH" }
          );
          setConvos((prev) =>
            prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [activeId, active?.unread]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [active?.messages]);

  // Helper to get avatar color based on role
  const getAvatarColor = (role) => {
    const normalizedRole = asText(role).toUpperCase();
    if (normalizedRole === "TENANT") return "bg-teal-100 text-teal-700";
    if (normalizedRole === "LANDLORD") return "bg-purple-100 text-purple-700";
    if (normalizedRole === "ADMIN") return "bg-slate-200 text-slate-600";
    return "bg-slate-100 text-slate-600";
  };

  // Send message
  async function sendMessage() {
    if (!text.trim() || !active) return;

    setSendingMessage(true);
    setSendError(null);

    try {
      let conversationId = activeId;

      // If this is the default admin conversation, create it first
      if (activeId === 'admin-default') {
        const createResponse = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ participantId: process.env.NEXT_PUBLIC_ADMIN_USER_ID }),
          }
        );

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to create conversation with admin");
        }

        const createData = await createResponse.json();
        conversationId = createData.id || createData.data?.id;

        if (!conversationId) {
          throw new Error("Failed to get conversation ID");
        }

        // Update conversation in state with real ID
        setConvos((prev) =>
          prev.map((c) =>
            c.id === 'admin-default'
              ? { ...c, id: conversationId }
              : c
          )
        );
        setActiveId(conversationId);
      }

      // Try multiple payload formats for compatibility
      let response;
      const messagePayloads = [
        { content: text.trim() },
        { text: text.trim() },
        { message: text.trim() },
      ];

      for (const payload of messagePayloads) {
        response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) break;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Message sent:", data);

      // Add message to UI immediately
      const now = new Date();
      const timeStr = now.toLocaleDateString("en-GB", { month: "short", day: "numeric" }) +
                      " · " +
                      now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

      setConvos((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                preview: text.trim(),
                messages: [
                  ...c.messages,
                  {
                    from: 'tenant',
                    name: currentUser?.name || 'You',
                    text: text.trim(),
                    time: timeStr,
                  },
                ],
              }
            : c
        )
      );

      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
      setSendError(error.message || "Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  }

  const filtered = convos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.preview.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <TenantShell>
        <div className="flex items-center justify-center h-screen">
          <p className="text-slate-500">Loading messages...</p>
        </div>
      </TenantShell>
    );
  }

  return (
    <TenantShell>
      <div className="mb-3 xl:mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
        <p className="text-slate-500 mt-1 text-sm">Conversations with landlords and agents</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex" style={{ height: "calc(100vh - 200px)", minHeight: 520 }}>
        {/* Left: Conversation list */}
        <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 shrink-0 border-r border-slate-100 flex-col`}>
          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/30"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveId(c.id); setShowChat(true); }}
                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition ${c.id === activeId ? "bg-slate-50 border-l-2 border-teal-600" : "border-l-2 border-transparent"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getAvatarColor(c.role)}`}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800 truncate text-sm">{c.name}</p>
                    {c.unread > 0 && <span className="shrink-0 w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">{c.unread}</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{c.role}</p>
                  <p className="text-xs text-slate-500 truncate mt-1">{c.preview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat area */}
        <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0`}>
          {active ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 shrink-0">
                <button
                  onClick={() => setShowChat(false)}
                  className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-700"
                  aria-label="Back"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(active.role)}`}>
                  {active.avatar}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{active.name}</p>
                  <p className="text-xs text-teal-600 mt-0.5">{active.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {active.messages.map((m, i) => {
                  const isTenant = m.from === "tenant";
                  const displayBg = isTenant ? "bg-teal-100 text-teal-700" : getAvatarColor(active.role);
                  return (
                    <div key={i} className={`flex gap-3 ${isTenant ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${displayBg}`}>
                        {isTenant ? "YOU" : active.avatar}
                      </div>
                      <div className={`max-w-[68%] flex flex-col ${isTenant ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isTenant ? "bg-teal-600 text-white rounded-tr-sm" : "bg-slate-100 text-slate-800 rounded-tl-sm"}`}>
                          {m.text}
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 px-1">{m.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div className="px-5 py-3 border-t border-slate-100 shrink-0">
                {sendError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {sendError}
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <textarea
                    rows={2}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={`Message ${active.name}…`}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 transition resize-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sendingMessage}
                    className="w-11 h-11 flex items-center justify-center bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl transition shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </TenantShell>
  );
}
