import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BellIcon,
  CalendarIcon,
  ChartColumnIcon,
  CircleUserIcon,
  FileTextIcon,
  GalleryHorizontalEndIcon,
  GlobeIcon,
  HouseIcon,
  InboxIcon,
  LogOutIcon,
  SettingsIcon,
  SunMoonIcon,
  WalletIcon,
} from "lucide-react";

import {
  Sidebar,
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

const business = {
  name: "Key Biscayne Yacht Club",
  address: "180 Harbor Dr, Key Biscayne, FL 33149",
};

const promotion = {
  title: "Refer us and win",
  description: "Lorem ipsum",
};

/** The default Figma nav sets, wired with `navigateTo` routes the consumer's
 * `onNavigate` receives verbatim. */
const primaryMenuItems: SidebarNavItem[] = [
  { icon: HouseIcon, label: "Home", navigateTo: "/" },
  { icon: InboxIcon, label: "Inbox", navigateTo: "/inbox" },
];

const secondaryMenuItems: SidebarNavItem[] = [
  { icon: GalleryHorizontalEndIcon, label: "Listings", navigateTo: "/listings" },
  { icon: CalendarIcon, label: "Calendar", navigateTo: "/calendar" },
  { icon: WalletIcon, label: "Transactions", navigateTo: "/transactions" },
  { icon: FileTextIcon, label: "Documents", navigateTo: "/documents" },
  { icon: ChartColumnIcon, label: "Analytics", navigateTo: "/analytics" },
];

/** Figma "Account Menu": items for the footer's SelectAccountInfo popover.
 * Rows either navigate (`navigateTo` → `onNavigate`) or act (`onClick`). */
const accountMenuItems: SidebarAccountMenuItem[] = [
  { icon: CircleUserIcon, label: "My profile", navigateTo: "/profile" },
  { icon: SunMoonIcon, label: "Theme", shortcut: "Auto" },
  { icon: GlobeIcon, label: "Language", shortcut: "English" },
  {
    icon: SettingsIcon,
    label: "Account settings",
    navigateTo: "/settings",
  },
  {
    icon: LogOutIcon,
    label: "Log Out",
    variant: "destructive",
    separator: true,
    onClick: () => console.log("[Sidebar story] sign out"),
  },
];

const onNavigate = (navigateTo: string) =>
  console.log(`[Sidebar story] navigate to ${navigateTo}`);

export const SingleBusiness: Story = {
  args: {
    businessMode: "single",
    primaryMenuItems,
    secondaryMenuItems,
    account,
    accountMenuItems,
    promotion,
    onNavigate,
  },
};

export const MultipleBusinesses: Story = {
  args: {
    businessMode: "multiple",
    business,
    inboxCount: 12,
    primaryMenuItems,
    secondaryMenuItems,
    account,
    accountMenuItems,
    promotion,
    onNavigate,
  },
};

export const SingleBusinessCollapsed: Story = {
  args: {
    businessMode: "single",
    primaryMenuItems,
    secondaryMenuItems,
    account,
    promotion,
    defaultCollapsed: true,
    onNavigate,
  },
};

export const MultipleBusinessesCollapsed: Story = {
  args: {
    businessMode: "multiple",
    business,
    inboxCount: 12,
    primaryMenuItems,
    secondaryMenuItems,
    account,
    accountMenuItems,
    promotion,
    defaultCollapsed: true,
    onNavigate,
  },
};

/** Consumer-defined nav lists: different items, per-item counts, and an
 * action-only row (`onClick`, no route). */
export const CustomMenuItems: Story = {
  args: {
    businessMode: "single",
    primaryMenuItems: [
      { icon: HouseIcon, label: "Overview", navigateTo: "/overview" },
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-6">
      <Sidebar
        businessMode="single"
        primaryMenuItems={primaryMenuItems}
        secondaryMenuItems={secondaryMenuItems}
        account={account}
        promotion={promotion}
        onNavigate={onNavigate}
      />
      <Sidebar
        businessMode="multiple"
        business={business}
        inboxCount={12}
        primaryMenuItems={primaryMenuItems}
        secondaryMenuItems={secondaryMenuItems}
        account={account}
        accountMenuItems={accountMenuItems}
        promotion={promotion}
        onNavigate={onNavigate}
      />
      <Sidebar
        businessMode="single"
        primaryMenuItems={primaryMenuItems}
        secondaryMenuItems={secondaryMenuItems}
        account={account}
        promotion={promotion}
        defaultCollapsed
        onNavigate={onNavigate}
      />
      <Sidebar
        businessMode="multiple"
        business={business}
        inboxCount={12}
        primaryMenuItems={primaryMenuItems}
        secondaryMenuItems={secondaryMenuItems}
        account={account}
        accountMenuItems={accountMenuItems}
        promotion={promotion}
        defaultCollapsed
        onNavigate={onNavigate}
      />
    </div>
  ),
};
