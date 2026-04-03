"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "exists" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();
      if (res.status === 201) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 200) {
        setStatus("exists");
      } else {
        setStatus("error");
      }
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-terracotta py-16"
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-[42px] text-white leading-tight">
          Sofra Sırları Posta Kutunuza Gelsin
        </h2>

        <p className="font-body text-base text-white/80 mt-4">
          İlk siparişinizde %10 indirim fırsatını kaçırmayın.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 mt-8 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            className="flex-1 bg-white px-6 py-4 font-body text-sm text-brown-deep placeholder:text-brown-mid/50 rounded-none focus:outline-none"
            required
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-brown-deep text-white font-body text-sm font-medium px-8 py-4 rounded-none hover:bg-brown-mid transition-colors disabled:opacity-70"
          >
            {status === "loading" ? "Gönderiliyor..." : "Abone Ol"}
          </button>
        </form>

        <p className="font-body text-xs mt-4">
          {status === "success" && <span className="text-white">✓ Abone oldunuz! %10 indirim kodunuz e-postanıza gönderildi.</span>}
          {status === "exists" && <span className="text-white/80">Bu e-posta zaten kayıtlı.</span>}
          {status === "error" && <span className="text-white/80">Bir hata oluştu, tekrar deneyin.</span>}
          {status === "idle" && <span className="text-white/60">Spam yok. İstediğiniz zaman çıkabilirsiniz.</span>}
          {status === "loading" && <span className="text-white/60">&nbsp;</span>}
        </p>
      </div>
    </motion.section>
  );
}
