import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CircleUserIcon,
  GlobeIcon,
  LogOutIcon,
  SettingsIcon,
  SunMoonIcon,
} from "lucide-react";

import { Sidebar, type SidebarAccountMenuItem } from "./sidebar";

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

/** Figma "Account Menu": items for the footer's SelectAccountInfo popover. */
const accountMenuItems: SidebarAccountMenuItem[] = [
  { icon: CircleUserIcon, label: "My profile" },
  { icon: SunMoonIcon, label: "Theme", shortcut: "Auto" },
  { icon: GlobeIcon, label: "Language", shortcut: "English" },
  { icon: SettingsIcon, label: "Account settings" },
  { icon: LogOutIcon, label: "Log Out", variant: "destructive", separator: true },
];

export const SingleBusiness: Story = {
  args: {
    businessMode: "single",
    account,
    accountMenuItems,
    promotion,
  },
};

export const MultipleBusinesses: Story = {
  args: {
    businessMode: "multiple",
    business,
    inboxCount: 12,
    account,
    promotion,
  },
};

export const SingleBusinessCollapsed: Story = {
  args: {
    businessMode: "single",
    account,
    promotion,
    defaultCollapsed: true,
  },
};

export const MultipleBusinessesCollapsed: Story = {
  args: {
    businessMode: "multiple",
    business,
    inboxCount: 12,
    account,
    promotion,
    defaultCollapsed: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-6">
      <Sidebar businessMode="single" account={account} promotion={promotion} />
      <Sidebar
        businessMode="multiple"
        business={business}
        inboxCount={12}
        account={account}
        promotion={promotion}
      />
      <Sidebar
        businessMode="single"
        account={account}
        promotion={promotion}
        defaultCollapsed
      />
      <Sidebar
        businessMode="multiple"
        business={business}
        inboxCount={12}
        account={account}
        promotion={promotion}
        defaultCollapsed
      />
    </div>
  ),
};
