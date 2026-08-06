import type { Meta, StoryObj } from "@storybook/react-vite";
import { IdCardIcon } from "lucide-react";
import { RowDocuments } from "./row-documents";

const meta: Meta<typeof RowDocuments> = {
	title: "Data Display/RowDocuments",
	component: RowDocuments,
	tags: ["autodocs"],
	argTypes: {
		name: { control: "text" },
		description: { control: "text" },
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
	},
};

export default meta;
type Story = StoryObj<typeof RowDocuments>;

export const Default: Story = {
	args: {
		name: "Business license",
		description: "Expires May 15, 2026",
		badgeLabel: "Expired",
		badgeColor: "red",
	},
};

/** No status to show — omitting `badgeLabel` renders no badge. */
export const NoBadge: Story = {
	args: {
		name: "Certificate of insurance",
		description: "Uploaded Jan 10, 2026",
	},
};

/** No supporting line — omitting `description` renders just the name. */
export const NoDescription: Story = {
	args: {
		name: "Untitled upload",
		badgeLabel: "Pending review",
		badgeColor: "yellow",
	},
};

/** A custom `icon` (Figma: "Owner identity verification" uses an id-card icon instead of the default file icon). */
export const CustomIcon: Story = {
	args: {
		icon: IdCardIcon,
		name: "Owner identity verification",
		description: "Driver license · Expires Jun 02, 2032",
	},
};

/** `documentUrl` makes the whole row clickable — opens the document in a new tab. The "more actions" button remains a separate action and doesn't trigger it. */
export const Clickable: Story = {
	args: {
		name: "Business license",
		description: "Expires May 15, 2026",
		badgeLabel: "Expired",
		badgeColor: "red",
		documentUrl: "#",
	},
};

export const Valid: Story = {
	args: {
		name: "Business license",
		description: "Expires Dec 31, 2027",
		badgeLabel: "Valid",
		badgeColor: "green",
	},
};

export const Pending: Story = {
	args: {
		name: "Insurance certificate",
		description: "Uploaded Jan 10, 2026",
		badgeLabel: "Pending review",
		badgeColor: "yellow",
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex max-w-[720px] flex-col">
			<RowDocuments
				name="Business license"
				description="Expires May 15, 2026"
				badgeLabel="Expired"
				badgeColor="red"
			/>
			<RowDocuments
				name="Insurance certificate"
				description="Expires Dec 31, 2026"
				badgeLabel="Valid"
				badgeColor="green"
			/>
			<RowDocuments
				name="Registration form"
				description="Uploaded Jan 10, 2026"
				badgeLabel="Pending review"
				badgeColor="yellow"
			/>
			<RowDocuments
				name="W-9 form"
				description="Uploaded Jan 10, 2026"
			/>
		</div>
	),
};
