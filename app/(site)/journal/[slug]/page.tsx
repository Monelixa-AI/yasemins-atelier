import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/data/blog";
import { PostHero, PostContent, RelatedPosts } from "@/components/site/journal";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <>
      <PostHero post={post} />
      <PostContent post={post} />
      <RelatedPosts currentSlug={post.slug} category={post.category} />
    </>
  );
}
