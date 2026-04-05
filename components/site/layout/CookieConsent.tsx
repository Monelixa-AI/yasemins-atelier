"use client";

import { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  preference: boolean;
}

interface StoredConsent extends ConsentState {
  timestamp: number;
  version: number;
}

const STORAGE_KEY = "ya_cookie_consent";
const CONSENT_VERSION = 1;

/* ------------------------------------------------------------------ */
/*  Hook – useConsent                                                  */
/* ------------------------------------------------------------------ */
export function useConsent(): ConsentState | null {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredConsent = JSON.parse(raw);
        if (parsed.version === CONSENT_VERSION) {
          setConsent({
            analytics: parsed.analytics,
            marketing: parsed.marketing,
            preference: parsed.preference,
          });
        }
      }
    } catch {
      // corrupt data – treat as no consent
    }

    // Listen for consent changes from other components
    const handler = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: StoredConsent = JSON.parse(raw);
          setConsent({
            analytics: parsed.analytics,
            marketing: parsed.marketing,
            preference: parsed.preference,
          });
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("ya_consent_update", handler);
    return () => window.removeEventListener("ya_consent_update", handler);
  }, []);

  return consent;
}

/* ------------------------------------------------------------------ */
/*  Helper – persist consent                                           */
/* ------------------------------------------------------------------ */
function saveConsent(state: ConsentState) {
  const stored: StoredConsent = {
    ...state,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  window.dispatchEvent(new Event("ya_consent_update"));
}

/* ------------------------------------------------------------------ */
/*  Settings Modal                                                     */
/* ------------------------------------------------------------------ */
function SettingsModal({
  onSave,
  onClose,
}: {
  onSave: (state: ConsentState) => void;
  onClose: () => void;
}) {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [preference, setPreference] = useState(false);

  const categories = [
    {
      id: "required" as const,
      label: "Zorunlu Cerezler",
      description: "Sitenin calismasi icin gerekli",
      checked: true,
      disabled: true,
      onChange: () => {},
    },
    {
      id: "analytics" as const,
      label: "Analitik",
      description: "Google Analytics ile site performansi olcumu",
      checked: analytics,
      disabled: false,
      onChange: () => setAnalytics((v) => !v),
    },
    {
      id: "marketing" as const,
      label: "Pazarlama",
      description: "Meta Pixel ve reklam takibi",
      checked: marketing,
      disabled: false,
      onChange: () => setMarketing((v) => !v),
    },
    {
      id: "preference" as const,
      label: "Tercih",
      description: "Tema ve dil tercihleri",
      checked: preference,
      disabled: false,
      onChange: () => setPreference((v) => !v),
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-brown-deep px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-lg text-white">
            Cerez Ayarlari
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-xl leading-none"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="font-body text-sm text-gray-600">
            KVKK kapsaminda cerez tercihlerinizi yonetebilirsiniz.
            Zorunlu cerezler sitenin calismasi icin gereklidir ve
            kapatılamaz.
          </p>

          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-gray-900">
                  {cat.label}
                </p>
                <p className="font-body text-xs text-gray-500 mt-0.5">
                  {cat.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={cat.checked}
                  disabled={cat.disabled}
                  onChange={cat.onChange}
                  className="sr-only peer"
                />
                <div
                  className={`
                    w-10 h-5 rounded-full transition-colors
                    ${cat.disabled
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-gray-300 peer-checked:bg-green-500 cursor-pointer"
                    }
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                    after:bg-white after:rounded-full after:h-4 after:w-4
                    after:transition-transform
                    peer-checked:after:translate-x-5
                  `}
                />
              </label>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => onSave({ analytics, marketing, preference })}
            className="w-full font-body text-sm text-white bg-brown-deep hover:bg-brown-deep/90 px-6 py-2.5 rounded transition-colors"
          >
            Secilenleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component – CookieConsent                                     */
/* ------------------------------------------------------------------ */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setVisible(true);
        return;
      }
      const parsed: StoredConsent = JSON.parse(raw);
      if (parsed.version !== CONSENT_VERSION) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    saveConsent({ analytics: true, marketing: true, preference: true });
    setVisible(false);
    setShowSettings(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    saveConsent({ analytics: false, marketing: false, preference: false });
    setVisible(false);
    setShowSettings(false);
  }, []);

  const handleSaveSettings = useCallback((state: ConsentState) => {
    saveConsent(state);
    setVisible(false);
    setShowSettings(false);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Stage 1 – Bottom Bar */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-brown-deep/95 backdrop-blur-sm border-t border-gold/20">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-sm text-white/80 text-center sm:text-left">
              Bu site cerezler kullanir.{" "}
              <a
                href="/cerez-politikasi"
                className="text-gold underline underline-offset-2 hover:text-gold-light"
              >
                Cerez Politikasi
              </a>
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleRejectAll}
                className="font-body text-xs text-white/80 hover:text-white px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
              >
                Reddet
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="font-body text-xs text-white/80 hover:text-white px-4 py-2 border border-white/30 hover:border-white/60 rounded transition-colors"
              >
                Ayarlar
              </button>
              <button
                onClick={handleAcceptAll}
                className="font-body text-xs text-white bg-green-600 hover:bg-green-500 px-4 py-2 rounded transition-colors"
              >
                Tumunu Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2 – Settings Modal */}
      {showSettings && (
        <SettingsModal
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
