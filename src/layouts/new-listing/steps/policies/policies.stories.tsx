import type { Meta, StoryObj } from "@storybook/react-vite";
import { saveDraftSample, withToaster } from "../../shared/save-draft-sample";
import { PoliciesStep } from "./policies";

const meta: Meta<typeof PoliciesStep> = {
	title: "Layouts/NewListing/Policies",
	component: PoliciesStep,
	// "Save as draft" saves (simulated) and confirms with a toast.
	args: { onSaveDraft: saveDraftSample },
	decorators: [withToaster],
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
