import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ChoiceCard } from "./choice-card";

const meta: Meta<typeof ChoiceCard> = {
	title: "Forms/ChoiceCard",
	component: ChoiceCard,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		label: "Label",
		description: "Description",
		className: "w-[206px]",
	},
};
export default meta;
type Story = StoryObj<typeof ChoiceCard>;

export const Default: Story = {};

export const Selected: Story = {
	args: { isSelected: true },
};

export const WithoutDescription: Story = {
	args: { description: undefined },
};

export const Disabled: Story = {
	args: { disabled: true },
};

function ToggleDemo() {
	const [selected, setSelected] = React.useState(false);
	return (
		<ChoiceCard
			label="Private event"
			description="Celebrations and hosted gatherings."
			className="w-[260px]"
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
			<ChoiceCard label="Label" description="Description" />
			<ChoiceCard label="Label" description="Description" isSelected />
			<ChoiceCard label="Label" description="Description" disabled />
			<ChoiceCard label="Label" description="Description" isSelected disabled />
		</div>
	),
};
