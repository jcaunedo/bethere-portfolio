import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotificationsLayoutOld } from "./notifications-old";

const meta: Meta<typeof NotificationsLayoutOld> = {
  title: "Layouts/AccountSettings/NotificationsOld",
  component: NotificationsLayoutOld,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof NotificationsLayoutOld>;

export const Default: Story = {};
