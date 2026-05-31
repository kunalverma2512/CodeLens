import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, MessageSquare, ArrowUp,
  AlertCircle, Loader2, X, Menu,
} from "lucide-react";
import {
  createConversation,
  listConversations,
  loadConversation,
  deleteConversation,
  sendMessage,
} from "../services/apexService";
import ReactMarkdown from "react-markdown";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24)  return `${hrs}h ago`;
  return `${days}d ago`;
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message, isStreaming }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-5`}
    >
      {/* APEX label */}
      {!isUser && (
        <div className="shrink-0 mr-3 mt-0.5">
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <span className="text-[9px] font-black text-black tracking-widest leading-none">APEX</span>
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[78%] lg:max-w-[70%]`}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 px-0.5">
          {isUser ? "You" : "APEX"}
        </span>

        <div className={`px-4 py-3 text-sm leading-relaxed border ${
          isUser
            ? "bg-white text-black border-white"
            : "bg-transparent text-zinc-100 border-zinc-700"
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words font-medium">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none
              prose-p:leading-relaxed prose-p:my-1.5 prose-p:text-zinc-200
              prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-green-400 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono
              prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-pre:text-xs
              prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wide
              prose-blockquote:border-zinc-500 prose-blockquote:text-zinc-400
              prose-hr:border-zinc-700
            ">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-0.5 h-3.5 bg-white ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {message.timestamp && (
          <span className="text-[10px] text-zinc-600 mt-1 px-0.5">
            {timeAgo(message.timestamp)}
          </span>
        )}
      </div>

      {/* User label */}
      {isUser && (
        <div className="shrink-0 ml-3 mt-0.5">
          <div className="w-8 h-8 bg-zinc-700 border border-zinc-600 flex items-center justify-center">
            <span className="text-[9px] font-black text-zinc-200 tracking-widest">YOU</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Thinking Indicator ───────────────────────────────────────────────────────

function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start mb-5"
    >
      <div className="w-8 h-8 bg-white flex items-center justify-center mr-3 shrink-0">
        <span className="text-[9px] font-black text-black tracking-widest leading-none">APEX</span>
      </div>
      <div className="border border-zinc-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Thinking</span>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-white"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sidebar Conversation Item ─────────────────────────────────────────────────

function ConversationItem({ conv, isActive, onSelect, onDelete }) {
  return (
    <div
      className={`group relative w-full px-3 py-2.5 cursor-pointer transition-colors border-l-2 ${
        isActive
          ? "border-l-white bg-zinc-800"
          : "border-l-transparent hover:border-l-zinc-600 hover:bg-zinc-800/50"
      }`}
      onClick={() => onSelect(conv._id)}
    >
      <div className="flex items-start gap-2.5 pr-7">
        <MessageSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold truncate leading-snug ${isActive ? "text-white" : "text-zinc-300"}`}>
            {conv.title}
          </p>
          {conv.lastMessagePreview && (
            <p className="text-[11px] text-zinc-600 truncate mt-0.5 leading-snug">
              {conv.lastMessagePreview}
            </p>
          )}
          <p className="text-[10px] text-zinc-700 mt-1">{timeAgo(conv.updatedAt)}</p>
        </div>
      </div>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400"
        onClick={(e) => { e.stopPropagation(); onDelete(conv._id); }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyChatState({ onNewConversation, isCreating }) {
  const prompts = [
    "Where do I actually stand with my DSA skills?",
    "What project should I build to grow as an engineer?",
    "Plan my Codeforces improvement for next month.",
    "Analyze my GitHub activity honestly.",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="border border-zinc-700 px-6 py-2 mb-6">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-white">APEX</span>
      </div>
      <h2 className="text-lg font-black uppercase tracking-wide text-white mb-2">Ask APEX Anything</h2>
      <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-8">
        APEX reads your real Codeforces and GitHub data. Every answer is backed by your actual performance — not guesswork.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mb-8">
        {prompts.map((p, i) => (
          <button
            key={i}
            className="text-left px-4 py-3 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-xs leading-relaxed transition-colors"
            onClick={onNewConversation}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={onNewConversation}
        disabled={isCreating}
        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
      >
        {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
        New Conversation
      </button>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────

export default function ApexWorkspacePage() {
  // — Sidebar state —
  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default on mobile
  const [conversations, setConversations]   = useState([]);
  const [siLoading, setSiLoading]           = useState(true);

  // — Active conversation state —
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [convTitle, setConvTitle]       = useState("");
  const [convLoading, setConvLoading]   = useState(false);

  // — Input + streaming state —
  const [input, setInput]         = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking]  = useState(false);
  const [isCreating, setIsCreating]  = useState(false);
  const [error, setError]            = useState(null);
  const [charCount, setCharCount]    = useState(0);
  const MAX_CHARS = 4000;

  const cancelStreamRef  = useRef(null);
  const messagesContainerRef = useRef(null); // ← scroll THIS, not the page
  const inputRef         = useRef(null);
  const isNearBottomRef  = useRef(true);     // track if user has scrolled up

  // ── Scroll container (not page) to bottom ────────────────────────────────
  const scrollToBottom = useCallback((force = false) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (force || isNearBottomRef.current) {
      // Direct DOM scroll — no scrollIntoView, which leaks to <body>
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  // Track whether user has scrolled away from bottom
  const handleContainerScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distFromBottom < 80;
  }, []);

  // Scroll on new messages / thinking state change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // Load sidebar on mount
  useEffect(() => {
    fetchConversations();
    // Open sidebar by default on desktop
    if (window.innerWidth >= 768) setSidebarOpen(true);
  }, []);

  const fetchConversations = async () => {
    try {
      setSiLoading(true);
      const res = await listConversations();
      setConversations(res.data.data.conversations);
    } catch {
      setError("Could not load conversations.");
    } finally {
      setSiLoading(false);
    }
  };

  const handleSelectConversation = async (id) => {
    if (id === activeConvId) {
      // On mobile, close sidebar after selecting
      if (window.innerWidth < 768) setSidebarOpen(false);
      return;
    }
    if (cancelStreamRef.current) { cancelStreamRef.current(); cancelStreamRef.current = null; }

    setActiveConvId(id);
    setMessages([]);
    setConvLoading(true);
    setError(null);
    if (window.innerWidth < 768) setSidebarOpen(false); // close sidebar on mobile

    try {
      const res = await loadConversation(id);
      const conv = res.data.data.conversation;
      setMessages(conv.messages);
      setConvTitle(conv.title);
      // Force scroll to bottom when loading history
      setTimeout(() => scrollToBottom(true), 50);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load conversation.");
    } finally {
      setConvLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleNewConversation = async () => {
    if (isCreating) return;
    setIsCreating(true);
    setError(null);
    if (window.innerWidth < 768) setSidebarOpen(false);

    try {
      const res = await createConversation();
      const conv = res.data.data.conversation;
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(conv._id);
      setMessages([]);
      setConvTitle(conv.title);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setError("Failed to create conversation. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (activeConvId === id) {
        setActiveConvId(null);
        setMessages([]);
        setConvTitle("");
      }
    } catch {
      setError("Failed to delete conversation.");
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming || !activeConvId) return;
    const text = input.trim();
    setInput("");
    setCharCount(0);
    setError(null);
    setIsThinking(true);
    isNearBottomRef.current = true; // force scroll for new messages

    // Auto-resize textarea back to single line
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const userMsg = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    const placeholderId = `stream-${Date.now()}`;
    let streamContent = "";

    const cancel = sendMessage(
      activeConvId,
      text,
      // onChunk
      (chunk) => {
        setIsThinking(false);
        setIsStreaming(true);
        streamContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?._streamId === placeholderId) {
            return [...prev.slice(0, -1), { ...last, content: streamContent }];
          }
          return [...prev, {
            _streamId: placeholderId,
            role: "assistant",
            content: streamContent,
            timestamp: new Date().toISOString(),
          }];
        });
      },
      // onDone
      ({ title }) => {
        setIsStreaming(false);
        setIsThinking(false);
        cancelStreamRef.current = null;
        if (title && title !== "New Conversation") {
          setConvTitle(title);
          setConversations((prev) =>
            prev.map((c) =>
              c._id === activeConvId
                ? { ...c, title, updatedAt: new Date().toISOString() }
                : c
            )
          );
        }
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      // onError
      (errMsg) => {
        setIsStreaming(false);
        setIsThinking(false);
        cancelStreamRef.current = null;
        setError(errMsg);
        setMessages((prev) => prev.filter((m) => m._streamId !== placeholderId));
      }
    );

    cancelStreamRef.current = cancel;
  }, [input, isStreaming, activeConvId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setInput(val);
      setCharCount(val.length);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex bg-zinc-950 text-white overflow-hidden"
      style={{
        height: "calc(100vh - 64px)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}
    >
      {/* ── MOBILE SIDEBAR BACKDROP ──────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      {/* Desktop: static. Mobile: fixed overlay */}
      <aside
        className={`
          h-full border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0
          transition-all duration-250
          md:static md:z-auto
          fixed top-0 left-0 z-30
          ${sidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:w-0 md:translate-x-0"}
          md:overflow-hidden
        `}
        style={{ height: "calc(100vh - 64px)", top: "64px" }}
      >
        <div className="w-72 h-full flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="px-4 pt-4 pb-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="border border-zinc-600 px-2 py-0.5">
                  <span className="text-[10px] font-black tracking-[0.25em] text-white">APEX</span>
                </div>
                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">AI</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-zinc-600 hover:text-white transition-colors md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleNewConversation}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isCreating
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Plus className="w-3.5 h-3.5" />
              }
              New Conversation
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto py-2">
            {siLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10 px-4">
                <MessageSquare className="w-7 h-7 text-zinc-800 mx-auto mb-2" />
                <p className="text-zinc-600 text-xs">No conversations yet.</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest px-4 py-2">
                  History
                </p>
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv._id}
                    conv={conv}
                    isActive={conv._id === activeConvId}
                    onSelect={handleSelectConversation}
                    onDelete={handleDeleteConversation}
                  />
                ))}
              </>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="px-4 py-3 border-t border-zinc-800 shrink-0">
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest text-center">
              20 messages / hour
            </p>
          </div>
        </div>
      </aside>

      {/* ── MAIN CHAT AREA ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Chat Header */}
        <div className="h-12 border-b border-zinc-800 px-4 flex items-center gap-3 shrink-0 bg-zinc-950">
          {/* Hamburger — always visible */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {activeConvId && (
              <div className="w-1.5 h-1.5 bg-green-400 shrink-0" />
            )}
            <h1 className="text-xs font-bold uppercase tracking-widest text-zinc-300 truncate">
              {convTitle || (activeConvId ? "Loading..." : "APEX Workspace")}
            </h1>
          </div>

          <span className="text-[10px] text-zinc-700 uppercase tracking-widest shrink-0 hidden sm:block">
            Real Data · Context-Aware
          </span>
        </div>

        {/* ── Messages Container ────────────────────────────────────────── */}
        {/* THIS is the scrollable area — not the page */}
        <div
          ref={messagesContainerRef}
          onScroll={handleContainerScroll}
          className="flex-1 overflow-y-auto min-h-0"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="px-4 sm:px-8 lg:px-16 xl:px-20 py-6 min-h-full flex flex-col">

            {/* Loading conversation */}
            {convLoading && (
              <div className="flex items-center justify-center flex-1 py-20">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
              </div>
            )}

            {/* No conversation selected */}
            {!activeConvId && !convLoading && (
              <div className="flex-1 flex items-center justify-center">
                <EmptyChatState
                  onNewConversation={handleNewConversation}
                  isCreating={isCreating}
                />
              </div>
            )}

            {/* Messages */}
            {activeConvId && !convLoading && (
              <div className="flex flex-col">
                {messages.length === 0 && !isThinking && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="border border-zinc-800 px-4 py-1.5 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">APEX</span>
                    </div>
                    <p className="text-zinc-500 text-sm">Conversation ready. Ask anything.</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <MessageBubble
                    key={msg._streamId || `${msg.role}-${i}`}
                    message={msg}
                    isStreaming={
                      isStreaming &&
                      i === messages.length - 1 &&
                      msg.role === "assistant"
                    }
                  />
                ))}

                <AnimatePresence>
                  {isThinking && <ThinkingBubble />}
                </AnimatePresence>

                {/* Scroll anchor — just a zero-height div, no scrollIntoView called on it */}
                <div style={{ height: 1 }} />
              </div>
            )}
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 sm:mx-8 mb-2 px-4 py-2.5 border border-red-800 bg-red-950/40 flex items-center gap-2 text-xs text-red-400"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-400 font-bold text-base leading-none">×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input Bar ────────────────────────────────────────────────────── */}
        <div className="px-4 sm:px-8 pb-4 pt-2 shrink-0 border-t border-zinc-800 bg-zinc-950">
          <div className={`flex items-end gap-2 border px-4 py-3 transition-colors ${
            activeConvId
              ? "border-zinc-700 bg-zinc-900 focus-within:border-zinc-500"
              : "border-zinc-800 bg-zinc-900/40"
          }`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                activeConvId
                  ? "Ask APEX — it knows your real data..."
                  : "Select or create a conversation first..."
              }
              disabled={!activeConvId || isStreaming}
              rows={1}
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none leading-relaxed disabled:cursor-not-allowed"
              style={{ maxHeight: "160px", minHeight: "24px", scrollbarWidth: "none" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
              }}
            />

            <div className="flex items-center gap-2 shrink-0 pb-0.5">
              {charCount > 3500 && (
                <span className={`text-[10px] font-mono ${charCount > 3900 ? "text-red-400" : "text-zinc-600"}`}>
                  {MAX_CHARS - charCount}
                </span>
              )}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming || !activeConvId}
                className="w-7 h-7 bg-white hover:bg-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95"
              >
                {isStreaming
                  ? <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
                  : <ArrowUp className="w-3.5 h-3.5 text-black" />
                }
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1.5 px-0.5">
            <span className="text-[10px] text-zinc-700">
              <kbd className="text-zinc-600">↵</kbd> send &nbsp;·&nbsp; <kbd className="text-zinc-600">⇧↵</kbd> newline
            </span>
            {activeConvId && (
              <span className="text-[10px] text-zinc-700">
                APEX · Real data only
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
