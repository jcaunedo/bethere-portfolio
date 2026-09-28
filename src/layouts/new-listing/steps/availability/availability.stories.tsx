import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { sampleListingDays } from "../../shared/week";
import { PricingStep } from "../pricing/pricing";
import { AvailabilityStep } from "./availability";

const meta: Meta<typeof AvailabilityStep> = {
	title: "Layouts/NewListing/Availability",
	component: AvailabilityStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof AvailabilityStep>;

/**
 * "Continue" goes to the next step (Pricing), which offers the days picked here for by-day rates;
 * its back arrow and "Change days" return here with the same days selected.
 */
export const Default: Story = {
	render: (args) => <AvailabilityToPricing {...args} />,
};

function AvailabilityToPricing(props: React.ComponentProps<typeof AvailabilityStep>) {
	const [screen, setScreen] = React.useState<"availability" | "pricing">("availability");
	const [days, setDays] = React.useState(sampleListingDays);

	// Each screen is a long page — start the next one at the top.
	const go = (next: typeof screen) => {
		setScreen(next);
		window.scrollTo({ top: 0 });
	};

	return screen === "availability" ? (
		<AvailabilityStep {...props} days={days} onDaysChange={setDays} onContinue={() => go("pricing")} />
	) : (
		<PricingStep days={days} onBack={() => go("availability")} onChangeDays={() => go("availability")} />
	);
}
