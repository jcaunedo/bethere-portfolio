import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryStep } from "./category";

const meta: Meta<typeof CategoryStep> = {
	title: "Layouts/ProviderPortal/NewListing/Category",
	component: CategoryStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof CategoryStep>;

export const Default: Story = {
	args: {
		options: [
			"Motor Yacht",
			"Sailing Yacht",
			"Catamaran",
			"Sport Fishing Yacht",
			"Party Yacht",
			"Luxury Yacht",
			"Other",
		],
	},
};
