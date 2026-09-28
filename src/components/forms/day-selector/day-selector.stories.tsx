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

/** Figma Property 1=Available — the day has availability (dark label, no shadow/border). */
export const Available: Story = {
	args: { isAvailable: true },
};

/** Figma Property 1=Selected. */
export const Selected: Story = {
	args: { isSelected: true },
};

/** Figma Property 1=Disabled — subtle label, full opacity, not interactive. */
export const Disabled: Story = {
	args: { disabled: true },
};

/** Figma Show Alert — red dot flagging the day needs attention; shown in every state. */
export const WithAlert: Story = {
	args: { isSelected: true, showAlert: true },
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

/** Every state in one row: Tue/Thu available, Wed selected, Mon disabled, the rest default. */
export const GroupWithAvailability: Story = {
	decorators: [
		(Story) => (
			<div className="w-[640px]">
				<Story />
			</div>
		),
	],
	render: () => (
		<DaySelectorGroup
			options={[
				{ value: "mon", label: "Mon", disabled: true },
				{ value: "tue", label: "Tue" },
				{ value: "wed", label: "Wed" },
				{ value: "thu", label: "Thu" },
				{ value: "fri", label: "Fri" },
				{ value: "sat", label: "Sat" },
				{ value: "sun", label: "Sun" },
			]}
			availableDays={["tue", "thu", "sat"]}
			defaultValue={["wed"]}
		/>
	),
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
			<div className="grid w-[364px] grid-cols-4 gap-2">
				<DaySelector label="Day" />
				<DaySelector label="Day" isAvailable />
				<DaySelector label="Day" isSelected />
				<DaySelector label="Day" disabled />
				<DaySelector label="Day" showAlert />
				<DaySelector label="Day" isAvailable showAlert />
				<DaySelector label="Day" isSelected showAlert />
				<DaySelector label="Day" disabled showAlert />
			</div>
			<DaySelectorGroup defaultValue={["sat", "sun"]} />
			{/* Availability step: Thu selected with no time window yet. */}
			<DaySelectorGroup defaultValue={["tue", "thu", "sat", "sun"]} alertDays={["thu"]} />
		</div>
	),
};
