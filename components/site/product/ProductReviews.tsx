"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ThumbsUp, Camera, ChevronDown } from "lucide-react";
import Image from "next/image";

// ─── TYPES ─────────────────────────────────────────────

interface ReviewUser {
  name: string | null;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  images: string[];
  isPinned: boolean;
  adminReply: string | null;
  helpfulCount: number;
  createdAt: string;
  user: ReviewUser;
}

interface ReviewsData {
  reviews: Review[];
  avgRating: number;
  totalCount: number;
  distribution: Record<number, number>;
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

// ─── HELPERS ───────────────────────────────────────────

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hideSurname(name: string | null): string {
  if (!name) return "Anonim";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return parts[0] + " " + parts[parts.length - 1][0] + ".";
}

function relativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "az once";
  if (diffMins < 60) return `${diffMins} dakika once`;
  if (diffHours < 24) return `${diffHours} saat once`;
  if (diffDays < 7) return `${diffDays} gun once`;
  if (diffWeeks < 5) return `${diffWeeks} hafta once`;
  if (diffMonths < 12) return `${diffMonths} ay once`;
  return date.toLocaleDateString("tr-TR");
}

function getHelpfulKey(reviewId: string): string {
  return `review_helpful_${reviewId}`;
}

// ─── STAR RATING INPUT ─────────────────────────────────

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={
              star <= (hover || value)
                ? "text-gold fill-gold"
                : "text-gold/30"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ─── STARS DISPLAY ─────────────────────────────────────

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.floor(rating)
              ? "text-gold fill-gold"
              : "text-gold/30"
          }
        />
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────

export default function ProductReviews({
  productSlug,
}: {
  productSlug: string;
}) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Form state
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ─── FETCH SESSION ───────────────────────────────────

  useEffect(() => {
    fetch("/api/users/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.id) setSessionUser({ id: d.id, name: d.name, email: d.email });
      })
      .catch(() => {})
      .finally(() => setSessionChecked(true));
  }, []);

  // ─── FETCH REVIEWS ──────────────────────────────────

  const fetchReviews = useCallback(() => {
    setLoading(true);
    fetch(`/api/products/${productSlug}/reviews`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ─── HELPFUL CLICK ──────────────────────────────────

  const handleHelpful = async (reviewId: string) => {
    const key = getHelpfulKey(reviewId);
    if (typeof window !== "undefined" && localStorage.getItem(key)) return;

    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, { method: "POST" });
      if (typeof window !== "undefined") localStorage.setItem(key, "1");
      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          reviews: prev.reviews.map((r) =>
            r.id === reviewId
              ? { ...r, helpfulCount: r.helpfulCount + 1 }
              : r
          ),
        };
      });
    } catch {
      // silent
    }
  };

  // ─── SUBMIT REVIEW ──────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;
    if (formRating < 1 || formRating > 5) {
      setSubmitError("Lutfen bir puan secin (1-5)");
      return;
    }
    if (!formBody.trim()) {
      setSubmitError("Yorum metni zorunludur");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // First need productId from slug
      const productRes = await fetch(`/api/products/${productSlug}`);
      if (!productRes.ok) {
        setSubmitError("Urun bulunamadi");
        setSubmitting(false);
        return;
      }
      const product = await productRes.json();

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          userId: sessionUser.id,
          rating: formRating,
          title: formTitle.trim() || undefined,
          body: formBody.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error || "Bir hata olustu");
        setSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setFormRating(0);
      setFormTitle("");
      setFormBody("");
      setShowForm(false);

      // Refresh reviews after a short delay (review is PENDING so won't show yet)
      setTimeout(fetchReviews, 500);
    } catch {
      setSubmitError("Bir hata olustu");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── FILTERED REVIEWS ───────────────────────────────

  const filteredReviews = data
    ? filterRating
      ? data.reviews.filter((r) => r.rating === filterRating)
      : data.reviews
    : [];

  // ─── RENDER ─────────────────────────────────────────

  if (loading) {
    return (
      <div id="reviews" className="mt-16 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gold-light/50 rounded w-48" />
          <div className="h-24 bg-gold-light/50 rounded" />
          <div className="h-32 bg-gold-light/50 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { avgRating, totalCount, distribution } = data;

  return (
    <div id="reviews" className="mt-16 max-w-4xl">
      {/* ─── HEADER: Average + Distribution ──────────── */}
      <div className="flex items-start gap-8 mb-8">
        <div className="text-center shrink-0">
          <p className="font-heading text-6xl font-bold text-terracotta">
            {totalCount > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <Stars rating={avgRating} size={16} />
          <p className="font-body text-xs text-brown-mid mt-1">
            {totalCount} degerlendirme
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="font-body text-xs text-brown-mid w-6">
                  {star}★
                </span>
                <div className="flex-1 h-2 bg-gold-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-body text-xs text-brown-mid w-10 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── FILTER + WRITE BUTTON ───────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "Tumu", value: null },
            { label: "5★", value: 5 },
            { label: "4★", value: 4 },
            { label: "3★", value: 3 },
            { label: "2★", value: 2 },
            { label: "1★", value: 1 },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setFilterRating(f.value)}
              className={`px-3 py-1 rounded-full font-body text-xs transition-colors ${
                filterRating === f.value
                  ? "bg-terracotta text-white"
                  : "bg-gold-light text-brown-mid hover:bg-gold-light/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          {sessionChecked && (
            <button
              onClick={() => {
                if (sessionUser) {
                  setShowForm(!showForm);
                  setSubmitSuccess(false);
                  setSubmitError("");
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-terracotta text-white font-body text-sm rounded-lg hover:bg-terracotta/90 transition-colors"
            >
              <Star size={14} />
              Yorum Yaz
              {showForm && <ChevronDown size={14} className="rotate-180" />}
            </button>
          )}
        </div>
      </div>

      {/* ─── SUCCESS MESSAGE ─────────────────────────── */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="font-body text-sm text-green-800">
            Yorumunuz basariyla gonderildi! Onaylandiktan sonra burada gorunecektir.
            Yorum bonusu olarak 10 puan kazandiniz.
          </p>
        </div>
      )}

      {/* ─── REVIEW FORM ─────────────────────────────── */}
      {showForm && (
        <div className="mb-8 p-6 bg-cream/50 border border-gold-light rounded-lg">
          {!sessionUser ? (
            <div className="text-center py-4">
              <p className="font-body text-sm text-brown-mid mb-3">
                Yorum yazmak icin giris yapin
              </p>
              <a
                href="/giris"
                className="inline-block px-6 py-2 bg-terracotta text-white font-body text-sm rounded-lg hover:bg-terracotta/90 transition-colors"
              >
                Giris Yapin
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-sm text-brown-deep mb-2">
                  Puaniniz *
                </label>
                <StarRatingInput value={formRating} onChange={setFormRating} />
              </div>

              <div>
                <label className="block font-body text-sm text-brown-deep mb-1">
                  Baslik
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Yorumunuz icin kisa bir baslik"
                  maxLength={120}
                  className="w-full px-3 py-2 font-body text-sm border border-gold-light rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>

              <div>
                <label className="block font-body text-sm text-brown-deep mb-1">
                  Yorumunuz *
                </label>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Bu urun hakkindaki dusuncelerinizi paylasun..."
                  rows={4}
                  maxLength={2000}
                  className="w-full px-3 py-2 font-body text-sm border border-gold-light rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>

              {submitError && (
                <p className="font-body text-sm text-red-600">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-terracotta text-white font-body text-sm rounded-lg hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Gonderiliyor..." : "Yorumu Gonder"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ─── REVIEWS LIST ────────────────────────────── */}
      {filteredReviews.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-body text-sm text-brown-mid">
            {filterRating
              ? `${filterRating} yildizli yorum bulunamadi`
              : "Henuz onaylanmis yorum yok"}
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {filteredReviews.map((review) => {
            const helpfulKey = getHelpfulKey(review.id);
            const alreadyVoted =
              typeof window !== "undefined" &&
              localStorage.getItem(helpfulKey) === "1";

            return (
              <div
                key={review.id}
                className="py-6 border-b border-gold-light"
              >
                {/* Pinned badge */}
                {review.isPinned && (
                  <span className="inline-block mb-2 px-2 py-0.5 bg-terracotta/10 text-terracotta font-body text-[10px] rounded">
                    Sabitlenen Yorum
                  </span>
                )}

                {/* User info + rating */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0">
                    <span className="font-body text-xs font-medium text-terracotta">
                      {getInitials(review.user.name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm text-brown-deep font-medium">
                      {hideSurname(review.user.name)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Stars rating={review.rating} size={12} />
                      <span className="font-body text-[10px] text-brown-mid">
                        {relativeDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-body text-sm font-semibold text-brown-deep mb-1">
                    {review.title}
                  </h4>
                )}

                {/* Body */}
                <p className="font-body text-sm text-brown-deep leading-relaxed">
                  {review.body}
                </p>

                {/* Photos */}
                {review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-gold-light"
                      >
                        <Image
                          src={img}
                          alt={`Yorum fotoğrafı ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful button */}
                <div className="mt-3">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    disabled={alreadyVoted}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-xs transition-colors ${
                      alreadyVoted
                        ? "bg-terracotta/10 text-terracotta cursor-default"
                        : "bg-gold-light text-brown-mid hover:bg-gold-light/70"
                    }`}
                  >
                    <ThumbsUp size={12} />
                    Yararli ({review.helpfulCount})
                  </button>
                </div>

                {/* Admin reply */}
                {review.adminReply && (
                  <div className="mt-4 p-4 bg-cream/80 border-l-2 border-terracotta rounded-r-lg">
                    <p className="font-body text-[10px] text-terracotta font-semibold mb-1">
                      Yasemin&apos;s Atelier
                    </p>
                    <p className="font-body text-sm text-brown-deep leading-relaxed">
                      {review.adminReply}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
