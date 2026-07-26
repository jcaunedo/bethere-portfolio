import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Fill treatments for the mark. Figma `Property 1`: Gradient/Solid use the
 * brand orange (`--color-brand-500` / `--sunset-500`, #f26740); Gradient adds
 * a second stop (#8f270a) that has no token equivalent — it is a one-off
 * decorative endpoint scoped to this asset. Black/White are flat foreground
 * and literal white.
 */
const symbolVariants = cva("h-9 w-auto shrink-0", {
  variants: {
    variant: {
      gradient: "",
      solid: "text-brand-500",
      black: "text-foreground",
      white: "text-white",
    },
  },
  defaultVariants: {
    variant: "gradient",
  },
});

type SymbolProps = React.ComponentProps<"svg"> &
  VariantProps<typeof symbolVariants>;

/** BeThere brand mark (the "Ventor Shape" double-curve). Figma: bethere.ds `Bethere Symbol`. */
function Symbol({ className, variant = "gradient", ...props }: SymbolProps) {
  const gradientId = `bethere-symbol-gradient-${React.useId()}`;
  const isGradient = variant === "gradient";

  return (
    <svg
      data-slot="symbol"
      data-variant={variant}
      viewBox="0 0 25 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(symbolVariants({ variant }), className)}
      {...props}
    >
      {isGradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0.657485"
            y1="18"
            x2="24.8423"
            y2="18"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F26740" />
            <stop offset="1" stopColor="#8F270A" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M0.657536 32.8373C0.657536 34.584 2.20223 36 4.1077 36C6.01318 36 7.55787 34.584 7.55787 32.8373C7.55787 26.6503 14.0609 21.1627 21.3922 21.1627V14.8374C10.8448 14.8374 0.657536 22.6355 0.657536 32.8373Z"
        fill={isGradient ? `url(#${gradientId})` : "currentColor"}
      />
      <path
        d="M0.657485 3.16265C0.657485 1.41597 2.20218 -9.53672e-07 4.10765 -9.53672e-07C6.01312 -9.53672e-07 7.55782 1.41597 7.55782 3.16265C7.55782 9.34971 14.0609 14.8374 21.3922 14.8374C23.2975 14.8376 24.8423 16.2534 24.8423 17.9999C24.8423 19.7465 23.2975 21.1625 21.3922 21.1627C10.8448 21.1627 0.657485 13.3645 0.657485 3.16265Z"
        fill={isGradient ? "#F26740" : "currentColor"}
      />
    </svg>
  );
}

export { Symbol, symbolVariants };
export type { SymbolProps };
