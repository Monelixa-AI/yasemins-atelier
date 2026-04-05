import type { Metadata } from "next";
import CorporateCTA from "@/components/site/corporate/CorporateCTA";

export const metadata: Metadata = {
  title: "Kurumsal Başvuru | Yasemin's Atelier",
  description:
    "Kurumsal hesap başvurusu yapın. Özel fiyatlandırma, fatura çözümleri ve kişiselleştirilmiş hizmet avantajlarından yararlanın.",
};

export default function KurumsalBasvuruPage() {
  return (
    <div className="min-h-screen bg-[#3D1A0A]">
      <CorporateCTA />
    </div>
  );
}
