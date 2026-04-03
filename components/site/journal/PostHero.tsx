import Link from "next/link";
import type { BlogPost } from "@/lib/data/blog";
import Badge from "@/components/site/ui/Badge";
import SafeImage from "@/components/site/ui/SafeImage";

export default function PostHero({ post }: { post: BlogPost }) {
  return (
    <section className="bg-brown-deep">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav className="font-body text-xs text-white/50">
          <Link href="/journal" className="hover:text-white/80 transition-colors">
            Journal
          </Link>
          {" / "}
          <span className="text-white/40">{post.category}</span>
          {" / "}
          <span className="text-white/40">{post.title}</span>
        </nav>
      </div>

      {/* Hero image */}
      <div className="relative">
        <SafeImage
          src={post.coverImage}
          alt={post.title}
          aspectRatio="aspect-[21/9]"
          fallbackLabel={post.title}
          className="w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-deep via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <Badge variant="occasion">{post.category}</Badge>
            <h1 className="font-heading text-3xl lg:text-5xl text-white mt-3 max-w-3xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="font-body text-sm text-white/70">
                {post.publishedAt}
              </span>
              <span className="text-white/30">·</span>
              <span className="font-body text-sm text-white/70">
                {post.readingMins} dk okuma
              </span>
              <span className="text-white/30">·</span>
              <span className="font-body text-sm text-white/70">
                Yasemin Çiftçioğlu
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
