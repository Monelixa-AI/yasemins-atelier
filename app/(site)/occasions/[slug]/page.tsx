import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { occasions } from "@/lib/data/occasions";
import { products } from "@/lib/data/products";
import {
  OccasionHero,
  OccasionProducts,
  OccasionTips,
  OccasionFAQ,
  OccasionBlog,
  OccasionCTA,
} from "@/components/site/occasions";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const occ = occasions.find((o) => o.slug === params.slug);
  if (!occ) return {};
  return { title: occ.seoTitle, description: occ.seoDesc };
}

export default function OccasionDetailPage({ params }: Props) {
  const occasion = occasions.find((o) => o.slug === params.slug);
  if (!occasion) notFound();

  const occasionProducts = products.filter((p) =>
    p.occasions.includes(occasion.dbSlug)
  );

  return (
    <>
      <OccasionHero occasion={occasion} />
      <OccasionProducts products={occasionProducts} occasionName={occasion.name} />
      <OccasionTips tips={occasion.tips} />
      <OccasionFAQ faqs={occasion.faqs} />
      <OccasionBlog relatedBlogSlugs={occasion.relatedBlogSlugs} />
      <OccasionCTA colorBg={occasion.colorBg} />
    </>
  );
}
