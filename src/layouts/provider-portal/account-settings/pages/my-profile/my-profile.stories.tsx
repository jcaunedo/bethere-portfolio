import type { Meta, StoryObj } from "@storybook/react-vite";

import { MyProfileLayout } from "./my-profile";

const meta: Meta<typeof MyProfileLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/MyProfile",
  component: MyProfileLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof MyProfileLayout>;

export const Default: Story = {};
