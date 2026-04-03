import { prisma } from "@/lib/db";

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

export async function updateUserLoyalty(userId: string, points: number) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { increment: points } },
    });
  } catch {
    return null;
  }
}
