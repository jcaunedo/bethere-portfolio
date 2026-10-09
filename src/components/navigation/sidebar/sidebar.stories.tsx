import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BellIcon,
  CalendarIcon,
  ChartColumnIcon,
  CircleUserIcon,
  GalleryHorizontalEndIcon,
  LanguagesIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  SunMoonIcon,
} from "lucide-react";
import { BankNoteIcon } from "@/components/icons/bank-note-icon";
import { BankNoteSolidIcon } from "@/components/icons/bank-note-solid-icon";
import { CalendarSolidIcon } from "@/components/icons/calendar-solid-icon";
import { ChartColumnSolidIcon } from "@/components/icons/chart-column-solid-icon";
import { GalleryHorizontalEndSolidIcon } from "@/components/icons/gallery-horizontal-end-solid-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { HomeSolidIcon } from "@/components/icons/home-solid-icon";
import { MessageCircleSolidIcon } from "@/components/icons/message-circle-solid-icon";

import {
  Sidebar,
  SidebarMenuItem,
  type SidebarAccountMenuItem,
  type SidebarNavItem,
} from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const account = {
  name: "Lucy Smith",
  email: "lucysmith@email.com",
};


const promotion = {
  title: "Refer us and win",
  description: "Lorem ipsum",
};

/** The default Figma nav sets, wired with `navigateTo` routes the consumer's
 * `onNavigate` receives verbatim. */
const primaryMenuItems: SidebarNavItem[] = [
  { icon: HomeIcon, activeIcon: HomeSolidIcon, label: "Home", navigateTo: "/" },
  { icon: MessageCircleIcon, activeIcon: MessageCircleSolidIcon, label: "Messages", navigateTo: "/messages" },
];

const secondaryMenuItems: SidebarNavItem[] = [
  { icon: GalleryHorizontalEndIcon, activeIcon: GalleryHorizontalEndSolidIcon, label: "Listings", navigateTo: "/listings" },
  { icon: CalendarIcon, activeIcon: CalendarSolidIcon, label: "Calendar", navigateTo: "/calendar" },
  { icon: BankNoteIcon, activeIcon: BankNoteSolidIcon, label: "Transactions", navigateTo: "/transactions" },
  { icon: ChartColumnIcon, activeIcon: ChartColumnSolidIcon, label: "Analytics", navigateTo: "/analytics" },
];

/** Figma "Account Menu": items for the footer's SelectAccountInfo popover —
 * My profile and Account settings open those settings sections directly
 * (product-specs/account-menu.md). Rows either navigate (`navigateTo` →
 * `onNavigate`) or act (`onClick`). */
const accountMenuItems: SidebarAccountMenuItem[] = [
  { icon: CircleUserIcon, label: "My profile", navigateTo: "/settings/profile" },
  { icon: SettingsIcon, label: "Account settings", navigateTo: "/settings/business-profiles" },
  { icon: SunMoonIcon, label: "Theme", shortcut: "Auto" },
  { icon: LanguagesIcon, label: "Language", shortcut: "English" },
  {
    icon: LogOutIcon,
    label: "Log out",
    variant: "destructive",
    separator: true,
    onClick: () => console.log("[Sidebar story] sign out"),
  },
];

const onNavigate = (navigateTo: string) =>
  console.log(`[Sidebar story] navigate to ${navigateTo}`);

/** Figma "Sidebar Menu Item" (62:936) state set: Default, Hover (`:hover` in
 * the browser) and Active — no fill, semibold, solid icon (the outline icon
 * filled, unless an `activeIcon` is passed). */
export const MenuItemStates: Story = {
  render: () => (
    <div className="flex w-[294px] flex-col gap-2 bg-background p-4">
      <SidebarMenuItem icon={HomeIcon} label="Default" />
      <SidebarMenuItem icon={HomeIcon} label="Hover me" />
      <SidebarMenuItem icon={HomeIcon} activeIcon={HomeSolidIcon} label="Active" active />
    </div>
  ),
};

/** Figma Property=Single Business. */
export const SingleBusiness: Story = {
  args: {
    messagesCount: 12,
    primaryMenuItems,
    secondaryMenuItems,
    account,
    accountMenuItems,
    promotion,
    onNavigate,
  },
};

/** Figma Property=Single Collapsed: icon rail, no labels. */
export const SingleBusinessCollapsed: Story = {
  args: {
    messagesCount: 12,
    primaryMenuItems,
    secondaryMenuItems,
    account,
    promotion,
    defaultCollapsed: true,
    onNavigate,
  },
};

/** Consumer-defined nav lists: different items, per-item counts, and an
 * action-only row (`onClick`, no route). */
export const CustomMenuItems: Story = {
  args: {
    primaryMenuItems: [
      { icon: HomeIcon, label: "Overview", navigateTo: "/overview" },
      { icon: BellIcon, label: "Notifications", count: 3, navigateTo: "/notifications" },
    ],
    secondaryMenuItems: [
      { icon: CalendarIcon, label: "Bookings", navigateTo: "/bookings" },
      {
        icon: SettingsIcon,
        label: "Preferences",
        onClick: () => console.log("[Sidebar story] open preferences dialog"),
      },
    ],
    defaultActiveItem: "Overview",
    account,
    accountMenuItems,
    onNavigate,
  },
};

/** Figma "Sidebar" (62:973): Single Business and Single Collapsed. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-6">
      <Sidebar
        messagesCount={12}
        primaryMenuItems={primaryMenuItems}
        secondaryMenuItems={secondaryMenuItems}
        account={account}
        accountMenuItems={accountMenuItems}
        promotion={promotion}
        onNavigate={onNavigate}
      />
      <Sidebar
        messagesCount={12}
        primaryMenuItems={primaryMenuItems}
        secondaryMenuItems={secondaryMenuItems}
        account={account}
        promotion={promotion}
        defaultCollapsed
        onNavigate={onNavigate}
      />
    </div>
  ),
};
