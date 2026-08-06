import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardBusiness } from "./card-business";

const meta: Meta<typeof CardBusiness> = {
	title: "Cards/CardBusiness",
	component: CardBusiness,
	tags: ["autodocs"],
	argTypes: {
		name: { control: "text" },
		address: { control: "text" },
		owner: { control: "text" },
		badgeLabel: { control: "text" },
		badgeColor: {
			control: "select",
			options: [
				"gray",
				"red",
				"yellow",
				"green",
				"blue",
				"purple",
				"violet",
				"pink",
				"orange",
				"amber",
			],
		},
		asChild: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof CardBusiness>;

export const Default: Story = {
	args: {
		name: "Key Biscayne Yacht Club",
		address: "180 Harbor Dr, Key Biscayne, FL 33149",
		owner: "John Smith",
		badgeLabel: "Approved",
		badgeColor: "green",
	},
};

/** Hover the card to see the subtle background tint (Figma: Property 1=Hover). */
export const Hover: Story = {
	args: {
		name: "Key Biscayne Yacht Club",
		address: "180 Harbor Dr, Key Biscayne, FL 33149",
		owner: "John Smith",
		badgeLabel: "Approved",
		badgeColor: "green",
	},
};

/**
 * Below `md` (768px), the badge and chevron move into the info column as a
 * full-width row (Figma: Property 1=Mobile). This uses a real viewport
 * media query, not a container query — narrow the browser window itself
 * (not just this story's canvas) below 768px to see it.
 */
export const Mobile: Story = {
	args: {
		name: "Key Biscayne Yacht Club",
		address: "180 Harbor Dr, Key Biscayne, FL 33149",
		owner: "John Smith",
		badgeLabel: "Approved",
		badgeColor: "green",
	},
};

export const Pending: Story = {
	args: {
		name: "Coral Gables Marina",
		address: "3400 Pan American Dr, Coral Gables, FL 33133",
		owner: "Maria Gonzalez",
		badgeLabel: "Pending",
		badgeColor: "yellow",
	},
};

export const Rejected: Story = {
	args: {
		name: "Sunset Harbor Grill",
		address: "1900 Bay Rd, Miami Beach, FL 33139",
		owner: "Alex Chen",
		badgeLabel: "Rejected",
		badgeColor: "red",
	},
};

/** `asChild` renders the row as a link while keeping the generated content. */
export const AsLink: Story = {
	args: {
		asChild: true,
		name: "Key Biscayne Yacht Club",
		address: "180 Harbor Dr, Key Biscayne, FL 33149",
		owner: "John Smith",
		badgeLabel: "Approved",
		badgeColor: "green",
		children: <a href="#business-detail" />,
	},
};

export const Disabled: Story = {
	args: {
		name: "Key Biscayne Yacht Club",
		address: "180 Harbor Dr, Key Biscayne, FL 33149",
		owner: "John Smith",
		badgeLabel: "Approved",
		badgeColor: "green",
		disabled: true,
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex max-w-[720px] flex-col gap-4">
			<CardBusiness
				name="Key Biscayne Yacht Club"
				address="180 Harbor Dr, Key Biscayne, FL 33149"
				owner="John Smith"
				badgeLabel="Approved"
				badgeColor="green"
			/>
			<CardBusiness
				name="Coral Gables Marina"
				address="3400 Pan American Dr, Coral Gables, FL 33133"
				owner="Maria Gonzalez"
				badgeLabel="Pending"
				badgeColor="yellow"
			/>
			<CardBusiness
				name="Sunset Harbor Grill"
				address="1900 Bay Rd, Miami Beach, FL 33139"
				owner="Alex Chen"
				badgeLabel="Rejected"
				badgeColor="red"
			/>
		</div>
	),
};
