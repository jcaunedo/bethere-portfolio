import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Figma: bethere.ds → Input / Type=Textfield. shadcn baseline reskinned to UCL
// tokens. Interaction states (hover/focus/disabled/read-only/error) are Tailwind
// state utilities, not variants — only Size is a real axis in the design.
const inputVariants = cva(
  "flex w-full min-w-0 rounded-xl border border-input bg-card px-3 py-1 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none " +
    "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground " +
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground " +
    "read-only:text-muted-foreground read-only:cursor-default " +
    "hover:border-neutral-400 " + // Figma State=Hover → color/input/ring (#9aa1ac, neutral-400)
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
    "dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        xs: "h-6 text-xs",   // 24px — very compact
        sm: "h-7 text-xs",   // 28px — compact
        md: "h-8",           // 32px — dense / small
        lg: "h-9",           // 36px — default ★
        xl: "h-10 text-base", // 40px — large / emphasis
      },
    },
    defaultVariants: { size: "lg" },
  },
);

/** Single-line text input. Figma origin: bethere.ds Input / Type=Textfield. */
function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size ?? "lg"}
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
