import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const addIndicatorVariants = cva(
  "relative flex size-12 shrink-0 items-center justify-center rounded-full border-[1.2px] border-dashed border-foreground-subtle bg-card text-icon-foreground [&_svg]:size-6",
);

type AddIndicatorProps = React.ComponentProps<"div"> &
  VariantProps<typeof addIndicatorVariants> & {
    /**
     * Centered icon. Defaults to the Figma `add-indicator` plus glyph —
     * override to reuse the same dashed-circle badge for a different "add X"
     * row (e.g. a calendar icon for "Calendar").
     */
    icon?: React.ReactNode;
  };

/**
 * Dashed-circle "add" indicator with a centered icon (a plus by default) — a
 * purely visual marker consumers wrap in their own interactive element
 * (button/link) when it needs to be clickable. Translated from Figma
 * `add-indicator` (bethere.ds).
 */
function AddIndicator({
  className,
  // Figma's plus glyph has flat (square) arm ends, not lucide's default
  // rounded caps — strokeLinecap="square" matches that flat-tipped shape.
  icon = <Plus aria-hidden="true" strokeLinecap="square" />,
  ...props
}: AddIndicatorProps) {
  return (
    <div
      data-slot="add-indicator"
      className={cn(addIndicatorVariants({ className }))}
      {...props}
    >
      {icon}
    </div>
  );
}

export { AddIndicator, addIndicatorVariants, type AddIndicatorProps };
