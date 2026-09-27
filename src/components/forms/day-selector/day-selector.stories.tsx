import type { Meta, StoryObj } from "@storybook/react-vite";
import { DaySelector, DaySelectorGroup } from "./day-selector";

const meta: Meta<typeof DaySelector> = {
	title: "Forms/DaySelector",
	component: DaySelector,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		label: "Mon",
	},
	decorators: [
		(Story) => (
			<div className="w-[85px]">
				<Story />
			</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof DaySelector>;

/** Figma Property 1=Default. Hover it for Property 1=Hover. */
export const Default: Story = {};

/** Figma Property 1=Selected. */
export const Selected: Story = {
	args: { isSelected: true },
};

export const Disabled: Story = {
	args: { disabled: true },
};

/** Mon–Sun row, multi-select. */
export const Group: Story = {
	decorators: [
		(Story) => (
			<div className="w-[640px]">
				<Story />
			</div>
		),
	],
	render: () => <DaySelectorGroup defaultValue={["mon", "wed", "fri"]} />,
};

export const AllVariants: Story = {
	decorators: [
		(Story) => (
			<div className="w-[640px]">
				<Story />
			</div>
		),
	],
	render: () => (
		<div className="flex flex-col gap-6">
			<div className="grid w-[276px] grid-cols-3 gap-2">
				<DaySelector label="Day" />
				<DaySelector label="Day" isSelected />
				<DaySelector label="Day" disabled />
			</div>
			<DaySelectorGroup defaultValue={["sat", "sun"]} />
		</div>
	),
};
