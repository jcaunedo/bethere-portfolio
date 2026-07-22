import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectBusinessSwitcher } from "./select-business-switcher";

const meta: Meta<typeof SelectBusinessSwitcher> = {
  title: "Data Display/SelectBusinessSwitcher",
  component: SelectBusinessSwitcher,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SelectBusinessSwitcher>;

const business = {
  name: "Key Biscayne Yacht Club",
  address: "180 Harbor Dr, Key Biscayne, FL 33149",
};

export const Default: Story = {
  args: business,
};

/** Hover the rendered row in Storybook to see the Figma "Hover" state (white card fill). */
export const Hover: Story = {
  args: business,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 bg-background p-4">
      <SelectBusinessSwitcher {...business} />
      <SelectBusinessSwitcher {...business} className="bg-card ring-4 ring-card" />
    </div>
  ),
};
