import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewListing } from "./new-listing";

const meta: Meta<typeof NewListing> = {
	title: "Layouts/NewListing",
	component: NewListing,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof NewListing>;

export const Default: Story = {};
