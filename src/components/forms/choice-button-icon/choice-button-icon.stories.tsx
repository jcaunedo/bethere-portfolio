import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarIcon } from "lucide-react";
import * as React from "react";
import { ChoiceButtonIcon } from "./choice-button-icon";

const meta: Meta<typeof ChoiceButtonIcon> = {
	title: "Forms/ChoiceButtonIcon",
	component: ChoiceButtonIcon,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		icon: <StarIcon className="size-full" />,
		label: "Label",
		className: "w-[206px]",
	},
};
export default meta;
type Story = StoryObj<typeof ChoiceButtonIcon>;

export const Default: Story = {};

export const Active: Story = {
	args: { isSelected: true },
};

export const Disabled: Story = {
	args: { disabled: true },
};

function ToggleDemo() {
	const [selected, setSelected] = React.useState(false);
	return (
		<ChoiceButtonIcon
			icon={<StarIcon className="size-full" />}
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
			<ChoiceButtonIcon icon={<StarIcon className="size-full" />} label="Label" />
			<ChoiceButtonIcon icon={<StarIcon className="size-full" />} label="Label" isSelected />
			<ChoiceButtonIcon icon={<StarIcon className="size-full" />} label="Label" disabled />
			<ChoiceButtonIcon
				icon={<StarIcon className="size-full" />}
				label="Label"
				isSelected
				disabled
			/>
		</div>
	),
};
