import type { Meta, StoryObj } from "@storybook/react-vite";

import { MatchesStep } from "./matches";
import { sampleMatches } from "./sample-matches";

const meta: Meta<typeof MatchesStep> = {
	title: "Layouts/NewListing/Matches",
	component: MatchesStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof MatchesStep>;

export const Default: Story = {
	args: { matches: sampleMatches },
};
