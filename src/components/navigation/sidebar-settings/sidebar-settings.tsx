import * as React from "react";

import { cn } from "@/lib/utils";
import { SidebarMenuItem, type SidebarNavItem } from "@/components/navigation/sidebar";

type SidebarSettingsProps = React.ComponentProps<"nav"> & {
  /** Settings sub-nav rows (Figma: My profile, Business profiles, Team
   * members, Billing, Notifications, Promo codes, Security, Integrations). */
  items: SidebarNavItem[];
  /**
   * Controlled active item. When set, the rail mirrors this value and never
   * marks an item active on its own — so a consumer driving it from the current
   * route can't have the highlight drift by clicking an item that doesn't
   * navigate. Omit for the uncontrolled behavior below.
   */
  activeItem?: string;
  /**
   * Which item is active on first render. Defaults to the first item, as in
   * Figma. The component owns the active state internally after that
   * (clicking a different item marks it active) — use `onNavigate` to react
   * to clicks, e.g. to drive actual routing. Ignored when `activeItem` is set.
   */
  defaultActiveItem?: string;
  /**
   * Called with a clicked item's `navigateTo` route so the consumer can
   * trigger the actual navigation call. Items without `navigateTo` never
   * fire it.
   */
  onNavigate?: (navigateTo: string) => void;
};

/**
 * Settings sub-nav rail (Figma "Sidebar Settings"): a vertical list of
 * `SidebarMenuItem` rows, rendered with the tinted `Active-alt` treatment
 * instead of the primary Sidebar's solid `Active` state.
 */
function SidebarSettings({
  items,
  activeItem,
  defaultActiveItem,
  onNavigate,
  className,
  ...props
}: SidebarSettingsProps) {
  const [uncontrolledActiveItem, setUncontrolledActiveItem] = React.useState(
    defaultActiveItem ?? items[0]?.label,
  );
  const isControlled = activeItem !== undefined;
  const currentActiveItem = isControlled ? activeItem : uncontrolledActiveItem;

  const handleItemClick = (item: SidebarNavItem) => {
    // Controlled: the consumer's value is the only source of truth, so a click
    // that doesn't navigate must not move the highlight.
    if (!isControlled) {
      setUncontrolledActiveItem(item.label);
    }
    if (item.onClick) {
      item.onClick();
    } else if (item.navigateTo) {
      onNavigate?.(item.navigateTo);
    }
  };

  return (
    <nav
      data-slot="sidebar-settings"
      className={cn("flex w-full flex-col items-start gap-2 px-8", className)}
      {...props}
    >
      {items.map((item) => (
        <SidebarMenuItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          count={item.count}
          active={currentActiveItem === item.label}
          activeVariant="alt"
          onClick={() => handleItemClick(item)}
        />
      ))}
    </nav>
  );
}

export { SidebarSettings };
export type { SidebarSettingsProps };
