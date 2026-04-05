import { prisma } from "@/lib/db"
import { addDays, subDays, startOfDay, endOfDay, endOfMonth, format } from "date-fns"
import { sendBirthday, sendWinBack, sendLoyaltyLevelUp, sendBookingReminderEmail } from "./email"
import { sendSMS, SMS_TEMPLATES } from "./sms"

function generateCode(prefix: string): string {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${random}`
}

// ─── BIRTHDAY AUTOMATION ───────────────────────────────

export async function runBirthdayAutomation() {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  // Find users whose birthDate matches today's month and day
  const users = await prisma.user.findMany({
    where: {
      emailConsent: true,
      isActive: true,
      birthDate: { not: null },
    },
  })

  // Filter by month/day since Prisma doesn't support month/day extraction on DateTime
  const birthdayUsers = users.filter((user) => {
    if (!user.birthDate) return false
    const bd = new Date(user.birthDate)
    return bd.getMonth() + 1 === currentMonth && bd.getDate() === currentDay
  })

  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  for (const user of birthdayUsers) {
    // Check if already sent today
    const alreadySent = await prisma.emailLog.findFirst({
      where: {
        to: user.email,
        subject: { contains: "Mutlu Yıllar" },
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    })

    if (alreadySent) continue

    // Create 15% discount code
    const code = generateCode("DOGUMGUNU")
    const monthEnd = endOfMonth(today)

    await prisma.discountCode.create({
      data: {
        code,
        type: "PERCENTAGE",
        value: 15,
        maxUses: 1,
        perUserLimit: 1,
        validFrom: todayStart,
        validUntil: monthEnd,
        isActive: true,
      },
    })

    // Add 100 loyalty points
    await prisma.user.update({
      where: { id: user.id },
      data: { loyaltyPoints: { increment: 100 } },
    })

    await prisma.loyaltyTransaction.create({
      data: {
        userId: user.id,
        points: 100,
        type: "BIRTHDAY_BONUS",
        description: "Dogum gunu hediye puani",
      },
    })

    // Send birthday email
    await sendBirthday(user, code, monthEnd)
  }

  return { processed: birthdayUsers.length }
}

// ─── WIN-BACK AUTOMATION ───────────────────────────────

export async function runWinBackAutomation() {
  const today = new Date()
  const ninetyDaysAgo = subDays(today, 90)
  const thirtyDaysAgo = subDays(today, 30)

  // Find users who have orders but ALL orders are older than 90 days
  const users = await prisma.user.findMany({
    where: {
      emailConsent: true,
      isActive: true,
      orders: {
        every: {
          createdAt: { lt: ninetyDaysAgo },
        },
        some: {}, // must have at least one order
      },
    },
    include: {
      orders: {
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  let sentCount = 0

  for (const user of users) {
    // Check if already sent in last 30 days
    const recentlySent = await prisma.emailLog.findFirst({
      where: {
        to: user.email,
        subject: { contains: "Sizi özledik" },
        createdAt: { gte: thirtyDaysAgo },
      },
    })

    if (recentlySent) continue

    // Create 75 TL fixed discount code
    const code = generateCode("GERIDON")

    await prisma.discountCode.create({
      data: {
        code,
        type: "FIXED_AMOUNT",
        value: 75,
        maxUses: 1,
        perUserLimit: 1,
        validFrom: startOfDay(today),
        validUntil: addDays(today, 30),
        isActive: true,
      },
    })

    await sendWinBack(user, code, 75)
    sentCount++
  }

  return { processed: sentCount }
}

// ─── LOYALTY TIER CHECK ────────────────────────────────

export async function runLoyaltyTierCheck(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) return null

  const totalPoints = user.loyaltyPoints
  let newTier: "BRONZE" | "SILVER" | "GOLD"

  if (totalPoints >= 1500) {
    newTier = "GOLD"
  } else if (totalPoints >= 500) {
    newTier = "SILVER"
  } else {
    newTier = "BRONZE"
  }

  if (newTier !== user.loyaltyTier) {
    await prisma.user.update({
      where: { id: userId },
      data: { loyaltyTier: newTier },
    })

    // Only send email on upgrade (not downgrade)
    const tierOrder = { BRONZE: 0, SILVER: 1, GOLD: 2 }
    if (tierOrder[newTier] > tierOrder[user.loyaltyTier]) {
      await sendLoyaltyLevelUp(user, newTier)
    }

    return { previousTier: user.loyaltyTier, newTier }
  }

  return { previousTier: user.loyaltyTier, newTier, changed: false }
}

// ─── BOOKING REMINDERS ─────────────────────────────────

export async function runBookingReminders() {
  const today = new Date()
  const tomorrowStart = startOfDay(addDays(today, 1))
  const tomorrowEnd = endOfDay(addDays(today, 1))

  const bookings = await prisma.serviceBooking.findMany({
    where: {
      bookedDate: {
        gte: tomorrowStart,
        lte: tomorrowEnd,
      },
      status: { in: ["CONFIRMED", "DEPOSIT_PAID"] },
      reminderSent: false,
    },
    include: {
      user: true,
    },
  })

  let sentCount = 0

  for (const booking of bookings) {
    // Send reminder email
    await sendBookingReminderEmail(booking)

    // Send reminder SMS
    const smsMessage = SMS_TEMPLATES.bookingReminder(
      booking.packageName,
      booking.startTime
    )
    await sendSMS(booking.guestPhone, smsMessage)

    // Mark reminder as sent
    await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: { reminderSent: true },
    })

    sentCount++
  }

  return { processed: sentCount }
}
