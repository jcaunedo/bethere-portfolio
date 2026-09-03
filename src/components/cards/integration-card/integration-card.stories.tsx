import type { Meta, StoryObj } from "@storybook/react-vite";

import { IntegrationCard } from "./integration-card";
import googleCalendarLogo from "./images/google-calendar.png";
import slackLogo from "./images/slack.png";
import stripeLogo from "./images/stripe.png";

const meta: Meta<typeof IntegrationCard> = {
	title: "Cards/IntegrationCard",
	component: IntegrationCard,
	tags: ["autodocs"],
	argTypes: {
		title: { control: "text" },
		description: { control: "text" },
		connected: { control: "boolean" },
	},
	decorators: [
		(Story) => (
			<div className='w-[880px]'>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof IntegrationCard>;

/** Figma: Property 1=Default — icon, title, description, and a "Connect" action. */
export const Default: Story = {
	args: {
		icon: <img src={googleCalendarLogo} alt='' />,
		title: "Google Calendar",
		description:
			"Keep your Bethere bookings and availability in sync with Google Calendar.",
		connected: false,
	},
};

/** Figma: Property 1=Connected — a "Disconnect" action plus a connection-details block. */
export const Connected: Story = {
	args: {
		icon: <img src={googleCalendarLogo} alt='' />,
		title: "Google Calendar",
		description:
			"Keep your Bethere bookings and availability in sync with Google Calendar.",
		connected: true,
		details: [
			{ label: "Connected as", value: "lucysmith@gmail.com" },
			{
				label: "Calendars",
				value: "Bookings, Personal",
				editLabel: "Edit",
				onEditClick: () => alert("Edit calendars"),
			},
		],
	},
};

/** The icon slot is generic — any provider mark works, not just Google's. */
export const OtherProvider: Story = {
	args: {
		icon: <img src={slackLogo} alt='' />,
		title: "Slack",
		description:
			"Get notified in Slack about new bookings, changes, cancellations, and other important Bethere activity.",
		connected: false,
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className='flex w-[880px] flex-col gap-4'>
			<IntegrationCard
				icon={<img src={googleCalendarLogo} alt='' />}
				title='Google Calendar'
				description='Keep your Bethere bookings and availability in sync with Google Calendar.'
				connected
				details={[
					{ label: "Connected as", value: "lucysmith@gmail.com" },
					{
						label: "Calendars",
						value: "Bookings, Personal",
						editLabel: "Edit",
						onEditClick: () => alert("Edit calendars"),
					},
				]}
			/>
			<IntegrationCard
				icon={<img src={slackLogo} alt='' />}
				title='Slack'
				description='Get notified in Slack about new bookings, changes, cancellations, and other important Bethere activity.'
				connected={false}
			/>
			<IntegrationCard
				icon={<img src={stripeLogo} alt='' />}
				title='Stripe'
				description='Connect Stripe to accept payments and manage payouts for your bookings.'
				connected={false}
			/>
		</div>
	),
};
