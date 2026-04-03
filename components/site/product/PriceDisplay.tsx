interface PriceDisplayProps {
  basePrice: number;
  hasVariants?: boolean;
}

export default function PriceDisplay({ basePrice, hasVariants }: PriceDisplayProps) {
  return (
    <p className="font-heading text-[22px] font-bold text-terracotta">
      {basePrice}₺
      {hasVariants && (
        <span className="font-body text-xs text-brown-mid font-normal ml-1">
          &apos;den başlayan
        </span>
      )}
    </p>
  );
}
