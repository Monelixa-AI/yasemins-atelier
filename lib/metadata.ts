import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://yaseminsatelier.com";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Yasemin's Atelier | Istanbul Butik Gastronomi",
    template: "%s | Yasemin's Atelier",
  },
  description:
    "Istanbul'un butik gastronomi atölyesi. Özel günleriniz için el yapımı lezzetler, catering hizmetleri, workshop deneyimleri ve doğal ürünler.",
  keywords: [
    "butik gastronomi",
    "istanbul catering",
    "el yapımı lezzetler",
    "özel gün yemekleri",
    "gastronomi atölyesi",
    "workshop istanbul",
    "doğal ürünler",
    "ev yemekleri istanbul",
    "davet organizasyon",
    "kurumsal catering",
    "türk mutfağı",
    "sağlıklı yemek",
    "lezzet kutusu",
    "eve şef",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BASE_URL,
    siteName: "Yasemin's Atelier",
    title: "Yasemin's Atelier | Istanbul Butik Gastronomi",
    description:
      "Istanbul'un butik gastronomi atölyesi. Özel günleriniz için el yapımı lezzetler, catering hizmetleri ve doğal ürünler.",
    images: [
      {
        url: `${BASE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Yasemin's Atelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yasemin's Atelier | Istanbul Butik Gastronomi",
    description:
      "Istanbul'un butik gastronomi atölyesi. Özel günleriniz için el yapımı lezzetler.",
    images: [`${BASE_URL}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

/* ─── Page-level metadata helper ────────────────────── */

interface PageMetadataOptions {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  image,
  canonical,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const ogImage = image || `${BASE_URL}/og-default.jpg`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
