import type { Metadata } from "next";
import { Header, Footer, WhatsAppButton, CookieBanner } from "@/components/site/layout";
import CartDrawer from "@/components/site/cart/CartDrawer";
import ChatWidget from "@/components/site/chat/ChatWidget";

export const metadata: Metadata = {
  title: {
    default: "Yasemin's Atelier | Gastronomi Şefi · İstanbul",
    template: "%s | Yasemin's Atelier",
  },
  description:
    "İstanbul'da el yapımı, taze hazırlanmış mezeler, börekler ve özel siparişler. Gastronomi şefi Yasemin'in atölyesinden sofralarınıza.",
  keywords: [
    "yasemin atelier",
    "istanbul catering",
    "el yapımı meze",
    "istanbul yemek siparişi",
    "özel sofra",
    "gastronomi",
  ],
  openGraph: {
    title: "Yasemin's Atelier",
    description: "Her sofra, bir sanat eseridir.",
    images: ["/images/hero-chef.png"],
    locale: "tr_TR",
    type: "website",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[90px]">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <WhatsAppButton />
      <CookieBanner />
    </>
  );
}
