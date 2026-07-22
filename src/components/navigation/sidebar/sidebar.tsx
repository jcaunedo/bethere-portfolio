import * as React from "react";
import {
  CalendarIcon,
  ChartColumnIcon,
  FileTextIcon,
  GalleryHorizontalEndIcon,
  GiftIcon,
  HouseIcon,
  InboxIcon,
  PanelLeftIcon,
  WalletIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SelectBusinessSwitcher } from "@/components/data-display/select-business-switcher";
import { SelectAccountInfo } from "@/components/data-display/select-account-info";

/** BeThere icon mark (the "→" glyph from the BE→THERE wordmark). Figma: `Sidebar Logo Container` → `Logo Collapsed`. */
function LogoMarkIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M26.2205 16.7743L16.8001 26.2C16.3535 26.2 16.1023 26.2 15.6557 26.2L14.0368 24.5802C14.0368 24.1333 14.0368 23.882 14.0368 23.4351L18.8377 18.6315C18.7679 18.4657 18.7644 18.4517 18.6946 18.2859H6.98725L6.1778 17.476V14.9223C6.49355 14.6064 6.67149 14.4283 6.98725 14.1124H18.6946L18.8377 13.7668L14.0385 8.96488V7.81983L15.6575 6.2C16.104 6.2 16.3553 6.2 16.8019 6.2L26.2222 15.6257C26.2222 16.0726 26.2222 16.3239 26.2222 16.7708L26.2205 16.7743Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** One row in the primary nav list. Figma "Menu Item". */
function SidebarMenuItem({
  icon: Icon,
  label,
  count,
  active = false,
  collapsed = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  /** Leading icon, e.g. a lucide-react icon component. */
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  /** Optional trailing numeric badge (Figma "Counter", seen on Inbox). */
  count?: number;
  /** Marks the item as the current route (Figma State=Active). */
  active?: boolean;
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
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex h-9 min-h-8 items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium text-sidebar-foreground outline-none transition-colors",
        "focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sidebar-icon-foreground",
        active
          ? "bg-card text-brand-500 [&_svg]:text-brand-500"
          : "hover:bg-state-hover",
        collapsed ? "size-9 shrink-0 justify-center px-0" : "w-full",
        className,
      )}
      {...props}
    >
      <Icon />
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
      className={cn("h-px w-full border-t border-sidebar-border", className)}
      {...props}
    />
  );
}

/** Promo callout above the account footer. Figma "Promotion". */
function SidebarPromotion({
  title,
  description,
  className,
  ...props
}: React.ComponentProps<"div"> & { title: string; description: string }) {
  return (
    <div
      data-slot="sidebar-promotion"
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border border-border bg-background p-4",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center gap-2">
        <GiftIcon className="size-[18px] shrink-0 text-foreground" />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      <p className="w-full text-xs text-foreground">{description}</p>
    </div>
  );
}

const primaryMenuItems = [
  { icon: HouseIcon, label: "Home" },
  { icon: InboxIcon, label: "Inbox" },
] as const;

const secondaryMenuItems = [
  { icon: GalleryHorizontalEndIcon, label: "Listings" },
  { icon: CalendarIcon, label: "Calendar" },
  { icon: WalletIcon, label: "Transactions" },
  { icon: FileTextIcon, label: "Documents" },
  { icon: ChartColumnIcon, label: "Analytics" },
] as const;

interface SidebarBusiness {
  name: string;
  address: string;
  avatarUrl?: string;
}

interface SidebarAccountInfo {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface SidebarProps extends React.ComponentProps<"div"> {
  /**
   * Whether the signed-in user belongs to a single business or can switch
   * between multiple (Figma variants "Single Business" / "Multiple
   * Businesses"). When `"multiple"`, the business switcher moves above the
   * primary nav items and `business` is required.
   */
  businessMode?: "single" | "multiple";
  /** Active business summary, shown only when `businessMode="multiple"`. */
  business?: SidebarBusiness;
  /** Inbox unread count (Figma "Counter"), shown only when > 0. */
  inboxCount?: number;
  /** Signed-in user summary shown in the footer. */
  account: SidebarAccountInfo;
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
  /** Called with a menu item's label when it's clicked. */
  onNavigate?: (label: string) => void;
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

/** Persistent app navigation rail. Figma: bethere.ds "Sidebar". */
function Sidebar({
  businessMode = "single",
  business,
  inboxCount,
  account,
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

  const handleNavigate = (label: string) => {
    setActiveItem(label);
    onNavigate?.(label);
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
      {primaryMenuItems.map(({ icon, label }) => (
        <SidebarMenuItem
          key={label}
          icon={icon}
          label={label}
          count={label === "Inbox" ? inboxCount : undefined}
          active={activeItem === label}
          collapsed={collapsed}
          onClick={() => handleNavigate(label)}
        />
      ))}
      <SidebarDivider />
      {secondaryMenuItems.map(({ icon, label }) => (
        <SidebarMenuItem
          key={label}
          icon={icon}
          label={label}
          active={activeItem === label}
          collapsed={collapsed}
          onClick={() => handleNavigate(label)}
        />
      ))}
    </div>
  );

  return (
    <div
      data-slot="sidebar"
      data-business-mode={businessMode}
      data-collapsed={collapsed}
      className={cn(
        "relative flex h-screen flex-col items-start justify-between bg-background",
        collapsed ? "w-16 px-2 py-6" : "w-[296px] p-6",
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
        className={cn(
          "relative z-10 flex w-full flex-col items-center",
          collapsed ? "gap-6" : businessMode === "multiple" ? "gap-4" : "gap-6",
        )}
      >
        {collapsed ? (
          <button
            type="button"
            data-slot="sidebar-logo"
            aria-label="Expand sidebar"
            onClick={handleToggleCollapsed}
            onMouseEnter={() => setIsRailHovered(true)}
            onMouseLeave={() => setIsRailHovered(false)}
            className="flex h-10 w-9 shrink-0 cursor-e-resize items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
          >
            <LogoMarkIcon
              className={cn("size-8 text-foreground", isRailHovered && "hidden")}
            />
            <PanelLeftIcon
              className={cn(
                "hidden size-[18px] text-foreground",
                isRailHovered && "block",
              )}
            />
          </button>
        ) : (
          <div className="flex h-10 w-full items-center justify-between py-2 pr-1 pl-1.5">
            <span className="text-lg font-semibold text-foreground">
              BeThere
            </span>
            <button
              type="button"
              data-slot="sidebar-collapse"
              aria-label="Collapse sidebar"
              onClick={handleToggleCollapsed}
              className="flex size-6 shrink-0 cursor-w-resize items-center justify-center rounded-full outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
            >
              <PanelLeftIcon className="size-[18px] text-sidebar-icon-foreground" />
            </button>
          </div>
        )}

        {businessMode === "multiple" && business ? (
          <SelectBusinessSwitcher
            name={business.name}
            address={business.address}
            avatarUrl={business.avatarUrl}
            collapsed={collapsed}
          />
        ) : null}

        {menuItems}
      </div>

      <div
        data-slot="sidebar-content-bottom"
        className="relative z-10 flex w-full flex-col items-center justify-end gap-6"
      >
        {promotion && !collapsed ? (
          <SidebarPromotion
            title={promotion.title}
            description={promotion.description}
          />
        ) : null}
        <SelectAccountInfo
          name={account.name}
          email={account.email}
          avatarUrl={account.avatarUrl}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
}

export { Sidebar, SidebarMenuItem, SidebarDivider, SidebarPromotion };
export type { SidebarProps, SidebarBusiness, SidebarAccountInfo };
