import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListingAttributes } from "./listing-attributes";

const meta: Meta<typeof ListingAttributes> = {
	title: "Layouts/ListingAttributes",
	component: ListingAttributes,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof ListingAttributes>;

export const Default: Story = {};
