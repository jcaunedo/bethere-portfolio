import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["lg", "xl"],
    },
    type: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    placeholder: "Enter text…",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

// Figma "lg · 36"
export const Large: Story = {
  args: { size: "lg" },
};

// Figma "xl · 40"
export const ExtraLarge: Story = {
  args: { size: "xl" },
};

// Figma State=HasValue
export const HasValue: Story = {
  args: { defaultValue: "julio@bethere.group" },
};

// Figma State=Disabled
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Unavailable" },
};

// Figma State=Read-only
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Read-only value" },
};

// Figma State=Error → aria-invalid
export const Error: Story = {
  args: { "aria-invalid": true, defaultValue: "Invalid value" },
};

export const File: Story = {
  args: { type: "file", placeholder: undefined },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Input size="lg" placeholder="Large · 36" />
        <Input size="xl" placeholder="Extra large · 40" />
      </div>
      <div className="flex flex-col gap-2">
        <Input defaultValue="Has value" />
        <Input disabled defaultValue="Disabled" />
        <Input readOnly defaultValue="Read-only" />
        <Input aria-invalid defaultValue="Error" />
      </div>
    </div>
  ),
};
