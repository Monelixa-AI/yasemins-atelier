import { prisma } from "@/lib/db";

/**
 * Simple hash function for deterministic variant assignment.
 * Returns a number between 0 and 99.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash) % 100;
}

/**
 * Get the assigned variant for a user/session in a given A/B test.
 * Uses a deterministic hash so the same user always sees the same variant.
 */
export async function getVariant(
  testId: string,
  userId?: string,
  sessionId?: string
) {
  const seed = userId || sessionId;
  if (!seed) return null;

  const test = await prisma.aBTest.findFirst({
    where: {
      id: testId,
      status: "RUNNING",
    },
    include: {
      variants: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!test || test.variants.length === 0) return null;

  // If there's a winner, always return the winner
  if (test.winnerVariantId) {
    return test.variants.find((v) => v.id === test.winnerVariantId) || null;
  }

  // Deterministic assignment based on hash
  const hashValue = simpleHash(`${testId}:${seed}`);

  // Build weight ranges from variant weights
  const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
  let cumulative = 0;

  for (const variant of test.variants) {
    cumulative += (variant.weight / totalWeight) * 100;
    if (hashValue < cumulative) {
      return variant;
    }
  }

  // Fallback to last variant
  return test.variants[test.variants.length - 1];
}

/**
 * Track an impression for a variant.
 */
export async function trackABImpression(variantId: string) {
  await prisma.aBTestVariant.update({
    where: { id: variantId },
    data: { impressions: { increment: 1 } },
  });
}

/**
 * Track a conversion for a variant.
 */
export async function trackABConversion(variantId: string) {
  await prisma.aBTestVariant.update({
    where: { id: variantId },
    data: { conversions: { increment: 1 } },
  });
}
