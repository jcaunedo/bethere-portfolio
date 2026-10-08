import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarIcon,
  ChartColumnIcon,
  FileTextIcon,
  GalleryHorizontalEndIcon,
  HouseIcon,
  InboxIcon,
  PanelLeftIcon,
  WalletIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { BankNoteSolidIcon } from "@/components/icons/bank-note-solid-icon";
import { CalendarSolidIcon } from "@/components/icons/calendar-solid-icon";
import { ChartColumnSolidIcon } from "@/components/icons/chart-column-solid-icon";
import { FileTextSolidIcon } from "@/components/icons/file-text-solid-icon";
import { GalleryHorizontalEndSolidIcon } from "@/components/icons/gallery-horizontal-end-solid-icon";
import { HomeSolidIcon } from "@/components/icons/home-solid-icon";
import { InboxSolidIcon } from "@/components/icons/inbox-solid-icon";
import { enterTransition, motionDuration, useMotionPreference } from "@/lib/motion";
import { Logo } from "@/components/data-display/logo";
import { Symbol } from "@/components/data-display/symbol";
import { SelectAccountInfo } from "@/components/data-display/select-account-info";
import { Promotion } from "@/components/data-display/promotion";
import {
  AccountMenu,
  AccountMenuContent,
  AccountMenuItem,
  AccountMenuSeparator,
  AccountMenuTrigger,
} from "@/components/overlays/account-menu";

/**
 * One row in a sidebar nav list. Figma "Sidebar Menu Item" (bethere.ds 62:936): State=Default,
 * Hover, Active. Used by the app Sidebar and by SidebarSettings.
 */
function SidebarMenuItem({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  count,
  active = false,
  activeVariant = "default",
  collapsed = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  /** Leading icon, e.g. a lucide-react icon component (Figma: the outline icon). */
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Solid icon for the Active state (Figma swaps e.g. home-line for home-line-solid). Optional:
   * without it, the outline `icon` is filled with its own color when active.
   */
  activeIcon?: React.ComponentType<{ className?: string }>;
  label: string;
  /** Optional trailing numeric badge (Figma "Counter", seen on Inbox). */
  count?: number;
  /** Marks the item as the current route (Figma State=Active). */
  active?: boolean;
  /**
   * @deprecated Figma retired the filled Active and tinted Active-alt treatments: every active
   * item now uses the same State=Active (no fill, semibold, solid icon). Accepted and ignored.
   */
  activeVariant?: "default" | "alt";
  /**
   * Icon-only layout for the collapsed Sidebar (Figma "Single/Multiple
   * Collapsed") — the label stays for accessibility (`aria-label`) but is
   * visually hidden, and the icon centers in the row.
   */
  collapsed?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        // Figma: 36px row (min 32), radius/menu-option, 8px/6px padding, 12px gap, 16px icon.
        "flex h-9 min-h-8 items-center gap-3 rounded-menu-option px-2 py-1.5 text-sm outline-none transition-colors",
        "focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        active
          ? // State=Active: no fill; sm/semibold in color/foreground/foreground, solid icon in color/icon/foreground.
            "font-semibold text-foreground [&_svg]:text-icon-foreground"
          : // State=Default: sm/medium in sidebar-foreground, icon in color/icon/muted.
            // State=Hover: color/states/hover fill; label and icon go to foreground.
            "font-medium text-sidebar-foreground hover:bg-state-hover hover:text-foreground [&_svg]:text-icon-muted hover:[&_svg]:text-icon-foreground",
        collapsed ? "size-9 shrink-0 justify-center px-0" : "w-full",
        className,
      )}
      {...props}
    >
      {active ? (
        ActiveIcon ? <ActiveIcon /> : <Icon className="fill-current" />
      ) : (
        <Icon />
      )}
      {collapsed ? null : (
        <>
          <span className="min-w-0 flex-1 overflow-hidden text-left text-ellipsis whitespace-nowrap">
            {label}
          </span>
          {count !== undefined ? (
            <span
              data-slot="sidebar-menu-item-count"
              className="shrink-0 px-0.5 text-center text-xs text-brand-500"
            >
              {count}
            </span>
          ) : null}
        </>
      )}
    </button>
  );
}

/** Horizontal rule between menu groups. Figma "Divider". */
function SidebarDivider({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-divider"
      role="separator"
      // Figma: a 16px-tall row with the 1px line centered.
      className={cn("my-[7.5px] h-px w-full border-t border-sidebar-border", className)}
      {...props}
    />
  );
}

/** One row in the primary/secondary nav lists, as configured by the consumer. */
interface SidebarNavItem {
  icon: React.ComponentType<{ className?: string }>;
  /** Solid icon shown while the item is active (see `SidebarMenuItem`'s `activeIcon`). */
  activeIcon?: React.ComponentType<{ className?: string }>;
  label: string;
  /** Optional trailing numeric badge (Figma "Counter", seen on Inbox). */
  count?: number;
  /**
   * Action callback for non-routing items. Takes precedence over
   * `navigateTo` when both are set.
   */
  onClick?: () => void;
  /**
   * Route this item points at. Clicking forwards it to `onNavigate` so the
   * consumer can run its router's navigation call.
   */
  navigateTo?: string;
}

// Each item's solid icon (bethere.ds 934:46xx–47xx) shows while it's active.
const defaultPrimaryMenuItems: SidebarNavItem[] = [
  { icon: HouseIcon, activeIcon: HomeSolidIcon, label: "Home" },
  { icon: InboxIcon, activeIcon: InboxSolidIcon, label: "Inbox" },
];

const defaultSecondaryMenuItems: SidebarNavItem[] = [
  { icon: GalleryHorizontalEndIcon, activeIcon: GalleryHorizontalEndSolidIcon, label: "Listings" },
  { icon: CalendarIcon, activeIcon: CalendarSolidIcon, label: "Calendar" },
  { icon: WalletIcon, activeIcon: BankNoteSolidIcon, label: "Transactions" },
  { icon: FileTextIcon, activeIcon: FileTextSolidIcon, label: "Documents" },
  { icon: ChartColumnIcon, activeIcon: ChartColumnSolidIcon, label: "Analytics" },
];

interface SidebarAccountInfo {
  name: string;
  email: string;
  avatarUrl?: string;
}

/** One row in the account menu opened from the footer's SelectAccountInfo. */
interface SidebarAccountMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  /** Trailing secondary text, e.g. a current setting value (Figma "Auto"/"English"). */
  shortcut?: string;
  /** Figma "Log Out" row: destructive-tinted text/icon. */
  variant?: "default" | "destructive";
  /** Renders a divider above this item instead of a menu row. */
  separator?: boolean;
  /**
   * Action callback, e.g. sign-out. Takes precedence over `navigateTo`
   * when both are set.
   */
  onClick?: () => void;
  /** Route this item points at — clicking forwards it to `onNavigate`. */
  navigateTo?: string;
}

interface SidebarProps
  extends Omit<
    React.ComponentProps<"div">,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
  > {
  /**
   * Inbox unread count (Figma "Counter"). Convenience applied to the nav
   * item labelled `"Inbox"` when that item doesn't set its own `count`.
   */
  inboxCount?: number;
  /**
   * Nav items above the divider. Defaults to the Figma set (Home, Inbox).
   * Each item may carry an `onClick` action or a `navigateTo` route that is
   * forwarded to `onNavigate`.
   */
  primaryMenuItems?: SidebarNavItem[];
  /**
   * Nav items below the divider. Defaults to the Figma set (Listings,
   * Calendar, Transactions, Documents, Analytics). Same per-item
   * `onClick`/`navigateTo` behavior as `primaryMenuItems`.
   */
  secondaryMenuItems?: SidebarNavItem[];
  /** Signed-in user summary shown in the footer. */
  account: SidebarAccountInfo;
  /**
   * Items for the popover menu opened by clicking the footer's
   * SelectAccountInfo (Figma "Account Menu"). Omit to render
   * SelectAccountInfo without a menu (not clickable). Items may carry an
   * `onClick` action (e.g. sign-out) or a `navigateTo` route forwarded to
   * `onNavigate`.
   */
  accountMenuItems?: SidebarAccountMenuItem[];
  /** Called with an account menu item's label when it's clicked. */
  onAccountMenuAction?: (label: string) => void;
  /** Promo callout above the account footer; omit to hide it. Never shown while collapsed. */
  promotion?: { title: string; description: string };
  /** Called when the collapse ("panel-left") icon is activated. */
  onCollapse?: () => void;
  /**
   * Which nav item is active on first render. Defaults to `"Home"`.
   * The Sidebar owns the active state internally after that (clicking a
   * different item marks it active instead) — use `onNavigate` to react to
   * clicks, e.g. to drive actual routing.
   */
  defaultActiveItem?: string;
  /**
   * Called with a clicked item's `navigateTo` route (nav or account menu)
   * so the consumer can trigger the actual navigation call. Items without
   * `navigateTo` never fire it.
   */
  onNavigate?: (navigateTo: string) => void;
  /**
   * Whether the Sidebar starts collapsed (icon rail, no labels — Figma
   * "Single/Multiple Collapsed"). Defaults to expanded. The Sidebar owns
   * the collapsed state internally after that — use `onCollapsedChange` to
   * react to the user toggling it (e.g. to persist the preference).
   */
  defaultCollapsed?: boolean;
  /** Called with the new collapsed state whenever the user toggles it. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * Persistent app navigation rail. Figma: bethere.ds "Sidebar" (62:973) — Property=Single Business
 * (expanded) and Single Collapsed (icon rail). The multiple-business variant was retired.
 */
function Sidebar({
  inboxCount,
  primaryMenuItems = defaultPrimaryMenuItems,
  secondaryMenuItems = defaultSecondaryMenuItems,
  account,
  accountMenuItems,
  onAccountMenuAction,
  promotion,
  onCollapse,
  defaultActiveItem = "Home",
  onNavigate,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  ...props
}: SidebarProps) {
  const [activeItem, setActiveItem] = React.useState(defaultActiveItem);
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [isRailHovered, setIsRailHovered] = React.useState(false);
  const { resolve } = useMotionPreference();

  const handleNavItemClick = (item: SidebarNavItem) => {
    setActiveItem(item.label);
    if (item.onClick) {
      item.onClick();
    } else if (item.navigateTo) {
      onNavigate?.(item.navigateTo);
    }
  };

  const handleAccountMenuItemClick = (item: SidebarAccountMenuItem) => {
    onAccountMenuAction?.(item.label);
    if (item.onClick) {
      item.onClick();
    } else if (item.navigateTo) {
      onNavigate?.(item.navigateTo);
    }
  };

  const handleToggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapsedChange?.(next);
    onCollapse?.();
  };

  const menuItems = (
    <div
      data-slot="sidebar-menu-items"
      className={cn(
        "flex w-full flex-col gap-2",
        collapsed ? "items-center" : "items-start",
      )}
    >
      {primaryMenuItems.map((item) => (
        <SidebarMenuItem
          key={item.label}
          icon={item.icon}
          activeIcon={item.activeIcon}
          label={item.label}
          count={
            item.count ?? (item.label === "Inbox" ? inboxCount : undefined)
          }
          active={activeItem === item.label}
          collapsed={collapsed}
          onClick={() => handleNavItemClick(item)}
        />
      ))}
      <SidebarDivider />
      {secondaryMenuItems.map((item) => (
        <SidebarMenuItem
          key={item.label}
          icon={item.icon}
          activeIcon={item.activeIcon}
          label={item.label}
          count={item.count}
          active={activeItem === item.label}
          collapsed={collapsed}
          onClick={() => handleNavItemClick(item)}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      data-slot="sidebar"
      data-collapsed={collapsed}
      // Figma widths: Single Collapsed 64px, Single Business 296px.
      animate={{ width: collapsed ? 64 : 296 }}
      transition={resolve(enterTransition)}
      className={cn(
        "relative flex h-screen shrink-0 flex-col items-start justify-between overflow-hidden bg-background",
        // Figma: collapsed 10px sides / 24px top-bottom; expanded spacing/6 (24px) all round.
        collapsed ? "px-[10px] py-6" : "p-6",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        data-slot="sidebar-rail-toggle"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={handleToggleCollapsed}
        onMouseEnter={() => setIsRailHovered(true)}
        onMouseLeave={() => setIsRailHovered(false)}
        className={cn(
          "absolute inset-0 z-0 outline-none",
          collapsed ? "cursor-e-resize" : "cursor-w-resize",
        )}
      />

      <div
        data-slot="sidebar-content-top"
        className="relative z-10 flex w-full flex-col items-center gap-6"
      >
        {collapsed ? (
          <button
            type="button"
            data-slot="sidebar-logo"
            aria-label="Expand sidebar"
            onClick={handleToggleCollapsed}
            onMouseEnter={() => setIsRailHovered(true)}
            onMouseLeave={() => setIsRailHovered(false)}
            className="flex size-9 shrink-0 cursor-e-resize items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
          >
            <Symbol
              // Figma Logo Collapsed: Bethere Symbol at 28px.
              className={cn("h-7", isRailHovered && "hidden")}
            />
            <PanelLeftIcon
              // Figma Logo Collapsed Hover: panel-left in color/icon/foreground.
              className={cn(
                "hidden size-4 text-icon-foreground",
                isRailHovered && "block",
              )}
            />
          </button>
        ) : (
          <div className="flex h-9 w-full items-center justify-between py-2 pr-0 pl-1.5">
            {/* Figma Logo Extended: Bethere Logo at 24px. */}
            <Logo className="h-6" />
            <button
              type="button"
              data-slot="sidebar-collapse"
              aria-label="Collapse sidebar"
              onClick={handleToggleCollapsed}
              className="flex size-8 shrink-0 cursor-w-resize items-center justify-center rounded-xl outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
            >
              <PanelLeftIcon className="size-4 text-icon-subtle" />
            </button>
          </div>
        )}

        {menuItems}
      </div>

      <div
        data-slot="sidebar-content-bottom"
        className="relative z-10 flex w-full flex-col items-center justify-end gap-6"
      >
        <AnimatePresence>
          {promotion && !collapsed ? (
            <motion.div
              key="promotion"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                // Waits out the rail's own width animation (enterTransition,
                // same duration) before the dissolve starts, so Promotion
                // doesn't pop in at full opacity while the rail is still
                // resizing — CLAUDE.md "Reveal": fade only, no movement,
                // since this is content settling into an already-placed
                // layout slot, not entering from off-position.
                transition: resolve({
                  duration: motionDuration.fast,
                  delay: 0.2,
                }),
              }}
              // No exit animation — collapsing hides Promotion instantly
              // rather than dissolving it out.
              exit={{ opacity: 0, transition: { duration: 0 } }}
            >
              <Promotion
                title={promotion.title}
                description={promotion.description}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        {accountMenuItems && accountMenuItems.length > 0 ? (
          <AccountMenu>
            <AccountMenuTrigger asChild>
              <SelectAccountInfo
                name={account.name}
                email={account.email}
                avatarUrl={account.avatarUrl}
                collapsed={collapsed}
              />
            </AccountMenuTrigger>
            <AccountMenuContent align="start">
              {accountMenuItems.map((item) => (
                <React.Fragment key={item.label}>
                  {item.separator ? <AccountMenuSeparator /> : null}
                  <AccountMenuItem
                    showIcon
                    icon={<item.icon />}
                    shortcut={item.shortcut}
                    variant={item.variant}
                    onClick={() => handleAccountMenuItemClick(item)}
                  >
                    {item.label}
                  </AccountMenuItem>
                </React.Fragment>
              ))}
            </AccountMenuContent>
          </AccountMenu>
        ) : (
          <SelectAccountInfo
            name={account.name}
            email={account.email}
            avatarUrl={account.avatarUrl}
            collapsed={collapsed}
          />
        )}
      </div>
    </motion.div>
  );
}

export { Sidebar, SidebarMenuItem, SidebarDivider };
export type {
  SidebarProps,
  SidebarAccountInfo,
  SidebarAccountMenuItem,
  SidebarNavItem,
};
