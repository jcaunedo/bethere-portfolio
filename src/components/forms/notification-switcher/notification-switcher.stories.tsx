import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationSwitcher } from "./notification-switcher";

const meta: Meta<typeof NotificationSwitcher> = {
	title: "Forms/NotificationSwitcher",
	component: NotificationSwitcher,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	argTypes: {
		activeChannel: {
			control: "select",
			options: ["email", "sms", "whatsapp"],
		},
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
	render: (args) => <InteractiveRow {...args} label="Allow Notifications" />,
};

export const Disabled: Story = {
	args: {
		label: "Allow Notifications",
		disabled: true,
		checked: false,
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex max-w-4xl flex-col gap-1">
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
