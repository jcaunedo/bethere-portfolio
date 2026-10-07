import * as React from "react";

import { Button } from "@/components/buttons/button";
import { ChoiceGroup } from "@/components/forms/choice-group";
import { FormField } from "@/components/forms/field";
import { Input } from "@/components/forms/input";
import { NumericInput } from "@/components/forms/numeric-input";
import { Typography } from "@/components/typography";
import { ChoiceChipGrid } from "../../shared/choice-chip-grid";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { useReportAnswers } from "../../shared/use-report-answers";

const onBoardFeatures = [
	"Air Conditioning",
	"Sound System",
	"Wi-Fi",
	"TV",
	"Kitchen / Galley",
	"Refrigerator",
	"Ice Maker",
	"BBQ Grill",
];

const waterToys = [
	"Jet Ski Available",
	"Seabob",
	"E-Foil",
	"Floating Mat",
	"Paddleboards",
	"Kayaks",
	"Snorkeling Gear",
	"Fishing Equipment",
];

const accessibility = ["Wheelchair Accessible", "Senior friendly"];

const captainOptions = [
	{ value: "yes", label: "Yes" },
	{ value: "no", label: "No" },
];

const crewOptions = [
	{ value: "yes", label: "Yes" },
	{ value: "no", label: "No" },
	{ value: "upon-request", label: "Upon request" },
];

/** What this step collects — reported to the flow and used to restore the step on a revisit. */
type AttributesAnswers = {
	name: string;
	/** Feet. `null` while the field is empty. */
	length: number | null;
	cabins: number | null;
	bathrooms: number | null;
	guests: number | null;
	captain: string;
	crew: string;
	features: string[];
	toys: string[];
	access: string[];
};

/** Figma sample (the step's defaults). */
const sampleAttributes: AttributesAnswers = {
	name: "Little Atocha",
	length: 55,
	cabins: 3,
	bathrooms: 2,
	guests: 13,
	captain: "yes",
	crew: "no",
	features: ["Air Conditioning", "Sound System", "Wi-Fi", "Refrigerator", "Ice Maker", "BBQ Grill"],
	toys: ["Seabob", "E-Foil", "Floating Mat", "Snorkeling Gear", "Fishing Equipment"],
	access: ["Senior friendly"],
};

type AttributesStepProps = NewListingStepProps & {
	/** Answers to start from (e.g. when revisiting the step). Defaults to the Figma sample. */
	defaultAnswers?: AttributesAnswers;
	/** Called with the step's answers whenever they change. */
	onAnswersChange?: (answers: AttributesAnswers) => void;
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
};

/**
 * New Listing — listing attributes: the features and amenities of whatever hosts the
 * experience (boat, vehicle, venue…). Default content is the yacht example from
 * Figma origin: Provider Portal, "6. Yacht Attributes" frame (node 91:846).
 */
function AttributesStep({
	steps = 14,
	currentStep = 6,
	stepLabel = "Azimut 55 Flybridge (2021) · Step 6 of 14",
	defaultAnswers = sampleAttributes,
	onAnswersChange,
	onContinue,
	...frame
}: AttributesStepProps) {
	const id = React.useId();
	const [details, setDetails] = React.useState(() => ({
		name: defaultAnswers.name,
		length: defaultAnswers.length,
		cabins: defaultAnswers.cabins,
		bathrooms: defaultAnswers.bathrooms,
		guests: defaultAnswers.guests,
	}));
	const [captain, setCaptain] = React.useState(defaultAnswers.captain);
	const [crew, setCrew] = React.useState(defaultAnswers.crew);
	const [features, setFeatures] = React.useState(() => new Set(defaultAnswers.features));
	const [toys, setToys] = React.useState(() => new Set(defaultAnswers.toys));
	const [access, setAccess] = React.useState(() => new Set(defaultAnswers.access));

	const answers = React.useMemo<AttributesAnswers>(
		() => ({ ...details, captain, crew, features: [...features], toys: [...toys], access: [...access] }),
		[details, captain, crew, features, toys, access],
	);
	useReportAnswers(answers, onAnswersChange);

	// Spec fields stay uncontrolled (seeded from the answers); edits and stepper clicks report back.
	const numberField = (key: "length" | "cabins" | "bathrooms" | "guests") => ({
		defaultValue: defaultAnswers[key] ?? undefined,
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value === "" ? null : Number(event.target.value);
			setDetails((current) => ({ ...current, [key]: value }));
		},
	});

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			align="top"
			title="Tell guests about your yacht"
			description="Highlight the features and amenities available on board."
		>
			{/* Standard 48px (spacing/12) gap between form sections. */}
			<form
				className="flex w-full flex-col gap-12"
				onSubmit={(event) => {
					event.preventDefault();
					onContinue?.();
				}}
			>
				<section aria-labelledby={`${id}-details`} className="flex flex-col gap-4">
					<SectionHeading id={`${id}-details`}>Yacht details</SectionHeading>
					<FormField htmlFor={`${id}-name`} label="Yacht Name" className="gap-2">
						<Input
								id={`${id}-name`}
								size="xl"
								className="text-sm"
								defaultValue={defaultAnswers.name}
								onChange={(event) => setDetails((current) => ({ ...current, name: event.target.value }))}
							/>
					</FormField>
					<div className="grid grid-cols-2 gap-4">
						<FormField htmlFor={`${id}-length`} label="Length (ft)" className="gap-2">
							<NumericInput id={`${id}-length`} size="xl" className="text-sm" steppers {...numberField("length")} />
						</FormField>
						<FormField htmlFor={`${id}-cabins`} label="Cabins" className="gap-2">
							<NumericInput id={`${id}-cabins`} size="xl" className="text-sm" steppers {...numberField("cabins")} />
						</FormField>
						<FormField htmlFor={`${id}-bathrooms`} label="Bathrooms" className="gap-2">
							<NumericInput id={`${id}-bathrooms`} size="xl" className="text-sm" steppers {...numberField("bathrooms")} />
						</FormField>
						<FormField htmlFor={`${id}-guests`} label="Maximum Guests" className="gap-2">
							<NumericInput id={`${id}-guests`} size="xl" className="text-sm" steppers {...numberField("guests")} />
						</FormField>
					</div>
				</section>

				<section aria-labelledby={`${id}-crew`} className="flex flex-col gap-3">
					<SectionHeading id={`${id}-crew`}>Crew</SectionHeading>
					<div className="flex flex-col gap-6">
						<ChoiceField
							id={`${id}-captain`}
							label="Captain included?"
							description="You'll set the captain fee in a later step."
						>
							<ChoiceGroup
								aria-labelledby={`${id}-captain`}
								aria-describedby={`${id}-captain-description`}
								options={captainOptions}
								value={captain}
								onChange={setCaptain}
							/>
						</ChoiceField>
						<ChoiceField id={`${id}-crew-included`} label="Crew included?">
							<ChoiceGroup
								aria-labelledby={`${id}-crew-included`}
								options={crewOptions}
								value={crew}
								onChange={setCrew}
							/>
						</ChoiceField>
					</div>
				</section>

				<ChipSection
					id={`${id}-features`}
					title="On-board features"
					options={onBoardFeatures}
					selected={features}
					onSelectedChange={setFeatures}
					allowCustom
				/>
				<ChipSection
					id={`${id}-toys`}
					title="Water toys"
					options={waterToys}
					selected={toys}
					onSelectedChange={setToys}
					allowCustom
				/>
				<ChipSection
					id={`${id}-accessibility`}
					title="Accessibility"
					options={accessibility}
					selected={access}
					onSelectedChange={setAccess}
				/>

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

/**
 * Label + ChoiceGroup + optional helper, 8px apart. Not a `FormField`: a
 * radiogroup is named via `aria-labelledby`, not a `<label htmlFor>`.
 */
function ChoiceField({
	id,
	label,
	description,
	children,
}: {
	id: string;
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Typography id={id} size="sm" weight="medium">
				{label}
			</Typography>
			{children}
			{description != null ? (
				<Typography id={`${id}-description`} size="xs" className="text-muted-foreground">
					{description}
				</Typography>
			) : null}
		</div>
	);
}

/** Titled 3-column multi-select chip grid, optionally ending with an "Add" tile. */
function ChipSection({
	id,
	title,
	options,
	selected,
	onSelectedChange,
	allowCustom = false,
}: {
	id: string;
	title: string;
	options: string[];
	selected: Set<string>;
	onSelectedChange: (next: Set<string>) => void;
	allowCustom?: boolean;
}) {
	return (
		<section className="flex flex-col gap-3">
			<SectionHeading id={id}>{title}</SectionHeading>
			<ChoiceChipGrid
				labelledBy={id}
				options={options}
				selected={selected}
				onSelectedChange={onSelectedChange}
				allowCustom={allowCustom}
			/>
		</section>
	);
}

export { AttributesStep, sampleAttributes };
export type { AttributesAnswers, AttributesStepProps };
