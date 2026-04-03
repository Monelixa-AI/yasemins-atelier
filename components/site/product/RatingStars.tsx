import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
}

export default function RatingStars({ rating, reviewCount }: RatingStarsProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={14} className="text-gold fill-gold" />
        ))}
        {hasHalf && <StarHalf size={14} className="text-gold fill-gold" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={14} className="text-gold/30" />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="font-body text-xs text-gold">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
