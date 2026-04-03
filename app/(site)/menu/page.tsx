import type { Metadata } from "next";
import { MenuHero, MenuLayout } from "@/components/site/menu";
import DeliveryNotice from "@/components/site/ui/DeliveryNotice";

export const metadata: Metadata = {
  title: "Menü | Tüm Ürünler",
  description: "El yapımı mezeler, börekler, tatlılar ve daha fazlası.",
};

export default function MenuPage() {
  return (
    <>
      <MenuHero />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        <DeliveryNotice type="fresh" />
      </div>
      <MenuLayout />
    </>
  );
}
