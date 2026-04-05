import type { Metadata } from "next";
import CorporateHero from "@/components/site/corporate/CorporateHero";
import CorporateBenefits from "@/components/site/corporate/CorporateBenefits";
import CorporateUseCases from "@/components/site/corporate/CorporateUseCases";
import CorporatePricing from "@/components/site/corporate/CorporatePricing";
import CorporateCTA from "@/components/site/corporate/CorporateCTA";

export const metadata: Metadata = {
  title: "Kurumsal | B2B Çözümleri",
  description:
    "Yasemin's Atelier kurumsal hizmetleri: özel fiyatlandırma, kurumsal fatura, toplu sipariş ve ekip yönetimi. İş dünyasına layık gastronomi deneyimi.",
};

export default function KurumsalPage() {
  return (
    <>
      <CorporateHero />
      <CorporateBenefits />
      <CorporateUseCases />
      <CorporatePricing />
      <CorporateCTA />
    </>
  );
}
