import type { Metadata } from "next";
import { Header, Footer, WhatsAppButton, CookieConsent, AnalyticsProvider } from "@/components/site/layout";
import CartDrawer from "@/components/site/cart/CartDrawer";
import ChatWidget from "@/components/site/chat/ChatWidget";
import PopupManager from "@/components/site/popups/PopupManager";
import SiteBanner from "@/components/site/layout/SiteBanner";
import UTMTracker from "@/components/site/UTMTracker";
import FlashSaleBar from "@/components/site/flash/FlashSaleBar";
import TikTokPixel from "@/components/site/TikTokPixel";
import { JsonLd } from "@/components/site/JsonLd";
import { getOrganizationSchema, getLocalBusinessSchema } from "@/lib/structured-data";
import { defaultMetadata } from "@/lib/metadata";

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
      <main className="pt-[90px]">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <WhatsAppButton />
      <AnalyticsProvider />
      <TikTokPixel />
      <CookieConsent />
      <PopupManager />
      <UTMTracker />
    </>
  );
}
