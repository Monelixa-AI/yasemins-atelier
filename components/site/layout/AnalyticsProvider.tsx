"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { useConsent } from "./CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function AnalyticsProvider() {
  const consent = useConsent();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  /* Track pageview on pathname change (GA4) */
  useEffect(() => {
    if (!consent?.analytics) return;
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (typeof window !== "undefined" && window.gtag && GA_ID) {
      window.gtag("config", GA_ID, { page_path: pathname });
    }
  }, [pathname, consent?.analytics]);

  /* Track pageview on pathname change (Meta Pixel) */
  useEffect(() => {
    if (!consent?.marketing) return;
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, consent?.marketing]);

  // No consent yet — render nothing
  if (!consent) return null;

  return (
    <>
      {/* ---- Analytics (GA4 + GTM) ---- */}
      {consent.analytics && GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      {consent.analytics && GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

      {/* ---- Marketing (Meta Pixel) ---- */}
      {consent.marketing && PIXEL_ID && (
        <Script
          id="meta-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}
