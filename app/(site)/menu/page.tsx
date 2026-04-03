import type { Metadata } from "next";
import { MenuHero, MenuLayout } from "@/components/site/menu";

export const metadata: Metadata = {
  title: "Menü | Tüm Ürünler",
  description: "El yapımı mezeler, börekler, tatlılar ve daha fazlası.",
};

export default function MenuPage() {
  return (
    <>
      <MenuHero />
      <MenuLayout />
    </>
  );
}
