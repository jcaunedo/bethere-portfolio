import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewListingFlow } from "./new-listing-flow";

/**
 * The whole New Listing flow, stitched from the step layouts in `./steps/`. Each step is
 * named for what it collects (search, attributes, expectations…), not for one listing type;
 * the order below is the Experience → yacht charter path from product-specs.
 */
const meta: Meta = {
	title: "Layouts/ProviderPortal/NewListing/Flow",
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj;

/**
 * Steps 1 → 13: Experience → yacht type → yacht lookup → matches → attributes → expectations →
 * availability → pricing → photos → business → policies → documents → review; the stepper's back
 * button steps back. Review's summary shows what was chosen along the way; a card's pencil opens
 * its step, and that step's Continue returns to Review.
 */
export const Default: Story = {
	render: () => <NewListingFlow />,
};
