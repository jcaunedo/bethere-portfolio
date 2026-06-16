import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Figma: bethere.ds → Input / Type=Textarea. shadcn baseline reskinned to UCL
// tokens, sharing the Textfield field look. Multi-line, content-sized height.
const textareaVariants = cva(
  "field-sizing-content flex w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none " +
    "placeholder:text-muted-foreground " +
    "read-only:text-muted-foreground read-only:cursor-default " +
    "hover:border-neutral-400 " + // Figma State=Hover (color/input/ring #9aa1ac)
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
    "dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        lg: "min-h-16", // Figma "lg · 36"
        xl: "min-h-20", // Figma "xl · 40"
      },
    },
    defaultVariants: { size: "lg" },
  },
);

/** Multi-line text input. Figma origin: bethere.ds Input / Type=Textarea. */
function Textarea({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size ?? "lg"}
      className={cn(textareaVariants({ size, className }))}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
