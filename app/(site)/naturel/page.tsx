import type { Metadata } from "next";
import {
  NaturelHero,
  NaturelTrustBar,
  NaturelManifesto,
  NaturelCategories,
  NaturelFeatured,
  NaturelChildrenSection,
  NaturelIngredients,
  NaturelSubscription,
  NaturelTestimonials,
  NaturelCTA,
} from "@/components/site/naturel";

export const metadata: Metadata = {
  title: "Naturel | El Yapımı & Katkısız | Yasemin's Atelier",
  description: "Katkı maddesi içermeyen, el yapımı atıştırmalıklar. Granola, kuruyemiş, çocuk serisi ve doğal soslar. Türkiye geneli kargo.",
};

export default function NaturelPage() {
  return (
    <>
      <NaturelHero />
      <NaturelTrustBar />
      <NaturelManifesto />
      <NaturelCategories />
      <NaturelFeatured />
      <NaturelChildrenSection />
      <NaturelIngredients />
      <NaturelSubscription />
      <NaturelTestimonials />
      <NaturelCTA />
    </>
  );
}
