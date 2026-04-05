import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";
import { sendEmail } from "@/lib/email";
import React from "react";
import NewsletterConfirmation from "@/emails/NewsletterConfirmation";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Gecerli bir e-posta girin" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing && existing.confirmedAt) {
      return NextResponse.json({ message: "Bu e-posta zaten kayitli." }, { status: 200 });
    }

    if (!existing) {
      await prisma.newsletterSubscriber.create({
        data: { email, source: "website", confirmedAt: null },
      });
    }

    // Generate confirmation token and store in Settings
    const token = randomUUID();

    await prisma.setting.upsert({
      where: { key: `newsletter_confirm_${token}` },
      update: { value: { email } },
      create: { key: `newsletter_confirm_${token}`, value: { email } },
    });

    // Send confirmation email
    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://yaseminsatelier.com"}/api/newsletter/confirm?token=${token}`;

    const template = React.createElement(NewsletterConfirmation, { confirmUrl });

    await sendEmail(
      email,
      "Bulten Aboneliginizi Onaylayin",
      template
    );

    return NextResponse.json(
      { message: "Onay e-postasi gonderildi. Lutfen e-postanizi kontrol edin." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}
