import { Resend } from "resend"
import { render } from "@react-email/render"
import { prisma } from "@/lib/db"
import React, { ReactElement } from "react"

import OrderConfirmation from "@/emails/OrderConfirmation"
import OrderStatusUpdate from "@/emails/OrderStatusUpdate"
import BookingConfirmation from "@/emails/BookingConfirmation"
import BookingApproved from "@/emails/BookingApproved"
import BookingReminder from "@/emails/BookingReminder"
import Welcome from "@/emails/WelcomeEmail"
import PasswordReset from "@/emails/PasswordReset"
import LoyaltyLevelUp from "@/emails/LoyaltyLevelUp"
import WinBack from "@/emails/WinBackEmail"
import Birthday from "@/emails/BirthdayEmail"

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")
  }
  return _resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Yasemin's Atelier <info@yaseminsatelier.com>"

// ─── CORE SEND FUNCTION ────────────────────────────────

export async function sendEmail(
  to: string | string[],
  subject: string,
  template: ReactElement,
  replyTo?: string
): Promise<boolean> {
  try {
    const html = await render(template)

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo,
    })

    const recipient = Array.isArray(to) ? to.join(", ") : to
    const status = error ? "failed" : "sent"
    const resendId = data?.id || null

    await prisma.emailLog.create({
      data: {
        to: recipient,
        subject,
        status,
        resendId,
      },
    })

    if (error) {
      console.error("Resend error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Email gonderim hatasi:", error)

    const recipient = Array.isArray(to) ? to.join(", ") : to
    await prisma.emailLog.create({
      data: {
        to: recipient,
        subject,
        status: "error",
      },
    }).catch((e) => console.error("Email log hatasi:", e))

    return false
  }
}

// ─── HELPER FUNCTIONS ──────────────────────────────────

export async function sendOrderConfirmation(order: any): Promise<boolean> {
  const template = React.createElement(OrderConfirmation, {
    orderNumber: order.orderNumber,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    address: order.address,
    deliveryDate: order.deliveryDate,
    deliverySlot: order.deliverySlot || "",
    paymentMethod: order.paymentMethod || "Kredi Karti",
    customerName: order.user?.name || order.address?.fullName,
  })

  const email = order.user?.email || order.guestEmail
  return sendEmail(
    email,
    `Siparişiniz Alındı — #${order.orderNumber}`,
    template
  )
}

export async function sendOrderStatusUpdate(
  order: any,
  status: string
): Promise<boolean> {
  const subjectMap: Record<string, string> = {
    CONFIRMED: `Siparişiniz Onaylandı — #${order.orderNumber}`,
    PREPARING: `Siparişiniz Hazırlanıyor — #${order.orderNumber}`,
    READY: `Siparişiniz Hazır — #${order.orderNumber}`,
    OUT_FOR_DELIVERY: `Siparişiniz Yolda — #${order.orderNumber}`,
    DELIVERED: `Siparişiniz Teslim Edildi — #${order.orderNumber}`,
    CANCELLED: `Siparişiniz İptal Edildi — #${order.orderNumber}`,
    REFUNDED: `İade İşleminiz Tamamlandı — #${order.orderNumber}`,
  }

  const subject = subjectMap[status] || `Sipariş Güncelleme — #${order.orderNumber}`

  const template = React.createElement(OrderStatusUpdate, {
    orderNumber: order.orderNumber,
    status: status as "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED",
    statusText: subjectMap[status] || status,
    customerName: order.user?.name || order.address?.fullName,
  })

  const email = order.user?.email || order.guestEmail
  return sendEmail(email, subject, template)
}

export async function sendBookingConfirmation(booking: any): Promise<boolean> {
  const template = React.createElement(BookingConfirmation, {
    bookingNumber: booking.bookingNumber,
    customerName: booking.guestName,
    serviceName: booking.serviceName || booking.packageName,
    packageName: booking.packageName,
    bookedDate: booking.bookedDate,
    startTime: booking.startTime,
    endTime: booking.endTime,
    guestCount: booking.guestCount,
    depositAmount: booking.depositAmount,
    totalAmount: booking.packagePrice || booking.totalAmount,
    address: booking.address,
  })

  return sendEmail(
    booking.guestEmail,
    `Rezervasyonunuz Alındı — #${booking.bookingNumber}`,
    template
  )
}

export async function sendBookingApproved(booking: any): Promise<boolean> {
  const template = React.createElement(BookingApproved, {
    bookingNumber: booking.bookingNumber,
    customerName: booking.guestName,
    serviceName: booking.packageName,
    bookedDate: booking.bookedDate,
    startTime: booking.startTime,
    calendarUrl: `https://yaseminsatelier.com/calendar/add/${booking.bookingNumber}`,
  })

  return sendEmail(
    booking.guestEmail,
    "Rezervasyonunuz Onaylandı!",
    template
  )
}

export async function sendBookingReminderEmail(booking: any): Promise<boolean> {
  const template = React.createElement(BookingReminder, {
    customerName: booking.guestName,
    serviceName: booking.packageName,
    bookedDate: booking.bookedDate,
    startTime: booking.startTime,
    address: booking.address,
    contactPhone: process.env.CONTACT_PHONE || "+905551234567",
  })

  return sendEmail(
    booking.guestEmail,
    "Yarın Rezervasyonunuz Var!",
    template
  )
}

export async function sendWelcomeEmail(
  user: any,
  discountCode?: string
): Promise<boolean> {
  const template = React.createElement(Welcome, {
    customerName: user.name,
    discountCode,
  })

  return sendEmail(
    user.email,
    "Yasemin's Atelier'e Hoş Geldiniz!",
    template
  )
}

export async function sendPasswordReset(
  email: string,
  name: string,
  resetLink: string
): Promise<boolean> {
  const template = React.createElement(PasswordReset, {
    customerName: name,
    resetLink,
  })

  return sendEmail(
    email,
    "Şifre Sıfırlama Talebi",
    template
  )
}

export async function sendLoyaltyLevelUp(
  user: any,
  newTier: string
): Promise<boolean> {
  const template = React.createElement(LoyaltyLevelUp, {
    customerName: user.name,
    tierName: newTier,
    benefits: [],
  })

  return sendEmail(
    user.email,
    "Tebrikler! Yeni seviyeye ulaştınız!",
    template
  )
}

export async function sendWinBack(
  user: any,
  discountCode: string,
  discountValue: number
): Promise<boolean> {
  const template = React.createElement(WinBack, {
    customerName: user.name,
    lastOrderDate: "",
    discountCode,
    discountValue: `%${discountValue}`,
  })

  return sendEmail(
    user.email,
    "Sizi özledik!",
    template
  )
}

export async function sendBirthday(
  user: any,
  discountCode: string,
  validUntil: Date
): Promise<boolean> {
  const template = React.createElement(Birthday, {
    customerName: user.name,
    discountCode,
    validUntil: validUntil.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  })

  return sendEmail(
    user.email,
    "Mutlu Yıllar!",
    template
  )
}
