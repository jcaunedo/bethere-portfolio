import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ChoiceItem } from "./choice-item";

const meta: Meta<typeof ChoiceItem> = {
	title: "Forms/ChoiceItem",
	component: ChoiceItem,
	tags: ["autodocs"],
	args: {
		title: "Title",
	},
};
export default meta;
type Story = StoryObj<typeof ChoiceItem>;

export const SingleSelect: Story = {
	args: {
		selectionMode: "single",
	},
};

export const SingleSelectWithDescription: Story = {
	args: {
		selectionMode: "single",
		description: "Description",
	},
};

export const SingleSelectSubtle: Story = {
	args: {
		selectionMode: "single",
		subtle: true,
	},
};

export const MultipleSelect: Story = {
	args: {
		selectionMode: "multiple",
	},
};

export const MultipleSelectSelected: Story = {
	args: {
		selectionMode: "multiple",
		isSelected: true,
	},
};

export const MultipleSelectSubtle: Story = {
	args: {
		selectionMode: "multiple",
		subtle: true,
	},
};

function MultipleSelectDemo() {
	const [selected, setSelected] = React.useState<Set<string>>(new Set());

	const toggle = (value: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(value)) {
				next.delete(value);
			} else {
				next.add(value);
			}
			return next;
		});
	};

	const options = ["Yoga class", "Sound bath", "Meditation session"];

	return (
		<div className="flex w-[400px] flex-col gap-2">
			{options.map((option) => (
				<ChoiceItem
					key={option}
					selectionMode="multiple"
					title={option}
					isSelected={selected.has(option)}
					onClick={() => toggle(option)}
				/>
			))}
		</div>
	);
}

export const MultipleSelectInteractive: Story = {
	render: () => <MultipleSelectDemo />,
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex w-[400px] flex-col gap-8">
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-muted-foreground">Single-select</p>
				<ChoiceItem selectionMode="single" title="Default" />
				<ChoiceItem selectionMode="single" title="Subtle" subtle />
				<ChoiceItem
					selectionMode="single"
					title="With description"
					description="Description"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium text-muted-foreground">Multi-select</p>
				<ChoiceItem selectionMode="multiple" title="Default" />
				<ChoiceItem selectionMode="multiple" title="Subtle" subtle />
				<ChoiceItem selectionMode="multiple" title="Selected" isSelected />
			</div>
		</div>
	),
};
