import type { Meta, StoryObj } from "@storybook/react-vite";
import { SELECT_STORY } from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";
import { saveDraftSample, withToaster } from "../../shared/save-draft-sample";
import { PricingStep } from "./pricing";

const meta: Meta<typeof PricingStep> = {
	title: "Layouts/ProviderPortal/NewListing/Pricing",
	component: PricingStep,
	// "Save as draft" saves (simulated) and confirms with a toast.
	args: { onSaveDraft: saveDraftSample },
	decorators: [withToaster],
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
