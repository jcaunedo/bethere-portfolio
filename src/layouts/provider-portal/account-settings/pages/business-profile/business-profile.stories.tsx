import type { Meta, StoryObj } from "@storybook/react-vite";

import { BusinessProfileLayout } from "./business-profile";

const meta: Meta<typeof BusinessProfileLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/BusinessProfile",
  component: BusinessProfileLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof BusinessProfileLayout>;

export const Default: Story = {};
