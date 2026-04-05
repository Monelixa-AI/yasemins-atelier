"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Banner {
  id: string;
  name: string;
  content: string;
  linkUrl?: string;
  bgColor: string;
  textColor: string;
  isCloseable: boolean;
  position: string;
  priority: number;
  clicks: number;
}

export default function SiteBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load closed banners from localStorage
    const closed = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("banner_closed_")) {
        closed.add(key.replace("banner_closed_", ""));
      }
    }
    setClosedIds(closed);

    fetch("/api/banners/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.banners?.length) {
          setBanners(data.banners);
        }
      })
      .catch(() => {});
  }, []);

  const handleClose = (bannerId: string) => {
    localStorage.setItem(`banner_closed_${bannerId}`, "true");
    setClosedIds((prev) => new Set(prev).add(bannerId));
  };

  const handleClick = (banner: Banner) => {
    // Track click client-side
    fetch("/api/admin/banners/" + banner.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clicks: banner.clicks + 1 }),
    }).catch(() => {});

    if (banner.linkUrl) {
      window.location.href = banner.linkUrl;
    }
  };

  const visibleBanners = banners.filter((b) => !closedIds.has(b.id));

  if (!visibleBanners.length) return null;

  return (
    <div className="w-full z-50">
      {visibleBanners.map((banner) => (
        <div
          key={banner.id}
          className="relative flex items-center justify-center px-4 py-2.5 text-sm font-medium"
          style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
        >
          <button
            onClick={() => handleClick(banner)}
            className={`flex-1 text-center ${banner.linkUrl ? "cursor-pointer hover:underline" : ""}`}
          >
            {banner.content}
          </button>

          {banner.isCloseable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose(banner.id);
              }}
              className="absolute right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Banner'i kapat"
            >
              <X className="w-4 h-4" style={{ color: banner.textColor }} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
