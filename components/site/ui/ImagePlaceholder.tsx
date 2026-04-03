interface ImagePlaceholderProps {
  aspectRatio?: string;
  label?: string;
  className?: string;
}

export default function ImagePlaceholder({
  aspectRatio = "aspect-square",
  label,
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative ${aspectRatio} ${className}`}
      style={{
        background: "linear-gradient(135deg, #E8D5A3, #F5DCC8)",
      }}
    >
      {label && (
        <span className="absolute inset-0 flex items-center justify-center font-heading text-lg italic text-gold px-4 text-center">
          {label}
        </span>
      )}
    </div>
  );
}
