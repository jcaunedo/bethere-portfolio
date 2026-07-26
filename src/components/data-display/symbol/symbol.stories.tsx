import type { Meta, StoryObj } from "@storybook/react-vite";

import { Symbol } from "./symbol";

const meta: Meta<typeof Symbol> = {
  title: "Data Display/Symbol",
  component: Symbol,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["gradient", "solid", "black", "white"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Symbol>;

export const Gradient: Story = {
  args: { variant: "gradient" },
};

export const Solid: Story = {
  args: { variant: "solid" },
};

export const Black: Story = {
  args: { variant: "black" },
};

export const White: Story = {
  args: { variant: "white" },
  render: (args) => (
    <div className="rounded-md bg-neutral-800 p-4">
      <Symbol {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6 rounded-md bg-neutral-800 p-4">
      <Symbol variant="gradient" />
      <Symbol variant="solid" />
      <Symbol variant="black" />
      <Symbol variant="white" />
    </div>
  ),
};
