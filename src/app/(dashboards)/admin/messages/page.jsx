"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Send, Search, ArrowLeft, Plus, Copy, Check } from "lucide-react";
import { authenticatedFetch } from "@/utils/authFetch";
import { usePortalAuth } from "@/context/PortalAuthContext";

// Helper to generate initials
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// Helper to get avatar color based on role
const getColorForRole = (role) => {
  const colors = [
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-pink-100 text-pink-700",
    "bg-amber-100 text-amber-700",
  ];
  
  const normalizedRole = String(role || "").toUpperCase();
  if (normalizedRole === "TENANT") return "bg-teal-100 text-teal-700";
  if (normalizedRole === "LANDLORD") return "bg-purple-100 text-purple-700";
  
  return colors[Math.floor(Math.random() * colors.length)];
};

function AdminMessagesContent() {
  const { user: currentUser } = usePortalAuth();
  const searchParams = useSearchParams();
  const [convos, setConvos]         = useState([]);
  const [activeId, setActiveId]     = useState(null);
  const [text, setText]             = useState("");
  const [search, setSearch]         = useState("");
  const [showChat, setShowChat]     = useState(false);
  const [startNewConvo, setStartNewConvo] = useState(false);
  const [copiedId, setCopiedId]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendError, setSendError]   = useState(null);
  const [allUsers, setAllUsers]     = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const scrollRef                   = useRef(null);

  const active = convos.find((c) => c.id === activeId);

  const asText = (value, fallback = "") => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (value && typeof value === "object") {
      if (typeof value.text === "string") return value.text;
      if (typeof value.content === "string") return value.content;
    }
    return fallback;
  };

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`);
        if (!response.ok) throw new Error(`Failed to fetch conversations: ${response.statusText}`);
        const data = await response.json();
        
        console.log("Conversations API response:", data); // Debug log

        // Transform API response to UI format
        let convosArray = [];
        if (Array.isArray(data)) {
          convosArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          convosArray = data.data;
        } else if (data.conversations && Array.isArray(data.conversations)) {
          convosArray = data.conversations;
        }

        // Transform API response to UI format
        const formattedConvos = convosArray.map((c) => {
          const participant = Array.isArray(c.participants) && c.participants.length > 0
            ? c.participants[0]
            : null;
          const rawRole = c.participantRole || c.participant?.role || c.role || participant?.role;
          const normalizedRole = asText(rawRole, "USER").toUpperCase();
          const displayRole = normalizedRole === "TENANT"
            ? "Tenant"
            : normalizedRole === "LANDLORD"
              ? "Landlord"
              : "User";
          const previewSource = c.lastMessage?.text || c.lastMessage?.content || c.lastMessage || c.preview;

          return {
            id: c.id || c.conversationId,
            name: asText(c.participantName || c.participant?.name || c.name || participant?.name, "Unknown"),
            participantId: c.participantId || c.participant?.id || participant?.userId,
            role: displayRole,
            property: asText(c.property, ""),
            avatar_bg: getAvatarColor(rawRole),
            preview: asText(previewSource, "No messages"),
            unread: Number(c.unreadCount || c.unread || 0),
            messages: formatMessages(c.messages, currentUser?.id) || [],
          };
        });

        setConvos(formattedConvos);
        
        // Check if a specific conversation was requested via query params
        const conversationIdFromQuery = searchParams.get('conversationId');
        if (conversationIdFromQuery) {
          // Set active to the requested conversation
          const foundConvo = formattedConvos.find(c => c.id === conversationIdFromQuery);
          if (foundConvo) {
            setActiveId(conversationIdFromQuery);
          } else if (formattedConvos.length > 0) {
            // Fallback to first if not found
            setActiveId(formattedConvos[0].id);
          }
        } else if (formattedConvos.length > 0) {
          setActiveId(formattedConvos[0].id);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConvos();
  }, [searchParams]);

  // Fetch all users for new conversation search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        let page = 1;
        const limit = 100;
        let hasNextPage = true;
        const allUsersList = [];

        while (hasNextPage) {
          const params = new URLSearchParams();
          params.append("page", String(page));
          params.append("limit", String(limit));

          const response = await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?${params.toString()}`
          );

          if (!response.ok) {
            console.error(`Failed to fetch users page ${page}`);
            break;
          }

          const data = await response.json();
          
          // Extract users array from response
          let usersArray = [];
          if (Array.isArray(data)) {
            usersArray = data;
          } else if (data.data && Array.isArray(data.data)) {
            usersArray = data.data;
          } else if (data.users && Array.isArray(data.users)) {
            usersArray = data.users;
          }

          allUsersList.push(...usersArray);

          // Check pagination
          const pagination = data.meta?.pagination || data.data?.pagination || {};
          if (typeof pagination.hasNextPage === "boolean") {
            hasNextPage = pagination.hasNextPage;
          } else if (pagination.currentPage && pagination.totalPages) {
            hasNextPage = pagination.currentPage < pagination.totalPages;
          } else {
            hasNextPage = false;
          }

          page += 1;
          if (page > 50) hasNextPage = false; // Safety limit
        }

        // Transform users to UI format
        const formattedUsers = allUsersList.map((user) => ({
          id: user.id,
          name: user.name || user.email || "Unknown",
          email: user.email || "",
          role: user.role || "USER",
          phone: user.phone || "",
          initials: getInitials(user.name || user.email || "User"),
          color: getColorForRole(user.role),
          property: user.role === "LANDLORD" 
            ? `${user.profileSummary?.propertiesCount || 0} properties`
            : user.profileSummary?.currentTenancy ? "Active Tenancy" : "No active tenancy"
        }));

        setAllUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeId) return;

    const fetchMessages = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${activeId}/messages`
        );
        if (!response.ok) throw new Error(`Failed to fetch messages: ${response.statusText}`);
        const data = await response.json();
        
        console.log("Messages API response:", data); // Debug log

        // Handle different response formats
        let messagesArray = [];
        if (Array.isArray(data)) {
          messagesArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          messagesArray = data.data;
        } else if (data.messages && Array.isArray(data.messages)) {
          messagesArray = data.messages;
        }

        // Transform and update messages
        const formattedMessages = formatMessages(messagesArray, currentUser?.id);

        // Update messages for active conversation
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
    if (role === "Tenant") return "bg-teal-100 text-teal-700";
    if (role === "Landlord") return "bg-purple-100 text-purple-700";
    return "bg-blue-100 text-blue-700";
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
      const senderId = m.senderId || m.sender_id || '';
      const senderRole = m.sender?.role || m.senderRole || '';
      
      const timeStr = new Date(timestamp).toLocaleDateString("en-GB", { month: "short", day: "numeric" }) +
                      " · " +
                      new Date(timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      
      // Message is from admin if sender role is ADMIN (uppercase from backend)
      const isAdmin = senderRole.toUpperCase() === 'ADMIN';
      
      return {
        from: isAdmin ? 'admin' : 'participant',
        name: m.sender?.name || m.senderName || m.sender_name || 'User',
        text: String(content),
        time: timeStr,
      };
    });
  };

  // Search results when starting new conversation
  const searchResults = startNewConvo && search.trim()
    ? allUsers.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Handle starting new conversation with a user
  const startConversation = async (user) => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId: user.id }),
        }
      );

      if (!response.ok) throw new Error(`Failed to start conversation: ${response.statusText}`);
      const newConvo = await response.json();
      const createdConvo = newConvo?.data || newConvo;

      const formattedConvo = {
        id: createdConvo?.id || createdConvo?.conversationId,
        name: user.name,
        participantId: user.id,
        role: user.role === "TENANT" ? "Tenant" : user.role === "LANDLORD" ? "Landlord" : "User",
        property: user.property,
        avatar_bg: user.color,
        preview: "Conversation started",
        unread: 0,
        messages: [],
      };

      setConvos(prev => [formattedConvo, ...prev]);
      setActiveId(formattedConvo.id);
      setStartNewConvo(false);
      setSearch("");
      setShowChat(true);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const copyToClipboard = (userId) => {
    navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeId, convos]);

  const sendMessage = async () => {
    if (!text.trim() || !activeId) return;

    try {
      setSendingMessage(true);
      setSendError(null);

      // Try common payload shapes used by chat APIs.
      const payloadAttempts = [
        { content: text.trim() },
        { text: text.trim() },
        { message: text.trim() },
      ];

      let response = null;
      let lastErrorMessage = "";

      for (const payload of payloadAttempts) {
        response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${activeId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) break;

        const errorBody = await response.json().catch(() => ({}));
        lastErrorMessage = errorBody?.message || response.statusText || "Request failed";

        // Stop retrying on auth/permission errors.
        if (response.status === 401 || response.status === 403) break;
      }

      if (!response || !response.ok) {
        throw new Error(lastErrorMessage || `Failed to send message (${response?.status || "unknown"})`);
      }

      const now = new Date();
      const label = now.toLocaleDateString("en-GB", { month: "short", day: "numeric" }) + " · " +
        now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

      const newMessage = {
        from: "admin",
        name: "Admin",
        text: text.trim(),
        time: label,
      };

      setConvos((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                preview: text.trim(),
                messages: [...c.messages, newMessage],
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
  };

  const filtered = !startNewConvo 
    ? convos.filter((c) =>
        asText(c.name).toLowerCase().includes(search.toLowerCase()) ||
        asText(c.preview).toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Messages</h1>
        <p className="text-base text-slate-500 mt-0.5">Respond to tenant and landlord enquiries</p>
      </div>

      {/* Chat shell */}
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex"
        style={{ height: "calc(100vh - 200px)", minHeight: 520 }}
      >
        {/* ── Left: conversation list ───────────────────────── */}
        <div className={`${showChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 shrink-0 border-r border-slate-100 flex-col`}>
          {/* Header with New Message button */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-800">
              {startNewConvo ? "New Message" : "Messages"}
            </h2>
            <button
              onClick={() => {
                setStartNewConvo(!startNewConvo);
                setSearch("");
              }}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
              title={startNewConvo ? "Back to conversations" : "Start new conversation"}
            >
              {startNewConvo ? <ArrowLeft size={18} /> : <Plus size={18} />}
            </button>
          </div>

          {/* search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={startNewConvo ? "Search tenant/landlord…" : "Search conversations…"}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/30"
              />
            </div>
          </div>

          {/* list or search results */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {startNewConvo ? (
              // ── START NEW CONVERSATION: Show search results ──
              <>
                {usersLoading && !search.trim() ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    Loading users...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => startConversation(user)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 text-left transition"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${user.color}`}>
                        {user.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{user.property}</p>
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-slate-600 cursor-pointer hover:bg-slate-200 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(user.id);
                          }}>
                          <span className="truncate">{user.id}</span>
                          {copiedId === user.id ? (
                            <Check size={12} className="shrink-0 text-teal-600" />
                          ) : (
                            <Copy size={12} className="shrink-0 opacity-50" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : search.trim() ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No users found for "{search}"
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400">
                    Type a name or email to search
                  </div>
                )}
              </>
            ) : (
              // ── NORMAL MODE: Show conversations ──
              loading ? (
                <div className="p-4 text-center text-sm text-slate-500">Loading conversations...</div>
              ) : filtered.length > 0 ? (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveId(c.id); setShowChat(true); }}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 text-left transition ${c.id === activeId ? "bg-slate-50 border-l-2 border-purple-500" : "border-l-2 border-transparent"}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${c.avatar_bg}`}>
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
                      {c.property && <p className="text-xs text-slate-500 truncate mt-0.5">{c.property}</p>}
                      <p className="text-xs text-slate-500 truncate mt-0.5">{c.preview}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-slate-500">
                  No conversations yet. Start a new one!
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Right: chat area ──────────────────────────────── */}
        <div className={`${showChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0`}>
          {active ? (
            <>
              {/* chat header */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 shrink-0">
                <button
                  onClick={() => setShowChat(false)}
                  className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${active?.avatar_bg}`}>
                  {active?.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{active?.name}</p>
                  <p className="text-xs text-purple-600">{active?.role}</p>
                </div>
              </div>

              {/* messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {active?.messages.map((m, i) => {
                  const isAdmin = m.from === "admin";
                  const displayBg = isAdmin ? "bg-slate-200 text-slate-600" : "bg-teal-100 text-teal-700";
                  return (
                    <div key={i} className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${displayBg}`}>
                        {isAdmin ? "AD" : active?.name.split(" ").map((n) => n[0]).slice(0, 1).join("")}
                      </div>
                      <div className={`max-w-[68%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isAdmin ? "bg-purple-600 text-white rounded-tr-sm" : "bg-teal-100 text-teal-700 rounded-tl-sm"}`}>
                          {m.text}
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 px-1">{m.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* compose */}
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
                    placeholder={`Message ${active?.name}…`}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition resize-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sendingMessage}
                    className="w-11 h-11 flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl transition shrink-0"
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
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Messages...</div>}>
      <AdminMessagesContent />
    </Suspense>
  );
}
