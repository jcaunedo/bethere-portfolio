import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["lg", "xl"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: { placeholder: "Enter a longer message…" },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const HasValue: Story = {
  args: { defaultValue: "Some multi-line\ncontent here." },
};
export const Disabled: Story = { args: { disabled: true, defaultValue: "Unavailable" } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: "Read-only" } };
export const Error: Story = {
  args: { "aria-invalid": true, defaultValue: "Invalid value" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea size="lg" placeholder="Large · 36" />
      <Textarea size="xl" placeholder="Extra large · 40" />
      <Textarea disabled defaultValue="Disabled" />
      <Textarea aria-invalid defaultValue="Error" />
    </div>
  ),
};
