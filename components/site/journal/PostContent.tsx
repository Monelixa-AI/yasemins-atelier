"use client";

import type { BlogPost } from "@/lib/data/blog";
import PostSidebar from "./PostSidebar";

export default function PostContent({ post }: { post: BlogPost }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
          {/* Main content */}
          <article>
            {/* Lead paragraph */}
            <p className="font-body text-xl text-brown-mid font-medium leading-[1.8] mb-8">
              {post.excerpt}
            </p>

            {/* Content body */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-heading prose-headings:text-brown-deep prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-p:font-body prose-p:text-brown-deep prose-p:leading-[1.9] prose-p:text-base
                prose-blockquote:border-l-terracotta prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-brown-mid prose-blockquote:font-heading prose-blockquote:text-xl
                prose-strong:text-brown-deep
                prose-a:text-terracotta prose-a:underline-offset-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share buttons */}
            <div className="mt-12 pt-8 border-t border-gold-light">
              <p className="font-body text-sm text-brown-mid mb-4">
                Bu yazıyı paylaş:
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs border border-gold-light text-brown-mid px-4 py-2 rounded-none hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  WhatsApp
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="font-body text-xs border border-gold-light text-brown-mid px-4 py-2 rounded-none hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  Linki Kopyala
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <PostSidebar post={post} />
        </div>
      </div>
    </section>
  );
}
