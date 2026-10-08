import type { Meta, StoryObj } from "@storybook/react-vite";
import { BusinessProfile } from "./business-profile";

const meta: Meta<typeof BusinessProfile> = {
  title: "Layouts/ProviderPortal/BusinessProfile",
  component: BusinessProfile,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof BusinessProfile>;

export const Default: Story = {};
