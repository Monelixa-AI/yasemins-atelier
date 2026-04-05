"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import PopupModal from "./PopupModal";

interface Popup {
  id: string;
  name: string;
  type: string;
  title: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  inputPlaceholder?: string;
  trigger: string;
  triggerDelay?: number;
  triggerScroll?: number;
  showOnce: boolean;
  showAfterDays?: number;
  maxShows?: number;
  position: string;
  bgColor: string;
  textColor: string;
}

function getDevice(): string {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

function canShowPopup(popup: Popup): boolean {
  if (typeof window === "undefined") return false;

  const key = `popup_shown_${popup.id}`;
  const stored = localStorage.getItem(key);

  if (!stored) return true;

  try {
    const data = JSON.parse(stored);

    // Check showOnce
    if (popup.showOnce && data.shown) return false;

    // Check maxShows
    if (popup.maxShows && data.count >= popup.maxShows) return false;

    // Check showAfterDays
    if (popup.showAfterDays && data.lastShown) {
      const lastShown = new Date(data.lastShown);
      const daysSince = (Date.now() - lastShown.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < popup.showAfterDays) return false;
    }

    return true;
  } catch {
    return true;
  }
}

function markPopupShown(popupId: string) {
  const key = `popup_shown_${popupId}`;
  const stored = localStorage.getItem(key);
  let data = { shown: true, count: 1, lastShown: new Date().toISOString() };

  if (stored) {
    try {
      const prev = JSON.parse(stored);
      data = { shown: true, count: (prev.count || 0) + 1, lastShown: new Date().toISOString() };
    } catch {
      // Reset if corrupted
    }
  }

  localStorage.setItem(key, JSON.stringify(data));
}

export default function PopupManager() {
  const pathname = usePathname();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [activePopup, setActivePopup] = useState<Popup | null>(null);

  const showPopup = useCallback((popup: Popup) => {
    if (!canShowPopup(popup)) return;
    setActivePopup(popup);
    markPopupShown(popup.id);

    // Track impression
    fetch("/api/popups/impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ popupId: popup.id }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const device = getDevice();

    fetch(`/api/popups?page=${encodeURIComponent(pathname)}&device=${device}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.popups?.length) {
          setPopups(data.popups);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Set up triggers
  useEffect(() => {
    if (!popups.length) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const cleanups: (() => void)[] = [];

    for (const popup of popups) {
      if (!canShowPopup(popup)) continue;

      switch (popup.trigger) {
        case "PAGE_LOAD": {
          showPopup(popup);
          break;
        }

        case "TIME_DELAY": {
          const delay = (popup.triggerDelay || 3) * 1000;
          const timer = setTimeout(() => showPopup(popup), delay);
          timers.push(timer);
          break;
        }

        case "SCROLL_DEPTH": {
          const threshold = popup.triggerScroll || 50;
          let triggered = false;

          const onScroll = () => {
            if (triggered) return;
            const scrollPercent =
              (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent >= threshold) {
              triggered = true;
              showPopup(popup);
            }
          };

          window.addEventListener("scroll", onScroll, { passive: true });
          cleanups.push(() => window.removeEventListener("scroll", onScroll));
          break;
        }

        case "EXIT_INTENT": {
          let triggered = false;

          const onMouseLeave = (e: MouseEvent) => {
            if (triggered) return;
            if (e.clientY <= 0) {
              triggered = true;
              showPopup(popup);
            }
          };

          document.addEventListener("mouseleave", onMouseLeave);
          cleanups.push(() => document.removeEventListener("mouseleave", onMouseLeave));
          break;
        }
      }
    }

    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, [popups, showPopup]);

  const handleClose = () => {
    setActivePopup(null);
  };

  const handleConvert = (email?: string) => {
    if (!activePopup) return;

    fetch("/api/popups/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ popupId: activePopup.id, email }),
    }).catch(() => {});

    setActivePopup(null);
  };

  if (!activePopup) return null;

  return (
    <PopupModal
      popup={activePopup}
      onClose={handleClose}
      onConvert={handleConvert}
    />
  );
}
