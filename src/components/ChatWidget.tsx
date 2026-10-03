import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Language = "en" | "sn" | "nd";
type MessageRole = "user" | "assistant" | "system";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

interface SuggestedAction {
  label: string;
  message: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8000/api";

const MAX_MESSAGE_LENGTH = 1500;

const LANG_LABELS: Record<Language, string> = {
  en: "EN",
  sn: "SN",
  nd: "ND",
};

const LANG_NAMES: Record<Language, string> = {
  en: "English",
  sn: "Shona",
  nd: "Ndebele",
};

const WELCOME_MESSAGES: Record<Language, string> = {
  en:
    "Hello! I'm the CBZ Holdings AI Concierge.\n\nI can help you with:\n• Bank accounts & loans\n• Insurance quotes\n• Investment plans (Datvest)\n• Properties & stands\n• Agro-Yield crop finance\n• Red Sphere micro-loans\n\nWhat can I help you with today?",
  sn:
    "Makadii! Ndini CBZ Holdings AI Concierge.\n\nNdinogona kukubatsirai ne:\n• Ma accounts ebhanga & mikururo\n• Insurance quotes\n• MaInvestment (Datvest)\n• Minda & dzimba (Properties)\n• Agro-Yield zvekurima\n\nNdingakubatsirai neiko nhasi?",
  nd:
    "Salibonani! Ngingu-CBZ Holdings AI Concierge.\n\nSingalisiza nge:\n• Ama-accounts ebhange & amakolamu\n• Amanani e-insurance\n• Uwekezaji (Datvest)\n• Izindawo & izakhiwo (Properties)\n• Agro-Yield yokulima\n\nSingalisiza ngani namuhla?",
};

const SUGGESTED_ACTIONS: Record<Language, SuggestedAction[]> = {
  en: [
    { label: "Open an account", message: "How do I open a CBZ bank account?" },
    { label: "Insurance quote", message: "I want a motor insurance quote" },
    { label: "Stands & property", message: "Tell me about CBZ Properties stands" },
    { label: "Agro finance", message: "How does seasonal crop financing work?" },
    { label: "Investment guide", message: "What Datvest investment options are there?" },
  ],
  sn: [
    { label: "Vhura account", message: "Ndingavhura sei account paCBZ?" },
    { label: "Insurance yemota", message: "Ndiri kuda insurance quote yemotokari yangu" },
    { label: "Minda yeProperties", message: "Ndizvidzidze nezve minda yaCBZ Properties" },
    { label: "Agro finance", message: "Kurima kunobatsirika sei naCBZ Agro-Yield?" },
  ],
  nd: [
    { label: "Vula i-account", message: "Ngingavula njani i-account e-CBZ?" },
    { label: "I-insurance yemoto", message: "Ngifuna i-insurance quote yemoto yami" },
    { label: "Izindawo zezakhiwo", message: "Ngixoxele nge-CBZ Properties" },
    { label: "Imali yokulima", message: "Ukubolekwa imali yokulima e-CBZ Agro-Yield" },
  ],
};

const PLACEHOLDER: Record<Language, string> = {
  en: "Ask me anything about CBZ…",
  sn: "Ndibvunze chero chinhu nezve CBZ…",
  nd: "Ngibuze noma yini mayelana le-CBZ…",
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Sanitises text from the model before rendering — treats it as plain text
 * to prevent XSS if any markdown or links are present.
 * Converts newlines to <br>, **bold** to <strong>, and *italic* to <em>
 * without trusting arbitrary HTML.
 */
function sanitizeAndFormat(raw: string): React.ReactNode[] {
  const lines = raw.split("\n");
  return lines.map((line, i) => {
    // Bold: **text**
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    while (remaining.length) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(
            <span key={key++}>{remaining.slice(0, boldMatch.index)}</span>
          );
        }
        parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }

    return (
      <React.Fragment key={i}>
        {parts}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

async function getCsrfToken(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/csrf/`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      return data.csrfToken ?? "";
    }
  } catch {}
  return "";
}

let _cachedCsrf = "";
async function csrfToken(): Promise<string> {
  if (!_cachedCsrf) _cachedCsrf = await getCsrfToken();
  return _cachedCsrf;
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION PERSISTENCE (server-side ID stored in sessionStorage key only —
// no token, content, or reply is in sessionStorage)
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_KEY = "cbz_chat_session_id";
function getStoredSessionId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
function storeSessionId(id: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Widget Component
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(getStoredSessionId());
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Scroll to bottom on new messages ──────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Focus input when panel opens ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // ── Load server-held history on first open ─────────────────────────────────
  useEffect(() => {
    if (!isOpen || hasLoadedHistory || !sessionId) return;
    setHasLoadedHistory(true);

    fetch(`${API_BASE}/chatbot/history/${sessionId}/`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data || !data.messages?.length) {
          setMessages([welcomeMsg(language)]);
          return;
        }
        // Restore detected language from session
        if (data.language && ["en", "sn", "nd"].includes(data.language)) {
          setLanguage(data.language as Language);
        }
        const restored: ChatMessage[] = data.messages.map((m: any) => ({
          id: uid(),
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at),
        }));
        setMessages(restored);
        setShowSuggestions(false);
      })
      .catch(() => {
        setMessages([welcomeMsg(language)]);
      });
  }, [isOpen, sessionId, hasLoadedHistory, language]);

  // ── Show welcome message when no session ─────────────────────────────────
  useEffect(() => {
    if (isOpen && !sessionId && !hasLoadedHistory) {
      setHasLoadedHistory(true);
      setMessages([welcomeMsg(language)]);
    }
  }, [isOpen, sessionId, hasLoadedHistory, language]);

  // ── Language switch ────────────────────────────────────────────────────────
  const switchLanguage = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      setShowLangMenu(false);
      if (messages.length <= 1) {
        setMessages([welcomeMsg(lang)]);
      }
    },
    [messages.length]
  );

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!trimmed || isLoading) return;

      setShowSuggestions(false);
      setInputValue("");
      setIsLoading(true);

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      const streamingPlaceholder: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, streamingPlaceholder]);

      try {
        const csrf = await csrfToken();

        const res = await fetch(`${API_BASE}/chatbot/message/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
          },
          body: JSON.stringify({
            message: trimmed,
            session_id: sessionId ?? undefined,
            language,
            stream: true,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";
        let newSessionId: string | null = null;

        const streamingId = streamingPlaceholder.id;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;
            try {
              const payload = JSON.parse(raw);

              if (payload.chunk) {
                fullText += payload.chunk;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, content: fullText, streaming: true }
                      : m
                  )
                );
              }

              if (payload.done) {
                if (payload.fullReply) fullText = payload.fullReply;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, content: fullText, streaming: false }
                      : m
                  )
                );
              }

              if (payload.sessionId) {
                newSessionId = payload.sessionId;
              }
            } catch {}
          }
        }

        // Mark stream done (in case done event was in last buffer)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId ? { ...m, streaming: false } : m
          )
        );

        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
          storeSessionId(newSessionId);
        }
      } catch (err) {
        const errMsg =
          language === "sn"
            ? "Ndine urombo, pane dambudziko. Edza zvakare."
            : language === "nd"
            ? "Ngiyaxolisa, kukhona inkinga. Zama futhi."
            : "Sorry, something went wrong. Please try again.";

        setMessages((prev) =>
          prev.map((m) =>
            m.streaming
              ? { ...m, content: errMsg, streaming: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [isLoading, language, sessionId]
  );

  // ── Keyboard handling ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage]
  );

  // ── Close on Escape ────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const charCount = inputValue.length;
  const nearLimit = charCount > MAX_MESSAGE_LENGTH * 0.8;

  return (
    <>
      {/* ── Floating trigger button ──────────────────────────────────────── */}
      <button
        id="cbz-chat-toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close CBZ AI assistant" : "Open CBZ AI assistant"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={[
          "fixed bottom-6 right-6 z-[9998] flex items-center gap-2.5",
          "h-14 rounded-full shadow-2xl transition-all duration-300 ease-out",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          isOpen
            ? "bg-[#002554] px-5 text-white"
            : "bg-[#E4002B] px-5 text-white hover:bg-[#C50025] active:scale-95",
        ].join(" ")}
        style={{ boxShadow: isOpen ? "0 8px 32px rgba(0,37,84,0.35)" : "0 8px 32px rgba(228,0,43,0.45)" }}
      >
        {isOpen ? (
          <>
            <CloseIcon />
            <span className="text-sm font-semibold tracking-wide hidden sm:inline">Close</span>
          </>
        ) : (
          <>
            <SparkleIcon />
            <span className="text-sm font-semibold tracking-wide">AI Assistant</span>
          </>
        )}
      </button>

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          id="cbz-chat-panel"
          ref={panelRef}
          role="dialog"
          aria-label="CBZ Holdings AI Assistant"
          aria-modal="false"
          className={[
            "fixed bottom-24 right-4 sm:right-6 z-[9997]",
            "w-[calc(100vw-2rem)] sm:w-[420px]",
            "max-h-[calc(100vh-8rem)] flex flex-col",
            "rounded-2xl overflow-hidden",
            "bg-white",
            "animate-chat-slide-in",
          ].join(" ")}
          style={{
            boxShadow: "0 24px 64px rgba(0,37,84,0.18), 0 4px 16px rgba(0,37,84,0.1)",
          }}
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #002554 0%, #0A3E80 100%)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <SparkleIcon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate leading-tight">CBZ AI Concierge</p>
                <p className="text-blue-200 text-[11px] leading-tight truncate">
                  Banking · Insurance · Investments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Language picker */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu((v) => !v)}
                  aria-label="Select language"
                  aria-haspopup="listbox"
                  aria-expanded={showLangMenu}
                  className={[
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
                    "bg-white/15 text-white hover:bg-white/25 transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50",
                  ].join(" ")}
                >
                  <GlobeIcon size={13} />
                  {LANG_LABELS[language]}
                </button>

                {showLangMenu && (
                  <div
                    role="listbox"
                    aria-label="Language options"
                    className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl overflow-hidden z-10"
                  >
                    {(["en", "sn", "nd"] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        role="option"
                        aria-selected={language === lang}
                        onClick={() => switchLanguage(lang)}
                        className={[
                          "w-full text-left px-3 py-2 text-sm transition-colors",
                          language === lang
                            ? "bg-[#002554] text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        <span className="font-bold mr-2">{LANG_LABELS[lang]}</span>
                        {LANG_NAMES[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Messages ────────────────────────────────────────────────── */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3"
            style={{ minHeight: "200px", maxHeight: "52vh", background: "#F8F9FC" }}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Suggested actions */}
            {showSuggestions && messages.length <= 2 && !isLoading && (
              <div className="mt-1 flex flex-wrap gap-2">
                {SUGGESTED_ACTIONS[language].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.message)}
                    className={[
                      "text-xs px-3 py-1.5 rounded-full border font-medium transition-all",
                      "border-[#E4002B]/30 text-[#E4002B] bg-white",
                      "hover:bg-[#E4002B] hover:text-white hover:border-[#E4002B]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E4002B]",
                    ].join(" ")}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ───────────────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 px-3 py-3 border-t border-gray-100 bg-white"
          >
            <div
              className={[
                "flex items-end gap-2 rounded-xl px-3 py-2 transition-all",
                "border-2",
                inputValue ? "border-[#002554]" : "border-gray-200",
                "focus-within:border-[#002554]",
              ].join(" ")}
            >
              <textarea
                ref={inputRef}
                id="cbz-chat-input"
                aria-label="Type your message"
                rows={1}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value.slice(0, MAX_MESSAGE_LENGTH));
                  // Auto-grow
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER[language]}
                disabled={isLoading}
                className={[
                  "flex-1 resize-none text-sm text-gray-800 placeholder-gray-400",
                  "bg-transparent border-none outline-none leading-snug",
                  "min-h-[1.5rem] max-h-[100px]",
                  "disabled:opacity-60",
                ].join(" ")}
                style={{ overflowY: "auto" }}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className={[
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E4002B]",
                  inputValue.trim() && !isLoading
                    ? "bg-[#E4002B] text-white hover:bg-[#C50025] active:scale-90"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed",
                ].join(" ")}
              >
                <SendIcon size={15} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <p className="text-[10px] text-gray-400">
                CBZ Holdings · Secure &amp; Confidential
              </p>
              {nearLimit && (
                <p className={[
                  "text-[10px] font-medium",
                  charCount >= MAX_MESSAGE_LENGTH ? "text-red-500" : "text-amber-500",
                ].join(" ")}>
                  {charCount}/{MAX_MESSAGE_LENGTH}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Slide-in animation ────────────────────────────────────────────── */}
      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-chat-slide-in {
          animation: chatSlideIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Message Bubble
// ─────────────────────────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isEmpty = !message.content && message.streaming;

  return (
    <div
      className={[
        "flex gap-2.5 w-full",
        isUser ? "flex-row-reverse" : "flex-row",
      ].join(" ")}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: "linear-gradient(135deg, #002554, #0A3E80)" }}
          aria-hidden="true"
        >
          <SparkleIcon size={13} />
        </div>
      )}

      <div
        className={[
          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words",
          isUser
            ? "bg-[#002554] text-white rounded-tr-sm"
            : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100",
        ].join(" ")}
      >
        {isEmpty ? (
          <TypingDots />
        ) : (
          <span>{sanitizeAndFormat(message.content)}</span>
        )}

        {message.streaming && message.content && (
          <span className="inline-block w-1 h-3.5 ml-0.5 bg-current opacity-70 animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <span className="flex gap-1 items-center h-5" aria-label="Loading response">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Welcome message factory
// ─────────────────────────────────────────────────────────────────────────────
function welcomeMsg(lang: Language): ChatMessage {
  return {
    id: uid(),
    role: "assistant",
    content: WELCOME_MESSAGES[lang],
    timestamp: new Date(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon components (inline SVG — no external icon deps needed)
// ─────────────────────────────────────────────────────────────────────────────
function SparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M19 3l1 2.5L22.5 6l-2.5 1L19 9.5l-1-2.5L15.5 6l2.5-1z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function GlobeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function SendIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
