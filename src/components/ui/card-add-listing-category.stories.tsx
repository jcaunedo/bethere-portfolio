import type { Meta, StoryObj } from "@storybook/react-vite";
import { Compass, Home, Building2, Tent } from "lucide-react";
import { CardAddListingCategory } from "./card-add-listing-category";

const meta: Meta<typeof CardAddListingCategory> = {
	title: "Components/CardAddListingCategory",
	component: CardAddListingCategory,
	tags: ["autodocs"],
	argTypes: {
		title: { control: "text" },
		description: { control: "text" },
		asChild: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export default meta;
type Story = StoryObj<typeof CardAddListingCategory>;

export const Default: Story = {
	args: {
		icon: <Compass />,
		title: "Title",
		description: "Description",
	},
};

/** Hover the card to see the elevation drop-shadow (Figma: Property 1=Hover). */
export const Hover: Story = {
	args: {
		icon: <Compass />,
		title: "Hover me",
		description: "Elevates on hover",
	},
};

export const WithoutIcon: Story = {
	args: {
		title: "No icon",
		description: "The icon slot is optional",
	},
};

/** `asChild` renders the card as a link while keeping the generated content. */
export const AsLink: Story = {
	args: {
		asChild: true,
		icon: <Home />,
		title: "Rentals",
		description: "Add a rental listing",
		children: <a href="#add-rentals" />,
	},
};

export const Disabled: Story = {
	args: {
		icon: <Compass />,
		title: "Unavailable",
		description: "This category is disabled",
		disabled: true,
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="grid max-w-[820px] grid-cols-2 gap-4">
			<CardAddListingCategory
				icon={<Home />}
				title="Rentals"
				description="Add a rental listing"
			/>
			<CardAddListingCategory
				icon={<Building2 />}
				title="Properties"
				description="List a property for sale"
			/>
			<CardAddListingCategory
				icon={<Tent />}
				title="Experiences"
				description="Host a local experience"
			/>
			<CardAddListingCategory
				icon={<Compass />}
				title="Explore"
				description="Browse all categories"
			/>
		</div>
	),
};
