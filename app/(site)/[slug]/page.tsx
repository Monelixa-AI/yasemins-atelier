import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { staticPages } from "@/lib/data/pages";
import BlockRenderer from "@/components/site/blocks/BlockRenderer";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return staticPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = staticPages.find((p) => p.slug === params.slug);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDesc,
  };
}

export default function StaticPage({ params }: Props) {
  const page = staticPages.find((p) => p.slug === params.slug);
  if (!page) notFound();

  return (
    <>
      {/* Page hero */}
      <section className="bg-cream py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl text-brown-deep">{page.title}</h1>
        </div>
      </section>

      {/* Blocks */}
      <BlockRenderer blocks={page.blocks} />
    </>
  );
}
