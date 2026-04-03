import Link from "next/link";
import type { CTABlock } from "@/types/page-blocks";

export default function CTABlockComponent({ block }: { block: CTABlock }) {
  const isDark = block.variant === "dark";

  return (
    <div className={`py-16 text-center ${isDark ? "bg-brown-deep" : "bg-terracotta"}`}>
      <div className="max-w-2xl mx-auto px-4">
        <h2
          className={`font-heading text-3xl lg:text-4xl ${
            isDark ? "text-white" : "text-white"
          }`}
        >
          {block.title}
        </h2>
        {block.subtitle && (
          <p className="font-body text-base text-white/80 mt-3">
            {block.subtitle}
          </p>
        )}
        <Link
          href={block.buttonHref}
          className={`inline-block mt-8 font-body text-sm font-medium px-8 py-4 rounded-none transition-colors duration-300 ${
            isDark
              ? "bg-terracotta text-white hover:bg-terracotta-dark"
              : "bg-white text-terracotta hover:bg-cream"
          }`}
        >
          {block.buttonText}
        </Link>
      </div>
    </div>
  );
}
