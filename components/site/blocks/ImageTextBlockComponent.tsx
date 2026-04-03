import Link from "next/link";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";
import type { ImageTextBlock } from "@/types/page-blocks";

export default function ImageTextBlockComponent({
  block,
}: {
  block: ImageTextBlock;
}) {
  const imageLeft = block.imagePosition === "left";

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 lg:px-8">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
          imageLeft ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        <ImagePlaceholder
          aspectRatio="aspect-[4/3]"
          label={block.imageAlt ?? block.title}
          className="w-full"
        />
        <div>
          <h2 className="font-heading text-3xl text-brown-deep">{block.title}</h2>
          <p className="font-body text-[15px] text-brown-mid leading-[1.9] mt-4">
            {block.content}
          </p>
          {block.ctaText && block.ctaHref && (
            <Link
              href={block.ctaHref}
              className="inline-block mt-6 font-body text-sm text-terracotta underline underline-offset-4 hover:text-terracotta-dark transition-colors"
            >
              {block.ctaText} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
