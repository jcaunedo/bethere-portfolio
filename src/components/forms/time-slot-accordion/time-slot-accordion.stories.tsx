import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeSlotAccordion, type TimeSlotAccordionValue } from "./time-slot-accordion";

/** One day per Figma state: HasValue (Tue), Required (Thu), Showing 2 slots (Sat), Time Slot / All day (Sun). */
const figmaStates: TimeSlotAccordionValue = {
	tue: [{ start: "09:00", end: "16:00" }],
	thu: [],
	sat: [
		{ start: "09:00", end: "14:00" },
		{ start: "16:00", end: "23:30" },
	],
	sun: [{ start: "00:00", end: "23:59" }],
};

const figmaDays = [
	{ value: "tue", label: "Tuesday" },
	{ value: "thu", label: "Thursday" },
	{ value: "sat", label: "Saturday" },
	{ value: "sun", label: "Sunday" },
];

const meta: Meta<typeof TimeSlotAccordion> = {
	title: "Forms/TimeSlotAccordion",
	component: TimeSlotAccordion,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	decorators: [
		(Story) => (
			<div className="max-w-[640px]">
				<Story />
			</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof TimeSlotAccordion>;

/** Collapsed rows: HasValue, Required, Showing 2 slots, Time Slot (All day). Click a day to edit it. */
export const Default: Story = {
	args: { days: figmaDays, defaultValue: figmaStates },
};

/** Figma Property 1=Edit — Thursday open with two windows (one missing its end time). */
export const Edit: Story = {
	args: {
		days: figmaDays,
		defaultOpenDay: "thu",
		defaultValue: {
			...figmaStates,
			thu: [
				{ start: "06:00", end: "10:00" },
				{ start: "14:00", end: null },
			],
		},
	},
};

/** Full week, nothing set yet — every day Required. */
export const Empty: Story = {};

export const AllVariants: Story = {
	args: {
		days: figmaDays,
		defaultOpenDay: "thu",
		defaultValue: { ...figmaStates, thu: [{ start: "06:00", end: "10:00" }, { start: "14:00", end: null }] },
	},
};
