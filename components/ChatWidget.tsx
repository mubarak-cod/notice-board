"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { THEME } from "@/lib/Theme";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING_TEXT =
  "\u{1F44B} Hi, I'm MapBot, built by Sanni Basit and coursemates for our final year project. I can help with notices, department info, or how this site works. What can I help with?";

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5.2 17.7 4 21l3.5-1.5c1.1.5 2.3.7 3.6.7 4.9 0 8.9-3.4 8.9-7.6S16 5 11.1 5 2.2 8.4 2.2 12.6c0 2 .9 3.8 3 5.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M7.5 12.6h.1M11.1 12.6h.1M14.7 12.6h.1" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="m5 5 12 12M17 5 5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="m3 3 14 6.5L3 16l2.1-5.9L12 9.5 5.1 8.9 3 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const greetingStartedRef = useRef(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Types the greeting out word-by-word the FIRST time the chat is
  // opened in this session — never replays on subsequent opens.
  useEffect(() => {
    if (!open || greetingStartedRef.current) return;
    greetingStartedRef.current = true;

    const words = GREETING_TEXT.split(" ");
    let currentIndex = 0;
    setMessages([{ role: "assistant", content: "" }]);

    const interval = setInterval(() => {
      currentIndex += 1;
      const partial = words.slice(0, currentIndex).join(" ");
      setMessages([{ role: "assistant", content: partial }]);

      if (currentIndex >= words.length) {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [open]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    const userMessage: ChatMessage = { role: "user", content: message };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: messages }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
        if (response.status === 429 || payload?.error === "rate_limited") {
          setErrorMessage("Slow down a bit - try again in a minute.");
        } else if (response.status === 503 || payload?.error === "service_unavailable") {
          setErrorMessage("MapBot is temporarily unavailable. Please try again later.");
        } else {
          setErrorMessage(payload?.message || "I couldn't process that. Please try again.");
        }
        return;
      }

      if (!response.body) {
        setErrorMessage("MapBot is temporarily unavailable. Please try again later.");
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: assistantText }]);
      }

      assistantText += decoder.decode();
      setMessages([...nextMessages, { role: "assistant", content: assistantText }]);
    } catch {
      setErrorMessage("MapBot is temporarily unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-60 sm:bottom-6 sm:right-6" style={{ color: THEME.primary }}>
      {open && (
        <section
          aria-label="MapBot chat"
          className="absolute bottom-[calc(100%+14px)] right-0 flex h-[min(620px,calc(100vh-110px))] w-[calc(100vw-32px)] max-w-97.5 flex-col overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(66,21,75,0.24)] sm:w-97.5"
          style={{ background: THEME.onPrimary, borderColor: THEME.primary }}
        >
          <header className="flex shrink-0 items-center justify-between px-4 py-3" style={{ background: THEME.primary, color: THEME.onPrimary }}>
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[16px]"
                style={{ background: "rgba(255,255,255,0.15)" }}
                aria-hidden="true"
              >
                {"\u{1F916}"}
              </span>
              <div>
                <p className="text-[16px] font-bold">MapBot</p>
                <p className="text-[11px]" style={{ color: THEME.muted }}>MAPOLY notice assistant</p>
              </div>
            </div>
            <button type="button" aria-label="Close MapBot" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
              <CloseIcon />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ background: THEME.onPrimary }}>
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex items-end gap-2 ${item.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {item.role === "assistant" && (
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px]"
                    style={{ background: "#F1EFE9" }}
                    aria-hidden="true"
                  >
                    {"\u{1F916}"}
                  </span>
                )}
                <p
                  className="max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                  style={item.role === "user"
                    ? { background: THEME.accent, color: THEME.onPrimary, borderBottomRightRadius: 5 }
                    : { background: THEME.primary, color: THEME.onPrimary, borderBottomLeftRadius: 5 }}
                >
                  {item.content || "..."}
                </p>
              </div>
            ))}
            {errorMessage && (
              <p className="rounded-xl border px-3 py-2.5 text-[13px] leading-relaxed" style={{ borderColor: THEME.accent, color: THEME.primary }}>
                {"\u26A0\uFE0F"} {errorMessage}
              </p>
            )}
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={sendMessage} className="flex shrink-0 items-center gap-2 border-t p-3" style={{ borderColor: THEME.muted }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about notices..."
              aria-label="Message MapBot"
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-[13.5px] outline-none placeholder:opacity-60"
              style={{ borderColor: THEME.muted, color: THEME.primary }}
            />
            <button type="submit" aria-label="Send message" disabled={loading || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-40" style={{ background: THEME.accent, color: THEME.onPrimary }}>
              <SendIcon />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={open ? "Close MapBot" : "Open MapBot"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-[0_10px_25px_rgba(66,21,75,0.25)] transition-transform hover:scale-105"
        style={{ background: THEME.accent, color: THEME.onPrimary }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}