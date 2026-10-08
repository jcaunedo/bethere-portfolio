import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Headline: what's missing, e.g. "No business profiles yet". */
  title: string;
  /** One line on why it matters or what will appear here. */
  description?: string;
  /** Optional icon or illustration above the title. */
  icon?: React.ReactNode;
  /** Call-to-action text naming the next step, e.g. "Add business". Omit for no button. */
  buttonLabel?: string;
  /** Optional leading icon for the button, e.g. a plus. */
  buttonIcon?: React.ReactNode;
  /** Forwarded to the CTA button (e.g. `onClick`). */
  buttonProps?: Omit<React.ComponentProps<typeof Button>, "children">;
}

/**
 * A centered empty-state message for a view with nothing to show — a list with
 * no items yet, a search with no matches, or a section that isn't available
 * yet. Ported from verita-ai's `EmptyState` (Figma: Verita `Contracts` empty
 * filter panel): an `lg`/semibold title in foreground and a `base` description
 * in muted foreground, 8px apart, with an optional primary button 16px below.
 * The same layout is used for every empty view; only the copy (and whether
 * there's an action) changes.
 *
 * Centers itself in whatever space its parent gives it — pass
 * `className="flex-1"` (or a height/padding) to fill a panel.
 */
function EmptyState({
  title,
  description,
  icon,
  buttonLabel,
  buttonIcon,
  buttonProps,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex w-full flex-col items-center justify-center gap-4 text-center", className)}
      {...props}
    >
      {/* Icon, title and description 8px apart; the button sits 16px below the group. */}
      <div className="flex flex-col items-center gap-2">
        {icon ? (
          <div data-slot="empty-state-icon" className="flex items-center justify-center">
            {icon}
          </div>
        ) : null}
        {/* A section-level heading under the page's h1, at verita-ai's lg/semibold size
            (an explicit size: the h2 definition alone would be xl). */}
        <Typography as="h2" size="lg" weight="semibold" className="text-foreground">
          {title}
        </Typography>
        {/* Description max 640px wide so long text wraps to a comfortable line length. */}
        {description ? (
          <Typography size="base" className="max-w-[640px] text-muted-foreground">
            {description}
          </Typography>
        ) : null}
      </div>
      {buttonLabel ? (
        <Button variant="default" size="lg" {...buttonProps}>
          {buttonIcon}
          {buttonLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
