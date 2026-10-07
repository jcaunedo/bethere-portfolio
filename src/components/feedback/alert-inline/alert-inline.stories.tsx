import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertInline } from "./alert-inline";

const meta: Meta<typeof AlertInline> = {
	title: "Feedback/AlertInline",
	component: AlertInline,
	tags: ["autodocs"],
	args: { children: "Label" },
};

export default meta;
type Story = StoryObj<typeof AlertInline>;

export const Info: Story = { args: { variant: "info" } };

export const Warning: Story = { args: { variant: "warning" } };

export const Destructive: Story = { args: { variant: "destructive" } };

export const Success: Story = { args: { variant: "success" } };

/** Figma 896:46 — all four tones. */
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<AlertInline variant="info">Label</AlertInline>
			<AlertInline variant="warning">Label</AlertInline>
			<AlertInline variant="destructive">Label</AlertInline>
			<AlertInline variant="success">Label</AlertInline>
		</div>
	),
};
