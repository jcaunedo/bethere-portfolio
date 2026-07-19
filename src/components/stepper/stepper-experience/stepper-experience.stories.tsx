import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepperExperience } from "./stepper-experience";

const meta: Meta<typeof StepperExperience> = {
  title: "Stepper/StepperExperience",
  component: StepperExperience,
  tags: ["autodocs"],
  argTypes: {
    steps: { control: "number" },
    currentStep: { control: "number" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof StepperExperience>;

export const Default: Story = {
  args: {
    steps: 12,
    currentStep: 2,
    label: "Step 2 of 12 · Description (optional)",
    onBack: () => {},
    onClose: () => {},
    onStepClick: (step) => alert(`Jump back to step ${step}`),
  },
};

export const NoBack: Story = {
  args: {
    steps: 12,
    currentStep: 1,
    label: "Step 1 of 12 · Description (optional)",
    onClose: () => {},
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[600px] flex-col gap-6">
      <StepperExperience
        steps={12}
        currentStep={1}
        label="Step 1 of 12 · Description (optional)"
        onClose={() => {}}
      />
      <StepperExperience
        steps={12}
        currentStep={6}
        label="Step 6 of 12 · Description (optional)"
        onBack={() => {}}
        onClose={() => {}}
      />
    </div>
  ),
};
