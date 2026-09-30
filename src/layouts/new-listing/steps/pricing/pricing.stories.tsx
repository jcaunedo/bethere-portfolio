import type { Meta, StoryObj } from "@storybook/react-vite";
import { SELECT_STORY } from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";
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

/** Continue opens the next step's story, Photos (in the Flow story it advances in place). */
export const Default: Story = {
	args: {
		onContinue: () =>
			addons.getChannel().emit(SELECT_STORY, { storyId: "layouts-newlisting-photos--default" }),
	},
};
