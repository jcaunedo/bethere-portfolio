import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { saveDraftSample, withToaster } from "../../shared/save-draft-sample";
import { AvailabilityStep } from "../availability/availability";
import { ExpectationsStep } from "./expectations";

const meta: Meta<typeof ExpectationsStep> = {
	title: "Layouts/ProviderPortal/NewListing/Expectations",
	component: ExpectationsStep,
	// "Save as draft" saves (simulated) and confirms with a toast.
	args: { onSaveDraft: saveDraftSample },
	decorators: [withToaster],
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof ExpectationsStep>;

/** "Continue" goes to the next step (Availability); its back arrow returns here. */
export const Default: Story = {
	render: (args) => <ExpectationsToAvailability {...args} />,
};

function ExpectationsToAvailability(props: React.ComponentProps<typeof ExpectationsStep>) {
	const [screen, setScreen] = React.useState<"expectations" | "availability">("expectations");

	// Each screen is a long page — start the next one at the top.
	const go = (next: typeof screen) => {
		setScreen(next);
		window.scrollTo({ top: 0 });
	};

	return screen === "expectations" ? (
		<ExpectationsStep {...props} onContinue={() => go("availability")} />
	) : (
		<AvailabilityStep onBack={() => go("expectations")} onSaveDraft={props.onSaveDraft} />
	);
}
