import * as React from "react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NavigationListItemProps = React.ComponentProps<"button"> & {
  /** Leading icon, e.g. a lucide-react icon component. */
  icon: React.ComponentType<{ className?: string }>;
  /** Row label. */
  label: string;
};

/**
 * Generic mobile list row (Figma `Settings navigation item`): leading icon,
 * label, and a trailing chevron disclosure indicator, with a tap/press
 * background tint. Distinct from the desktop `SidebarMenuItem` — no
 * persistent active state, sized and styled for a full-width mobile list
 * (e.g. the "Account Settings" menu that pushes into a sub-page like "My
 * profile") rather than a collapsible sidebar rail. Not settings-specific —
 * reusable anywhere a tappable, disclosure-style list row is needed.
 */
function NavigationListItem({
  className,
  icon: Icon,
  label,
  ...props
}: NavigationListItemProps) {
  return (
    <button
      type="button"
      data-slot="navigation-list-item"
      className={cn(
        "flex min-h-8 w-full items-center gap-4 rounded-menu-option p-4 text-left outline-none transition-colors",
        "hover:bg-background active:bg-background",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      <Icon className="size-4 shrink-0 text-icon" />
      <span className="min-w-0 flex-1 truncate text-base font-medium text-sidebar-foreground">
        {label}
      </span>
      <ChevronRightIcon className="size-4 shrink-0 text-icon-subtle" />
    </button>
  );
}

export { NavigationListItem };
export type { NavigationListItemProps };
