import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { AvailabilityStep } from "../availability/availability";
import { ExpectationsStep } from "./expectations";

const meta: Meta<typeof ExpectationsStep> = {
	title: "Layouts/NewListing/Expectations",
	component: ExpectationsStep,
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
		<AvailabilityStep onBack={() => go("expectations")} />
	);
}
