import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = {
  args: { defaultChecked: false },
};

export const On: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch defaultChecked={false} />
      <Switch defaultChecked />
      <Switch disabled />
    </div>
  ),
};
