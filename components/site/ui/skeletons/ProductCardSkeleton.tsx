export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-[4/5] bg-[#E8D5A3]/40 rounded-lg" />

      {/* Text content */}
      <div className="mt-3 space-y-2">
        {/* Product name */}
        <div className="h-4 bg-[#E8D5A3]/40 rounded w-3/4" />
        {/* Subtitle / variant */}
        <div className="h-3 bg-[#E8D5A3]/40 rounded w-1/2" />
        {/* Price */}
        <div className="h-5 bg-[#E8D5A3]/40 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}
