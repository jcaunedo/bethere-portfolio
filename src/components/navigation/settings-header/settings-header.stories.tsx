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
    title: "Settings",
    onClose: () => alert("Back"),
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
    title: "Settings",
    onClose: () => alert("Back"),
  },
};

/**
 * Below Tailwind's `md` breakpoint (< 768px), the title/Done pair is
 * replaced by a back chevron + centered `title` (Figma `My Profile -
 * Mobile`). Resize the preview or use Storybook's viewport toolbar to see
 * the swap.
 */
export const MobileTitle: Story = {
  args: {
    title: "My profile",
    onClose: () => alert("Back"),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
