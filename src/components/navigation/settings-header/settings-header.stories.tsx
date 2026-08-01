import type { Meta, StoryObj } from "@storybook/react-vite";

import { SettingsHeader } from "./settings-header";

const meta: Meta<typeof SettingsHeader> = {
  title: "Navigation/SettingsHeader",
  component: SettingsHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SettingsHeader>;

export const Default: Story = {
  args: {
    onClose: () => alert("Close settings"),
  },
};

export const WithContent: Story = {
  render: (args) => (
    <div className="flex min-h-screen flex-col bg-background">
      <SettingsHeader {...args} />
      <div className="flex-1 px-8 py-6 text-muted-foreground text-sm">
        Settings page content goes here.
      </div>
    </div>
  ),
  args: {
    onClose: () => alert("Close settings"),
  },
};

/**
 * Below Tailwind's `md` breakpoint (< 768px), the logo/close pair is
 * replaced by a back chevron + centered `mobileTitle` (Figma `My Profile -
 * Mobile`). Resize the preview or use Storybook's viewport toolbar to see
 * the swap.
 */
export const MobileTitle: Story = {
  args: {
    mobileTitle: "My profile",
    onClose: () => alert("Back"),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
