import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormField } from "./form-field";
import { Input } from "@/components/forms/input";

const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
  tags: ["autodocs"],
  args: { htmlFor: "demo", label: "Label" },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <FormField {...args}>
        <Input id="demo" placeholder="Type here…" />
      </FormField>
    </div>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <div className="w-80">
      <FormField {...args} description="Helper text shown below the control.">
        <Input id="demo" placeholder="Type here…" />
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div className="w-80">
      <FormField {...args} required error="This field is required.">
        <Input id="demo" aria-invalid placeholder="Type here…" />
      </FormField>
    </div>
  ),
};
