import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExperienceLocation, type ExperienceLocationValue } from "./experience-location";

const sailingClub: ExperienceLocationValue = {
	name: "Coconut Grove Sailing Club",
	address: "2990 S Bayshore Dr, Miami, FL 33133",
	additionalInfo: "Dock B — Slip 14",
	instructions:
		"Check in at the dock office, then follow the signs to Dock B, Slip 14. Your captain will be there to welcome you aboard!",
};

const meta: Meta<typeof ExperienceLocation> = {
	title: "Cards/ExperienceLocation",
	component: ExperienceLocation,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		defaultValue: sailingClub,
	},
	decorators: [
		(Story) => (
			<div className="max-w-[638px]">
				<Story />
			</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof ExperienceLocation>;

/** Figma Property 1=Default. The pencil opens Edit; Save/Cancel return here. */
export const Default: Story = {};

/** Figma Property 1=Edit. The map re-centers on the Address field once typing pauses. */
export const Edit: Story = {
	args: { defaultEditing: true },
};

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex flex-col gap-4">
			<ExperienceLocation {...args} />
			<ExperienceLocation {...args} defaultEditing />
		</div>
	),
};
