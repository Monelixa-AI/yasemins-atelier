"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Truck,
  CreditCard,
  PartyPopper,
  ShoppingBag,
  Loader2,
  Gift,
  MessageCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCartStore } from "@/store/cart";
import OrderSummary from "./OrderSummary";
import { StripePaymentForm } from "./StripePaymentForm";
import { IyzicoPaymentForm } from "./IyzicoPaymentForm";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface DeliveryForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  deliveryDate: string;
  timeSlot: string;
  isGift: boolean;
  giftNote: string;
}

type PaymentMethodType = "stripe" | "iyzico" | "cash" | "pos";

const ISTANBUL_DISTRICTS = [
  "Kadikoy", "Besiktas", "Sisli", "Uskudar", "Fatih", "Beyoglu",
  "Atasehir", "Maltepe", "Bakirkoy", "Sariyer", "Beykoz", "Kartal",
  "Pendik", "Bagcilar", "Bahcelievler", "Bayrampasa", "Eyupsultan",
  "Gaziosmanpasa", "Kagithane", "Kucukcekmece", "Sultanbeyli",
  "Tuzla", "Umraniye", "Zeytinburnu",
];

const TIME_SLOTS = [
  { value: "10-13", label: "10:00 - 13:00" },
  { value: "13-17", label: "13:00 - 17:00" },
  { value: "17-21", label: "17:00 - 21:00" },
];

const STEP_CONFIG = [
  { num: 1, label: "Teslimat", icon: Truck },
  { num: 2, label: "Ödeme", icon: CreditCard },
  { num: 3, label: "Onay", icon: Check },
];

const CASH_FEE = 10;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getSubtotal, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState<DeliveryForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    deliveryDate: "",
    timeSlot: "",
    isGift: false,
    giftNote: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("stripe");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  /* ---------- min tomorrow for delivery date ---------- */
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const subtotal = mounted ? getSubtotal() : 0;
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const isCash = paymentMethod === "cash" || paymentMethod === "pos";
  const cashFee = isCash ? CASH_FEE : 0;
  const total = subtotal + deliveryFee - discountAmount + cashFee;

  /* ---------- validate discount ---------- */
  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    setDiscountMsg("");
    try {
      const res = await fetch("/api/discount-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode, orderTotal: subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountAmount(Math.round(data.discount));
        setDiscountMsg(data.message);
      } else {
        setDiscountAmount(0);
        setDiscountMsg(data.message);
      }
    } catch {
      setDiscountMsg("Bir hata oluştu.");
    } finally {
      setDiscountLoading(false);
    }
  };

  /* ---------- create order ---------- */
  const createOrder = async (): Promise<{ orderId: string; orderNumber: string } | null> => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: delivery.email,
          guestPhone: delivery.phone,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variantName: item.variantName,
          })),
          subtotal,
          deliveryFee,
          discount: discountAmount,
          total: subtotal + deliveryFee - discountAmount,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.orderId);
        setOrderNumber(data.orderNumber ?? data.orderId);
        return { orderId: data.orderId, orderNumber: data.orderNumber };
      }
      setPaymentError(data.error || "Sipariş oluşturulamadı.");
      return null;
    } catch {
      setPaymentError("Bağlantı hatası, lütfen tekrar deneyin.");
      return null;
    }
  };

  /* ---------- initiate Stripe payment ---------- */
  const initiateStripePayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");

    const order = await createOrder();
    if (!order) {
      setPaymentLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId }),
      });
      const data = await res.json();
      if (res.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setPaymentError(data.error || "Ödeme başlatılamadı.");
      }
    } catch {
      setPaymentError("Ödeme bağlantısı kurulamadı.");
    } finally {
      setPaymentLoading(false);
    }
  };

  /* ---------- handle payment method change ---------- */
  const handlePaymentMethodChange = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    setClientSecret(null);
    setPaymentError("");
  };

  /* ---------- Stripe success ---------- */
  const handleStripeSuccess = useCallback(() => {
    setOrderSuccess(true);
    clearCart();
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    setStep(3);
  }, [clearCart]);

  /* ---------- handle cash/pos payment ---------- */
  const handleCashPayment = async () => {
    setOrderLoading(true);
    setPaymentError("");

    const order = await createOrder();
    if (!order) {
      setOrderLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          method: paymentMethod === "pos" ? "POS_ON_DELIVERY" : "CASH",
        }),
      });

      if (res.ok) {
        setOrderSuccess(true);
        clearCart();
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
        setStep(3);
      } else {
        const data = await res.json();
        setPaymentError(data.error || "Sipariş onaylanamadı.");
      }
    } catch {
      setPaymentError("Bağlantı hatası.");
    } finally {
      setOrderLoading(false);
    }
  };

  /* ---------- iyzico error callback ---------- */
  const handleIyzicoError = useCallback((msg: string) => {
    setPaymentError(msg);
  }, []);

  /* ---------- initiate iyzico payment ---------- */
  const initiateIyzicoPayment = async () => {
    setPaymentLoading(true);
    setPaymentError("");

    const order = await createOrder();
    if (!order) {
      setPaymentLoading(false);
      return;
    }

    setPaymentLoading(false);
    // IyzicoPaymentForm handles the rest via orderId
  };

  /* ---------- step validation ---------- */
  const canProceed = () => {
    if (step === 1) {
      return (
        delivery.name.trim() !== "" &&
        delivery.email.trim() !== "" &&
        delivery.phone.trim() !== "" &&
        delivery.address.trim() !== "" &&
        delivery.district !== "" &&
        delivery.deliveryDate !== "" &&
        delivery.timeSlot !== ""
      );
    }
    return true;
  };

  if (!mounted) return null;

  /* ---------- empty cart ---------- */
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <ShoppingBag size={56} className="text-gold-light mb-4" />
        <h2 className="font-heading text-2xl text-brown-deep">Sepetiniz Boş</h2>
        <p className="font-body text-sm text-brown-mid mt-2">
          Lezzetli ürünlerimizi keşfetmek ister misiniz?
        </p>
        <Link
          href="/menu"
          className="mt-6 bg-terracotta text-white font-body text-sm font-medium px-8 py-3 hover:bg-terracotta-dark transition-colors"
        >
          Menüyü Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ==================== Stepper ==================== */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {STEP_CONFIG.map((s, i) => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          const Icon = s.icon;
          return (
            <div key={s.num} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "border-terracotta text-terracotta bg-terracotta-light/30"
                      : "border-gold-light text-brown-mid/40"
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span
                  className={`font-body text-xs ${
                    isActive
                      ? "text-terracotta font-semibold"
                      : isCompleted
                      ? "text-green-600"
                      : "text-brown-mid/50"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEP_CONFIG.length - 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    step > s.num ? "bg-green-500" : "bg-gold-light"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        {/* ==================== Main Content ==================== */}
        <div>
          <AnimatePresence mode="wait">
            {/* ============ STEP 1: Delivery ============ */}
            {step === 1 && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-5"
              >
                <h2 className="font-heading text-2xl text-brown-deep">Teslimat Bilgileri</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                      Ad Soyad *
                    </label>
                    <input
                      value={delivery.name}
                      onChange={(e) => setDelivery({ ...delivery, name: e.target.value })}
                      className="w-full border border-gold-light px-3 py-2.5 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={delivery.email}
                      onChange={(e) => setDelivery({ ...delivery, email: e.target.value })}
                      className="w-full border border-gold-light px-3 py-2.5 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={delivery.phone}
                      onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                      className="w-full border border-gold-light px-3 py-2.5 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                      İlçe *
                    </label>
                    <select
                      value={delivery.district}
                      onChange={(e) => setDelivery({ ...delivery, district: e.target.value })}
                      className="w-full border border-gold-light px-3 py-2.5 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta bg-white"
                    >
                      <option value="">İlçe seçin</option>
                      {ISTANBUL_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                    Adres *
                  </label>
                  <textarea
                    value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                    rows={2}
                    className="w-full border border-gold-light px-3 py-2.5 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta resize-none"
                    placeholder="Mahalle, sokak, bina no, daire no"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                      Teslimat Tarihi *
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={delivery.deliveryDate}
                      onChange={(e) =>
                        setDelivery({ ...delivery, deliveryDate: e.target.value })
                      }
                      className="w-full border border-gold-light px-3 py-2.5 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                      Teslimat Saati *
                    </label>
                    <div className="flex gap-2">
                      {TIME_SLOTS.map((ts) => (
                        <button
                          key={ts.value}
                          onClick={() =>
                            setDelivery({ ...delivery, timeSlot: ts.value })
                          }
                          className={`flex-1 border-2 px-2 py-2 font-body text-xs transition-all ${
                            delivery.timeSlot === ts.value
                              ? "border-terracotta bg-terracotta-light/30 text-brown-deep font-semibold"
                              : "border-gold-light/60 text-brown-mid hover:border-gold"
                          }`}
                        >
                          {ts.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gift options */}
                <div className="border border-gold-light/50 p-4 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={delivery.isGift}
                      onChange={(e) =>
                        setDelivery({ ...delivery, isGift: e.target.checked })
                      }
                      className="accent-terracotta w-4 h-4"
                    />
                    <Gift size={16} className="text-gold" />
                    <span className="font-body text-sm text-brown-deep">
                      Hediye olarak gönderilsin
                    </span>
                  </label>
                  {delivery.isGift && (
                    <textarea
                      value={delivery.giftNote}
                      onChange={(e) =>
                        setDelivery({ ...delivery, giftNote: e.target.value })
                      }
                      rows={2}
                      className="w-full border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta resize-none"
                      placeholder="Hediye notunuz..."
                    />
                  )}
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceed()}
                  className="w-full bg-terracotta text-white font-body text-sm font-medium py-4 hover:bg-terracotta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Ödemeye Geç
                </button>
              </motion.div>
            )}

            {/* ============ STEP 2: Payment ============ */}
            {step === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-5"
              >
                <h2 className="font-heading text-2xl text-brown-deep">Ödeme Yöntemi</h2>

                {/* Payment method selection */}
                <div className="space-y-3">
                  {([
                    {
                      key: "stripe" as const,
                      label: "Kredi / Banka Kartı (Uluslararası)",
                      desc: "Visa, Mastercard, Amex — Stripe güvenli ödeme",
                    },
                    {
                      key: "iyzico" as const,
                      label: "Yerli Kart / Taksit (Türkiye)",
                      desc: "Troy dahil — iyzico ile taksit imkanı",
                    },
                    {
                      key: "cash" as const,
                      label: "Kapıda Nakit Ödeme",
                      desc: `Teslimat sırasında nakit — +${CASH_FEE}₺ ek ücret`,
                    },
                    {
                      key: "pos" as const,
                      label: "Kapıda POS ile Ödeme",
                      desc: `Kurye ile kredi kartı — +${CASH_FEE}₺ ek ücret`,
                    },
                  ]).map((pm) => (
                    <label
                      key={pm.key}
                      className={`flex items-start gap-3 p-4 border-2 cursor-pointer transition-all ${
                        paymentMethod === pm.key
                          ? "border-terracotta bg-terracotta-light/10"
                          : "border-gold-light/60 hover:border-gold"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.key}
                        checked={paymentMethod === pm.key}
                        onChange={() => handlePaymentMethodChange(pm.key)}
                        className="accent-terracotta mt-1"
                      />
                      <div>
                        <span className="font-body text-sm font-medium text-brown-deep">
                          {pm.label}
                        </span>
                        <p className="font-body text-xs text-brown-mid mt-0.5">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Payment error */}
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <p className="font-body text-sm text-red-600">{paymentError}</p>
                  </div>
                )}

                {/* Stripe payment form */}
                {paymentMethod === "stripe" && clientSecret && (
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    onSuccess={handleStripeSuccess}
                    onError={(msg) => setPaymentError(msg)}
                  />
                )}

                {/* iyzico payment form */}
                {paymentMethod === "iyzico" && orderId && (
                  <IyzicoPaymentForm
                    orderId={orderId}
                    onError={handleIyzicoError}
                  />
                )}

                {/* Cash/POS info */}
                {(paymentMethod === "cash" || paymentMethod === "pos") && (
                  <div className="bg-[#FDF6EE] p-4 rounded-lg font-body text-sm text-brown-mid space-y-2">
                    <p>
                      {paymentMethod === "cash"
                        ? "Teslimat sırasında nakit ödeme yapabilirsiniz. Lütfen uygun banknot hazır bulundurun."
                        : "Teslimat sırasında kurye mobil POS cihazı ile kartınızdan ödeme alacaktır."}
                    </p>
                    <p className="text-xs text-terracotta font-medium">
                      +{CASH_FEE}₺ kapıda ödeme ek ücreti uygulanır.
                    </p>
                  </div>
                )}

                {/* Discount code */}
                <div className="border border-gold-light/50 p-4">
                  <label className="font-body text-xs font-medium text-brown-deep block mb-2">
                    İndirim Kodu
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      className="flex-1 border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta uppercase"
                      placeholder="Kod girin"
                    />
                    <button
                      onClick={applyDiscount}
                      disabled={discountLoading}
                      className="bg-brown-deep text-white font-body text-sm px-5 py-2 hover:bg-brown-mid transition-colors disabled:opacity-50"
                    >
                      {discountLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Uygula"
                      )}
                    </button>
                  </div>
                  {discountMsg && (
                    <p
                      className={`font-body text-xs mt-2 ${
                        discountAmount > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {discountMsg}
                    </p>
                  )}
                </div>

                {/* Price summary */}
                <div className="bg-cream p-4 space-y-2 font-body text-sm">
                  <div className="flex justify-between text-brown-mid">
                    <span>Ara Toplam</span>
                    <span>{subtotal}&#x20BA;</span>
                  </div>
                  <div className="flex justify-between text-brown-mid">
                    <span>Teslimat</span>
                    <span>
                      {deliveryFee === 0 ? "Ücretsiz" : `${deliveryFee}\u20BA`}
                    </span>
                  </div>
                  {cashFee > 0 && (
                    <div className="flex justify-between text-brown-mid">
                      <span>Kapıda Ödeme Ücreti</span>
                      <span>+{cashFee}&#x20BA;</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>İndirim</span>
                      <span>-{discountAmount}&#x20BA;</span>
                    </div>
                  )}
                  <hr className="border-gold-light" />
                  <div className="flex justify-between">
                    <span className="text-brown-deep font-medium">Toplam</span>
                    <span className="font-heading text-2xl text-terracotta font-bold">
                      {total}&#x20BA;
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gold-light text-brown-mid font-body text-sm font-medium py-4 hover:border-gold transition-colors"
                  >
                    Geri
                  </button>

                  {/* Stripe: create intent then show form */}
                  {paymentMethod === "stripe" && !clientSecret && (
                    <button
                      onClick={initiateStripePayment}
                      disabled={paymentLoading}
                      className="flex-[2] bg-terracotta text-white font-body text-sm font-medium py-4 hover:bg-terracotta-dark transition-colors disabled:opacity-50"
                    >
                      {paymentLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Hazırlanıyor...
                        </span>
                      ) : (
                        "Kart ile Öde"
                      )}
                    </button>
                  )}

                  {/* iyzico: create order then show form */}
                  {paymentMethod === "iyzico" && !orderId && (
                    <button
                      onClick={initiateIyzicoPayment}
                      disabled={paymentLoading}
                      className="flex-[2] bg-terracotta text-white font-body text-sm font-medium py-4 hover:bg-terracotta-dark transition-colors disabled:opacity-50"
                    >
                      {paymentLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Hazırlanıyor...
                        </span>
                      ) : (
                        "iyzico ile Öde"
                      )}
                    </button>
                  )}

                  {/* Cash/POS: direct order */}
                  {(paymentMethod === "cash" || paymentMethod === "pos") && (
                    <button
                      onClick={handleCashPayment}
                      disabled={orderLoading}
                      className="flex-[2] bg-terracotta text-white font-body text-sm font-medium py-4 hover:bg-terracotta-dark transition-colors disabled:opacity-50"
                    >
                      {orderLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          İşleniyor...
                        </span>
                      ) : (
                        "Siparişi Onayla"
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ============ STEP 3: Confirmation ============ */}
            {step === 3 && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-5"
              >
                {orderSuccess ? (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <PartyPopper size={40} className="text-green-600" />
                    </div>
                    <h2 className="font-heading text-3xl text-brown-deep">
                      Siparişiniz Alındı!
                    </h2>
                    <p className="font-body text-sm text-brown-mid max-w-md mx-auto">
                      Siparişiniz başarıyla oluşturuldu. Onay e-postası en kısa sürede
                      gönderilecektir.
                    </p>
                    {orderNumber && (
                      <div className="bg-cream inline-block px-8 py-4">
                        <p className="font-body text-xs text-brown-mid">Sipariş No</p>
                        <p className="font-heading text-3xl text-terracotta font-bold">
                          {orderNumber}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Yasemin's Atelier siparişim: ${orderNumber}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-body text-sm px-6 py-3 hover:bg-green-700 transition-colors"
                      >
                        <MessageCircle size={16} />
                        WhatsApp ile Paylaş
                      </a>
                      {orderId && (
                        <a
                          href={`/api/invoices/${orderId}`}
                          className="inline-flex items-center justify-center gap-2 border-2 border-terracotta text-terracotta font-body text-sm px-6 py-3 hover:bg-terracotta hover:text-white transition-colors"
                        >
                          Fatura İndir
                        </a>
                      )}
                      <Link
                        href="/menu"
                        className="inline-flex items-center justify-center gap-2 border-2 border-gold text-brown-mid font-body text-sm px-6 py-3 hover:bg-cream transition-colors"
                      >
                        Alışverişe Devam
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="py-12">
                    <p className="font-body text-sm text-red-500">
                      Bir hata oluştu. Lütfen tekrar deneyin.
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="mt-4 bg-terracotta text-white font-body text-sm px-6 py-3 hover:bg-terracotta-dark transition-colors"
                    >
                      Geri Dön
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================== Sidebar ==================== */}
        {step < 3 && (
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <OrderSummary discount={discountAmount} deliveryFee={deliveryFee} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
