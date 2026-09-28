import type { Meta, StoryObj } from "@storybook/react-vite";
import { PricingStep } from "./pricing";

const meta: Meta<typeof PricingStep> = {
	title: "Layouts/NewListing/Pricing",
	component: PricingStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof PricingStep>;

export const Default: Story = {};
