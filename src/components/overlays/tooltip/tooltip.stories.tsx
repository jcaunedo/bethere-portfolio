import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, InfoIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-40 items-center justify-center p-16">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/** Figma: bethere.ds `Tooltip` — hover or focus the button. */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Label</TooltipContent>
    </Tooltip>
  ),
};

/** Shown open, as in Figma (no hover needed). */
export const Open: Story = {
  render: () => (
    <Tooltip open>
      <TooltipTrigger asChild>
        <Button variant="outline">Trigger</Button>
      </TooltipTrigger>
      <TooltipContent>Label</TooltipContent>
    </Tooltip>
  ),
};

/** The usual pairing: an icon-only button, with the tooltip naming its action. */
export const IconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Copy link">
          <CopyIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy link</TooltipContent>
    </Tooltip>
  ),
};

/** Every side; the arrow follows the side. */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-40 gap-y-24">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} open>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label={`Info (${side})`}>
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
