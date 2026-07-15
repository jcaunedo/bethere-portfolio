import type { Meta, StoryObj } from "@storybook/react-vite";
import { OtpInput } from "./otp-input";
import { FormField } from "@/components/forms/field";

const meta: Meta<typeof OtpInput> = {
  title: "Forms/OtpInput",
  component: OtpInput,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["lg", "6xl"],
    },
    maxLength: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    maxLength: 6,
  },
};

export default meta;
type Story = StoryObj<typeof OtpInput>;

export const Default: Story = {};

// Figma "Size=Default" (36px slots)
export const Large: Story = {
  args: { size: "lg" },
};

// Figma "Size=6xl" (56px slots)
export const ExtraLarge: Story = {
  args: { size: "6xl" },
};

// Figma State=HasValue
export const HasValue: Story = {
  args: { defaultValue: "524872" },
};

// Figma State=Disabled
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "524872" },
};

// Figma State=Error → aria-invalid
export const Error: Story = {
  args: { "aria-invalid": true, defaultValue: "524872" },
};

export const WithFormField: Story = {
  render: (args) => (
    <FormField htmlFor="otp" label="Verification Code">
      <OtpInput id="otp" {...args} />
    </FormField>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <OtpInput size="lg" />
        <OtpInput size="6xl" />
      </div>
      <div className="flex flex-col gap-4">
        <OtpInput defaultValue="524872" />
        <OtpInput disabled defaultValue="524872" />
        <OtpInput aria-invalid defaultValue="524872" />
      </div>
    </div>
  ),
};
