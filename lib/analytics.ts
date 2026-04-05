"use client";

/* ------------------------------------------------------------------ */
/*  Global type declarations for gtag, fbq, dataLayer                  */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    // dataLayer is already typed by @next/third-parties as Object[]
  }
}

/* ------------------------------------------------------------------ */
/*  Generic event helper                                               */
/* ------------------------------------------------------------------ */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", eventName, params);
  }

  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

/* ------------------------------------------------------------------ */
/*  GA4 E-Commerce Events                                              */
/* ------------------------------------------------------------------ */

export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  trackEvent("view_item", {
    currency: "TRY",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  trackEvent("add_to_cart", {
    currency: "TRY",
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

export function trackBeginCheckout(
  items: { id: string; name: string; price: number; quantity: number }[],
  total: number
) {
  trackEvent("begin_checkout", {
    currency: "TRY",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackPurchase(
  orderId: string,
  total: number,
  items: { id: string; name: string; price: number; quantity: number }[]
) {
  // GA4 purchase event
  trackEvent("purchase", {
    transaction_id: orderId,
    currency: "TRY",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  // Meta Pixel purchase event
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      currency: "TRY",
      value: total,
    });
  }
}

export function trackSearch(searchTerm: string) {
  trackEvent("search", {
    search_term: searchTerm,
  });
}

/* ------------------------------------------------------------------ */
/*  Custom Events                                                      */
/* ------------------------------------------------------------------ */

export function trackBookingInitiated(
  serviceSlug: string,
  packageName: string
) {
  trackEvent("booking_initiated", {
    service_slug: serviceSlug,
    package_name: packageName,
  });
}

export function trackGenerateLead(source: string) {
  trackEvent("generate_lead", {
    currency: "TRY",
    source,
  });
}
