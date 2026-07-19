import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepIndicator } from "./step-indicator";

const meta: Meta<typeof StepIndicator> = {
  title: "Stepper/StepIndicator",
  component: StepIndicator,
  tags: ["autodocs"],
  argTypes: {
    state: { control: "select", options: ["default", "active", "done"] },
  },
};

export default meta;
type Story = StoryObj<typeof StepIndicator>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="w-32">
      <StepIndicator {...args} />
    </div>
  ),
};

export const Active: Story = {
  args: { state: "active" },
  render: (args) => (
    <div className="w-32">
      <StepIndicator {...args} />
    </div>
  ),
};

export const Done: Story = {
  args: { state: "done", onClick: () => alert("Jump back to this step") },
  render: (args) => (
    <div className="w-32">
      <StepIndicator {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-64 gap-2">
      <StepIndicator state="default" />
      <StepIndicator state="active" />
      <StepIndicator state="done" />
    </div>
  ),
};
