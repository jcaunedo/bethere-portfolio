import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ChoiceGroup } from "./choice-group";

const meta: Meta<typeof ChoiceGroup> = {
	title: "Forms/ChoiceGroup",
	component: ChoiceGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
};
export default meta;
type Story = StoryObj<typeof ChoiceGroup>;

const yesNo = [
	{ value: "yes", label: "Yes" },
	{ value: "no", label: "No" },
];

const yesNoUponRequest = [
	{ value: "yes", label: "Yes" },
	{ value: "no", label: "No" },
	{ value: "upon-request", label: "Upon request" },
];

export const TwoOptions: Story = {
	args: {
		options: yesNo,
		defaultValue: "no",
	},
	render: (args) => (
		<div className="w-[400px]">
			<ChoiceGroup {...args} />
		</div>
	),
};

export const ThreeOptions: Story = {
	args: {
		options: yesNoUponRequest,
		defaultValue: "no",
	},
	render: (args) => (
		<div className="w-[400px]">
			<ChoiceGroup {...args} />
		</div>
	),
};

export const WithDescription: Story = {
	args: {
		options: [
			{ value: "solo", label: "Solo", description: "Just you" },
			{ value: "group", label: "Group", description: "Bring friends" },
		],
		defaultValue: "solo",
	},
	render: (args) => (
		<div className="w-[420px]">
			<ChoiceGroup {...args} />
		</div>
	),
};

export const Disabled: Story = {
	args: {
		options: yesNo,
		defaultValue: "yes",
		disabled: true,
	},
	render: (args) => (
		<div className="w-[400px]">
			<ChoiceGroup {...args} />
		</div>
	),
};

function InteractiveDemo() {
	const [value, setValue] = React.useState("no");
	return (
		<div className="flex w-[400px] flex-col gap-3">
			<ChoiceGroup options={yesNoUponRequest} value={value} onChange={setValue} />
			<p className="text-sm text-muted-foreground">Selected: {value}</p>
		</div>
	);
}

export const Interactive: Story = {
	render: () => <InteractiveDemo />,
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex w-[420px] flex-col gap-6">
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-muted-foreground">Two options</p>
				<ChoiceGroup options={yesNo} defaultValue="no" />
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-muted-foreground">Three options</p>
				<ChoiceGroup options={yesNoUponRequest} defaultValue="no" />
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-muted-foreground">Disabled</p>
				<ChoiceGroup options={yesNo} defaultValue="yes" disabled />
			</div>
		</div>
	),
};
