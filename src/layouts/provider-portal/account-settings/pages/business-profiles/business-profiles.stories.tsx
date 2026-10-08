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
