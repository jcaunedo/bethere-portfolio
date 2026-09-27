import type { Meta, StoryObj } from "@storybook/react-vite";
import { TypeStep } from "./type";

const meta: Meta<typeof TypeStep> = {
	title: "Layouts/NewListing/Type",
	component: TypeStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof TypeStep>;

export const Default: Story = {};
