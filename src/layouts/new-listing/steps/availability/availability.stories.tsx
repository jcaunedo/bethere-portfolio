import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvailabilityStep } from "./availability";

const meta: Meta<typeof AvailabilityStep> = {
	title: "Layouts/NewListing/Availability",
	component: AvailabilityStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof AvailabilityStep>;

export const Default: Story = {};
