import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Button } from "@/components/buttons/button";
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

/** Advancing fills the next segment left → right; Back (or a completed segment) empties it right → left. */
export const Advancing: Story = {
  render: () => <AdvancingStepper />,
};

function AdvancingStepper() {
  const steps = 12;
  const [step, setStep] = React.useState(1);
  return (
    <div className="flex w-[600px] flex-col gap-4">
      <StepperExperience
        steps={steps}
        currentStep={step}
        label={`Step ${step} of ${steps}`}
        onBack={step > 1 ? () => setStep(step - 1) : undefined}
        onClose={() => {}}
        onStepClick={setStep}
      />
      <div className="flex justify-end">
        <Button type="button" disabled={step === steps} onClick={() => setStep(step + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

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
