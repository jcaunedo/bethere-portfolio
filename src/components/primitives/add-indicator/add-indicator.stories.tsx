import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "lucide-react";
import { AddIndicator } from "./add-indicator";

const meta: Meta<typeof AddIndicator> = {
  title: "Primitives/AddIndicator",
  component: AddIndicator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AddIndicator>;

export const Default: Story = {};

/** Overriding `icon` reuses the same dashed-circle badge for a different "add X" row. */
export const CustomIcon: Story = {
  args: {
    icon: <Calendar aria-hidden="true" />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <AddIndicator />
      <AddIndicator icon={<Calendar aria-hidden="true" />} />
    </div>
  ),
};
