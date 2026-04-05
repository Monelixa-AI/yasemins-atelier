"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useConsent } from "@/components/site/layout/CookieConsent";

const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

declare global {
  interface Window {
    ttq: {
      load: (id: string) => void;
      page: () => void;
      track: (event: string, data?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
    };
    TiktokAnalyticsObject: string;
  }
}

export default function TikTokPixel() {
  const consent = useConsent();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const initialized = useRef(false);

  // Pathname degisiminde PageView takibi
  useEffect(() => {
    if (!consent?.marketing || !TIKTOK_PIXEL_ID) return;
    if (!initialized.current) return;
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.page();
    }
  }, [pathname, consent?.marketing]);

  // Marketing onay kontrolu
  if (!consent?.marketing || !TIKTOK_PIXEL_ID) return null;

  return (
    <Script
      id="tiktok-pixel"
      strategy="lazyOnload"
      onLoad={() => {
        initialized.current = true;
      }}
      dangerouslySetInnerHTML={{
        __html: `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;
            var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
            ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e+\"_\"+o]=1;
            var a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=r+"?sdkid="+e+"&lib="+t;
            var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
            ttq.load('${TIKTOK_PIXEL_ID}');
            ttq.page();
          }(window, document, 'ttq');
        `,
      }}
    />
  );
}
