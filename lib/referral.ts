import { prisma } from "@/lib/db";

/**
 * Process a referral when a new user registers with a referral code.
 * Finds the referrer by code, creates a Referral record with status REGISTERED.
 */
export async function processReferral(
  referralCode: string,
  newUserId: string,
  newUserEmail: string
) {
  // Find the user who owns this referral code
  const referrer = await prisma.user.findUnique({
    where: { referralCode },
  });

  if (!referrer) {
    return null;
  }

  // Don't allow self-referral
  if (referrer.id === newUserId) {
    return null;
  }

  // Check if this user was already referred
  const existingReferral = await prisma.referral.findUnique({
    where: { referredUserId: newUserId },
  });

  if (existingReferral) {
    return existingReferral;
  }

  // Create referral record
  const referral = await prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredEmail: newUserEmail,
      referredUserId: newUserId,
      status: "REGISTERED",
    },
  });

  // Link the referred user to the referrer
  await prisma.user.update({
    where: { id: newUserId },
    data: { referredById: referrer.id },
  });

  return referral;
}

/**
 * Reward a referral when the referred user completes their first paid order.
 * Gives the referrer 50 loyalty points and updates the referral to REWARDED.
 */
export async function rewardReferral(userId: string) {
  // Check if this is the user's first paid order
  const paidOrderCount = await prisma.order.count({
    where: {
      userId,
      paymentStatus: "PAID",
    },
  });

  // Only reward on first paid order
  if (paidOrderCount !== 1) {
    return null;
  }

  // Find the referral record for this user
  const referral = await prisma.referral.findUnique({
    where: { referredUserId: userId },
  });

  if (!referral || referral.status === "REWARDED") {
    return null;
  }

  const REFERRAL_REWARD_POINTS = 50;

  // Transaction: reward referrer + update referral status
  const [updatedReferral] = await prisma.$transaction([
    prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: "REWARDED",
        referrerReward: REFERRAL_REWARD_POINTS,
        convertedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: referral.referrerId },
      data: {
        loyaltyPoints: { increment: REFERRAL_REWARD_POINTS },
      },
    }),
    prisma.loyaltyTransaction.create({
      data: {
        userId: referral.referrerId,
        points: REFERRAL_REWARD_POINTS,
        type: "REFERRAL_REWARD",
        description: `Referans odul: ${referral.referredEmail} ilk siparisini tamamladi`,
      },
    }),
  ]);

  return updatedReferral;
}
