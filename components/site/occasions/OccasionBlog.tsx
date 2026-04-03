"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { blogPosts } from "@/lib/data/blog";
import SectionHeader from "@/components/site/ui/SectionHeader";
import Badge from "@/components/site/ui/Badge";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

export default function OccasionBlog({ relatedBlogSlugs }: { relatedBlogSlugs: string[] }) {
  const posts = blogPosts.filter((p) => relatedBlogSlugs.includes(p.slug));
  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="Blog" title="Bu Occasion İçin Okumalar" />

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
                <ImagePlaceholder aspectRatio="aspect-[16/9]" label={post.title} />
              </Link>
              <div className="pt-4">
                <Badge variant="occasion">{post.category}</Badge>
                <Link href={`/journal/${post.slug}`}>
                  <h3 className="font-heading text-[22px] text-brown-deep mt-2 group-hover:text-terracotta transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="font-body text-xs text-gold mt-2">
                  {post.publishedAt} · {post.readingMins} dk okuma
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
