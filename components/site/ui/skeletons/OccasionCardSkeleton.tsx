export default function OccasionCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg overflow-hidden">
      {/* Square image placeholder */}
      <div className="aspect-square bg-[#E8D5A3]/40 rounded-lg" />

      {/* Text content */}
      <div className="mt-3 space-y-2">
        {/* Name */}
        <div className="h-4 bg-[#E8D5A3]/40 rounded w-2/3" />
        {/* Description */}
        <div className="h-3 bg-[#E8D5A3]/40 rounded w-4/5" />
      </div>
    </div>
  );
}
