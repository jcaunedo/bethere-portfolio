import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "@/components/forms/radio-group";
import { BusinessChoiceCard } from "./business-choice-card";
import mapKeyBiscayne from "./images/map-key-biscayne.webp";
import mapBrickell from "./images/map-brickell.webp";

const meta: Meta<typeof BusinessChoiceCard> = {
	title: "Forms/BusinessChoiceCard",
	component: BusinessChoiceCard,
	tags: ["autodocs"],
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
};
export default meta;
type Story = StoryObj<typeof BusinessChoiceCard>;

const keyBiscayne = {
	name: "Key Biscayne Yacht Club",
	address: "180 Harbor Dr, Key Biscayne, FL 33149",
	taxId: "12-3456789",
	map: <img src={mapKeyBiscayne} alt="Map of Key Biscayne Yacht Club" />,
};

const brickell = {
	name: "Delilah Miami",
	address: "301 Brickell Key Dr, Miami, FL 33131",
	taxId: "98-7654321",
	map: <img src={mapBrickell} alt="Map of Delilah Miami" />,
};

/** Figma Variants=single — the account's only business, confirmed with the checkbox. */
export const Single: Story = {
	args: { variant: "single", ...keyBiscayne },
};

/** Single, already confirmed ("Yes, this is the business for this listing" ticked). */
export const SingleConfirmed: Story = {
	args: { variant: "single", defaultConfirmed: true, ...keyBiscayne },
};

/** Figma Variants=multiple-selected / multiple-default — radio options inside a RadioGroup. */
export const Multiple: Story = {
	render: () => (
		<RadioGroup defaultValue="key-biscayne" aria-label="Business" className="gap-4">
			<BusinessChoiceCard variant="multiple" value="key-biscayne" {...keyBiscayne} />
			<BusinessChoiceCard variant="multiple" value="brickell" {...brickell} />
		</RadioGroup>
	),
};

/** No Figma source: a disabled option dims like ChoiceCard. */
export const MultipleDisabled: Story = {
	render: () => (
		<RadioGroup defaultValue="key-biscayne" aria-label="Business" className="gap-4">
			<BusinessChoiceCard variant="multiple" value="key-biscayne" {...keyBiscayne} />
			<BusinessChoiceCard variant="multiple" value="brickell" disabled {...brickell} />
		</RadioGroup>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			<BusinessChoiceCard {...keyBiscayne} />
			<RadioGroup defaultValue="key-biscayne" aria-label="Business" className="gap-4">
				<BusinessChoiceCard variant="multiple" value="key-biscayne" {...keyBiscayne} />
				<BusinessChoiceCard variant="multiple" value="brickell" {...brickell} />
			</RadioGroup>
		</div>
	),
};
