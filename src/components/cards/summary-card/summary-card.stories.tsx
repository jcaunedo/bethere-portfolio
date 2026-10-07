import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlocksIcon, CircleUserIcon, DollarSignIcon, MapPinIcon, ShipIcon, TimerIcon } from "lucide-react";

import jumpFromBoat from "@/assets/images/jump-from-boat.webp";
import { SummaryCard } from "./summary-card";

const meta: Meta<typeof SummaryCard> = {
	title: "Cards/SummaryCard",
	component: SummaryCard,
	tags: ["autodocs"],
	// Preview on the app surface these sit on (color/background/accent/background = --background).
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	decorators: [
		(Story) => (
			<div className="max-w-[640px]">
				<Story />
			</div>
		),
	],
	args: {
		eyebrow: "Yacht",
		value: "Little Atocha · Azimut 55 Fly (2021)",
		detail: "55 ft · 13 guests · 3 cabins · 2 bathrooms",
		icon: ShipIcon,
		editLabel: "Edit yacht: Little Atocha",
	},
};
export default meta;
type Story = StoryObj<typeof SummaryCard>;

/** Figma Property 1=Default. Hover anywhere on the card for Property 1=Hover (card shadow, dark pencil). */
export const Default: Story = {};

/** Without the detail line. */
export const NoDetail: Story = {
	args: { eyebrow: "Duration", value: "2 hr, 4 hr, 6 hr, and 10 hr", detail: undefined, icon: TimerIcon },
};

/** A long detail wraps onto more lines; the value stays on one. */
export const LongDetail: Story = {
	args: {
		eyebrow: "Add-on Services",
		value: "6 available",
		detail: "Bartender · Catering · Private Chef · Jet Ski Rental · Photographer · Transportation · Floral Design · Live Music",
		icon: BlocksIcon,
	},
};

/** Figma Property 1=Multiple: several answers under one eyebrow, e.g. two captains. */
export const Multiple: Story = {
	args: {
		eyebrow: "Captain",
		entries: [
			{ value: "Frank Smith", detail: "USCG Master Captain" },
			{ value: "Cody Fisher", detail: "Master Captain" },
		],
		icon: CircleUserIcon,
		editLabel: "Edit captains: Frank Smith, Cody Fisher",
	},
};

/** A photo thumbnail instead of an icon tile. */
export const Image: Story = {
	args: { eyebrow: "Photos", value: "7 photos", detail: undefined, icon: undefined, imageSrc: jumpFromBoat },
};

/** A brand badge beside the pencil (e.g. a pricing adjustment). */
export const Badge: Story = {
	args: {
		eyebrow: "Summer pricing",
		value: "Starting at $230/hr",
		detail: "Packages from $460 – $1,840",
		icon: DollarSignIcon,
		badge: "+15%",
	},
};

/** Something this section must have is missing: destructive stroke and a "Required" pill. */
export const Required: Story = {
	args: {
		eyebrow: "Location",
		value: "No boarding location yet",
		detail: undefined,
		icon: MapPinIcon,
		required: true,
	},
};

export const AllVariants: Story = {
	render: (args) => (
		<div className="flex flex-col gap-2">
			<SummaryCard {...args} />
			<SummaryCard {...args} eyebrow="Duration" value="2 hr, 4 hr, 6 hr, and 10 hr" detail={undefined} icon={TimerIcon} />
			<SummaryCard {...args} eyebrow="Photos" value="7 photos" detail={undefined} imageSrc={jumpFromBoat} />
			<SummaryCard
				{...args}
				eyebrow="Summer pricing"
				value="Starting at $230/hr"
				detail="Packages from $460 – $1,840"
				icon={DollarSignIcon}
				badge="+15%"
			/>
			<SummaryCard {...args} eyebrow="Location" value="No boarding location yet" detail={undefined} icon={MapPinIcon} required />
			<SummaryCard
				{...args}
				eyebrow="Captain"
				entries={[
					{ value: "Frank Smith", detail: "USCG Master Captain" },
					{ value: "Cody Fisher", detail: "Master Captain" },
				]}
				icon={CircleUserIcon}
			/>
		</div>
	),
};
