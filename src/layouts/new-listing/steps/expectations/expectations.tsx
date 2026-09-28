import * as React from "react";

import { Button } from "@/components/buttons/button";
import { ExperienceLocation, type ExperienceLocationValue } from "@/components/cards/experience-location";
import { SortableList, type SortableListItemValue } from "@/components/forms/sortable-list";
import { Typography } from "@/components/typography";
import { ChoiceChipGrid } from "../../shared/choice-chip-grid";
import { AddLink } from "../../shared/add-link";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";

const durations = ["1 hr", "2 hr", "4 hr", "6 hr", "8 hr", "10 hr", "Full Day", "Multi-Day"];

const experienceTypes = [
	"Sandbar Day",
	"Sunset Cruise",
	"Fishing Charter",
	"Celebration",
	"Luxury Charter",
	"Corporate Event",
	"Sightseeing",
	"Family Outing",
	"Party Charter",
	"Romantic Cruise",
];

const inclusions = [
	"Captain",
	"Fuel",
	"Ice",
	"Bottled Water",
	"Soft Drinks",
	"Towels",
	"Floating Mat",
	"Water Toys",
	"Cleaning Fee",
	"Docking Fees",
];

const boardingLocation: ExperienceLocationValue = {
	name: "Key Biscayne Yacht Club",
	address: "180 Harbor Dr, Key Biscayne, FL 33149",
	additionalInfo: "Dock B — Slip 14",
	instructions:
		"Head south on Crandon Blvd and turn right onto Harbor Drive — you'll see the yacht club on your left. Park in the Guest area near the flagpoles (your booking confirmation works as a pass). Pop into the dock office to check in, then follow the signs to Dock B, Slip 14. Your captain will be there to welcome you aboard!",
};

const destinations: SortableListItemValue[] = [
	{ id: "biscayne-bay", label: "Biscayne Bay" },
	{ id: "star-island", label: "Star Island" },
	{ id: "monument-island", label: "Monument Island" },
	{ id: "nixon-sandbar", label: "Nixon Sandbar" },
	{ id: "marine-stadium", label: "Marine Stadium" },
];

type ExpectationsStepProps = NewListingStepProps & {
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
};

/**
 * New Listing — experience expectations ("Tell guests what to expect"): durations,
 * boarding location, destinations, experience type and inclusions.
 * Figma origin: Provider Portal, "7. Experience Expectations" frame (node 94:3243).
 */
function ExpectationsStep({
	steps = 14,
	currentStep = 7,
	stepLabel = "Little Atocha · Step 7 of 14",
	onContinue,
	...frame
}: ExpectationsStepProps) {
	const id = React.useId();
	const [selectedDurations, setSelectedDurations] = React.useState(
		() => new Set(["2 hr", "4 hr", "6 hr", "Full Day"]),
	);
	const [places, setPlaces] = React.useState(destinations);
	const placesRef = React.useRef<HTMLDivElement>(null);
	const nextPlace = React.useRef(0);
	const [types, setTypes] = React.useState(
		() => new Set(["Sandbar Day", "Sunset Cruise", "Sightseeing", "Family Outing", "Romantic Cruise"]),
	);
	const [included, setIncluded] = React.useState(
		() =>
			new Set([
				"Captain",
				"Fuel",
				"Ice",
				"Bottled Water",
				"Floating Mat",
				"Water Toys",
				"Cleaning Fee",
				"Docking Fees",
			]),
	);

	// "Add place" appends an empty row and focuses it for typing.
	const addPlace = () => {
		setPlaces((current) => [...current, { id: `place-${nextPlace.current++}`, label: "" }]);
		requestAnimationFrame(() => {
			const fields = placesRef.current?.querySelectorAll<HTMLInputElement>("[data-slot=sortable-list-input]");
			fields?.[fields.length - 1]?.focus();
		});
	};

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			align="top"
			title="Tell guests what to expect"
			description="Help guests understand what to expect from their charter."
		>
			{/* Standard 48px (spacing/12) gap between form sections. */}
			<form
				className="flex w-full flex-col gap-12"
				onSubmit={(event) => {
					event.preventDefault();
					onContinue?.();
				}}
			>
				{/* Durations: heading only, 4-column grid ending with the "Add" tile for custom durations. */}
				<section aria-labelledby={`${id}-durations`} className="flex flex-col gap-4">
					<SectionHeading id={`${id}-durations`}>What charter durations do you offer?</SectionHeading>
					<ChoiceChipGrid
						labelledBy={`${id}-durations`}
						columns={4}
						options={durations}
						selected={selectedDurations}
						onSelectedChange={setSelectedDurations}
						allowCustom
					/>
				</section>

				<section aria-labelledby={`${id}-boarding`} className="flex flex-col gap-4">
					<SectionHeader id={`${id}-boarding`} description="Choose the primary departure marina.">
						Where will guests board your yacht?
					</SectionHeader>
					<ExperienceLocation defaultValue={boardingLocation} />
				</section>

				<section aria-labelledby={`${id}-places`} className="flex flex-col gap-4">
					<SectionHeader
						id={`${id}-places`}
						description="Select the destinations and routes available with this charter."
					>
						Where can guests go?
					</SectionHeader>
					<div ref={placesRef}>
						<SortableList
							aria-labelledby={`${id}-places`}
							value={places}
							onValueChange={setPlaces}
							placeholder="Place name"
						/>
					</div>
					<AddLink onClick={addPlace}>Add place</AddLink>
				</section>

				<section aria-labelledby={`${id}-types`} className="flex flex-col gap-4">
					<SectionHeader
						id={`${id}-types`}
						description="Select all the options that help guests find your charter."
					>
						What best describes this experience?
					</SectionHeader>
					<ChoiceChipGrid
						labelledBy={`${id}-types`}
						options={experienceTypes}
						selected={types}
						onSelectedChange={setTypes}
						allowCustom
					/>
				</section>

				<section aria-labelledby={`${id}-included`} className="flex flex-col gap-4">
					<SectionHeader
						id={`${id}-included`}
						description="Select all the options that help guests find your charter."
					>
						What’s included?
					</SectionHeader>
					<ChoiceChipGrid
						labelledBy={`${id}-included`}
						options={inclusions}
						selected={included}
						onSelectedChange={setIncluded}
						allowCustom
					/>
				</section>

				<Button type="submit" size="xl" className="w-full">
					Continue
				</Button>
			</form>
		</NewListingLayout>
	);
}

/** Section title. Figma: `lg/lg -semibold`. */
function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
	return (
		<Typography as="h2" id={id} size="lg" weight="semibold">
			{children}
		</Typography>
	);
}

/** Section title + supporting line, stacked with no gap. Figma: `lg -semibold` over muted `sm`. */
function SectionHeader({
	id,
	description,
	children,
}: {
	id: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col">
			<SectionHeading id={id}>{children}</SectionHeading>
			<Typography size="sm" className="text-muted-foreground">
				{description}
			</Typography>
		</div>
	);
}

export { ExpectationsStep };
