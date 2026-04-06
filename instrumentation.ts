// Sentry instrumentation — disabled until SENTRY_DSN is configured
// Uncomment when Sentry is set up:
//
// export async function register() {
//   if (process.env.NEXT_RUNTIME === "nodejs") {
//     await import("./sentry.server.config")
//   }
// }

export async function register() {
  // no-op
}
