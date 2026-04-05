import { prisma } from "@/lib/db"

const NETGSM_USERCODE = process.env.NETGSM_USERCODE!
const NETGSM_PASSWORD = process.env.NETGSM_PASSWORD!
const NETGSM_HEADER = process.env.NETGSM_HEADER || "YASEMINATL"

// ─── CORE SEND FUNCTION ────────────────────────────────

export async function sendSMS(
  to: string,
  message: string
): Promise<boolean> {
  try {
    // Format phone: remove non-digits, replace leading 0 with 90
    let phone = to.replace(/\D/g, "")
    if (phone.startsWith("0")) {
      phone = "90" + phone.substring(1)
    }
    if (!phone.startsWith("90")) {
      phone = "90" + phone
    }

    const params = new URLSearchParams({
      usercode: NETGSM_USERCODE,
      password: NETGSM_PASSWORD,
      gsmno: phone,
      message: message,
      msgheader: NETGSM_HEADER,
      dil: "TR",
    })

    const response = await fetch(
      `https://api.netgsm.com.tr/sms/send/get/?${params.toString()}`
    )
    const result = await response.text()

    const success = result.startsWith("00")

    await prisma.sMSLog.create({
      data: {
        to: phone,
        body: message,
        status: success ? "sent" : "failed",
        provider: "netgsm",
      },
    })

    if (!success) {
      console.error("Netgsm SMS hatasi:", result)
    }

    return success
  } catch (error) {
    console.error("SMS gonderim hatasi:", error)

    const phone = to.replace(/\D/g, "")
    await prisma.sMSLog.create({
      data: {
        to: phone,
        body: message,
        status: "error",
        provider: "netgsm",
      },
    }).catch((e) => console.error("SMS log hatasi:", e))

    return false
  }
}

// ─── SMS TEMPLATES ─────────────────────────────────────

export const SMS_TEMPLATES = {
  orderConfirmed: (orderNo: string) =>
    `Yasemin's Atelier: #${orderNo} siparisiniiz alindi! Hazirliklara basliyoruz. Detaylar icin: yaseminsatelier.com/hesabim`,

  orderOutForDelivery: (orderNo: string) =>
    `Yasemin's Atelier: #${orderNo} siparisiniz yolda! Teslimat suresince telefonunuzu acik tutun. Iyi gunlerde kullanin!`,

  orderDelivered: (orderNo: string) =>
    `Yasemin's Atelier: #${orderNo} siparisiniz teslim edildi! Deneyiminizi paylasmaniz bizi cok mutlu eder. Afiyet olsun!`,

  bookingConfirmed: (service: string, date: string) =>
    `Yasemin's Atelier: ${service} rezervasyonunuz ${date} tarihine alinmistir. Onay icin sizinle iletisime gececegiz.`,

  bookingReminder: (service: string, time: string) =>
    `Yasemin's Atelier: Hatirlatma! Yarin ${time} - ${service} rezervasyonunuz var. Hazirliklari tamamladik, sizi bekliyoruz!`,

  bookingApproved: (service: string) =>
    `Yasemin's Atelier: ${service} rezervasyonunuz onaylandi! Detaylar e-posta adresinize gonderildi. Gorusmek uzere!`,
}
