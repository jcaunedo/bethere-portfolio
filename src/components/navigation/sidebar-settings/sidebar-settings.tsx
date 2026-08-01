import * as React from "react";

import { cn } from "@/lib/utils";
import { SidebarMenuItem, type SidebarNavItem } from "@/components/navigation/sidebar";

type SidebarSettingsProps = React.ComponentProps<"nav"> & {
  /** Settings sub-nav rows (Figma: My profile, Business profiles, Team
   * members, Billing, Notifications, Promo codes, Security, Integrations). */
  items: SidebarNavItem[];
  /**
   * Which item is active on first render. Defaults to the first item, as in
   * Figma. The component owns the active state internally after that
   * (clicking a different item marks it active) — use `onNavigate` to react
   * to clicks, e.g. to drive actual routing.
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
  defaultActiveItem,
  onNavigate,
  className,
  ...props
}: SidebarSettingsProps) {
  const [activeItem, setActiveItem] = React.useState(
    defaultActiveItem ?? items[0]?.label,
  );

  const handleItemClick = (item: SidebarNavItem) => {
    setActiveItem(item.label);
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
          active={activeItem === item.label}
          activeVariant="alt"
          onClick={() => handleItemClick(item)}
        />
      ))}
    </nav>
  );
}

export { SidebarSettings };
export type { SidebarSettingsProps };
