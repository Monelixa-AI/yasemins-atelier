import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { COMPANY_INFO } from "./content";
import { POLICY_VERSIONS } from "./content";

/**
 * Generate a legally compliant mesafeli satis sozlesmesi for an order
 * and persist it in the SalesContract table.
 */
export async function generateSalesContract(
  orderId: string,
  customerIp: string
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      address: true,
      user: true,
    },
  });

  if (!order) throw new Error("Siparis bulunamadi.");

  const now = new Date();
  const contractNo = `SC-${order.orderNumber}-${format(now, "yyyyMMdd")}`;

  const buyerName = order.user?.name ?? "Misafir Musteri";
  const buyerEmail = order.user?.email ?? order.guestEmail ?? "-";
  const buyerPhone = order.user?.phone ?? order.guestPhone ?? "-";
  const deliveryAddress = order.address
    ? `${order.address.addressLine1}${order.address.addressLine2 ? ", " + order.address.addressLine2 : ""}, ${order.address.district}/${order.address.city}`
    : "-";

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="border:1px solid #ccc;padding:6px">${item.name}${item.variantName ? " - " + item.variantName : ""}</td>
          <td style="border:1px solid #ccc;padding:6px;text-align:center">${item.quantity}</td>
          <td style="border:1px solid #ccc;padding:6px;text-align:right">${Number(item.price).toFixed(2)} TL</td>
          <td style="border:1px solid #ccc;padding:6px;text-align:right">${Number(item.total).toFixed(2)} TL</td>
        </tr>`
    )
    .join("\n");

  const content = `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><title>Mesafeli Satis Sozlesmesi - ${contractNo}</title></head>
<body style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;font-size:14px;color:#333">
<h1 style="text-align:center;font-size:18px">MESAFELI SATIS SOZLESMESI</h1>
<p style="text-align:center;font-size:12px;color:#666">Sozlesme No: ${contractNo} | Tarih: ${format(now, "dd.MM.yyyy HH:mm")}</p>

<h2 style="font-size:15px">MADDE 1 - SATICI BILGILERI</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
  <tr><td style="padding:4px;font-weight:bold;width:180px">Unvan</td><td style="padding:4px">${COMPANY_INFO.legalName} (${COMPANY_INFO.name})</td></tr>
  <tr><td style="padding:4px;font-weight:bold">Adres</td><td style="padding:4px">${COMPANY_INFO.address}</td></tr>
  <tr><td style="padding:4px;font-weight:bold">E-posta</td><td style="padding:4px">${COMPANY_INFO.email}</td></tr>
  <tr><td style="padding:4px;font-weight:bold">Telefon</td><td style="padding:4px">${COMPANY_INFO.phone}</td></tr>
  <tr><td style="padding:4px;font-weight:bold">Vergi No</td><td style="padding:4px">${COMPANY_INFO.taxNo}</td></tr>
</table>

<h2 style="font-size:15px">MADDE 2 - ALICI BILGILERI</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">
  <tr><td style="padding:4px;font-weight:bold;width:180px">Ad Soyad</td><td style="padding:4px">${buyerName}</td></tr>
  <tr><td style="padding:4px;font-weight:bold">E-posta</td><td style="padding:4px">${buyerEmail}</td></tr>
  <tr><td style="padding:4px;font-weight:bold">Telefon</td><td style="padding:4px">${buyerPhone}</td></tr>
  <tr><td style="padding:4px;font-weight:bold">Teslimat Adresi</td><td style="padding:4px">${deliveryAddress}</td></tr>
  <tr><td style="padding:4px;font-weight:bold">IP Adresi</td><td style="padding:4px">${customerIp}</td></tr>
</table>

<h2 style="font-size:15px">MADDE 3 - SOZLESME KONUSU URUNLER</h2>
<table style="width:100%;border-collapse:collapse;margin-bottom:8px">
  <thead>
    <tr style="background:#f5f5f5">
      <th style="border:1px solid #ccc;padding:6px;text-align:left">Urun</th>
      <th style="border:1px solid #ccc;padding:6px;text-align:center">Adet</th>
      <th style="border:1px solid #ccc;padding:6px;text-align:right">Birim Fiyat</th>
      <th style="border:1px solid #ccc;padding:6px;text-align:right">Toplam</th>
    </tr>
  </thead>
  <tbody>${itemRows}</tbody>
</table>
<table style="width:100%;margin-bottom:16px">
  <tr><td style="text-align:right;padding:4px">Ara Toplam: <strong>${Number(order.subtotal).toFixed(2)} TL</strong></td></tr>
  <tr><td style="text-align:right;padding:4px">Teslimat Ucreti: <strong>${Number(order.deliveryFee).toFixed(2)} TL</strong></td></tr>
  ${Number(order.discount) > 0 ? `<tr><td style="text-align:right;padding:4px">Indirim: <strong>-${Number(order.discount).toFixed(2)} TL</strong></td></tr>` : ""}
  <tr><td style="text-align:right;padding:4px;font-size:16px">Genel Toplam (KDV Dahil): <strong>${Number(order.total).toFixed(2)} TL</strong></td></tr>
</table>

<h2 style="font-size:15px">MADDE 4 - TESLIMAT BILGILERI</h2>
<p>Siparis, belirtilen teslimat adresine ${order.deliveryDate ? format(order.deliveryDate, "dd.MM.yyyy") : "en gec 3 is gunu icinde"} tarihinde teslim edilecektir. Teslimat ucretleri yukaridaki tabloda belirtilmistir. Tum fiyatlar KDV dahildir.</p>

<h2 style="font-size:15px">MADDE 5 - CAYMA HAKKI</h2>
<p>6502 sayili Tuketicinin Korunmasi Hakkinda Kanun ve Mesafeli Sozlesmeler Yonetmeligi uyarinca, tuketici 14 gun icinde herhangi bir gerekce gostermeksizin sozlesmeden cayma hakkina sahiptir.</p>
<p><strong>Istisna:</strong> Cayma hakki, niteligi itibariyle iade edilemeyecek, hizla bozulma veya son kullanma tarihi gecme ihtimali olan mallarda (gida urunleri) uygulanmaz (Yonetmelik Madde 15/1-c). Satin alinan urunlerin buyuk cogunlugu gida niteligi tasidigindan, bu istisna kapsamindadir.</p>

<h2 style="font-size:15px">MADDE 6 - UYUSMAZLIK COZUMU</h2>
<p>Bu sozlesmeden dogan uyusmazliklarda Tuketici Hakem Heyetleri ve Tuketici Mahkemeleri yetkilidir. Bakanlik tarafindan ilan edilen deger sinirinin altindaki uyusmazliklarda ilceye/ile gore yetkili tuketici hakem heyetine, ustundeki uyusmazliklarda Istanbul Tuketici Mahkemelerine basvurulabilir.</p>

<p style="margin-top:24px;font-size:12px;color:#666">Bu sozlesme, ${format(now, "dd.MM.yyyy")} tarihinde elektronik ortamda olusturulmus ve taraflarca kabul edilmistir.</p>
</body>
</html>`.trim();

  const contract = await prisma.salesContract.create({
    data: {
      orderId,
      contractNo,
      content,
      version: POLICY_VERSIONS.salesContract,
      customerIp,
    },
  });

  return contract;
}
