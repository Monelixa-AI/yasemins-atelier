"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/data/blog";
import Badge from "@/components/site/ui/Badge";
import SafeImage from "@/components/site/ui/SafeImage";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link href={`/journal/${post.slug}`} className="block">
        <div className="overflow-hidden">
          <SafeImage
            src={post.coverImage}
            alt={post.title}
            aspectRatio="aspect-[16/9]"
            fallbackLabel={post.title}
          />
        </div>
      </Link>

      <div className="pt-4">
        <Badge variant="occasion" className="bg-terracotta/10 text-terracotta">
          {post.category}
        </Badge>

        <Link href={`/journal/${post.slug}`}>
          <h3 className="font-heading text-[22px] text-brown-deep mt-2 leading-snug group-hover:text-terracotta transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="font-body text-[13px] text-brown-mid mt-2 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="font-body text-xs text-gold">{post.publishedAt}</span>
          <span className="text-gold/50">·</span>
          <span className="font-body text-xs text-gold">
            {post.readingMins} dk okuma
          </span>
        </div>
      </div>
    </motion.article>
  );
}

interface JournalGridProps {
  posts: BlogPost[];
}

export default function JournalGrid({ posts }: JournalGridProps) {
  const featured = posts.find((p) => p.isFeatured);
  const others = posts.filter((p) => !p.isFeatured);

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Featured post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16 overflow-hidden"
          >
            <Link href={`/journal/${featured.slug}`}>
              <SafeImage
                src={featured.coverImage}
                alt={featured.title}
                aspectRatio="aspect-[16/9] lg:aspect-auto lg:h-full"
                fallbackLabel={featured.title}
                className="w-full min-h-[280px]"
              />
            </Link>
            <div className="bg-white p-8 lg:p-10 flex flex-col justify-center">
              <Badge variant="occasion">Öne Çıkan Yazı</Badge>
              <Link href={`/journal/${featured.slug}`}>
                <h2 className="font-heading text-3xl lg:text-4xl text-brown-deep mt-3 hover:text-terracotta transition-colors">
                  {featured.title}
                </h2>
              </Link>
              <p className="font-body text-[15px] text-brown-mid mt-4 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="font-body text-xs text-gold">
                  {featured.publishedAt}
                </span>
                <span className="text-gold/50">·</span>
                <span className="font-body text-xs text-gold">
                  {featured.readingMins} dk okuma
                </span>
              </div>
              <Link
                href={`/journal/${featured.slug}`}
                className="inline-block mt-6 font-body text-sm text-terracotta hover:text-terracotta-dark transition-colors underline underline-offset-4"
              >
                Devamını Oku →
              </Link>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load more placeholder */}
        <div className="text-center mt-12">
          <button
            disabled
            className="font-body text-sm text-brown-mid/50 border border-gold-light px-8 py-3 rounded-none cursor-not-allowed"
          >
            Daha Fazla Yükle
          </button>
        </div>
      </div>
    </section>
  );
}
