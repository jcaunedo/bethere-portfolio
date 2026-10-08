import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchInput } from "./search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Forms/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  argTypes: { size: { control: "select", options: ["lg", "xl"] } },
  args: { placeholder: "Search…" },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};
export const ExtraLarge: Story = { args: { size: "xl" } };
export const HasValue: Story = { args: { defaultValue: "Bethere" } };
export const Disabled: Story = { args: { disabled: true } };

export const Clearable: Story = {
  render: (args) => {
    const [value, setValue] = useState("Clear me");
    return (
      <div className="w-72">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
        />
      </div>
    );
  },
};
