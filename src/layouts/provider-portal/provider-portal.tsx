import * as React from "react";
import {
  CalendarIcon,
  ChartColumnIcon,
  FileTextIcon,
  GalleryHorizontalEndIcon,
  HouseIcon,
  InboxIcon,
  WalletIcon,
} from "lucide-react";

import { BankNoteSolidIcon } from "@/components/icons/bank-note-solid-icon";
import { CalendarSolidIcon } from "@/components/icons/calendar-solid-icon";
import { ChartColumnSolidIcon } from "@/components/icons/chart-column-solid-icon";
import { FileTextSolidIcon } from "@/components/icons/file-text-solid-icon";
import { GalleryHorizontalEndSolidIcon } from "@/components/icons/gallery-horizontal-end-solid-icon";
import { HomeSolidIcon } from "@/components/icons/home-solid-icon";
import { InboxSolidIcon } from "@/components/icons/inbox-solid-icon";
import {
  Sidebar,
  type SidebarAccountInfo,
  type SidebarAccountMenuItem,
  type SidebarNavItem,
} from "@/components/navigation/sidebar";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

/** The Provider Portal's pages — one per Sidebar item. */
type PortalPage =
  | "home"
  | "inbox"
  | "listings"
  | "calendar"
  | "transactions"
  | "documents"
  | "analytics";

/** Sidebar items, with the route each one hands to `onNavigate` (`/` for Home, `/<page>` otherwise). */
const portalPrimaryItems: SidebarNavItem[] = [
  { icon: HouseIcon, activeIcon: HomeSolidIcon, label: "Home", navigateTo: "/" },
  { icon: InboxIcon, activeIcon: InboxSolidIcon, label: "Inbox", navigateTo: "/inbox" },
];

const portalSecondaryItems: SidebarNavItem[] = [
  { icon: GalleryHorizontalEndIcon, activeIcon: GalleryHorizontalEndSolidIcon, label: "Listings", navigateTo: "/listings" },
  { icon: CalendarIcon, activeIcon: CalendarSolidIcon, label: "Calendar", navigateTo: "/calendar" },
  { icon: WalletIcon, activeIcon: BankNoteSolidIcon, label: "Transactions", navigateTo: "/transactions" },
  { icon: FileTextIcon, activeIcon: FileTextSolidIcon, label: "Documents", navigateTo: "/documents" },
  { icon: ChartColumnIcon, activeIcon: ChartColumnSolidIcon, label: "Analytics", navigateTo: "/analytics" },
];

/** Each page's Sidebar label (also its default title). */
const PAGE_LABEL: Record<PortalPage, string> = {
  home: "Home",
  inbox: "Inbox",
  listings: "Listings",
  calendar: "Calendar",
  transactions: "Transactions",
  documents: "Documents",
  analytics: "Analytics",
};

/** The page a Sidebar route points at ("/" → home, "/listings" → listings…). */
function pageForRoute(route: string): PortalPage | undefined {
  const page = (route === "/" ? "home" : route.replace(/^\//, "")) as PortalPage;
  return page in PAGE_LABEL ? page : undefined;
}

interface ProviderPortalLayoutProps {
  /** The page shown, which also marks its Sidebar item active on first render. */
  page: PortalPage;
  /** Signed-in user, for the Sidebar footer. */
  account: SidebarAccountInfo;
  /** Items for the Sidebar footer's account menu. */
  accountMenuItems?: SidebarAccountMenuItem[];
  /** Called with a Sidebar item's route ("/", "/inbox", "/listings"…) when it's clicked. */
  onNavigate?: (route: string) => void;
  /** Whether the Sidebar starts collapsed (Figma's Provider Portal frames show it collapsed). */
  defaultCollapsed?: boolean;
  /** The page's content, rendered in the content area beside the Sidebar. */
  children?: React.ReactNode;
}

/**
 * Provider Portal app shell: the Sidebar on the left and the current page beside it. Its pages are
 * the sibling folders (`./home/`, …). Figma: Provider Portal "Dashboard (Home)" (node 886:10115).
 */
function ProviderPortalLayout({
  page,
  account,
  accountMenuItems,
  onNavigate,
  defaultCollapsed = true,
  children,
}: ProviderPortalLayoutProps) {
  return (
    <div data-slot="provider-portal" className="flex h-screen w-full bg-background">
      <Sidebar
        primaryMenuItems={portalPrimaryItems}
        secondaryMenuItems={portalSecondaryItems}
        account={account}
        accountMenuItems={accountMenuItems}
        defaultActiveItem={PAGE_LABEL[page]}
        defaultCollapsed={defaultCollapsed}
        onNavigate={onNavigate}
      />
      {/* Figma "Frame 2": 24px left, top and bottom; 56px right. Scrolls on its own beside the Sidebar. */}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto py-6 pr-14 pl-6">{children}</main>
    </div>
  );
}

/**
 * A page's header row (Figma "Header"): 40px tall, the title in `2xl/semibold` (headline font), and
 * room for actions on the right later (8px gap).
 */
function PortalPageHeader({
  title,
  className,
  children,
}: {
  title: React.ReactNode;
  className?: string;
  /** Actions shown at the end of the row. */
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("flex h-10 w-full items-center gap-2", className)}>
      <Typography as="h1" size="2xl" weight="semibold" className="min-w-0 flex-1 truncate">
        {title}
      </Typography>
      {children}
    </header>
  );
}

export { ProviderPortalLayout, PortalPageHeader, PAGE_LABEL, pageForRoute };
export type { PortalPage, ProviderPortalLayoutProps };
