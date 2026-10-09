import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeIcon } from "@/components/icons/home-icon";
import { SidebarMenuItem } from "@/components/navigation/sidebar";
import { SidebarTooltip } from "./sidebar-tooltip";

const meta: Meta<typeof SidebarTooltip> = {
  title: "Overlays/SidebarTooltip",
  component: SidebarTooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-40 items-center justify-center bg-background p-16">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarTooltip>;

const trigger = (
  <button
    type="button"
    className="rounded-menu-option px-3 py-1.5 text-sm text-foreground outline-none hover:bg-state-hover focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50"
  >
    Hover me
  </button>
);

/** Figma: bethere.ds `sidebar-tooltip` — hover or focus the trigger. */
export const Default: Story = {
  render: () => <SidebarTooltip label="Label">{trigger}</SidebarTooltip>,
};

/** Shown open, as in Figma (no hover needed). */
export const Open: Story = {
  render: () => (
    <SidebarTooltip label="Label" defaultOpen>
      {trigger}
    </SidebarTooltip>
  ),
};

/** In context: a collapsed `SidebarMenuItem` shows its label in the tooltip on hover/focus. */
export const OnCollapsedMenuItem: Story = {
  render: () => <SidebarMenuItem icon={HomeIcon} label="Home" collapsed />,
};

/** Every placement, open. The sidebar uses `right`. */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-40 gap-y-20 py-10">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <SidebarTooltip key={side} label={side} side={side} defaultOpen>
          {trigger}
        </SidebarTooltip>
      ))}
    </div>
  ),
};
