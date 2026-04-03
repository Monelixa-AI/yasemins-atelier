import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-terracotta text-white hover:bg-terracotta-dark",
  secondary:
    "border-[1.5px] border-terracotta text-terracotta bg-transparent hover:bg-terracotta hover:text-white",
  outline:
    "border border-gold text-gold bg-transparent hover:bg-gold hover:text-brown-deep",
  ghost:
    "text-terracotta bg-transparent hover:text-terracotta-dark",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const BrandButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-body font-medium tracking-wide transition-all duration-300 rounded-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

BrandButton.displayName = "BrandButton";
export default BrandButton;
