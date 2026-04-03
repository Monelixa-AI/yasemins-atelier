import type { Metadata } from "next";
import {
  AtelierHero,
  AtelierBio,
  AtelierTimeline,
  AtelierCertificates,
  AtelierPhilosophy,
  AtelierMedia,
  AtelierContact,
} from "@/components/site/atelier";

export const metadata: Metadata = {
  title: "Atelier | Yasemin'in Hikayesi",
  description:
    "Gastronomi şefi Yasemin'in hikayesi, eğitimi, sertifikaları ve malzeme felsefesi.",
};

export default function AtelierPage() {
  return (
    <>
      <AtelierHero />
      <AtelierBio />
      <AtelierTimeline />
      <AtelierCertificates />
      <AtelierPhilosophy />
      <AtelierMedia />
      <AtelierContact />
    </>
  );
}
