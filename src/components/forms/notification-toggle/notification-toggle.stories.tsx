import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, MessageCircleMore } from "lucide-react";
import { NotificationToggle } from "./notification-toggle";

const meta: Meta<typeof NotificationToggle> = {
	title: "Forms/NotificationToggle",
	component: NotificationToggle,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	argTypes: {
		checked: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof NotificationToggle>;

function InteractiveRow(props: React.ComponentProps<typeof NotificationToggle>) {
	const [checked, setChecked] = React.useState(props.checked ?? true);
	return <NotificationToggle {...props} checked={checked} onCheckedChange={setChecked} />;
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

/** Channel rows use a custom icon (Mail/MessageCircleMore) instead of the default bell. */
export const CustomIcon: Story = {
	render: () => (
		<div className="flex max-w-4xl flex-col gap-5 p-4">
			<InteractiveRow label="Email" icon={<Mail />} />
			<InteractiveRow label="Text message (SMS)" icon={<MessageCircleMore />} checked={false} />
		</div>
	),
};

/**
 * Locked always displays as off (and stays clickable, calling
 * `onLockedInteraction` instead of toggling itself) while its real `checked`
 * is preserved underneath — toggling `locked` off reveals it was true again.
 */
export const Locked: Story = {
	render: () => {
		function LockedDemo() {
			const [locked, setLocked] = React.useState(true);
			return (
				<div className="flex flex-col gap-4 p-4">
					<button
						type="button"
						className="w-fit rounded-full border px-3 py-1 text-sm"
						onClick={() => setLocked((prev) => !prev)}
					>
						{locked ? "Unlock" : "Lock"}
					</button>
					<NotificationToggle
						label="New booking received"
						checked
						locked={locked}
						onLockedInteraction={() => setLocked(false)}
					/>
				</div>
			);
		}
		return <LockedDemo />;
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex max-w-4xl flex-col gap-1 p-4">
			<InteractiveRow label="Allow Notifications" checked={false} />
			<InteractiveRow label="Allow Notifications" checked />
			<NotificationToggle label="Allow Notifications" disabled checked={false} />
			<InteractiveRow label="Email" icon={<Mail />} />
		</div>
	),
};
