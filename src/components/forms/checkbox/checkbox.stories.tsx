import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
	title: "Forms/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		label: "Set different rates by day",
	},
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

/** Figma Property 1=Selected. */
export const Checked: Story = {
	args: { defaultChecked: true },
};

/** Figma Property 1=Partial — e.g. a "select all" when only some rows are checked. */
export const Partial: Story = {
	args: { checked: "indeterminate" },
};

/** Figma Property 1=Disabled. */
export const Disabled: Story = {
	args: { disabled: true },
};

/** Box only (bring your own label, e.g. inside a table row). */
export const WithoutLabel: Story = {
	args: { label: undefined, "aria-label": "Select row" },
};

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex flex-col gap-3">
			<Checkbox {...args} label="Default" />
			<Checkbox {...args} label="Selected" defaultChecked />
			<Checkbox {...args} label="Partial" checked="indeterminate" />
			<Checkbox {...args} label="Disabled" disabled />
		</div>
	),
};
