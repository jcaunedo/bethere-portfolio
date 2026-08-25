import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { SearchTrigger } from "./search-trigger";

const meta: Meta<typeof SearchTrigger> = {
  title: "Forms/SearchTrigger",
  component: SearchTrigger,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchTrigger>;

function ControlledDemo(props: React.ComponentProps<typeof SearchTrigger>) {
  const [value, setValue] = React.useState("");
  return (
    <SearchTrigger
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue("")}
    />
  );
}

export const Default: Story = {
  render: () => <ControlledDemo />,
};

export const ExtraLarge: Story = {
  render: () => <ControlledDemo size="xl" />,
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ControlledDemo size="lg" />
      <ControlledDemo size="xl" />
    </div>
  ),
};
