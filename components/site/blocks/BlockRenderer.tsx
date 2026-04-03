import type { PageBlock } from "@/types/page-blocks";
import TextBlockComponent from "./TextBlockComponent";
import ImageBlockComponent from "./ImageBlockComponent";
import ImageTextBlockComponent from "./ImageTextBlockComponent";
import CTABlockComponent from "./CTABlockComponent";
import FAQBlockComponent from "./FAQBlockComponent";
import StatsBlockComponent from "./StatsBlockComponent";

export default function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return <TextBlockComponent key={i} block={block} />;
          case "image":
            return <ImageBlockComponent key={i} block={block} />;
          case "image_text":
            return <ImageTextBlockComponent key={i} block={block} />;
          case "cta":
            return <CTABlockComponent key={i} block={block} />;
          case "faq":
            return <FAQBlockComponent key={i} block={block} />;
          case "stats":
            return <StatsBlockComponent key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
