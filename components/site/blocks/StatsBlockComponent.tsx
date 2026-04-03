import type { StatsBlock } from "@/types/page-blocks";

export default function StatsBlockComponent({ block }: { block: StatsBlock }) {
  return (
    <div className="py-12 bg-cream">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-0">
          {block.items.map((item, i) => (
            <div key={item.label} className="flex items-center">
              {i > 0 && (
                <div className="w-px h-12 bg-gold/30 mx-8 hidden sm:block" />
              )}
              <div className="text-center px-4 py-2">
                <p className="font-heading text-4xl font-bold text-terracotta">
                  {item.value}
                </p>
                <p className="font-body text-xs text-brown-mid mt-1">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
