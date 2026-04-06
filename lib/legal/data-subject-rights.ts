import { prisma } from "@/lib/db";

/**
 * Export all personal data for a user (KVKK Madde 11 – veri tasinabilirlik hakki).
 * Runs queries in parallel for performance.
 */
export async function exportUserData(userId: string) {
  const [
    user,
    orders,
    bookings,
    reviews,
    loyaltyTxns,
    consentRecords,
    addresses,
    wishlistItems,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        birthDate: true,
        loyaltyPoints: true,
        loyaltyTier: true,
        totalSpent: true,
        orderCount: true,
        emailConsent: true,
        smsConsent: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
    }),
    prisma.serviceBooking.findMany({ where: { userId } }),
    prisma.review.findMany({ where: { userId } }),
    prisma.loyaltyTransaction.findMany({ where: { userId } }),
    prisma.consentRecord.findMany({ where: { userId } }),
    prisma.address.findMany({ where: { userId } }),
    prisma.wishlistItem.findMany({ where: { userId } }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user,
    orders,
    bookings,
    reviews,
    loyaltyTransactions: loyaltyTxns,
    consentRecords,
    addresses,
    wishlistItems,
  };
}

/**
 * Submit a data deletion (erasure) request.
 * Prevents duplicate pending requests.
 */
export async function requestDataDeletion(userId: string, reason?: string) {
  const existing = await prisma.dataDeletionRequest.findFirst({
    where: { userId, status: "PENDING" },
  });

  if (existing) {
    throw new Error("Bu kullanici icin bekleyen bir silme talebi zaten mevcut.");
  }

  return prisma.dataDeletionRequest.create({
    data: { userId, reason },
  });
}

/**
 * Process an approved data deletion request.
 * Anonymises order data (VUK retention), deletes personal data.
 */
export async function processDataDeletion(
  requestId: string,
  adminUserId: string
) {
  const request = await prisma.dataDeletionRequest.findUnique({
    where: { id: requestId },
    include: { user: true },
  });

  if (!request || request.status !== "PENDING") {
    throw new Error("Gecersiz veya islenemeyen talep.");
  }

  const userId = request.userId;
  const deletionLog: Record<string, number> = {};
  const retainedData: string[] = [];

  await prisma.dataDeletionRequest.update({
    where: { id: requestId },
    data: { status: "IN_PROGRESS" },
  });

  // 1. Anonymise orders (VUK 10 yil saklama zorunlulugu)
  const orders = await prisma.order.updateMany({
    where: { userId },
    data: { userId: null, guestEmail: "[SILINDI]" },
  });
  deletionLog["orders_anonymised"] = orders.count;
  retainedData.push("Siparisler VUK geregi anonimlestirildi, silinmedi.");

  // 2. Delete addresses
  const addresses = await prisma.address.deleteMany({ where: { userId } });
  deletionLog["addresses_deleted"] = addresses.count;

  // 3. Delete reviews (userId is non-nullable)
  const reviews = await prisma.review.deleteMany({ where: { userId } });
  deletionLog["reviews_deleted"] = reviews.count;

  // 4. Delete AI conversations
  const conversations = await prisma.aIConversation.deleteMany({
    where: { userId },
  });
  deletionLog["ai_conversations_deleted"] = conversations.count;

  // 5. Delete wishlist items
  const wishlist = await prisma.wishlistItem.deleteMany({
    where: { userId },
  });
  deletionLog["wishlist_deleted"] = wishlist.count;

  // 6. Delete notification preferences
  const notifPrefs = await prisma.notificationPreference.deleteMany({
    where: { userId },
  });
  deletionLog["notification_prefs_deleted"] = notifPrefs.count;

  // 7. Delete user record
  await prisma.user.delete({ where: { id: userId } });
  deletionLog["user_deleted"] = 1;

  // 8. Finalise request
  await prisma.dataDeletionRequest.update({
    where: { id: requestId },
    data: {
      status: "COMPLETED",
      processedAt: new Date(),
      processedBy: adminUserId,
      deletionLog,
      retainedData,
    },
  });

  return { deletionLog, retainedData };
}
