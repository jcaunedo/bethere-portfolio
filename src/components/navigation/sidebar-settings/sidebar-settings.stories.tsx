import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BellIcon,
  BlocksIcon,
  BuildingIcon,
  CircleUserIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { TagsIcon } from "@/components/icons/tags-icon";
import { TagsSolidIcon } from "@/components/icons/tags-solid-icon";
import { BlocksSolidIcon } from "@/components/icons/blocks-solid-icon";

import { BuildingSolidIcon } from "@/components/icons/building-solid-icon";
import { CircleUserSolidIcon } from "@/components/icons/circle-user-solid-icon";
import { UsersSolidIcon } from "@/components/icons/users-solid-icon";
import { ReceiptIcon } from "@/components/icons/receipt-icon";
import { ReceiptSolidIcon } from "@/components/icons/receipt-solid-icon";
import { SidebarSettings, type SidebarSettingsGroup } from "./sidebar-settings";

const meta: Meta<typeof SidebarSettings> = {
  title: "Navigation/SidebarSettings",
  component: SidebarSettings,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SidebarSettings>;

/** The Figma rail: personal settings under "Profile", the business account's under "Account". */
const groups: SidebarSettingsGroup[] = [
  {
    label: "Profile",
    items: [
      { icon: CircleUserIcon, activeIcon: CircleUserSolidIcon, label: "My profile", navigateTo: "/settings/profile" },
      { icon: BellIcon, label: "Notifications", navigateTo: "/settings/notifications" },
      { icon: ShieldIcon, label: "Security", navigateTo: "/settings/security" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: BuildingIcon, activeIcon: BuildingSolidIcon, label: "Business profile", navigateTo: "/settings/business-profiles" },
      { icon: UsersIcon, activeIcon: UsersSolidIcon, label: "Team members", navigateTo: "/settings/team-members" },
      { icon: ReceiptIcon, activeIcon: ReceiptSolidIcon, label: "Billing", navigateTo: "/settings/billing" },
      { icon: TagsIcon, activeIcon: TagsSolidIcon, label: "Promo codes", navigateTo: "/settings/promo-codes" },
      { icon: BlocksIcon, activeIcon: BlocksSolidIcon, label: "Integrations", navigateTo: "/settings/integrations" },
    ],
  },
];

const onNavigate = (navigateTo: string) =>
  console.log(`[SidebarSettings story] navigate to ${navigateTo}`);

export const Default: Story = {
  render: (args) => (
    <div className="w-[296px] py-6">
      <SidebarSettings {...args} />
    </div>
  ),
  args: {
    groups,
    onNavigate,
  },
};

export const SecurityActive: Story = {
  render: (args) => (
    <div className="w-[296px] py-6">
      <SidebarSettings {...args} />
    </div>
  ),
  args: {
    groups,
    defaultActiveItem: "Security",
    onNavigate,
  },
};

/** Without `groups`: one unlabelled list of rows. */
export const Ungrouped: Story = {
  render: (args) => (
    <div className="w-[296px] py-6">
      <SidebarSettings {...args} />
    </div>
  ),
  args: {
    items: groups.flatMap((group) => group.items),
    onNavigate,
  },
};
