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

import { NavigationListItem } from "./navigation-list-item";

const meta: Meta<typeof NavigationListItem> = {
  title: "Navigation/NavigationListItem",
  component: NavigationListItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof NavigationListItem>;

export const Default: Story = {
  args: {
    icon: CircleUserIcon,
    label: "My profile",
  },
  render: (args) => (
    <div className="max-w-sm">
      <NavigationListItem {...args} />
    </div>
  ),
};

/**
 * Figma `Property 1=On Press`: a background tint while pressed. Storybook
 * can't hold `:active` open, so this story fakes it via `data-active` on the
 * wrapper for visual reference — the real component uses `active:bg-background`.
 */
export const OnPress: Story = {
  args: {
    icon: CircleUserIcon,
    label: "My profile",
  },
  render: (args) => (
    <div className="max-w-sm">
      <NavigationListItem {...args} className="bg-background" />
    </div>
  ),
};

/** The mobile "Account Settings" list — the full row set, matching Sidebar Settings' items. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col">
      <NavigationListItem icon={CircleUserIcon} label="My profile" />
      <NavigationListItem icon={BuildingIcon} label="Business profiles" />
      <NavigationListItem icon={UsersIcon} label="Team members" />
      <NavigationListItem icon={CreditCardIcon} label="Billing" />
      <NavigationListItem icon={BellIcon} label="Notifications" />
      <NavigationListItem icon={TagsIcon} label="Promo codes" />
      <NavigationListItem icon={ShieldIcon} label="Security" />
      <NavigationListItem icon={BlocksIcon} label="Integrations" />
    </div>
  ),
};
