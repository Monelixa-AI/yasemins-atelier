"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  MessageCircle,
  Loader2,
  Check,
} from "lucide-react";
import { occasions } from "@/lib/data/occasions";
import { useCartStore } from "@/store/cart";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface SuggestedProduct {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  basePrice: number;
  imageUrl: string;
}

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const BUDGET_OPTIONS = [
  { label: "Ekonomik", range: "200-400", min: 200, max: 400 },
  { label: "Standart", range: "400-600", min: 400, max: 600 },
  { label: "Premium", range: "600-900", min: 600, max: 900 },
  { label: "Luks", range: "900-1500", min: 900, max: 1500 },
  { label: "VIP", range: "1500+", min: 1500, max: 99999 },
];

const DIETARY_OPTIONS = [
  "Vegan",
  "Vejetaryen",
  "Glutensiz",
  "Laktozsuz",
  "Fistik Alerjisi",
  "Kabuklu Deniz",
  "Yumurta",
  "Yok",
];

const GUEST_PRESETS = [
  { label: "2-4", value: 3 },
  { label: "4-8", value: 6 },
  { label: "8-12", value: 10 },
  { label: "12-20", value: 16 },
  { label: "20+", value: 25 },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function QuestionnaireModal({ isOpen, onClose }: QuestionnaireModalProps) {
  const router = useRouter();
  const { addItem } = useCartStore();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Answers
  const [serviceType, setServiceType] = useState<"siparis" | "hizmet" | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [guestCount, setGuestCount] = useState(4);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Results
  const [loading, setLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  const [showResults, setShowResults] = useState(false);

  /* ---------- navigation ---------- */
  const canGoNext = () => {
    if (step === 1) return serviceType !== null;
    if (step === 2) return selectedOccasion !== "";
    if (step === 3) return guestCount >= 2;
    if (step === 4) return selectedDate !== "";
    if (step === 5) return selectedBudget !== "";
    if (step === 6) return dietaryNeeds.length > 0;
    return true;
  };

  const goNext = () => {
    // Q1: if hizmet → redirect
    if (step === 1 && serviceType === "hizmet") {
      onClose();
      router.push("/hizmetler");
      return;
    }
    if (canGoNext() && step < totalSteps) setStep(step + 1);
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  /* ---------- dietary toggle ---------- */
  const toggleDietary = (item: string) => {
    if (item === "Yok") {
      setDietaryNeeds(["Yok"]);
      return;
    }
    setDietaryNeeds((prev) => {
      const without = prev.filter((d) => d !== "Yok");
      return without.includes(item)
        ? without.filter((d) => d !== item)
        : [...without, item];
    });
  };

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceStyle: serviceType,
          occasion: selectedOccasion,
          guestCount,
          date: selectedDate,
          budget: selectedBudget,
          dietaryNeeds: dietaryNeeds.filter((d) => d !== "Yok"),
          notes,
        }),
      });
      const data = await res.json();
      setSuggestedProducts(data.suggestedProducts ?? []);
      setShowResults(true);
    } catch {
      alert("Bir hata olustu, lutfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- add suggestion to cart ---------- */
  const addToCart = (product: SuggestedProduct) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      imageUrl: product.imageUrl,
    });
  };

  /* ---------- total estimate ---------- */
  const budgetObj = BUDGET_OPTIONS.find((b) => b.range === selectedBudget);
  const estimateMin = budgetObj ? budgetObj.min : 0;
  const estimateMax = budgetObj ? budgetObj.max : 0;

  if (!isOpen) return null;

  /* ================================================================ */
  /* RENDER                                                            */
  /* ================================================================ */

  return (
    <div className="fixed inset-0 z-[80] bg-cream overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-brown-mid hover:text-brown-deep transition-colors"
        aria-label="Kapat"
      >
        <X size={24} />
      </button>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress bar */}
        {!showResults && (
          <div className="mb-8">
            <div className="flex justify-between font-body text-xs text-brown-mid mb-2">
              <span>Soru {step}/{totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gold-light/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-terracotta rounded-full"
                initial={false}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ======================== Q1: Service type ======================== */}
          {step === 1 && !showResults && (
            <motion.div
              key="q1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Ne istiyorsunuz?
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {[
                  {
                    key: "siparis" as const,
                    icon: "\ud83d\uded2",
                    label: "Yemek Siparisi",
                    desc: "El yapimi urunlerden secin ve kapiniza teslim edelim.",
                  },
                  {
                    key: "hizmet" as const,
                    icon: "\ud83d\udc69\u200d\ud83c\udf73",
                    label: "Ozel Hizmet",
                    desc: "Eve Sef, workshop veya davet organizasyonu.",
                  },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setServiceType(opt.key)}
                    className={`p-6 border-2 text-left transition-all ${
                      serviceType === opt.key
                        ? "border-terracotta bg-terracotta-light/20"
                        : "border-gold-light/60 hover:border-gold"
                    }`}
                  >
                    <span className="text-4xl block mb-3">{opt.icon}</span>
                    <p className="font-heading text-xl text-brown-deep">{opt.label}</p>
                    <p className="font-body text-sm text-brown-mid mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================== Q2: Occasion ======================== */}
          {step === 2 && !showResults && (
            <motion.div
              key="q2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Hangi ozel gun icin?
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {occasions.map((occ) => (
                  <button
                    key={occ.slug}
                    onClick={() => setSelectedOccasion(occ.slug)}
                    className={`p-3 border-2 text-center transition-all ${
                      selectedOccasion === occ.slug
                        ? "border-terracotta bg-terracotta-light/20"
                        : "border-gold-light/60 hover:border-gold"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{occ.icon}</span>
                    <p className="font-body text-xs text-brown-deep font-medium leading-tight">
                      {occ.name}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================== Q3: Guest count ======================== */}
          {step === 3 && !showResults && (
            <motion.div
              key="q3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Kac kisi?
              </h2>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {GUEST_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setGuestCount(p.value)}
                    className={`px-5 py-2 border-2 font-body text-sm transition-all ${
                      guestCount === p.value
                        ? "border-terracotta bg-terracotta-light/20 text-brown-deep font-semibold"
                        : "border-gold-light/60 text-brown-mid hover:border-gold"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="max-w-sm mx-auto space-y-2">
                <input
                  type="range"
                  min={2}
                  max={50}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-terracotta"
                />
                <div className="text-center">
                  <span className="font-heading text-4xl text-terracotta font-bold">
                    {guestCount}
                  </span>
                  <span className="font-body text-sm text-brown-mid ml-2">kisi</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================== Q4: Date ======================== */}
          {step === 4 && !showResults && (
            <motion.div
              key="q4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Hangi tarih?
              </h2>
              <div className="max-w-xs mx-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border-2 border-gold-light px-4 py-3 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta text-center"
                />
              </div>
            </motion.div>
          )}

          {/* ======================== Q5: Budget ======================== */}
          {step === 5 && !showResults && (
            <motion.div
              key="q5"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Butceniz nedir?
              </h2>
              <div className="grid gap-3 max-w-md mx-auto">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.range}
                    onClick={() => setSelectedBudget(b.range)}
                    className={`flex items-center justify-between p-4 border-2 transition-all ${
                      selectedBudget === b.range
                        ? "border-terracotta bg-terracotta-light/20"
                        : "border-gold-light/60 hover:border-gold"
                    }`}
                  >
                    <span className="font-heading text-lg text-brown-deep">{b.label}</span>
                    <span className="font-body text-sm text-brown-mid">
                      {b.range === "1500+" ? "1500\u20BA+" : `${b.min}-${b.max}\u20BA`}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================== Q6: Dietary ======================== */}
          {step === 6 && !showResults && (
            <motion.div
              key="q6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Diyet veya alerji?
              </h2>
              <p className="font-body text-sm text-brown-mid text-center">
                Birden fazla secenek isaretleyebilirsiniz.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {DIETARY_OPTIONS.map((item) => {
                  const isChecked = dietaryNeeds.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleDietary(item)}
                      className={`flex items-center gap-2 p-3 border-2 transition-all text-left ${
                        isChecked
                          ? "border-terracotta bg-terracotta-light/20"
                          : "border-gold-light/60 hover:border-gold"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${
                          isChecked ? "border-terracotta bg-terracotta" : "border-gold-light"
                        }`}
                      >
                        {isChecked && <Check size={12} className="text-white" />}
                      </div>
                      <span className="font-body text-sm text-brown-deep">{item}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ======================== Q7: Notes ======================== */}
          {step === 7 && !showResults && (
            <motion.div
              key="q7"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Eklemek istediginiz not var mi?
              </h2>
              <div className="max-w-md mx-auto">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gold-light px-4 py-3 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta resize-none"
                  placeholder="Ozel istekleriniz, allerjen detaylari, sunum tercihleri..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full max-w-md mx-auto block bg-terracotta text-white font-body text-sm font-medium py-4 hover:bg-terracotta-dark transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Oneriler hazirlaniyor...
                  </span>
                ) : (
                  "Tamamla"
                )}
              </button>
            </motion.div>
          )}

          {/* ======================== Results ======================== */}
          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl text-brown-deep text-center">
                Size Ozel Onerilerimiz
              </h2>

              {suggestedProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {suggestedProducts.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="border border-gold-light bg-white p-4 space-y-2"
                    >
                      <Link href={`/urunler/${product.slug}`} onClick={onClose}>
                        <h3 className="font-heading text-lg text-brown-deep hover:text-terracotta transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-body text-xs text-brown-mid line-clamp-2">
                        {product.shortDesc}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-heading text-xl text-terracotta font-bold">
                          {product.basePrice}&#x20BA;
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-terracotta text-white font-body text-xs px-4 py-2 hover:bg-terracotta-dark transition-colors flex items-center gap-1"
                        >
                          <ShoppingCart size={14} />
                          Sepete Ekle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="font-body text-sm text-brown-mid">
                    Tercihlerinize uygun urunler hazirlaniyor. WhatsApp ile iletisime gecerek
                    kisisel oneriler alabilirsiniz.
                  </p>
                </div>
              )}

              {/* Estimate */}
              {budgetObj && (
                <div className="bg-white border border-gold-light p-4 text-center">
                  <p className="font-body text-xs text-brown-mid">Tahmini Butce</p>
                  <p className="font-heading text-2xl text-terracotta font-bold">
                    {estimateMin} - {estimateMax === 99999 ? "1500+" : estimateMax}&#x20BA;
                  </p>
                  <p className="font-body text-xs text-brown-mid mt-1">
                    {guestCount} kisi icin
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-terracotta text-white font-body text-sm font-medium py-3 hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Sepete Ekle
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Yasemin's Atelier - Sofra Danismani\nOccasion: ${selectedOccasion}\nKisi: ${guestCount}\nTarih: ${selectedDate}\nButce: ${selectedBudget}\nDiyet: ${dietaryNeeds.join(", ")}\nNot: ${notes}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white font-body text-sm font-medium py-3 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  WhatsApp&apos;tan Onayla
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!showResults && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gold-light/30">
            <button
              onClick={goBack}
              disabled={step === 1}
              className="flex items-center gap-1 font-body text-sm text-brown-mid hover:text-brown-deep disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Geri
            </button>

            {step < 7 && (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex items-center gap-1 bg-terracotta text-white font-body text-sm font-medium px-6 py-2.5 hover:bg-terracotta-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Devam
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
