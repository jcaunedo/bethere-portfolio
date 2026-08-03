import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccountSettingsMenuLayout } from "./account-settings-menu";

const meta: Meta<typeof AccountSettingsMenuLayout> = {
  title: "Layouts/AccountSettings/Menu",
  component: AccountSettingsMenuLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof AccountSettingsMenuLayout>;

export const Default: Story = {
  args: {
    onClose: () => alert("Back"),
    onNavigate: (navigateTo) => alert(`Navigate to ${navigateTo}`),
  },
};
