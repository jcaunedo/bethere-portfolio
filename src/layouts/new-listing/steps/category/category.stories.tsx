import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExperienceCategorySelector } from "./experience-category-selector";

const meta: Meta<typeof ExperienceCategorySelector> = {
	title: "Layouts/ExperienceCategorySelector",
	component: ExperienceCategorySelector,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof ExperienceCategorySelector>;

export const Default: Story = {
	args: {
		options: [
			"Motor Yacht",
			"Sailing Yacht",
			"Catamaran",
			"Sport Fishing Yacht",
			"Party Yacht",
			"Luxury Yacht",
			"Other",
		],
	},
};
