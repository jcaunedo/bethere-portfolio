import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "Data Display/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["gradient", "solid", "black", "white"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

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
      <Logo {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6 rounded-md bg-neutral-800 p-4">
      <Logo variant="gradient" />
      <Logo variant="solid" />
      <Logo variant="black" />
      <Logo variant="white" />
    </div>
  ),
};
