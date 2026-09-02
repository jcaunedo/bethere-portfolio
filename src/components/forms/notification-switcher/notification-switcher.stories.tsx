import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationSwitcher } from "./notification-switcher";

const meta: Meta<typeof NotificationSwitcher> = {
	title: "Forms/NotificationSwitcher",
	component: NotificationSwitcher,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	argTypes: {
		checked: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof NotificationSwitcher>;

function InteractiveRow(
	props: React.ComponentProps<typeof NotificationSwitcher>,
) {
	const [checked, setChecked] = React.useState(props.checked ?? true);
	return (
		<NotificationSwitcher
			{...props}
			checked={checked}
			onCheckedChange={setChecked}
		/>
	);
}

export const Active: Story = {
	render: (args) => (
		<div className="p-4">
			<InteractiveRow {...args} label="Allow Notifications" />
		</div>
	),
};

/** Figma `States=Disabled` — this is the toggle's unchecked/off appearance, still fully interactive. */
export const Unchecked: Story = {
	render: (args) => (
		<div className="p-4">
			<InteractiveRow {...args} label="Allow Notifications" checked={false} />
		</div>
	),
};

/** Interaction blocked entirely — distinct from the unchecked/off appearance above. */
export const InteractionDisabled: Story = {
	args: {
		label: "Allow Notifications",
		disabled: true,
		checked: false,
	},
	decorators: [
		(StoryFn) => (
			<div className="p-4">
				<StoryFn />
			</div>
		),
	],
};

/**
 * Each channel button (email/SMS/WhatsApp) is independently clickable and
 * toggles its own active state. Turning the row's switch off disables all
 * three (and `disabled` does too) — re-enabling restores whichever channels
 * were active, since that state is untouched by either toggle.
 */
export const IndependentChannelButtons: Story = {
	render: (args) => {
		function ToggleRow() {
			const [checked, setChecked] = React.useState(args.checked ?? true);
			return (
				<div className="flex flex-col gap-4 p-4">
					<button
						type="button"
						className="w-fit rounded-full border px-3 py-1 text-sm"
						onClick={() => setChecked((prev) => !prev)}
					>
						{checked ? "Turn switch off" : "Turn switch on"}
					</button>
					<NotificationSwitcher
						{...args}
						checked={checked}
						onCheckedChange={setChecked}
					/>
				</div>
			);
		}
		return <ToggleRow />;
	},
	args: {
		label: "Allow Notifications",
		checked: true,
		defaultActiveChannels: ["sms"],
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex max-w-4xl flex-col gap-1 p-4">
			<InteractiveRow label="Allow Notifications" checked={false} />
			<InteractiveRow label="Allow Notifications" checked />
			<NotificationSwitcher
				label="Allow Notifications"
				disabled
				checked={false}
			/>
		</div>
	),
};
