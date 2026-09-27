import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExperienceExpectations } from "./experience-expectations";

const meta: Meta<typeof ExperienceExpectations> = {
	title: "Layouts/ExperienceExpectations",
	component: ExperienceExpectations,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof ExperienceExpectations>;

export const Default: Story = {};
