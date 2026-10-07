import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { saveDraftSample, withToaster } from "../../shared/save-draft-sample";
import { ExpectationsStep } from "../expectations/expectations";
import { AttributesStep } from "./attributes";

const meta: Meta<typeof AttributesStep> = {
	title: "Layouts/NewListing/Attributes",
	component: AttributesStep,
	// "Save as draft" saves (simulated) and confirms with a toast.
	args: { onSaveDraft: saveDraftSample },
	decorators: [withToaster],
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof AttributesStep>;

/** "Continue" goes to the next step (Expectations); its back arrow returns here. */
export const Default: Story = {
	render: (args) => <AttributesToExpectations {...args} />,
};

function AttributesToExpectations(props: React.ComponentProps<typeof AttributesStep>) {
	const [screen, setScreen] = React.useState<"attributes" | "expectations">("attributes");

	// Each screen is a long page — start the next one at the top.
	const go = (next: typeof screen) => {
		setScreen(next);
		window.scrollTo({ top: 0 });
	};

	return screen === "attributes" ? (
		<AttributesStep {...props} onContinue={() => go("expectations")} />
	) : (
		<ExpectationsStep onBack={() => go("attributes")} onSaveDraft={props.onSaveDraft} />
	);
}
