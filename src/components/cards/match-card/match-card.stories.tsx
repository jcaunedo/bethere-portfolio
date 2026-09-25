import type { Meta, StoryObj } from "@storybook/react-vite";
import { MatchCard } from "./match-card";
// Prototype-only sample thumbnails — imported by stories, never by the component, so they stay out of the package.
import yacht1 from "./images/yacht-1.webp";
import yacht2 from "./images/yacht-2.webp";
import yacht3 from "./images/yacht-3.webp";

const details = ["55 ft", "12 guests", "3 cabins", "2021"];

const meta: Meta<typeof MatchCard> = {
	title: "Cards/MatchCard",
	component: MatchCard,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
	args: {
		image: yacht1,
		name: "Azimut Fly 55",
		details,
		className: "max-w-[640px]",
	},
};
export default meta;
type Story = StoryObj<typeof MatchCard>;

/** Hover or keyboard-focus the card to see Figma's Variant2 (shadow + brand chevron). */
export const Default: Story = {};

export const WithBadge: Story = {
	args: { badge: "Best match" },
};

export const LongContent: Story = {
	args: {
		image: yacht2,
		name: "Sunseeker Manhattan 68 Flybridge Edition with an unusually long name",
		badge: "Best match",
		details: ["68 ft", "12 guests", "4 cabins", "2022", "Miami Beach Marina", "Captain included"],
	},
};

/** No `image` passed: the muted placeholder keeps the layout. */
export const WithoutImage: Story = {
	args: { image: undefined },
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex max-w-[640px] flex-col gap-4">
			<MatchCard image={yacht1} name="Azimut Fly 55" details={details} badge="Best match" />
			<MatchCard image={yacht2} name="Sunseeker Manhattan 68" details={["68 ft", "12 guests", "4 cabins", "2022"]} />
			<MatchCard image={yacht3} name="Princess F55" details={["55 ft", "10 guests", "3 cabins", "2020"]} />
			<MatchCard name="Ferretti 720" details={["72 ft", "12 guests", "4 cabins", "2022"]} />
			<MatchCard image={yacht1} name="Galeon 600 Fly" details={["60 ft", "10 guests", "3 cabins", "2021"]} disabled />
		</div>
	),
};
