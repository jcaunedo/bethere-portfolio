import * as React from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/data-display/avatar";

/** "Lucy Smith" → "LS"; falls back to the first two characters if there's no space. */
function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Signed-in user summary + account menu toggle. Figma: bethere.ds
 * "Select Account Info" (`Property 1=Default/Hover`). Same pattern as
 * `SelectBusinessSwitcher`: the Hover state's 4px frame is a `ring`
 * (box-shadow), not a `border` — a real border reserves layout space on
 * every side even when transparent, which would both prevent the row from
 * being a clean `w-full` fill and inset the hover fill inward instead of
 * letting it render outward past the row's own bounds.
 */
function SelectAccountInfo({
  name,
  email,
  avatarUrl,
  collapsed = false,
  className,
  // Destructured (not left in `...props`) so this component's own
  // `data-slot` always wins — e.g. when composed via `AccountMenuTrigger
  // asChild`, the trigger's own `data-slot="account-menu-trigger"` would
  // otherwise silently overwrite this one through plain prop-spread
  // ordering, since `{...props}` is spread after the JSX literal below.
  "data-slot": _dataSlot,
  ...props
}: React.ComponentProps<"button"> & {
  name: string;
  email: string;
  avatarUrl?: string;
  /** Avatar-only layout for the collapsed Sidebar (Figma "Collapsed"). */
  collapsed?: boolean;
  "data-slot"?: string;
}) {
  return (
    <button
      type="button"
      data-slot="select-account-info"
      aria-label={collapsed ? name : undefined}
      title={collapsed ? name : undefined}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl px-1 outline-none",
        // Figma Hover: color/states/hover fill + a 4px outside frame in the same color. The frame sits
        // outside the fill (no overlap), so the whole hover area reads as one even tint. The 4px ring
        // is always there (transparent at rest) so hover only changes its color, and fill and ring
        // fade together (motionDuration.fast, 160ms) rather than the ring growing or snapping in.
        "ring-4 ring-transparent transition-[background-color,box-shadow] duration-160 ease-in-out",
        "hover:bg-state-hover hover:ring-state-hover focus-visible:ring-[3px] focus-visible:ring-ring/50",
        collapsed && "justify-center px-0",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2",
          collapsed && "flex-none",
        )}
      >
        <Avatar size="lg" className="shrink-0">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback colorSeed={name}>
            {initialsFromName(name)}
          </AvatarFallback>
        </Avatar>
        {collapsed ? null : (
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-medium text-foreground">
              {name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {email}
            </span>
          </span>
        )}
      </span>
      {collapsed ? null : (
        <ChevronsUpDownIcon className="size-4 shrink-0 text-icon-subtle" />
      )}
    </button>
  );
}

export { SelectAccountInfo };
