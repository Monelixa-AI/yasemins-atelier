"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";

interface Popup {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  inputPlaceholder?: string;
  position: string;
  bgColor: string;
  textColor: string;
}

interface PopupModalProps {
  popup: Popup;
  onClose: () => void;
  onConvert: (email?: string) => void;
}

export default function PopupModal({ popup, onClose, onConvert }: PopupModalProps) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [handleEscape]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onConvert(email);
    setSubmitted(true);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCtaClick = () => {
    onConvert();
    if (popup.ctaUrl) {
      window.location.href = popup.ctaUrl;
    }
  };

  // Extract discount code from body or ctaText
  const discountCode = popup.body || popup.ctaText || "";

  const isExitIntent = popup.type === "EXIT_INTENT";
  const titlePrefix = isExitIntent ? "Gitmeden once! " : "";

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const desktopVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  } as const;

  const mobileVariants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { type: "spring" as const, damping: 30, stiffness: 300 } },
    exit: { y: "100%", transition: { duration: 0.25 } },
  } as const;

  const renderEmailCapture = () => {
    if (submitted) {
      return (
        <div className="text-center py-4">
          <Check className="w-12 h-12 mx-auto mb-3" style={{ color: popup.textColor }} />
          <p className="text-lg font-medium" style={{ color: popup.textColor }}>
            Tesekkurler! Kaydiniz alindi.
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={handleEmailSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={popup.inputPlaceholder || "E-posta adresiniz"}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          style={{ color: "#333" }}
        />
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: popup.textColor,
            color: popup.bgColor,
          }}
        >
          {popup.ctaText || "Abone Ol"}
        </button>
      </form>
    );
  };

  const renderDiscount = () => (
    <div className="mt-4 space-y-3">
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg border-2 border-dashed"
        style={{ borderColor: popup.textColor }}
      >
        <span className="font-mono font-bold text-lg tracking-wider" style={{ color: popup.textColor }}>
          {discountCode}
        </span>
        <button
          onClick={() => handleCopy(discountCode)}
          className="ml-3 p-1.5 rounded hover:bg-black/10 transition-colors"
          aria-label="Kodu kopyala"
        >
          {copied ? (
            <Check className="w-5 h-5" style={{ color: popup.textColor }} />
          ) : (
            <Copy className="w-5 h-5" style={{ color: popup.textColor }} />
          )}
        </button>
      </div>
      {popup.ctaUrl && (
        <button
          onClick={handleCtaClick}
          className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: popup.textColor,
            color: popup.bgColor,
          }}
        >
          {popup.ctaText || "Alisverise Basla"}
        </button>
      )}
    </div>
  );

  const renderAnnouncement = () => (
    <div className="mt-4 space-y-3">
      {popup.body && (
        <div
          className="prose prose-sm max-w-none"
          style={{ color: popup.textColor }}
          dangerouslySetInnerHTML={{ __html: popup.body }}
        />
      )}
      {popup.ctaUrl && (
        <button
          onClick={handleCtaClick}
          className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: popup.textColor,
            color: popup.bgColor,
          }}
        >
          {popup.ctaText || "Detaylar"}
        </button>
      )}
    </div>
  );

  const renderExitIntent = () => {
    // Exit intent can be email capture or discount based on body/ctaText
    if (popup.inputPlaceholder || popup.type === "EXIT_INTENT") {
      return renderEmailCapture();
    }
    return renderDiscount();
  };

  const renderContent = () => {
    switch (popup.type) {
      case "EMAIL_CAPTURE":
        return renderEmailCapture();
      case "DISCOUNT":
        return renderDiscount();
      case "ANNOUNCEMENT":
        return renderAnnouncement();
      case "EXIT_INTENT":
        return renderExitIntent();
      default:
        return renderAnnouncement();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="popup-overlay"
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          variants={isMobile ? mobileVariants : desktopVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={
            isMobile
              ? "fixed bottom-0 left-0 right-0 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
              : "relative w-full max-w-md mx-4 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          }
          style={{ backgroundColor: popup.bgColor }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/10 transition-colors z-10"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" style={{ color: popup.textColor }} />
          </button>

          {/* Image */}
          {popup.imageUrl && (
            <div className="w-full h-48 overflow-hidden rounded-t-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={popup.imageUrl}
                alt={popup.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2
              className="text-xl font-bold leading-tight"
              style={{ color: popup.textColor }}
            >
              {titlePrefix}{popup.title}
            </h2>

            {popup.subtitle && (
              <p
                className="mt-2 text-sm opacity-80"
                style={{ color: popup.textColor }}
              >
                {popup.subtitle}
              </p>
            )}

            {renderContent()}
          </div>

          {/* Mobile drag handle */}
          {isMobile && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300" />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
