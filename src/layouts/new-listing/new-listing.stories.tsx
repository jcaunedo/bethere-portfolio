import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "@/components/typography";
import { NewListingLayout } from "./new-listing";

const meta: Meta<typeof NewListingLayout> = {
	title: "Layouts/NewListing/Shell",
	component: NewListingLayout,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	args: {
		steps: 14,
		currentStep: 3,
		stepLabel: "Step 3 of 14",
		title: "Step question goes here",
		description: "A supporting line explains what this step is for.",
	},
};
export default meta;
type Story = StoryObj<typeof NewListingLayout>;

/** Placeholder content, standing in for a step's body. */
function StepContent() {
	return (
		<div className="flex h-40 w-full items-center justify-center rounded-input border border-dashed border-border">
			<Typography size="sm" className="text-muted-foreground">
				Step content renders here.
			</Typography>
		</div>
	);
}

/** Short step: body centered between the stepper and the footer. */
export const Default: Story = {
	render: (args) => (
		<NewListingLayout {...args}>
			<StepContent />
		</NewListingLayout>
	),
};

/** Long form: body starts 40px under the stepper and the page scrolls. */
export const TopAligned: Story = {
	args: { align: "top" },
	render: (args) => (
		<NewListingLayout {...args}>
			<StepContent />
		</NewListingLayout>
	),
};

/** Inside a flow that owns one persistent stepper. */
export const WithoutStepper: Story = {
	args: { showStepper: false },
	render: (args) => (
		<NewListingLayout {...args}>
			<StepContent />
		</NewListingLayout>
	),
};
