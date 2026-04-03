"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  User,
  PartyPopper,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { ServiceData, ServicePackage } from "@/lib/data/services";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface AvailableDate {
  date: string;
  available: boolean;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  label: string;
  available: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  guestCount: number;
  address: string;
  notes: string;
}

interface BookingFlowProps {
  service: ServiceData;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const STEP_LABELS = ["Paket", "Tarih", "Saat", "Bilgiler", "Onay"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

const MONTH_NAMES = [
  "Ocak", "Subat", "Mart", "Nisan", "Mayis", "Haziran",
  "Temmuz", "Agustos", "Eylul", "Ekim", "Kasim", "Aralik",
];

const DAY_LABELS = ["Pt", "Sa", "Ca", "Pe", "Cu", "Ct", "Pz"];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function BookingFlow({ service, onClose }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    guestCount: 2,
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");

  // Calendar state
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);

  // Slots state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  /* ---------- fetch availability ---------- */
  const fetchAvailability = useCallback(async (y: number, m: number) => {
    setDatesLoading(true);
    try {
      const res = await fetch(
        `/api/bookings/availability?service=${service.slug}&year=${y}&month=${m + 1}`
      );
      const data = await res.json();
      setAvailableDates(data.dates ?? []);
    } catch {
      setAvailableDates([]);
    } finally {
      setDatesLoading(false);
    }
  }, [service.slug]);

  useEffect(() => {
    if (step === 2) fetchAvailability(calYear, calMonth);
  }, [step, calYear, calMonth, fetchAvailability]);

  /* ---------- fetch slots ---------- */
  useEffect(() => {
    if (step !== 3 || !selectedDate) return;
    setSlotsLoading(true);
    fetch(`/api/bookings/slots?service=${service.slug}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [step, selectedDate, service.slug]);

  /* ---------- navigation ---------- */
  const canGoNext = () => {
    if (step === 1) return !!selectedPackage;
    if (step === 2) return !!selectedDate;
    if (step === 3) return !!selectedSlot;
    if (step === 4)
      return form.name.trim() !== "" && form.email.trim() !== "" && form.phone.trim() !== "";
    return true;
  };

  const goNext = () => {
    if (canGoNext() && step < 5) setStep(step + 1);
  };
  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const priceNum = parseInt((selectedPackage?.price ?? "0").replace(/\D/g, ""), 10);
      const deposit = Math.round(priceNum * 0.3);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: service.slug,
          packageName: selectedPackage?.name,
          packagePrice: priceNum,
          depositAmount: deposit,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          guestCount: form.guestCount,
          bookedDate: selectedDate,
          startTime: selectedSlot?.startTime,
          endTime: selectedSlot?.endTime,
          address: service.slug === "eve-sef" ? form.address : undefined,
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingNumber(data.bookingNumber ?? data.bookingId);
        setSuccess(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else {
        alert(data.error || "Bir hata olustu, lutfen tekrar deneyin.");
      }
    } catch {
      alert("Baglanti hatasi, lutfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- calendar helpers ---------- */
  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  };

  const isDateAvailable = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const entry = availableDates.find((d) => d.date === dateStr);
    if (!entry) return false;
    return entry.available;
  };

  const dateString = (day: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isPast = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  /* ================================================================ */
  /* RENDER                                                            */
  /* ================================================================ */

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white overflow-y-auto shadow-2xl mx-4"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-brown-mid hover:text-brown-deep transition-colors"
          aria-label="Kapat"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gold-light/50">
          <h2 className="font-heading text-2xl text-brown-deep">{service.name}</h2>
          <p className="font-body text-sm text-brown-mid mt-1">{service.tagline}</p>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-1">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-gold-light/40">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? "bg-green-500 w-full" : isActive ? "bg-terracotta w-full" : "w-0"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-body text-[10px] ${
                      isActive ? "text-terracotta font-semibold" : isCompleted ? "text-green-600" : "text-brown-mid/50"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            {/* ======================== STEP 1: Package ======================== */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <h3 className="font-heading text-xl text-brown-deep">Paket Secin</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {service.packages.map((pkg) => {
                    const isSelected = selectedPackage?.name === pkg.name;
                    return (
                      <button
                        key={pkg.name}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`relative text-left p-4 border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-terracotta bg-terracotta-light/30"
                            : "border-gold-light/60 hover:border-gold"
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 left-3 bg-terracotta text-white font-body text-[10px] font-semibold px-2 py-0.5">
                            Populer
                          </span>
                        )}
                        {isSelected && (
                          <Check size={16} className="absolute top-3 right-3 text-terracotta" />
                        )}
                        <p className="font-heading text-lg text-brown-deep font-bold">{pkg.name}</p>
                        <p className="font-heading text-xl text-terracotta font-bold mt-1">{pkg.price}</p>
                        <ul className="mt-3 space-y-1.5">
                          {pkg.features.map((f) => (
                            <li key={f} className="font-body text-xs text-brown-mid flex items-start gap-1.5">
                              <Check size={12} className="text-gold mt-0.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ======================== STEP 2: Date ======================== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <h3 className="font-heading text-xl text-brown-deep flex items-center gap-2">
                  <Calendar size={20} className="text-terracotta" />
                  Tarih Secin
                </h3>

                {/* Month navigation */}
                <div className="flex items-center justify-between">
                  <button onClick={prevMonth} className="p-1 text-brown-mid hover:text-terracotta">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-heading text-lg text-brown-deep">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button onClick={nextMonth} className="p-1 text-brown-mid hover:text-terracotta">
                    <ChevronRight size={20} />
                  </button>
                </div>

                {datesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={28} className="animate-spin text-terracotta" />
                  </div>
                ) : (
                  <div>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {DAY_LABELS.map((d) => (
                        <div
                          key={d}
                          className="text-center font-body text-[11px] font-semibold text-brown-mid py-1"
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayOfMonth(calYear, calMonth) }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth(calYear, calMonth) }, (_, i) => i + 1).map(
                        (day) => {
                          const avail = isDateAvailable(day);
                          const past = isPast(day);
                          const ds = dateString(day);
                          const isSel = selectedDate === ds;

                          return (
                            <button
                              key={day}
                              disabled={!avail || past}
                              onClick={() => setSelectedDate(ds)}
                              className={`h-10 font-body text-sm rounded transition-all ${
                                isSel
                                  ? "bg-terracotta text-white font-semibold"
                                  : avail && !past
                                  ? "bg-cream hover:bg-terracotta-light text-brown-deep"
                                  : "text-brown-mid/30 cursor-not-allowed"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ======================== STEP 3: Time Slot ======================== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <h3 className="font-heading text-xl text-brown-deep flex items-center gap-2">
                  <Clock size={20} className="text-terracotta" />
                  Saat Secin
                </h3>
                <p className="font-body text-sm text-brown-mid">
                  {selectedDate && new Date(selectedDate).toLocaleDateString("tr-TR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {slotsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={28} className="animate-spin text-terracotta" />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="font-body text-sm text-brown-mid/60 text-center py-8">
                    Bu tarih icin uygun saat bulunamadi.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const isSel = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 border-2 font-body text-sm transition-all ${
                            isSel
                              ? "border-terracotta bg-terracotta-light/30 text-brown-deep font-semibold"
                              : slot.available
                              ? "border-gold-light/60 hover:border-gold text-brown-deep"
                              : "border-gold-light/20 text-brown-mid/30 cursor-not-allowed"
                          }`}
                        >
                          <span className="font-semibold">{slot.label || `${slot.startTime} - ${slot.endTime}`}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ======================== STEP 4: Personal Info ======================== */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-5"
              >
                <h3 className="font-heading text-xl text-brown-deep flex items-center gap-2">
                  <User size={20} className="text-terracotta" />
                  Bilgileriniz
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Left — Form */}
                  <div className="space-y-3">
                    <div>
                      <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                        Ad Soyad *
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                        placeholder="Adiniz Soyadiniz"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                        Kisi Sayisi
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={form.guestCount}
                        onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
                        className="w-full border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta"
                      />
                    </div>
                    {service.slug === "eve-sef" && (
                      <div>
                        <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                          Adres *
                        </label>
                        <textarea
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          rows={2}
                          className="w-full border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta resize-none"
                          placeholder="Mahalle, sokak, bina no, daire no"
                        />
                      </div>
                    )}
                    <div>
                      <label className="font-body text-xs font-medium text-brown-deep block mb-1">
                        Notlar
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={2}
                        className="w-full border border-gold-light px-3 py-2 font-body text-sm text-brown-deep focus:outline-none focus:border-terracotta resize-none"
                        placeholder="Ozel istek, allerjen bilgisi vb."
                      />
                    </div>
                  </div>

                  {/* Right — Summary */}
                  <div className="bg-cream p-4 space-y-3 h-fit">
                    <h4 className="font-heading text-lg text-brown-deep">Rezervasyon Ozeti</h4>
                    <div className="space-y-2 font-body text-sm text-brown-mid">
                      <div className="flex justify-between">
                        <span>Hizmet</span>
                        <span className="text-brown-deep font-medium">{service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paket</span>
                        <span className="text-brown-deep font-medium">{selectedPackage?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tarih</span>
                        <span className="text-brown-deep font-medium">
                          {selectedDate && new Date(selectedDate).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saat</span>
                        <span className="text-brown-deep font-medium">
                          {selectedSlot?.label || selectedSlot?.startTime}
                        </span>
                      </div>
                      <hr className="border-gold-light" />
                      <div className="flex justify-between">
                        <span>Fiyat</span>
                        <span className="font-heading text-xl text-terracotta font-bold">
                          {selectedPackage?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================== STEP 5: Confirmation ======================== */}
            {step === 5 && !success && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-5"
              >
                <h3 className="font-heading text-xl text-brown-deep">Rezervasyonu Onaylayin</h3>

                {/* Summary */}
                <div className="bg-cream p-5 space-y-2 font-body text-sm">
                  <div className="flex justify-between text-brown-mid">
                    <span>Hizmet</span>
                    <span className="text-brown-deep font-medium">{service.name} — {selectedPackage?.name}</span>
                  </div>
                  <div className="flex justify-between text-brown-mid">
                    <span>Tarih & Saat</span>
                    <span className="text-brown-deep font-medium">
                      {selectedDate && new Date(selectedDate).toLocaleDateString("tr-TR")}{" "}
                      {selectedSlot?.label || selectedSlot?.startTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-brown-mid">
                    <span>Kisi</span>
                    <span className="text-brown-deep font-medium">{form.guestCount} kisi</span>
                  </div>
                  <div className="flex justify-between text-brown-mid">
                    <span>Ad Soyad</span>
                    <span className="text-brown-deep font-medium">{form.name}</span>
                  </div>
                  <hr className="border-gold-light" />
                  <div className="flex justify-between">
                    <span className="text-brown-mid">Toplam</span>
                    <span className="font-heading text-xl text-terracotta font-bold">
                      {selectedPackage?.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-mid">Depozito (%30)</span>
                    <span className="font-heading text-lg text-brown-deep font-bold">
                      {Math.round(
                        parseInt((selectedPackage?.price ?? "0").replace(/\D/g, ""), 10) * 0.3
                      )}
                      &#x20BA;
                    </span>
                  </div>
                </div>

                <p className="font-body text-xs text-brown-mid">
                  Rezervasyonu tamamladiginizda %30 depozito odemesi alinacaktir. Kalan tutar hizmet
                  gununuz odenecektir.
                </p>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-terracotta text-white font-body text-sm font-medium py-4 hover:bg-terracotta-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Isleniyor...
                    </>
                  ) : (
                    "Rezervasyonu Tamamla"
                  )}
                </button>
              </motion.div>
            )}

            {/* ======================== SUCCESS ======================== */}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <PartyPopper size={32} className="text-green-600" />
                </div>
                <h3 className="font-heading text-2xl text-brown-deep">
                  Rezervasyonunuz Alindi!
                </h3>
                <p className="font-body text-sm text-brown-mid max-w-sm mx-auto">
                  Rezervasyon talebiniz basariyla olusturuldu. En kisa surede size donecegiz.
                </p>
                {bookingNumber && (
                  <div className="bg-cream inline-block px-6 py-3">
                    <p className="font-body text-xs text-brown-mid">Rezervasyon No</p>
                    <p className="font-heading text-2xl text-terracotta font-bold">{bookingNumber}</p>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="mt-4 bg-brown-deep text-white font-body text-sm px-8 py-3 hover:bg-brown-mid transition-colors"
                >
                  Kapat
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {!success && (
          <div className="px-6 py-4 border-t border-gold-light/50 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 1}
              className="flex items-center gap-1 font-body text-sm text-brown-mid hover:text-brown-deep disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Geri
            </button>

            {step < 5 ? (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex items-center gap-1 bg-terracotta text-white font-body text-sm font-medium px-6 py-2.5 hover:bg-terracotta-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Devam
                <ChevronRight size={16} />
              </button>
            ) : (
              <div />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
