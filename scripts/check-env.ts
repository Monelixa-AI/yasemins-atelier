/**
 * check-env.ts
 * Checks that all required environment variables are set.
 * Usage: npx tsx scripts/check-env.ts
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_APP_URL",
] as const;

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error("Missing required environment variables:");
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1);
} else {
  console.log("All required environment variables are set.");
}
