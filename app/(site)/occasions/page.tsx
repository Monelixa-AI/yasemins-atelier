import type { Metadata } from "next";
import { occasions } from "@/lib/data/occasions";
import { OccasionsHero, OccasionsGrid } from "@/components/site/occasions";

export const metadata: Metadata = {
  title: "Occasions | Tüm Özel Anlar",
  description: "Misafir ağırlama, doğum günü, iş yemeği ve daha fazlası için özel lezzetler.",
};

export default function OccasionsPage() {
  return (
    <>
      <OccasionsHero />
      <OccasionsGrid occasions={occasions} />
    </>
  );
}
