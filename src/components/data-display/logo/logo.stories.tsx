import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "Data Display/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Neutral: Story = {
  args: { variant: "neutral" },
};

export const Brand: Story = {
  args: { variant: "brand" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6 rounded-md bg-card p-4">
      <Logo variant="neutral" />
      <Logo variant="brand" />
    </div>
  ),
};
