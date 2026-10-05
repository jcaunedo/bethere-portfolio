import type { Meta, StoryObj } from "@storybook/react-vite";
import { PoliciesStep } from "./policies";

const meta: Meta<typeof PoliciesStep> = {
	title: "Layouts/NewListing/Policies",
	component: PoliciesStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof PoliciesStep>;

/** Figma 109:3517: 13+, 48 hours, Flexible and Reschedule picked. Pick "Custom" cancellation for the terms field. */
export const Default: Story = {};

/** Service listing: the copy names a service instead of an experience. */
export const Service: Story = {
	args: { listingType: "service" },
};
