const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://yaseminsatelier.com";

/* ─── Organization ──────────────────────────────────── */

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Yasemin's Atelier",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-212-000-0000",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    sameAs: [
      "https://www.instagram.com/yaseminsatelier",
      "https://www.tiktok.com/@yaseminsatelier",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
  };
}

/* ─── Local Business / FoodEstablishment ────────────── */

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Yasemin's Atelier",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-default.jpg`,
    telephone: "+90-212-000-0000",
    priceRange: "\u20BA\u20BA\u20BA",
    servesCuisine: "Turkish",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
  };
}

/* ─── Product ───────────────────────────────────────── */

interface ProductInput {
  name: string;
  slug: string;
  shortDesc: string;
  basePrice: number | string;
  images?: { url: string; altText?: string | null }[];
  avgRating?: number | string | null;
  reviewCount?: number;
}

export function getProductSchema(product: ProductInput) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    url: `${BASE_URL}/urunler/${product.slug}`,
    image: product.images?.[0]?.url,
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: Number(product.basePrice),
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/urunler/${product.slug}`,
    },
  };

  if (product.avgRating && product.reviewCount && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(product.avgRating),
      reviewCount: product.reviewCount,
    };
  }

  return schema;
}

/* ─── Blog Post ─────────────────────────────────────── */

interface BlogPostInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string;
}

export function getBlogPostSchema(post: BlogPostInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    url: `${BASE_URL}/journal/${post.slug}`,
    image: post.coverImage || `${BASE_URL}/og-default.jpg`,
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: "Yasemin",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Yasemin's Atelier",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  };
}

/* ─── Breadcrumb ────────────────────────────────────── */

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}

/* ─── FAQ ───────────────────────────────────────────── */

interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* ─── Service ───────────────────────────────────────── */

interface ServiceInput {
  name: string;
  slug: string;
  description?: string;
  price?: number | string;
}

export function getServiceSchema(service: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description || "",
    url: `${BASE_URL}/hizmetler/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: "Yasemin's Atelier",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "City",
      name: "Istanbul",
    },
    ...(service.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "TRY",
            price: Number(service.price),
          },
        }
      : {}),
  };
}
