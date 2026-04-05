import { prisma } from "@/lib/db";

// ─── CACHE ─────────────────────────────────────────────
let cachedConfig: Awaited<ReturnType<typeof _fetchConfig>> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function _fetchConfig() {
  let config = await prisma.loyaltyConfig.findFirst();
  if (!config) {
    config = await prisma.loyaltyConfig.create({ data: {} });
  }
  return config;
}

export async function getLoyaltyConfig() {
  const now = Date.now();
  if (cachedConfig && now - cacheTimestamp < CACHE_TTL) {
    return cachedConfig;
  }
  cachedConfig = await _fetchConfig();
  cacheTimestamp = Date.now();
  return cachedConfig;
}

export function invalidateLoyaltyCache() {
  cachedConfig = null;
  cacheTimestamp = 0;
}

// ─── CALCULATE ORDER POINTS ────────────────────────────
export async function calculateOrderPoints(
  orderTotal: number,
  userId: string
): Promise<number> {
  const config = await getLoyaltyConfig();
  if (!config.isActive) return 0;

  const spendPerPoints = Number(config.spendPerPoints);
  let basePoints = Math.floor(orderTotal / spendPerPoints);

  // Tier multiplier
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loyaltyTier: true },
  });

  if (user) {
    const tierMultipliers: Record<string, number> = {
      BRONZE: Number(config.bronzeMultiplier),
      SILVER: Number(config.silverMultiplier),
      GOLD: Number(config.goldMultiplier),
    };
    const multiplier = tierMultipliers[user.loyaltyTier] ?? 1;
    basePoints = Math.floor(basePoints * multiplier);
  }

  // Check for active PointsMultiplierCampaign
  const now = new Date();
  const campaign = await prisma.pointsMultiplierCampaign.findFirst({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: { multiplier: "desc" },
  });

  if (campaign) {
    const campaignMin = campaign.minOrderAmount
      ? Number(campaign.minOrderAmount)
      : 0;
    if (orderTotal >= campaignMin) {
      basePoints = Math.floor(basePoints * Number(campaign.multiplier));
    }
  }

  return basePoints;
}

// ─── AWARD POINTS ──────────────────────────────────────
export async function awardPoints(
  userId: string,
  points: number,
  type: string,
  description: string,
  orderId?: string,
  expiresAt?: Date
) {
  const config = await getLoyaltyConfig();
  if (!config.isActive) return;

  let expiry = expiresAt;
  if (!expiry && config.pointsExpireEnabled && config.pointsExpireDays > 0) {
    expiry = new Date();
    expiry.setDate(expiry.getDate() + config.pointsExpireDays);
  }

  await prisma.$transaction([
    prisma.loyaltyTransaction.create({
      data: {
        userId,
        points,
        type,
        description,
        orderId: orderId ?? null,
        expiresAt: expiry ?? null,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { increment: points } },
    }),
  ]);

  await checkAndUpdateTier(userId);
}

// ─── REDEEM POINTS ─────────────────────────────────────
export async function redeemPoints(
  userId: string,
  points: number,
  orderId?: string
): Promise<boolean> {
  const config = await getLoyaltyConfig();
  if (!config.isActive) return false;
  if (points < config.minPointsToRedeem) return false;

  // Check for active block
  const block = await prisma.loyaltyRedemptionBlock.findFirst({
    where: {
      OR: [{ userId }, { userId: null }],
      unblockedAt: null,
    },
  });
  if (block) return false;

  // Check user balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loyaltyPoints: true },
  });
  if (!user || user.loyaltyPoints < points) return false;

  await prisma.$transaction([
    prisma.loyaltyTransaction.create({
      data: {
        userId,
        points: -points,
        type: "REDEEM",
        description: `${points} puan kullanildi`,
        orderId: orderId ?? null,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { decrement: points } },
    }),
  ]);

  return true;
}

// ─── CHECK AND UPDATE TIER ─────────────────────────────
export async function checkAndUpdateTier(userId: string) {
  const config = await getLoyaltyConfig();
  if (!config.tiersEnabled) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loyaltyPoints: true, loyaltyTier: true },
  });
  if (!user) return;

  const pts = user.loyaltyPoints;
  let newTier: "BRONZE" | "SILVER" | "GOLD" = "BRONZE";

  if (pts >= config.goldMin) {
    newTier = "GOLD";
  } else if (pts >= config.silverMin) {
    newTier = "SILVER";
  } else if (pts >= config.bronzeMin) {
    newTier = "BRONZE";
  }

  if (newTier !== user.loyaltyTier) {
    await prisma.user.update({
      where: { id: userId },
      data: { loyaltyTier: newTier },
    });
  }
}

// ─── EXPIRE OLD POINTS ─────────────────────────────────
export async function expireOldPoints() {
  const now = new Date();

  const expiredTxns = await prisma.loyaltyTransaction.findMany({
    where: {
      expiresAt: { lt: now },
      type: { not: "EXPIRED" },
      points: { gt: 0 },
    },
  });

  for (const txn of expiredTxns) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: txn.userId },
        data: { loyaltyPoints: { decrement: txn.points } },
      }),
      prisma.loyaltyTransaction.update({
        where: { id: txn.id },
        data: { type: "EXPIRED" },
      }),
    ]);
  }

  return { expired: expiredTxns.length };
}

// ─── CONVERSION HELPERS ────────────────────────────────
export async function pointsToTL(points: number): Promise<number> {
  const config = await getLoyaltyConfig();
  return points * Number(config.pointsToTLRate);
}

export async function tlToPoints(amount: number): Promise<number> {
  const config = await getLoyaltyConfig();
  return Math.floor(amount / Number(config.spendPerPoints));
}
