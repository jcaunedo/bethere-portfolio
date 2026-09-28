import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ChoiceChip } from "./choice-chip";

const meta: Meta<typeof ChoiceChip> = {
	title: "Forms/ChoiceChip",
	component: ChoiceChip,
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
type Story = StoryObj<typeof ChoiceChip>;

export const Default: Story = {};

export const Selected: Story = {
	args: { isSelected: true },
};

export const Disabled: Story = {
	args: { disabled: true },
};

/** Figma State=Default-alt — on a white (color/background/neutral/background) surface. Hover/select to see the shared states. */
export const OnNeutralSurface: Story = {
	args: { surface: "neutral" },
	decorators: [
		(Story) => (
			<div className="w-fit rounded-card bg-card p-6">
				<Story />
			</div>
		),
	],
};

function ToggleDemo() {
	const [selected, setSelected] = React.useState(false);
	return (
		<ChoiceChip
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
			<ChoiceChip label="Label" />
			<ChoiceChip label="Label" isSelected />
			<ChoiceChip label="Label" disabled />
			<ChoiceChip label="Label" isSelected disabled />
			{/* surface="neutral" (Figma Default-alt) on a white card. */}
			<div className="-mx-4 flex flex-col gap-4 rounded-card bg-card p-4">
				<ChoiceChip label="Label" surface="neutral" />
				<ChoiceChip label="Label" surface="neutral" isSelected />
			</div>
		</div>
	),
};
