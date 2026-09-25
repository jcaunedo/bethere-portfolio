import type { Meta, StoryObj } from "@storybook/react-vite";

import { ListingDetailsMatches } from "./listing-details-matches";
import { sampleMatches } from "./sample-matches";

const meta: Meta<typeof ListingDetailsMatches> = {
	title: "Layouts/ListingDetailsMatches",
	component: ListingDetailsMatches,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof ListingDetailsMatches>;

export const Default: Story = {
	args: { matches: sampleMatches },
};
