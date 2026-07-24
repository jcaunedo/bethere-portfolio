import * as React from "react";
import { Building2Icon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/data-display/avatar";

/**
 * Business summary row with an expand affordance, used to switch between
 * businesses. Figma: bethere.ds "Select Business Switcher"
 * (`Property 1=Default/Hover`). The Hover state's 4px frame is expressed as
 * a `ring` (box-shadow), not a `border` — a real border would consume 4px
 * of layout space on every side even when transparent, squeezing the row's
 * content and preventing it from being a clean `w-full` fill of its
 * container. `ring` draws outside the box without affecting layout, so the
 * row can be 100% width and the hover frame still renders outward.
 */
function SelectBusinessSwitcher({
  name,
  address,
  avatarUrl,
  collapsed = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  name: string;
  address: string;
  avatarUrl?: string;
  /** Avatar-only layout for the collapsed Sidebar (Figma "Collapsed"). */
  collapsed?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="select-business-switcher"
      aria-label={collapsed ? name : undefined}
      title={collapsed ? name : undefined}
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-xl px-1 outline-none transition-colors",
        "hover:bg-card hover:ring-4 hover:ring-card focus-visible:ring-[3px] focus-visible:ring-ring/50",
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
          <AvatarFallback tone="business">
            <Building2Icon />
          </AvatarFallback>
        </Avatar>
        {collapsed ? null : (
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-medium text-foreground">
              {name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {address}
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

export { SelectBusinessSwitcher };
