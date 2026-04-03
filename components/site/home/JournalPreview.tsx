"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/site/ui/SectionHeader";
import Badge from "@/components/site/ui/Badge";

const posts = [
  {
    slug: "sonbahar-meze-kozlenmis-patlican",
    title: "Sonbaharın En İyi Mezesi: Közlenmiş Patlıcan",
    category: "Tarifler",
    date: "28 Mart 2026",
    readTime: "5 dk",
    excerpt:
      "Közlenmiş patlıcanın o eşsiz dumanımsı aromasını sofralarınıza taşımanın en kolay yolu. Şefin püf noktaları ile birlikte.",
  },
  {
    slug: "misafir-agirlama-sofra-kurma",
    title: "Misafir Ağırlama: Sofra Kurmanın 7 Altın Kuralı",
    category: "Sofra Rehberi",
    date: "22 Mart 2026",
    readTime: "7 dk",
    excerpt:
      "Misafirlerinizi etkilemenin sırrı detaylarda gizli. Sofra düzeninden servis sırasına, her şeyi bu yazıda bulabilirsiniz.",
  },
  {
    slug: "istanbul-pazarlarinda-taze-malzeme",
    title: "İstanbul Pazarlarında Taze Malzeme Rehberi",
    category: "Pazar Notları",
    date: "15 Mart 2026",
    readTime: "6 dk",
    excerpt:
      "Kadıköy'den Beşiktaş'a, İstanbul'un en iyi semt pazarlarında taze ve yerel malzeme bulmanın yolları.",
  },
];

export default function JournalPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Blog"
          title="Atelier Journal"
          subtitle="Yasemin'in mutfak notları, mevsim hikayeleri"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              {/* Image placeholder */}
              <div className="aspect-[16/9] bg-gold-light" />

              <div className="pt-4">
                <Badge variant="occasion">{post.category}</Badge>

                <Link href={`/journal/${post.slug}`}>
                  <h3 className="font-heading text-[22px] text-brown-deep mt-2 leading-snug group-hover:text-terracotta transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-body text-xs text-gold">
                    {post.date}
                  </span>
                  <span className="text-gold/50">·</span>
                  <span className="font-body text-xs text-gold">
                    {post.readTime} okuma
                  </span>
                </div>

                <p className="font-body text-[13px] text-brown-mid mt-3 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <Link
                  href={`/journal/${post.slug}`}
                  className="inline-block mt-3 font-body text-sm text-terracotta hover:text-terracotta-dark transition-colors"
                >
                  Devamını Oku →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/journal"
            className="font-body text-sm text-terracotta hover:text-terracotta-dark transition-colors underline underline-offset-4"
          >
            Tüm Yazıları Gör →
          </Link>
        </div>
      </div>
    </section>
  );
}
