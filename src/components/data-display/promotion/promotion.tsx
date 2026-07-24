import * as React from "react";
import { GiftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Clickable referral/announcement callout. Figma: bethere.ds "Promotion"
 * (`Property 1=Default/Hover`). Rendered as a button since Figma defines a
 * Hover state, implying the whole card is an affordance (e.g. opens a
 * referral flow) rather than a static banner.
 */
function Promotion({
  title,
  description,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      data-slot="promotion"
      className={cn(
        "flex w-full flex-col items-start gap-2 rounded-lg border border-border bg-background p-4 text-left outline-none transition-colors",
        "hover:bg-state-hover focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center gap-2">
        <GiftIcon className="size-[18px] shrink-0 text-icon-primary" />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      <p className="w-full text-xs text-foreground">{description}</p>
    </button>
  );
}

export { Promotion };
