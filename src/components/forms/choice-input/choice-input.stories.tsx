import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ChoiceInput } from "./choice-input";

const meta: Meta<typeof ChoiceInput> = {
	title: "Forms/ChoiceInput",
	component: ChoiceInput,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		className: "w-[206px]",
	},
};
export default meta;
type Story = StoryObj<typeof ChoiceInput>;

export const Default: Story = {};

/** Opens the text field and types "abc" to show the Focus state with its clear button. */
export const Focus: Story = {
	play: async ({ canvasElement }) => {
		canvasElement.querySelector<HTMLButtonElement>("[data-slot=choice-input] button")?.click();
		await new Promise((resolve) => requestAnimationFrame(resolve));
		const input = canvasElement.querySelector<HTMLInputElement>("[data-slot=choice-input] input");
		if (!input) return;
		// Set through the native setter so React's onChange sees the value.
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "abc");
		input.dispatchEvent(new Event("input", { bubbles: true }));
	},
};

export const Added: Story = {
	args: { defaultValue: "Label" },
};

export const Disabled: Story = {
	args: { disabled: true },
};

function ControlledDemo() {
	const [value, setValue] = React.useState("");
	return (
		<div className="flex w-[206px] flex-col gap-3">
			<ChoiceInput value={value} onValueChange={setValue} />
			<p className="text-sm text-muted-foreground">Value: {value === "" ? "—" : value}</p>
		</div>
	);
}

export const Interactive: Story = {
	render: () => <ControlledDemo />,
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex w-[206px] flex-col gap-4">
			<ChoiceInput />
			<ChoiceInput defaultValue="Label" />
			<ChoiceInput disabled />
			<ChoiceInput defaultValue="Label" disabled />
		</div>
	),
};
