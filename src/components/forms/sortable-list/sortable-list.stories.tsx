import type { Meta, StoryObj } from "@storybook/react-vite";
import { SortableList, type SortableListItemValue } from "./sortable-list";

const items: SortableListItemValue[] = [
	{ id: "1", label: "Welcome aboard and safety briefing" },
	{ id: "2", label: "Cruise along Biscayne Bay" },
	{ id: "3", label: "Swim stop at the sandbar" },
	{ id: "4", label: "Sunset toast on the flybridge" },
];

const meta: Meta<typeof SortableList> = {
	title: "Forms/SortableList",
	component: SortableList,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		defaultValue: items,
		placeholder: "Add a step",
	},
	decorators: [
		(Story) => (
			<div className="max-w-[640px]">
				<Story />
			</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof SortableList>;

/**
 * Figma Property 1=Input. Hover a row (grip darkens, × appears), focus its label (input
 * focus ring), or drag it by the grip (card shadow) to see the other Figma states.
 */
export const Default: Story = {};

export const LongLabel: Story = {
	args: {
		defaultValue: [
			{ id: "1", label: "Head south on Crandon Blvd and turn right onto Harbor Drive to reach the yacht club" },
			...items.slice(1),
		],
	},
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex flex-col gap-8">
			<SortableList {...args} />
			<SortableList {...args} disabled />
		</div>
	),
};
