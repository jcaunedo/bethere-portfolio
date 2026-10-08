import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "@/components/typography";
import { AccountSettingsLayout } from "./account-settings";

const meta: Meta<typeof AccountSettingsLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/Shell",
  component: AccountSettingsLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof AccountSettingsLayout>;

export const Default: Story = {
  args: {
    onClose: () => console.log("[AccountSettingsLayout story] close"),
    onNavigate: (navigateTo) =>
      console.log(`[AccountSettingsLayout story] navigate to ${navigateTo}`),
  },
  render: (args) => (
    <AccountSettingsLayout {...args}>
      <div className="flex flex-col gap-1.5 p-8">
        <Typography as="h1" size="2xl" weight="medium">
          My profile
        </Typography>
        <Typography size="base" className="text-muted-foreground">
          Settings sub-page content renders here.
        </Typography>
      </div>
    </AccountSettingsLayout>
  ),
};
