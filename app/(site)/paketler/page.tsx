import type { Metadata } from "next";
import { bundles } from "@/lib/data/bundles";
import BundleCard from "@/components/site/bundle/BundleCard";
import SectionHeader from "@/components/site/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Paketler | Avantajlı Setler",
  description: "Avantajlı paket setleri ile tasarruf edin.",
};

export default function PaketlerPage() {
  return (
    <div className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Avantajlı Setler"
          title="Paketler"
          subtitle="Tek tek almak yerine paketi seçin, hem tasarruf edin hem kolay sipariş verin."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.filter((b) => b.isActive).map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </div>
    </div>
  );
}
