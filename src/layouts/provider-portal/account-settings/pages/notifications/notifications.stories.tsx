import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotificationsLayout } from "./notifications";

const meta: Meta<typeof NotificationsLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/Notifications",
  component: NotificationsLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof NotificationsLayout>;

export const Default: Story = {};
