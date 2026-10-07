import type { Meta, StoryObj } from "@storybook/react-vite";
import { IdCardIcon } from "lucide-react";

import { DocumentCard } from "./document-card";
import sampleDocumentUrl from "@/assets/documents/sample-document.pdf";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/data-display/avatar";

const meta: Meta<typeof DocumentCard> = {
	title: "Cards/DocumentCard",
	component: DocumentCard,
	tags: ["autodocs"],
	argTypes: {
		title: { control: "text" },
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
	decorators: [
		(Story) => (
			<div className='w-[640px] bg-background p-6'>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof DocumentCard>;

/** Figma: document-card — icon avatar, title, description, badge, and dismiss "x". Hover to see Property 1=Hover (`card` shadow); click to open the document in a new tab. */
export const Default: Story = {
	args: {
		title: "Business license",
		description: "PDF · 2.4 MB",
		badgeLabel: "Pending",
		documentUrl: sampleDocumentUrl,
		onDismiss: () => {},
	},
};

/** Figma: "Avatar User" shown in place of "Avatar Icon". */
export const WithUserAvatar: Story = {
	args: {
		...Default.args,
		avatar: (
			<Avatar size='lg'>
				<AvatarImage src='https://i.pravatar.cc/72?img=12' alt='' />
				<AvatarFallback>LS</AvatarFallback>
			</Avatar>
		),
	},
};

/** The icon slot accepts any lucide-style icon. */
export const CustomIcon: Story = {
	args: {
		...Default.args,
		icon: IdCardIcon,
		title: "Passport",
	},
};

/** Optional parts omitted: no description, badge, dismiss button, or document link (not clickable). */
export const Minimal: Story = {
	args: {
		title: "Business license",
	},
};

/** Long title/description wrap rather than truncate. */
export const LongContent: Story = {
	args: {
		...Default.args,
		title:
			"Certificate of liability insurance for marine charter operations 2026",
		description:
			"Uploaded by Lucy Smith on May 15, 2026 · Expires May 15, 2027 · PDF · 2.4 MB",
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className='flex flex-col gap-3'>
			<DocumentCard
				title='Business license'
				description='PDF · 2.4 MB'
				badgeLabel='Pending'
				documentUrl={sampleDocumentUrl}
				onDismiss={() => {}}
			/>
			<DocumentCard
				avatar={
					<Avatar size='lg'>
						<AvatarImage src='https://i.pravatar.cc/72?img=12' alt='' />
						<AvatarFallback>LS</AvatarFallback>
					</Avatar>
				}
				title='Lucy Smith'
				description='Uploaded May 15, 2026'
				badgeLabel='Approved'
				badgeColor='green'
				documentUrl={sampleDocumentUrl}
				onDismiss={() => {}}
			/>
			<DocumentCard
				icon={IdCardIcon}
				title='Passport'
				description='Expires May 15, 2026'
				badgeLabel='Expired'
				badgeColor='red'
			/>
			<DocumentCard title='Business license' />
		</div>
	),
};
