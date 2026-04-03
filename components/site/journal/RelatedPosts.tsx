"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/lib/data/blog";
import Badge from "@/components/site/ui/Badge";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";
import SectionHeader from "@/components/site/ui/SectionHeader";

interface RelatedPostsProps {
  currentSlug: string;
  category: string;
}

export default function RelatedPosts({
  currentSlug,
  category,
}: RelatedPostsProps) {
  const related = blogPosts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, 3);

  if (related.length === 0) {
    const fallback = blogPosts
      .filter((p) => p.slug !== currentSlug)
      .slice(0, 3);
    if (fallback.length === 0) return null;
    return <RelatedGrid posts={fallback} />;
  }

  return <RelatedGrid posts={related} />;
}

function RelatedGrid({
  posts,
}: {
  posts: typeof blogPosts;
}) {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="Okumaya Devam" title="Bunları da Okuyun" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/journal/${post.slug}`}>
                <ImagePlaceholder
                  aspectRatio="aspect-[16/9]"
                  label={post.title}
                />
              </Link>
              <div className="pt-4">
                <Badge
                  variant="occasion"
                  className="bg-terracotta/10 text-terracotta"
                >
                  {post.category}
                </Badge>
                <Link href={`/journal/${post.slug}`}>
                  <h3 className="font-heading text-[22px] text-brown-deep mt-2 leading-snug group-hover:text-terracotta transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-body text-xs text-gold">
                    {post.publishedAt}
                  </span>
                  <span className="text-gold/50">·</span>
                  <span className="font-body text-xs text-gold">
                    {post.readingMins} dk okuma
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
