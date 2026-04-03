"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const advantages = [
  "Her ay kapınıza taze ürünler",
  "%15 abonelik indirimi",
  "İstediğiniz zaman iptal",
  "Öncelikli kargo ve özel ürünler",
];

const plans = [
  { name: "Küçük", price: 280, desc: "3 ürün" },
  { name: "Standart", price: 420, desc: "5 ürün", popular: true },
  { name: "Büyük", price: 560, desc: "8 ürün" },
];

export default function NaturelSubscription() {
  const [selectedPlan, setSelectedPlan] = useState("Standart");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "naturel-subscription" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
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
    <section className="py-20" style={{ backgroundColor: "#3D1A0A" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div>
            <p
              className="font-body text-[10px] font-medium uppercase tracking-[0.2em] mb-3"
              style={{ color: "#A8D5A2" }}
            >
              ABONELİK
            </p>
            <h2 className="font-heading text-[36px] md:text-[48px] font-semibold text-white leading-tight">
              Her ay kapınıza, taze bir Naturel kutu.
            </h2>
            <div className="mt-8 space-y-4">
              {advantages.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#A8D5A2" }}
                  >
                    <Check size={12} style={{ color: "#2D4A1E" }} />
                  </div>
                  <span className="font-body text-[14px] text-white/80">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Subscription Card */}
          <div className="bg-cream p-8">
            {/* Badge */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-2xl text-brown-deep font-semibold">
                Kutu Seçin
              </h3>
              <span
                className="font-body text-[11px] font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "#C4622D" }}
              >
                %15 indirim
              </span>
            </div>

            {/* Plan Options */}
            <div className="space-y-3 mb-6">
              {plans.map((plan) => (
                <button
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full flex items-center justify-between p-4 border-2 transition-all duration-200 ${
                    selectedPlan === plan.name
                      ? "border-[#4A7C3F] bg-[#EAF3DE]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.name
                          ? "border-[#4A7C3F]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan === plan.name && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: "#4A7C3F" }}
                        />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-body text-sm font-medium text-brown-deep">
                        {plan.name}
                      </p>
                      <p className="font-body text-[11px] text-brown-deep/50">
                        {plan.desc}
                      </p>
                    </div>
                  </div>
                  <p className="font-heading text-lg font-bold text-brown-deep">
                    {plan.price}₺
                    <span className="font-body text-[11px] font-normal text-brown-deep/50">
                      /ay
                    </span>
                  </p>
                </button>
              ))}
            </div>

            {/* Email + Submit */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="w-full bg-white px-5 py-3.5 font-body text-sm text-brown-deep placeholder:text-brown-deep/40 border border-gray-200 focus:outline-none focus:border-[#4A7C3F]"
                required
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 text-white font-body text-sm font-medium transition-colors duration-300 disabled:opacity-70"
                style={{ backgroundColor: "#4A7C3F" }}
              >
                {status === "loading"
                  ? "Gönderiliyor..."
                  : "Abonelik Başlat"}
              </button>
            </form>

            <p className="font-body text-[11px] text-center mt-3">
              {status === "success" && (
                <span className="text-[#4A7C3F]">
                  ✓ Talebiniz alındı! Sizinle iletişime geçeceğiz.
                </span>
              )}
              {status === "error" && (
                <span className="text-[#C4622D]">
                  Bir hata oluştu, tekrar deneyin.
                </span>
              )}
              {status === "idle" && (
                <span className="text-brown-deep/40">
                  İstediğiniz zaman iptal edebilirsiniz.
                </span>
              )}
              {status === "loading" && (
                <span className="text-brown-deep/40">&nbsp;</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
