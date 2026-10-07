import type { Meta, StoryObj } from "@storybook/react-vite";
import { improveWithClaude } from "../../shared/improve-with-claude";
import { ReviewStep } from "./review";

const meta: Meta<typeof ReviewStep> = {
	title: "Layouts/NewListing/Review",
	component: ReviewStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	// AI marks rewrite the field with Claude (Storybook dev server only — see .storybook/improve-copy.ts).
	args: { onImprove: improveWithClaude },
};
export default meta;
type Story = StoryObj<typeof ReviewStep>;

/**
 * Figma 160:6093: the Figma title and description; the AI marks regenerate each field with Claude,
 * and "#/#" switches between versions.
 */
export const Default: Story = {};

/**
 * Auto-generation (off by default for now): Claude writes the title and description from the
 * summary when the step opens, falling back to the Figma copy if it can't. Two Claude calls per load.
 */
export const AutoGenerate: Story = {
	args: { autoGenerate: true },
};

/** Service listing: the copy names a service instead of an experience. */
export const Service: Story = {
	args: { listingType: "service" },
};
