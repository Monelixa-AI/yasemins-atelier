"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Meze oner",
  "Eve Sef",
  "Teslimat",
  "Fiyat sor",
];

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Merhaba! \ud83d\udc4b Ben Yasemin'in asistaniyim. Urunler, hizmetler veya rezervasyon hakkinda yardimci olabilirim.",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ---------- session ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("ya-chat-session");
    if (stored) {
      setSessionId(stored);
    } else {
      const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem("ya-chat-session", id);
      setSessionId(id);
    }
  }, []);

  /* ---------- auto-scroll ---------- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  /* ---------- focus input on open ---------- */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  /* ---------- send message ---------- */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, sessionId }),
        });
        const data = await res.json();
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.message },
        ]);
      } catch {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Bir sorun olustu, lutfen tekrar deneyin.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, sessionId]
  );

  /* ---------- open handler ---------- */
  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([INITIAL_MESSAGE]);
    }
  };

  /* ---------- textarea auto-resize ---------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ==================== Closed Button ==================== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-terracotta text-white flex items-center justify-center shadow-lg hover:bg-terracotta-dark transition-colors"
            aria-label="Sohbet"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ==================== Open Panel ==================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[320px] h-[480px] bg-white shadow-2xl border border-gold-light flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brown-deep px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white font-body text-xs font-bold">
                  YA
                </div>
                <div>
                  <p className="font-body text-sm text-white font-medium">
                    Yasemin&apos;in Asistani
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="font-body text-[10px] text-white/60">
                      Cevrimici
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 font-body text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-terracotta text-white rounded-2xl rounded-tr-none"
                        : "bg-terracotta-light text-brown-deep rounded-2xl rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-terracotta-light px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5">
                    <span
                      className="w-2 h-2 bg-brown-mid/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-brown-mid/40 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-brown-mid/40 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 border-t border-gold-light/30">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  disabled={loading}
                  className="shrink-0 font-body text-[11px] text-terracotta border border-terracotta/30 px-3 py-1 rounded-full hover:bg-terracotta/10 transition-colors disabled:opacity-40"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gold-light flex gap-2 shrink-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Mesajiniz..."
                rows={1}
                className="flex-1 font-body text-sm px-3 py-2 border border-gold-light focus:outline-none focus:border-terracotta resize-none max-h-[80px]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="bg-terracotta text-white p-2 hover:bg-terracotta-dark disabled:opacity-50 transition-colors self-end"
                aria-label="Gonder"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
