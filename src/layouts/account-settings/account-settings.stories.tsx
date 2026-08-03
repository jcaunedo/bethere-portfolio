import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "@/components/typography";
import { SettingsLayout } from "./settings";

const meta: Meta<typeof SettingsLayout> = {
  title: "Layouts/Settings",
  component: SettingsLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof SettingsLayout>;

export const Default: Story = {
  args: {
    onClose: () => console.log("[SettingsLayout story] close"),
    onNavigate: (navigateTo) =>
      console.log(`[SettingsLayout story] navigate to ${navigateTo}`),
  },
  render: (args) => (
    <SettingsLayout {...args}>
      <div className="flex flex-col gap-1.5 p-8">
        <Typography as="h1" size="2xl" weight="medium">
          My profile
        </Typography>
        <Typography size="base" className="text-muted-foreground">
          Settings sub-page content renders here.
        </Typography>
      </div>
    </SettingsLayout>
  ),
};
