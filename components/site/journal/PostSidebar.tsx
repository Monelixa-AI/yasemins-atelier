"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog";

const relatedProducts = [
  { name: "Klasik Meze Tabağı", price: "280₺", slug: "klasik-meze-tabagi" },
  { name: "Ev Yapımı Su Böreği", price: "320₺", slug: "ev-yapimi-su-boregi" },
  { name: "Misafir Ağırlama Seti", price: "680₺", slug: "misafir-agirlama-seti" },
];

export default function PostSidebar({ post }: { post: BlogPost }) {
  const [email, setEmail] = useState("");

  return (
    <aside className="space-y-6 lg:sticky lg:top-[100px]">
      {/* Author card */}
      <div className="bg-cream p-6 border border-gold-light">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-terracotta flex items-center justify-center shrink-0">
            <span className="font-heading text-xl text-white">Y</span>
          </div>
          <div>
            <p className="font-heading text-lg text-brown-deep">
              Yasemin Çiftçioğlu
            </p>
            <p className="font-body text-xs text-gold">
              Gastronomi Şefi & Kurucu
            </p>
          </div>
        </div>
        <p className="font-body text-[13px] text-brown-mid mt-3 leading-relaxed">
          İstanbul&apos;un köklü mutfak geleneğini çağdaş gastronomi
          bilimiyle harmanlayan bir şef.
        </p>
        <a
          href="https://instagram.com/yaseminsatelier"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 font-body text-xs text-terracotta hover:text-terracotta-dark transition-colors"
        >
          @yaseminsatelier →
        </a>
      </div>

      {/* Related products */}
      <div className="bg-cream p-6 border border-gold-light">
        <h4 className="font-body text-xs font-medium uppercase tracking-[0.15em] text-gold mb-4">
          Bu Yazıyla İlgili Lezzetler
        </h4>
        <div className="space-y-4">
          {relatedProducts.map((p) => (
            <div key={p.slug} className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 bg-gold-light" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-brown-deep truncate">
                  {p.name}
                </p>
                <p className="font-heading text-sm font-bold text-terracotta">
                  {p.price}
                </p>
              </div>
              <Link
                href={`/menu/${p.slug}`}
                className="font-body text-[10px] text-terracotta shrink-0"
              >
                Sipariş →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-cream p-6 border border-gold-light">
        <h4 className="font-body text-xs font-medium uppercase tracking-[0.15em] text-gold mb-4">
          Etiketler
        </h4>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-body text-xs bg-terracotta-light text-terracotta-dark px-3 py-1.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-terracotta p-6 text-white">
        <h4 className="font-heading text-lg">Journal&apos;a abone ol</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="flex mt-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta"
            className="flex-1 bg-white/10 border border-white/20 px-3 py-2 font-body text-xs text-white placeholder:text-white/40 rounded-none focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-brown-deep px-3 py-2 text-white font-body text-xs rounded-none hover:bg-brown-mid transition-colors"
          >
            Abone Ol
          </button>
        </form>
      </div>
    </aside>
  );
}
