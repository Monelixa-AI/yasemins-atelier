import type { TextBlock } from "@/types/page-blocks";

export default function TextBlockComponent({ block }: { block: TextBlock }) {
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`py-8 max-w-3xl mx-auto px-4 ${alignment[block.alignment ?? "left"]}`}>
      <div
        className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-brown-deep prose-p:font-body prose-p:text-brown-mid prose-p:leading-[1.9]"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </div>
  );
}
