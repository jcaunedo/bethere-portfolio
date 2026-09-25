import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ChoiceButton } from "./choice-button";

const meta: Meta<typeof ChoiceButton> = {
	title: "Forms/ChoiceButton",
	component: ChoiceButton,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		label: "Label",
		className: "w-[206px]",
	},
};
export default meta;
type Story = StoryObj<typeof ChoiceButton>;

export const Default: Story = {};

export const Active: Story = {
	args: { isSelected: true },
};

export const LongLabel: Story = {
	args: { label: "Private events, celebrations and hosted gatherings" },
};

export const Disabled: Story = {
	args: { disabled: true },
};

function ToggleDemo() {
	const [selected, setSelected] = React.useState(false);
	return (
		<ChoiceButton
			label="Label"
			className="w-[206px]"
			isSelected={selected}
			onClick={() => setSelected((s) => !s)}
		/>
	);
}

export const Interactive: Story = {
	render: () => <ToggleDemo />,
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex w-[206px] flex-col gap-4">
			<ChoiceButton label="Label" />
			<ChoiceButton label="Label" isSelected />
			<ChoiceButton label="Label" disabled />
			<ChoiceButton label="Label" isSelected disabled />
		</div>
	),
};
