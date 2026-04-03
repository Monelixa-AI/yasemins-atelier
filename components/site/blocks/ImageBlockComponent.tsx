import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";
import type { ImageBlock } from "@/types/page-blocks";

export default function ImageBlockComponent({ block }: { block: ImageBlock }) {
  return (
    <div className={`py-8 ${block.fullWidth ? "" : "max-w-4xl mx-auto px-4"}`}>
      <ImagePlaceholder
        aspectRatio="aspect-[16/9]"
        label={block.alt}
        className="w-full"
      />
      {block.caption && (
        <p className="font-body text-xs text-brown-mid text-center mt-3 italic">
          {block.caption}
        </p>
      )}
    </div>
  );
}
