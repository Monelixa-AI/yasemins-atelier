"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");
    const term = searchParams.get("utm_term");
    const content = searchParams.get("utm_content");
    const ref = searchParams.get("ref");

    // Store referral code
    if (ref) {
      sessionStorage.setItem("referral_code", ref);
    }

    // Track UTM if any param exists
    if (source || medium || campaign || term || content) {
      // Avoid duplicate tracking in the same session
      const existingSession = sessionStorage.getItem("utm_session_id");
      if (existingSession) return;

      fetch("/api/utm/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          medium,
          campaign,
          term,
          content,
          landingPage: window.location.pathname,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.sessionId) {
            sessionStorage.setItem("utm_session_id", data.sessionId);
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

  return null;
}
