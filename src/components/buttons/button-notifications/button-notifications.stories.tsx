import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonNotifications } from "./button-notifications";

const meta: Meta<typeof ButtonNotifications> = {
  title: "Buttons/ButtonNotifications",
  component: ButtonNotifications,
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonNotifications>;

export const Default: Story = {
  args: {},
};

export const Active: Story = {
  args: {
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ButtonNotifications />
      <ButtonNotifications active />
      <ButtonNotifications disabled />
    </div>
  ),
};
