import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header, Footer, WhatsAppButton, CookieConsent, AnalyticsProvider } from "@/components/site/layout";
import CartDrawer from "@/components/site/cart/CartDrawer";
import { JsonLd } from "@/components/site/JsonLd";
import { getOrganizationSchema, getLocalBusinessSchema } from "@/lib/structured-data";
import { defaultMetadata } from "@/lib/metadata";

const ChatWidget = dynamic(() => import("@/components/site/chat/ChatWidget"), { ssr: false });
const PopupManager = dynamic(() => import("@/components/site/popups/PopupManager"), { ssr: false });
const SiteBanner = dynamic(() => import("@/components/site/layout/SiteBanner"), { ssr: false });
const UTMTracker = dynamic(() => import("@/components/site/UTMTracker"), { ssr: false });
const FlashSaleBar = dynamic(() => import("@/components/site/flash/FlashSaleBar"), { ssr: false });
const TikTokPixel = dynamic(() => import("@/components/site/TikTokPixel"), { ssr: false });

export const metadata: Metadata = defaultMetadata;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getLocalBusinessSchema()} />
      <Header />
      <SiteBanner />
      <FlashSaleBar />
      <main id="main-content" className="pt-[90px]">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <WhatsAppButton />
      <AnalyticsProvider />
      <TikTokPixel />
      <CookieConsent />
      <PopupManager />
      <UTMTracker />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
