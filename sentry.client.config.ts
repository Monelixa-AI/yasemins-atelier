import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,

    // KVKK: strip PII from events before sending
    beforeSend(event) {
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },

    // Ignore common noise errors
    ignoreErrors: [
      // Browser extensions & network
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error exception captured",
      "Non-Error promise rejection captured",
      // Navigation
      "NEXT_NOT_FOUND",
      "NEXT_REDIRECT",
      // Network errors
      "Failed to fetch",
      "NetworkError",
      "Load failed",
      "ChunkLoadError",
      // User-initiated cancellations
      "AbortError",
      "The operation was aborted",
      "The user aborted a request",
    ],
  });
}
