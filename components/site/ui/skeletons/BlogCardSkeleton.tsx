export default function BlogCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-video bg-[#E8D5A3]/40 rounded-lg" />

      {/* Text content */}
      <div className="mt-3 space-y-2">
        {/* Title */}
        <div className="h-5 bg-[#E8D5A3]/40 rounded w-4/5" />
        {/* Excerpt line 1 */}
        <div className="h-3 bg-[#E8D5A3]/40 rounded w-full" />
        {/* Excerpt line 2 */}
        <div className="h-3 bg-[#E8D5A3]/40 rounded w-2/3" />
        {/* Date */}
        <div className="h-3 bg-[#E8D5A3]/40 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}
