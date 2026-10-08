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
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ??
  (import.meta as any).env?.VITE_API_URL ??
  "http://localhost:8000/api";

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
// Intelligent In-Browser Grounded Concierge Fallback
// Provides instant, verified responses in EN/SN/ND when backend is offline or on Vercel
// ─────────────────────────────────────────────────────────────────────────────
function getLocalKnowledgeResponse(message: string, currentLang: Language): { reply: string; detectedLang: Language } {
  const msg = message.toLowerCase();

  let lang = currentLang;
  const isShona = /(makadii|mhoro|maswera|manheru|ndiri|kuda|kuziva|nezve|bhanga|mari|kurima|munda|chii|ndinoda)/i.test(msg);
  const isNdebele = /(salibonani|linjani|kunjani|ngiyabonga|ngifuna|ukuvula|ibhange|imali|ukulima|umhlaba|ngani|lamuhla)/i.test(msg);

  if (isShona) lang = "sn";
  else if (isNdebele) lang = "nd";

  if (lang === "sn") {
    if (/(account|fca|bhanga|vhura)/i.test(msg)) {
      return {
        reply: "Makadii! Kuvhura account pa CBZ Bank munoda: ID card/passport, proof of residence, uye deposit yekutanga. FCA (USD account) inoda deposit inotangira pa US$20 chete. Munogona kuenda ku-branch yeCBZ iri pedyo kana kushandisa CBZ Touch Mobile App.\n\nNdingakubatsirai nechimwe chinhu here?",
        detectedLang: "sn"
      };
    }
    if (/(insurance|inshurenzi|motokari|car|tsaona)/i.test(msg)) {
      return {
        reply: "CBZ Insurance inopa sarudzo nhatu dzekuvhara motokari:\n• **Comprehensive Cover**: kubva pa $46/mwedzi — inobhadhara tsaona, moto, nekubiwa\n• **Full Third Party, Fire & Theft**: kubva pa $27/mwedzi\n• **Third Party chete**: kubva pa $14/mwedzi\n\nShandisai Insurance Quote Calculator yedu iri papeji yeInsurance kuti muverenge mutengo chaiwo wemotokari yenyu!",
        detectedLang: "sn"
      };
    }
    if (/(stand|imba|property|properties|mortgage|minda)/i.test(msg)) {
      return {
        reply: "CBZ Properties inopa minda yakaserviswa (serviced stands) muHarare nedzimwe nzvimbo dzenyika kubva pa $35,000, ne-15% deposit. Pane zvakare zvirongwa zve-mortgage zvemakore 15 kusvika 20.\n\nEdzai Stand-Affordability Calculator yedu papeji yeProperties kuti muone mari yamunokwanisa kukwereta!",
        detectedLang: "sn"
      };
    }
    if (/(kurima|munda|mbesa|agro|chibage|gorosi|fodya|tobacco|tractor)/i.test(msg)) {
      return {
        reply: "CBZ Agro-Yield inotsigira varimi vechibage, gorosi, soya, nefodya nemari yekurima inotangira pa $550 kusvika $850 pahectare (seasonal finance). Tinopawo zvekurendesa matarakita ema John Deere & Massey Ferguson.\n\nShandisai Seasonal Budget Calculator yedu kuronga mwaka wenyu!",
        detectedLang: "sn"
      };
    }
    if (/(invest|datvest|mari|unit trust|shares)/i.test(msg)) {
      return {
        reply: "Datvest Asset Management inopa nzira dzekukudza mari kuburikidza ne-Money Market Unit Trusts (inobereka mari inosvika ~8.5% p.a.) uye Equity Funds dzekudyara mumasheya eZSE & VFEX.\n\nOna Investment-Pathway Guide yedu kuti usarudze chirongwa chinoenderana nezvinangwa zvako!",
        detectedLang: "sn"
      };
    }
    return {
      reply: "Makadii henyu! Titambire ku CBZ Holdings AI Concierge. Tinogona kukubatsirai nezve:\n• Kuvhura ma-accounts eBhanga & Zvikwereti\n• Insurance yemotokari nedzimba\n• Minda nezvivakwa zve CBZ Properties\n• Mari yekurima ye Agro-Yield\n• Ma Investments e Datvest\n\nNdingakubatsirai neiko nhasi?",
      detectedLang: "sn"
    };
  }

  if (lang === "nd") {
    if (/(account|fca|ibhange|vula)/i.test(msg)) {
      return {
        reply: "Salibonani! Ukuvula i-account e-CBZ Bank udinga: i-ID card/passport, ubufakazi bendawo yokuhlala, lenkokhelo yokuqala. I-FCA (USD account) ifuna imali yokuvula eqala ku-US$20 kuphela. Ungavakatjhela igatsha le-CBZ eliseduze lawe kumbe usebenzise i-CBZ Touch App.\n\nSingalisiza ngani okulandelayo?",
        detectedLang: "nd"
      };
    }
    if (/(insurance|i-insurance|imoto|car)/i.test(msg)) {
      return {
        reply: "CBZ Insurance inikeza izinhlelo ezintathu zokuvikela imoto:\n• **Comprehensive Cover**: kusukela ku-$46/inyanga — yokukhokhela izingozi, umlilo, nokuntshontshwa\n• **Full Third Party, Fire & Theft**: kusukela ku-$27/inyanga\n• **Third Party kuphela**: kusukela ku-$14/inyanga\n\nSebenzisa i-Insurance Quote Calculator ekhasi le-Insurance ukubala intengo yakho namhlanje!",
        detectedLang: "nd"
      };
    }
    if (/(stand|indlu|property|properties|mortgage|izindawo)/i.test(msg)) {
      return {
        reply: "CBZ Properties inikeza izindawo zokwakha ezilungisiweyo (serviced stands) eHarare lamanye amadolobha kusukela ku-$35,000, nge-15% deposit. Kukhona lemali-mboleko yezindlu (mortgages) yeminyaka engu 15 kuya ku 20.\n\nSebenzisa i-Stand-Affordability Calculator ekhasi le-Properties ukubona imali oyifaneleyo!",
        detectedLang: "nd"
      };
    }
    if (/(ukulima|umhlaba|agro|umbila|ukolweni|ugwayi|tobacco|ithrektha)/i.test(msg)) {
      return {
        reply: "CBZ Agro-Yield isekela abalimi ngemali yokulima umbila, ukolweni, ugwayi, lesoya kusukela $550 kusiya $850 ngehektare. Siphinde sinikeze amathrektha e-John Deere le-Massey Ferguson ngokuqashisa.\n\nSebenzisa i-Seasonal Budget Calculator ukuhlela isizini yakho!",
        detectedLang: "nd"
      };
    }
    return {
      reply: "Salibonani! Siyalemukela e-CBZ Holdings AI Concierge. Singalisiza nge:\n• Ukuvula ama-accounts ebhange lezikwelede\n• I-insurance yemoto lezindlu\n• Izindawo zokwakha ze-CBZ Properties\n• Imali yokulima ye-Agro-Yield\n• Izinhlelo zokutshala imali ze-Datvest\n\nSingalisiza ngani namuhla?",
      detectedLang: "nd"
    };
  }

  // English (default)
  if (/(account|fca|open|banking|current|savings|visa)/i.test(msg)) {
    return {
      reply: "Opening a CBZ Bank account is quick and accessible. Here is what you need:\n\n• Valid National ID / Passport\n• Proof of residence (utility bill or letter)\n• Opening deposit (USD FCA minimum: **$20**)\n\nYou can apply at any of our 60+ branches nationwide or initiate your application through the **CBZ Touch Mobile App**.\n\nWould you like information on personal, SME, or diaspora accounts?",
      detectedLang: "en"
    };
  }

  if (/(insurance|motor|car|vehicle|cover|premium|third party|comprehensive)/i.test(msg)) {
    return {
      reply: "CBZ Insurance offers three leading motor coverage tiers:\n\n• **Comprehensive**: from **$46/month** — full protection against accidental damage, theft, fire, windscreen, and third-party liabilities\n• **Full Third Party, Fire & Theft**: from **$27/month**\n• **Statutory Third Party**: from **$14/month**\n\nYou can head to the **CBZ Insurance** page to test our instant **Insurance Quote Calculator**, or I can help guide your policy selection!",
      detectedLang: "en"
    };
  }

  if (/(stand|property|properties|house|home|mortgage|residential|serviced)/i.test(msg)) {
    return {
      reply: "CBZ Properties offers prime fully-serviced residential and commercial stands starting from **$35,000** with a **15% minimum deposit**.\n\n• Mortgage financing available through CBZ Bank with terms from 15 to 20 years at competitive rates (from 9.5% p.a.).\n• Prime locations include Harare North, Bulawayo, and regional growth corridors.\n\nBe sure to try our interactive **Stand-Affordability Calculator** on the Properties page to determine your exact borrowing capacity!",
      detectedLang: "en"
    };
  }

  if (/(agro|farm|crop|maize|wheat|tobacco|soya|hectare|seasonal|tractor|fertilizer)/i.test(msg)) {
    return {
      reply: "CBZ Agro-Yield is Zimbabwe's premier agribusiness financing partner:\n\n• **Seasonal Working Capital**: $550–$850 per hectare for commercial maize, winter wheat, soya beans, and tobacco.\n• **Mechanization Leasing**: John Deere and Massey Ferguson tractor and combine harvester leasing facilities.\n• **Integrated Crop Insurance**: Embedded yield and weather index protection via CBZ Insurance.\n\nCheck out the **Seasonal Budget & Yield Calculator** on the Agro-Yield page to project input costs, breakeven yields, and projected ROI!",
      detectedLang: "en"
    };
  }

  if (/(invest|datvest|fund|unit trust|portfolio|shares|wealth|stocks|asset)/i.test(msg)) {
    return {
      reply: "Datvest Asset Management (CBZ Holdings) provides institutional and retail wealth solutions:\n\n• **Money Market Unit Trust**: High liquidity, competitive annualised yields (~8.5% p.a.), with an opening investment from only $50.\n• **Balanced Growth Fund**: Diversified mix of fixed income and top-tier equities for steady capital appreciation.\n• **Equity Fund**: Direct participation in high-performing Zimbabwe Stock Exchange (ZSE) and Victoria Falls Stock Exchange (VFEX) counters.\n\nExplore our **Investment-Pathway Guide** on the Datvest page to profile your risk and forecast your growth!",
      detectedLang: "en"
    };
  }

  if (/(loan|credit|borrow|sme|micro|salary advance|red sphere|personal loan)/i.test(msg)) {
    return {
      reply: "CBZ Holdings provides several credit facilities tailored to your needs:\n\n• **Red Sphere Salary Advance**: Instant micro-loans for salaried individuals disbursed in under 2 hours.\n• **CBZ Personal Loans**: Flexible repayment terms up to 36 months.\n• **SME Growth Capital**: Working capital, order financing, and invoice discounting for growing enterprises.\n• **Home Loans**: Long-term mortgage facilities up to 20 years.\n\nWhich loan facility would you like to explore?",
      detectedLang: "en"
    };
  }

  if (/(branch|atm|location|where|address|hours|harare|bulawayo)/i.test(msg)) {
    return {
      reply: "CBZ Bank operates over 60 full-service branches and 24/7 ATMs across Zimbabwe, including Harare (Kwame Nkrumah, Samora Machel, Avondale, Borrowdale), Bulawayo (Fife St, 8th Ave), Gweru, Mutare, and Victoria Falls.\n\n• Standard Hours: Monday–Friday 08:00–15:00 | Saturday 08:00–11:30\n• Use our **Branch & ATM Finder** on the CBZ Bank page for GPS routing to your nearest facility!",
      detectedLang: "en"
    };
  }

  return {
    reply: "Welcome to CBZ Holdings! I am your AI Financial Concierge, ready to help you navigate our full suite of financial services:\n\n• **CBZ Bank**: Accounts, Visa cards, personal & SME loans\n• **CBZ Insurance**: Instant motor, property, and life cover quotes\n• **Datvest**: Money market unit trusts and portfolio management\n• **CBZ Properties**: Prime serviced stands and home loans\n• **CBZ Agro-Yield**: Seasonal crop finance and tractor leasing\n• **Red Sphere**: Fast micro-loans and salary advances\n\nHow may I assist you today?",
    detectedLang: "en"
  };
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

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
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

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
        // Backend unavailable or Vercel standalone: activate in-browser grounded concierge with word streaming
        const { reply, detectedLang } = getLocalKnowledgeResponse(trimmed, language);
        if (detectedLang !== language) {
          setLanguage(detectedLang);
        }

        const words = reply.split(" ");
        let fullText = "";
        const streamingId = streamingPlaceholder.id;

        for (let i = 0; i < words.length; i++) {
          fullText += (i === 0 ? "" : " ") + words[i];
          const isDone = i === words.length - 1;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamingId
                ? { ...m, content: fullText, streaming: !isDone }
                : m
            )
          );
          if (i % 2 === 0) {
            await new Promise((r) => setTimeout(r, 25));
          }
        }
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
