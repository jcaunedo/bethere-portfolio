import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepperOnboarding } from "./stepper-onboarding";

const meta: Meta<typeof StepperOnboarding> = {
  title: "Stepper/StepperOnboarding",
  component: StepperOnboarding,
  tags: ["autodocs"],
  argTypes: {
    steps: { control: "number" },
    currentStep: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof StepperOnboarding>;

export const Default: Story = {
  args: {
    steps: 3,
    currentStep: 1,
  },
};

export const MiddleStep: Story = {
  args: {
    steps: 3,
    currentStep: 2,
    onStepClick: (step) => alert(`Jump back to step ${step}`),
  },
};

export const LastStep: Story = {
  args: {
    steps: 3,
    currentStep: 3,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <StepperOnboarding steps={3} currentStep={1} />
      <StepperOnboarding steps={3} currentStep={2} />
      <StepperOnboarding steps={3} currentStep={3} />
    </div>
  ),
};
