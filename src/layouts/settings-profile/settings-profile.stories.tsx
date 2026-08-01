import type { Meta, StoryObj } from "@storybook/react-vite";

import { SettingsProfileLayout } from "./settings-profile";

const meta: Meta<typeof SettingsProfileLayout> = {
  title: "Layouts/SettingsProfile",
  component: SettingsProfileLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof SettingsProfileLayout>;

export const Default: Story = {};
