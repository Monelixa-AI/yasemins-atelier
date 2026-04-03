import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "occasion" | "category";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variantStyles = {
    default: "bg-gold/20 text-gold",
    occasion: "bg-terracotta text-white",
    category: "bg-gold text-white",
  };

  return (
    <span
      className={cn(
        "inline-block font-body text-[10px] font-medium uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
