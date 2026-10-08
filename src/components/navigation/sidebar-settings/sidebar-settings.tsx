import * as React from "react";

import { cn } from "@/lib/utils";
import {
  SidebarDivider,
  SidebarMenuItem,
  type SidebarNavItem,
} from "@/components/navigation/sidebar";

/** A labelled run of rows in the rail ("Profile" / "Account", shown uppercase). */
interface SidebarSettingsGroup {
  /** Group label, shown uppercase above its rows (e.g. "Profile"). */
  label: string;
  items: SidebarNavItem[];
}

type SidebarSettingsProps = React.ComponentProps<"nav"> & {
  /**
   * Rows grouped under labels, with a divider between groups (Figma: Profile
   * — My profile, Notifications, Security; Account — Business profiles, Team
   * members, Billing, Promo codes, Integrations). Takes precedence over
   * `items`.
   */
  groups?: SidebarSettingsGroup[];
  /** A single, unlabelled list of rows. Use `groups` for the Figma rail. */
  items?: SidebarNavItem[];
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
 * Settings sub-nav rail (Figma "Sidebar Settings"): `SidebarMenuItem` rows,
 * 12px apart, with the same Active state as the primary Sidebar. With
 * `groups`, each group gets an uppercase label and a divider separates them.
 */
function SidebarSettings({
  groups,
  items = [],
  activeItem,
  defaultActiveItem,
  onNavigate,
  className,
  ...props
}: SidebarSettingsProps) {
  const allItems = groups ? groups.flatMap((group) => group.items) : items;
  const [uncontrolledActiveItem, setUncontrolledActiveItem] = React.useState(
    defaultActiveItem ?? allItems[0]?.label,
  );
  const groupId = React.useId();
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

  const renderItem = (item: SidebarNavItem) => (
    <SidebarMenuItem
      key={item.label}
      icon={item.icon}
      activeIcon={item.activeIcon}
      label={item.label}
      count={item.count}
      active={currentActiveItem === item.label}
      onClick={() => handleItemClick(item)}
    />
  );

  return (
    <nav
      data-slot="sidebar-settings"
      // Figma: rows, labels and the divider row all 12px apart (spacing/3).
      className={cn("flex w-full flex-col items-start gap-3 px-8", className)}
      {...props}
    >
      {groups
        ? groups.map((group, index) => (
            <React.Fragment key={group.label}>
              {index > 0 ? <SidebarDivider /> : null}
              <div
                role="group"
                aria-labelledby={`${groupId}-${index}`}
                data-slot="sidebar-settings-group"
                className="flex w-full flex-col items-start gap-3"
              >
                {/* Figma group label: 10px regular, color/foreground/muted, 1px tracking, uppercase. */}
                <p
                  id={`${groupId}-${index}`}
                  data-slot="sidebar-settings-group-label"
                  className="text-[10px] leading-[18px] tracking-[1px] text-muted-foreground uppercase"
                >
                  {group.label}
                </p>
                {group.items.map(renderItem)}
              </div>
            </React.Fragment>
          ))
        : items.map(renderItem)}
    </nav>
  );
}

export { SidebarSettings };
export type { SidebarSettingsGroup, SidebarSettingsProps };
