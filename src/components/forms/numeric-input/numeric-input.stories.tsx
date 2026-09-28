import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumericInput } from "./numeric-input";

const meta: Meta<typeof NumericInput> = {
  title: "Forms/NumericInput",
  component: NumericInput,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["lg", "xl"] },
    steppers: { control: "boolean" },
  },
  args: { placeholder: "0" },
};

export default meta;
type Story = StoryObj<typeof NumericInput>;

export const Default: Story = {};
export const ExtraLarge: Story = { args: { size: "xl" } };
export const WithSteppers: Story = { args: { steppers: true, defaultValue: 10 } };
export const WithPrefix: Story = { args: { prefix: "€", defaultValue: 1200 } };
/** Trailing text inside the field, e.g. an applied adjustment. */
export const WithSuffix: Story = { args: { prefix: "$", suffix: "+15%", defaultValue: 230, size: "xl" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 42 } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <NumericInput placeholder="Plain" />
      <NumericInput steppers defaultValue={5} />
      <NumericInput prefix="€" defaultValue={1200} />
    </div>
  ),
};
