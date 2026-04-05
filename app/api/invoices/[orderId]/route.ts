import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generateInvoiceNo } from "@/lib/invoice"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/invoice/InvoicePDF"
import React from "react"

export async function GET(
  _request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: true,
        user: { select: { name: true, email: true, companyName: true, taxNumber: true } },
        address: true,
        invoice: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    if (order.paymentStatus !== "PAID" && order.paymentStatus !== "PARTIALLY_REFUNDED") {
      return NextResponse.json({ error: "Fatura sadece ödenmiş siparişler için oluşturulabilir" }, { status: 400 })
    }

    let invoice = order.invoice

    if (!invoice) {
      const subtotal = order.subtotal.toNumber()
      const taxRate = 0.08
      const taxAmount = subtotal * taxRate

      invoice = await prisma.invoice.create({
        data: {
          orderId: order.id,
          invoiceNo: generateInvoiceNo(),
          totalAmount: order.total,
          taxAmount,
          taxRate,
          billingName: order.user?.name || order.guestEmail || "Misafir",
          billingEmail: order.user?.email || order.guestEmail || "",
          billingAddress: order.address
            ? `${order.address.addressLine1}, ${order.address.district}, ${order.address.city}`
            : null,
          companyName: order.user?.companyName || null,
          taxNumber: order.user?.taxNumber || null,
        },
      })
    }

    const subtotal = order.subtotal.toNumber()
    const taxRate = invoice.taxRate.toNumber()
    const taxAmount = invoice.taxAmount.toNumber()

    const pdfData = {
      invoiceNo: invoice.invoiceNo,
      issuedAt: invoice.issuedAt.toLocaleDateString("tr-TR"),
      billingName: invoice.billingName,
      billingEmail: invoice.billingEmail,
      billingAddress: invoice.billingAddress,
      companyName: invoice.companyName,
      taxNumber: invoice.taxNumber,
      items: order.items.map((item) => ({
        name: item.name,
        variantName: item.variantName,
        quantity: item.quantity,
        price: item.price.toNumber(),
        total: item.total.toNumber(),
      })),
      subtotal,
      deliveryFee: order.deliveryFee.toNumber(),
      discount: order.discount.toNumber(),
      taxRate,
      taxAmount,
      total: order.total.toNumber(),
    }

    const buffer = await renderToBuffer(
      React.createElement(InvoicePDF, { data: pdfData }) as any
    )

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="fatura-${order.orderNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Fatura hatası:", error)
    return NextResponse.json({ error: "Fatura oluşturulamadı" }, { status: 500 })
  }
}
