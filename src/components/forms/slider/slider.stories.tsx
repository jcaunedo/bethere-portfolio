import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Typography } from "@/components/typography";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
	title: "Forms/Slider",
	component: Slider,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		"aria-label": "Percentage adjustment",
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
type Story = StoryObj<typeof Slider>;

/** Neutral: value 0, no fill, both bounds shown subtle. Drag or use ←/→ (Home/End/PageUp/PageDown work too). */
export const Default: Story = {};

/** Figma sample: +15%, filled from 0 toward the thumb; the right end shows the live value. */
export const Positive: Story = {
	args: { defaultValue: 15 },
};

/** Below the origin, the fill grows leftward from 0 and the left end shows the live value. */
export const Negative: Story = {
	args: { defaultValue: -40 },
};

/** Coarser steps. */
export const Step5: Story = {
	args: { defaultValue: 20, step: 5 },
};

export const Disabled: Story = {
	args: { defaultValue: 15, disabled: true },
};

/** Controlled, reporting the committed value. */
export const Controlled: Story = {
	render: (args) => {
		const [value, setValue] = React.useState(15);
		const [committed, setCommitted] = React.useState(15);
		return (
			<div className="flex flex-col gap-2">
				<Slider {...args} value={value} onValueChange={setValue} onValueCommit={setCommitted} />
				<Typography size="xs" className="text-muted-foreground">
					Committed: {committed}%
				</Typography>
			</div>
		);
	},
};

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex flex-col gap-3">
			<Slider {...args} />
			<Slider {...args} defaultValue={15} />
			<Slider {...args} defaultValue={-40} />
			<Slider {...args} defaultValue={100} />
			<Slider {...args} defaultValue={-100} />
			<Slider {...args} defaultValue={15} disabled />
		</div>
	),
};
