import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { naturelCategories, naturelProducts } from "@/lib/data/naturel-products";
import NaturelProductCard from "@/components/site/naturel/NaturelProductCard";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return naturelCategories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = naturelCategories.find((c) => c.slug === params.slug);
  if (!cat) return {};
  return { title: `${cat.name} | Naturel | Yasemin's Atelier`, description: cat.description };
}

export default function NaturelCategoryPage({ params }: Props) {
  const category = naturelCategories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const products = naturelProducts.filter((p) => p.categoryId === category.id);

  return (
    <>
      <section className="py-16" style={{ backgroundColor: category.colorBg }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-4xl block mb-3">{category.emoji}</span>
          <h1 className="font-heading text-5xl text-white">{category.name}</h1>
          <p className="font-body text-base text-white/70 mt-3">{category.description}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <NaturelProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center font-body text-sm text-brown-mid py-12">Bu kategoride henüz ürün yok.</p>
        )}
      </div>
    </>
  );
}
