import * as React from "react";
import {
  CalendarIcon,
  ChartColumnIcon,
  FileTextIcon,
  GalleryHorizontalEndIcon,
  MessageCircleIcon,
} from "lucide-react";

import { BankNoteIcon } from "@/components/icons/bank-note-icon";
import { BankNoteSolidIcon } from "@/components/icons/bank-note-solid-icon";
import { CalendarSolidIcon } from "@/components/icons/calendar-solid-icon";
import { ChartColumnSolidIcon } from "@/components/icons/chart-column-solid-icon";
import { FileTextSolidIcon } from "@/components/icons/file-text-solid-icon";
import { GalleryHorizontalEndSolidIcon } from "@/components/icons/gallery-horizontal-end-solid-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { HomeSolidIcon } from "@/components/icons/home-solid-icon";
import { MessageCircleSolidIcon } from "@/components/icons/message-circle-solid-icon";
import {
  Sidebar,
  type SidebarAccountInfo,
  type SidebarAccountMenuItem,
  type SidebarNavItem,
} from "@/components/navigation/sidebar";
import { Typography } from "@/components/typography";
import { layoutCanvasPaddingClassName } from "@/layouts/shared/layout-canvas";
import { useLayoutSidebar } from "@/layouts/shared/use-layout-sidebar";
import { cn } from "@/lib/utils";

/** The Provider Portal's pages — one per Sidebar item. */
type PortalPage =
  | "home"
  | "messages"
  | "listings"
  | "calendar"
  | "transactions"
  | "documents"
  | "analytics";

/** Sidebar items, with the route each one hands to `onNavigate` (`/` for Home, `/<page>` otherwise). */
const portalPrimaryItems: SidebarNavItem[] = [
  { icon: HomeIcon, activeIcon: HomeSolidIcon, label: "Home", navigateTo: "/" },
  { icon: MessageCircleIcon, activeIcon: MessageCircleSolidIcon, label: "Messages", navigateTo: "/messages" },
];

const portalSecondaryItems: SidebarNavItem[] = [
  { icon: GalleryHorizontalEndIcon, activeIcon: GalleryHorizontalEndSolidIcon, label: "Listings", navigateTo: "/listings" },
  { icon: CalendarIcon, activeIcon: CalendarSolidIcon, label: "Calendar", navigateTo: "/calendar" },
  { icon: BankNoteIcon, activeIcon: BankNoteSolidIcon, label: "Transactions", navigateTo: "/transactions" },
  { icon: FileTextIcon, activeIcon: FileTextSolidIcon, label: "Documents", navigateTo: "/documents" },
  { icon: ChartColumnIcon, activeIcon: ChartColumnSolidIcon, label: "Analytics", navigateTo: "/analytics" },
];

/** Each page's Sidebar label (also its default title). */
const PAGE_LABEL: Record<PortalPage, string> = {
  home: "Home",
  messages: "Messages",
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
  /** Called with a Sidebar item's route ("/", "/messages", "/listings"…) when it's clicked. */
  onNavigate?: (route: string) => void;
  /**
   * Whether the Sidebar starts collapsed (Figma's Provider Portal frames show it collapsed). At `lg`
   * (1024) and below it auto-collapses regardless (`useLayoutSidebar`).
   */
  defaultCollapsed?: boolean;
  /** The page's content, rendered in the content area beside the Sidebar. */
  children?: React.ReactNode;
}

/**
 * Provider Portal app shell: the Sidebar on the left and the current page beside it. Its pages are
 * the sibling folders (`./home/`, …). Figma: Provider Portal "Dashboard (Home)" (node 886:10115).
 * Responsive behavior (sidebar auto-collapse, canvas gutters) follows DESIGN.md "Page shell
 * responsiveness".
 */
function ProviderPortalLayout({
  page,
  account,
  accountMenuItems,
  onNavigate,
  defaultCollapsed = true,
  children,
}: ProviderPortalLayoutProps) {
  const { sidebarCollapsed, handleSidebarCollapsedChange } = useLayoutSidebar(defaultCollapsed);

  return (
    <div data-slot="provider-portal" className="flex h-screen w-full bg-background">
      <Sidebar
        primaryMenuItems={portalPrimaryItems}
        secondaryMenuItems={portalSecondaryItems}
        account={account}
        accountMenuItems={accountMenuItems}
        defaultActiveItem={PAGE_LABEL[page]}
        collapsed={sidebarCollapsed}
        onCollapsedChange={handleSidebarCollapsedChange}
        onNavigate={onNavigate}
      />
      {/* 56px top and bottom at every breakpoint (was Figma "Frame 2"'s 24px until Oct 08, 2026).
          Side gutters come from the shared shell helper
          (DESIGN.md "Page shell responsiveness"). Scrolls on its own beside the Sidebar. Also the
          positioning box for content centered in the canvas, e.g. a page's empty state. */}
      <main
        className={cn(
          "relative flex min-w-0 flex-1 flex-col overflow-y-auto py-14",
          layoutCanvasPaddingClassName(sidebarCollapsed),
        )}
      >
        {children}
      </main>
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
