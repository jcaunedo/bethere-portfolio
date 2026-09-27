import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { ExperienceExpectations } from "@/layouts/experience-expectations/experience-expectations";
import { ListingAttributes } from "./listing-attributes";

const meta: Meta<typeof ListingAttributes> = {
	title: "Layouts/ListingAttributes",
	component: ListingAttributes,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof ListingAttributes>;

/** "Continue" goes to the next step (Experience Expectations); its back arrow returns here. */
export const Default: Story = {
	render: (args) => <AttributesToExpectations {...args} />,
};

function AttributesToExpectations(props: React.ComponentProps<typeof ListingAttributes>) {
	const [screen, setScreen] = React.useState<"attributes" | "expectations">("attributes");

	// Each screen is a long page — start the next one at the top.
	const go = (next: typeof screen) => {
		setScreen(next);
		window.scrollTo({ top: 0 });
	};

	return screen === "attributes" ? (
		<ListingAttributes {...props} onContinue={() => go("expectations")} />
	) : (
		<ExperienceExpectations onBack={() => go("attributes")} />
	);
}
