import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoleSelect } from "./role-select";

const meta: Meta<typeof RoleSelect> = {
  title: "Forms/RoleSelect",
  component: RoleSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RoleSelect>;

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <RoleSelect />
    </div>
  ),
};

export const Preselected: Story = {
  render: () => (
    <div className="w-72">
      <RoleSelect defaultValue="admin" />
    </div>
  ),
};
