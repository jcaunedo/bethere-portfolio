import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BellIcon,
  BlocksIcon,
  BuildingIcon,
  CircleUserIcon,
  CreditCardIcon,
  ShieldIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react";

import { SidebarSettings } from "./sidebar-settings";
import type { SidebarNavItem } from "@/components/navigation/sidebar";

const meta: Meta<typeof SidebarSettings> = {
  title: "Navigation/SidebarSettings",
  component: SidebarSettings,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SidebarSettings>;

/** The default Figma row set. */
const items: SidebarNavItem[] = [
  { icon: CircleUserIcon, label: "My profile", navigateTo: "/settings/profile" },
  { icon: BuildingIcon, label: "Business profiles", navigateTo: "/settings/business-profiles" },
  { icon: UsersIcon, label: "Team members", navigateTo: "/settings/team-members" },
  { icon: CreditCardIcon, label: "Billing", navigateTo: "/settings/billing" },
  { icon: BellIcon, label: "Notifications", navigateTo: "/settings/notifications" },
  { icon: TagsIcon, label: "Promo codes", navigateTo: "/settings/promo-codes" },
  { icon: ShieldIcon, label: "Security", navigateTo: "/settings/security" },
  { icon: BlocksIcon, label: "Integrations", navigateTo: "/settings/integrations" },
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
    items,
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
    items,
    defaultActiveItem: "Security",
    onNavigate,
  },
};
