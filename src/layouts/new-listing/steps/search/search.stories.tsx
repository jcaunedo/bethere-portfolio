import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListingDetails } from "./listing-details";

const meta: Meta<typeof ListingDetails> = {
	title: "Layouts/ListingDetails",
	component: ListingDetails,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof ListingDetails>;

export const Default: Story = {};
