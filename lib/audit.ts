import { prisma } from "@/lib/db"

export async function logAction(
  adminUserId: string,
  action: string,
  entityType: string,
  entityId?: string,
  before?: unknown,
  after?: unknown,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminUserId,
        action,
        entityType,
        entityId: entityId || null,
        before: before ? JSON.parse(JSON.stringify(before)) : null,
        after: after ? JSON.parse(JSON.stringify(after)) : null,
        ipAddress: ipAddress || null,
      },
    })
  } catch (error) {
    console.error("Audit log hatası:", error)
  }
}
