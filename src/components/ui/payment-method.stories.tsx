import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaymentMethod } from "./payment-method";

const meta: Meta<typeof PaymentMethod> = {
  title: "Components/PaymentMethod",
  component: PaymentMethod,
  tags: ["autodocs"],
  argTypes: { size: { control: "select", options: ["lg", "xl"] } },
};

export default meta;
type Story = StoryObj<typeof PaymentMethod>;

export const Default: Story = {};
export const HasValue: Story = {
  args: { children: "Visa ending in 4242" },
};
export const ExtraLarge: Story = {
  args: { size: "xl", children: "Mastercard ending in 1234" },
};
export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <PaymentMethod />
      <PaymentMethod>Visa ending in 4242</PaymentMethod>
      <PaymentMethod aria-invalid>Expired card</PaymentMethod>
    </div>
  ),
};
