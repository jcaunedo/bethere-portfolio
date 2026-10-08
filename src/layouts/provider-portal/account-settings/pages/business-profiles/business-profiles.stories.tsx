import type { Meta, StoryObj } from "@storybook/react-vite";

import { BusinessProfilesLayout } from "./business-profiles";

const meta: Meta<typeof BusinessProfilesLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/BusinessProfiles",
  component: BusinessProfilesLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof BusinessProfilesLayout>;

export const Default: Story = {};

/** An account with a single business: one card. */
export const SingleBusiness: Story = {
  args: {
    businesses: [
      {
        id: "key-biscayne-yacht-club",
        name: "Key Biscayne Yacht Club",
        address: "180 Harbor Dr, Key Biscayne, FL 33149",
        owner: "John Smith",
        badgeLabel: "Approved",
        badgeColor: "green",
      },
    ],
  },
};

/** No businesses yet: the empty state with "Add business". */
export const Empty: Story = {
  args: { businesses: [] },
};
