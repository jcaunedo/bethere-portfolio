import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChoiceButtonIndicator } from "./choice-button-indicator";

const meta: Meta<typeof ChoiceButtonIndicator> = {
	title: "Primitives/ChoiceButtonIndicator",
	component: ChoiceButtonIndicator,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
};
export default meta;
type Story = StoryObj<typeof ChoiceButtonIndicator>;

export const Default: Story = {};

export const Selected: Story = {
	args: { isSelected: true },
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<ChoiceButtonIndicator />
			<ChoiceButtonIndicator isSelected />
		</div>
	),
};
