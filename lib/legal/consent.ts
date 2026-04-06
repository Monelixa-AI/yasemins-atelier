import { prisma } from "@/lib/db";
import { POLICY_VERSIONS } from "./content";
import { ConsentType } from "@prisma/client";

/** Map a ConsentType enum value to its current policy version string. */
export function getCurrentPolicyVersion(type: ConsentType): string {
  const map: Record<ConsentType, string> = {
    EMAIL_MARKETING: POLICY_VERSIONS.privacy,
    SMS_MARKETING: POLICY_VERSIONS.privacy,
    ANALYTICS_COOKIES: POLICY_VERSIONS.cookies,
    MARKETING_COOKIES: POLICY_VERSIONS.cookies,
    PREFERENCE_COOKIES: POLICY_VERSIONS.cookies,
    DATA_PROCESSING: POLICY_VERSIONS.kvkk,
    SALES_CONTRACT: POLICY_VERSIONS.salesContract,
    TERMS_OF_SERVICE: POLICY_VERSIONS.terms,
  };
  return map[type];
}

/** Create a consent record for a user or anonymous session. */
export async function recordConsent(
  userId: string | null,
  sessionId: string | null,
  consentType: ConsentType,
  granted: boolean,
  source: string,
  pageUrl?: string,
  ipAddress?: string
) {
  return prisma.consentRecord.create({
    data: {
      userId,
      sessionId,
      consentType,
      granted,
      source,
      pageUrl,
      ipAddress,
      policyVersion: getCurrentPolicyVersion(consentType),
    },
  });
}

/** Check whether a user currently has an active consent of the given type. */
export async function hasConsent(
  userId: string,
  consentType: ConsentType
): Promise<boolean> {
  const latest = await prisma.consentRecord.findFirst({
    where: { userId, consentType },
    orderBy: { createdAt: "desc" },
  });
  return latest?.granted ?? false;
}

/** Revoke a previously granted consent and update related User flags. */
export async function revokeConsent(
  userId: string,
  consentType: ConsentType,
  source: string
) {
  const record = await prisma.consentRecord.create({
    data: {
      userId,
      consentType,
      granted: false,
      source,
      policyVersion: getCurrentPolicyVersion(consentType),
      revokedAt: new Date(),
      revokedSource: source,
    },
  });

  // Keep User model flags in sync
  if (consentType === "EMAIL_MARKETING") {
    await prisma.user.update({
      where: { id: userId },
      data: { emailConsent: false },
    });
  }
  if (consentType === "SMS_MARKETING") {
    await prisma.user.update({
      where: { id: userId },
      data: { smsConsent: false },
    });
  }

  return record;
}

/** Return full consent history for a user, newest first. */
export async function getConsentHistory(userId: string) {
  return prisma.consentRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
