import type { Meta, StoryObj } from "@storybook/react-vite";
import { saveDraftSample, withToaster } from "../../shared/save-draft-sample";
import { BusinessStep } from "./business";
import { sampleBusinesses } from "./sample-businesses";

const meta: Meta<typeof BusinessStep> = {
	title: "Layouts/NewListing/Business",
	component: BusinessStep,
	// "Save as draft" saves (simulated) and confirms with a toast.
	args: { onSaveDraft: saveDraftSample },
	decorators: [withToaster],
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof BusinessStep>;

/** One business — the common case: tick "Yes, this is the business for this listing" to unlock Continue (Figma 106:2827). */
export const Default: Story = {
	args: { businesses: sampleBusinesses.slice(0, 1) },
};

/** Several businesses: pick one; Continue unlocks once one is selected (Figma 110:3850). */
export const Multiple: Story = {
	args: { businesses: sampleBusinesses },
};

/** Service listing: the copy names a service instead of an experience. */
export const Service: Story = {
	args: { businesses: sampleBusinesses.slice(0, 1), listingType: "service" },
};
