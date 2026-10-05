import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
	title: "Forms/RadioGroup",
	component: RadioGroup,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

/** Figma Property 1=Default and Selected. */
export const Default: Story = {
	render: (args) => (
		<RadioGroup defaultValue="daily" {...args}>
			<RadioGroupItem value="daily" label="Daily" />
			<RadioGroupItem value="weekly" label="Weekly" />
			<RadioGroupItem value="monthly" label="Monthly" />
		</RadioGroup>
	),
};

/** Figma Property 1=Disabled — unselected and selected. */
export const Disabled: Story = {
	render: (args) => (
		<RadioGroup defaultValue="daily" {...args}>
			<RadioGroupItem value="daily" label="Daily" disabled />
			<RadioGroupItem value="weekly" label="Weekly" disabled />
		</RadioGroup>
	),
};

/** `size="lg"` (24px) — the radio size used by BusinessChoiceCard. */
export const Large: Story = {
	render: (args) => (
		<RadioGroup defaultValue="a" className="flex gap-4" {...args}>
			<RadioGroupItem value="a" size="lg" aria-label="Option A" />
			<RadioGroupItem value="b" size="lg" aria-label="Option B" />
			<RadioGroupItem value="c" size="lg" aria-label="Option C" disabled />
		</RadioGroup>
	),
};

/** Radios only (bring your own label). */
export const WithoutLabel: Story = {
	render: (args) => (
		<RadioGroup defaultValue="a" className="flex gap-4" {...args}>
			<RadioGroupItem value="a" aria-label="Option A" />
			<RadioGroupItem value="b" aria-label="Option B" />
		</RadioGroup>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			{(["md", "lg"] as const).map((size) => (
				<RadioGroup key={size} defaultValue="selected" className="flex gap-6">
					<RadioGroupItem value="default" size={size} label="Default" />
					<RadioGroupItem value="selected" size={size} label="Selected" />
					<RadioGroupItem value="disabled" size={size} label="Disabled" disabled />
				</RadioGroup>
			))}
			<RadioGroup defaultValue="selected-disabled" className="flex gap-6">
				<RadioGroupItem value="selected-disabled" label="Selected + disabled" disabled />
			</RadioGroup>
		</div>
	),
};
