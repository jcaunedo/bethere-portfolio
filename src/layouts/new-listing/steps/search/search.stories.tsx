import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchStep } from "./search";

const meta: Meta<typeof SearchStep> = {
	title: "Layouts/NewListing/Search",
	component: SearchStep,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof SearchStep>;

export const Default: Story = {};
