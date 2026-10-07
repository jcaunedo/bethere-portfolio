import * as React from "react";
import {
	BabyIcon,
	CigaretteIcon,
	CupSodaIcon,
	DogIcon,
	FootprintsIcon,
	MartiniIcon,
	MusicIcon,
	UtensilsIcon,
} from "lucide-react";

import { Button } from "@/components/buttons/button";
import { ChoiceButtonIcon } from "@/components/forms/choice-button-icon";
import { ChoiceCard } from "@/components/forms/choice-card";
import { ChoiceGroup } from "@/components/forms/choice-group";
import { FormField } from "@/components/forms/field";
import { Textarea } from "@/components/forms/textarea";
import { Typography } from "@/components/typography";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { useReportAnswers } from "../../shared/use-report-answers";
import type { ListingKind } from "../type/type";

/** One single-choice option, with the text shown under the group while it's picked. */
type PolicyOption = {
	value: string;
	label: string;
	/** One line, or several shown as bullets (Figma: cancellation and weather). */
	summary: string | string[];
};

// Summaries marked "draft" have no Figma or annotation copy yet — see product-specs/new-listing-flow.md.
const ageOptions: PolicyOption[] = [
	{ value: "all", label: "All Ages", summary: "Guests of any age can participate." }, // draft
	{ value: "13", label: "13+", summary: "Children can participate when accompanied by an adult." },
	{ value: "18", label: "18+", summary: "Only guests 18 and older can participate." }, // draft
	{ value: "21", label: "21+", summary: "Only guests 21 and older can participate." }, // draft
];

const reschedulingOptions: PolicyOption[] = [
	...[12, 24, 48].map((hours) => ({
		value: `${hours}h`,
		label: `${hours} hours`,
		// Figma copy for 48 hours; 12 and 24 follow the same pattern (draft).
		summary: `Change requests will be accepted until ${hours} hours before the scheduled start time.`,
	})),
	{ value: "none", label: "Not allowed", summary: "Guests can't request changes once their booking is confirmed." }, // draft
];

// Figma annotation on "Cancellation policy". Custom shows a terms field instead of a summary.
const cancellationOptions: PolicyOption[] = [
	{
		value: "flexible",
		label: "Flexible",
		summary: ["Full refund up to 24 hours before the experience", "Free rescheduling when available"],
	},
	{
		value: "moderate",
		label: "Moderate",
		summary: ["Full refund up to 5 days before the experience", "Partial refund after that period"],
	},
	{
		value: "strict",
		label: "Strict",
		summary: ["Limited refund after booking confirmation", "Rescheduling only when approved"],
	},
	{ value: "custom", label: "Custom", summary: [] },
];

// Figma annotation on "Weather policy" (Reschedule, Refund); Host review is draft.
const weatherOptions: PolicyOption[] = [
	{ value: "reschedule", label: "Reschedule", summary: ["Guests can choose a new available date."] },
	{ value: "refund", label: "Refund", summary: ["Guests receive a refund if the experience cannot happen."] },
	{
		value: "host-review",
		label: "Host review",
		summary: ["You'll review each case and offer guests a new date or a refund."], // draft
	},
];

const allowedOptions = [
	{ value: "smoking", label: "Smoking", icon: <CigaretteIcon /> },
	{ value: "food", label: "Food", icon: <UtensilsIcon /> },
	{ value: "alcohol", label: "Alcohol", icon: <MartiniIcon /> },
	{ value: "soft-drinks", label: "Soft Drinks", icon: <CupSodaIcon /> },
	{ value: "shoes", label: "Shoes onboard", icon: <FootprintsIcon /> },
	{ value: "children", label: "Children", icon: <BabyIcon /> },
	{ value: "pets", label: "Pets", icon: <DogIcon /> },
	{ value: "music", label: "Music", icon: <MusicIcon /> },
];

const safetyOptions = [
	{
		value: "briefing",
		label: "Safety briefing required",
		description: "Guests must complete a safety briefing before starting.",
	},
	{ value: "id", label: "Valid ID required", description: "Guests must provide identification before the experience." },
	{
		value: "instructions",
		label: "Follow host instructions",
		description: "Guests must follow all safety guidance provided.",
	},
	{
		value: "life-jackets",
		label: "Life jackets required when needed",
		description: "Guests may be required to wear life jackets based on safety conditions.",
	},
	{
		value: "waiver",
		label: "Signed waiver required",
		description: "Guests must accept safety terms before participating.",
	},
	{
		value: "supervision",
		label: "Adult supervision required",
		description: "Children must be accompanied by an adult.",
	},
	{ value: "swimming", label: "Swimming ability required", description: "Guests should be comfortable swimming." },
	{
		value: "sober",
		label: "No intoxicated guests",
		description: "Guests under the influence cannot participate.",
	},
];

/** What this step collects — reported to the flow and used to restore the step on a revisit. */
type PoliciesAnswers = {
	/** `ageOptions` value. */
	age: string;
	/** `reschedulingOptions` value. */
	rescheduling: string;
	/** `cancellationOptions` value. */
	cancellation: string;
	customTerms: string;
	/** `weatherOptions` value. */
	weather: string;
	/** `allowedOptions` values. */
	allowed: string[];
	/** `safetyOptions` values. */
	safety: string[];
};

/** Figma sample (the step's defaults): these picks, nothing in the multi-select sections. */
const samplePolicies: PoliciesAnswers = {
	age: "13",
	rescheduling: "48h",
	cancellation: "flexible",
	customTerms: "",
	weather: "reschedule",
	allowed: [],
	safety: [],
};

type PoliciesStepProps = NewListingStepProps & {
	/** Listing type picked on the Type step — names it in the copy ("…during the service"). */
	listingType?: ListingKind;
	/** Answers to start from (e.g. when revisiting the step). Defaults to the Figma sample. */
	defaultAnswers?: PoliciesAnswers;
	/** Called with the step's answers whenever they change. */
	onAnswersChange?: (answers: PoliciesAnswers) => void;
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
};

/**
 * New Listing — policies ("Set your policies"): age requirement, rescheduling notice, cancellation
 * and weather policies (one choice each, with a summary of the pick underneath), what's allowed
 * during the listing (icon tiles) and safety requirements (cards), both multi-select. "Custom"
 * cancellation swaps the summary for a terms field.
 * Figma origin: Provider Portal, "12. Policies" (node 109:3517).
 */
function PoliciesStep({
	steps = 14,
	currentStep = 12,
	stepLabel = "Little Atocha · Step 12 of 14",
	listingType = "experience",
	defaultAnswers = samplePolicies,
	onAnswersChange,
	onContinue,
	...frame
}: PoliciesStepProps) {
	const id = React.useId();
	const [age, setAge] = React.useState(defaultAnswers.age);
	const [rescheduling, setRescheduling] = React.useState(defaultAnswers.rescheduling);
	const [cancellation, setCancellation] = React.useState(defaultAnswers.cancellation);
	const [customTerms, setCustomTerms] = React.useState(defaultAnswers.customTerms);
	const [weather, setWeather] = React.useState(defaultAnswers.weather);
	const [allowed, setAllowed] = React.useState<string[]>(defaultAnswers.allowed);
	const [safety, setSafety] = React.useState<string[]>(defaultAnswers.safety);

	const answers = React.useMemo<PoliciesAnswers>(
		() => ({ age, rescheduling, cancellation, customTerms, weather, allowed, safety }),
		[age, rescheduling, cancellation, customTerms, weather, allowed, safety],
	);
	useReportAnswers(answers, onAnswersChange);

	const toggle = (list: string[], value: string) =>
		list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			align="top"
			title="Set your policies"
			description="Customize your booking rules and guest expectations."
			// Figma: 40px from the title to the first section.
			bodyClassName="gap-10"
		>
			{/* Standard 48px (spacing/12) gap between form sections. */}
			<form
				className="flex w-full flex-col gap-12"
				onSubmit={(event) => {
					event.preventDefault();
					onContinue?.();
				}}
			>
				<SingleChoiceSection
					id={`${id}-age`}
					title="Age requirements"
					description="Define who can participate based on age."
					options={ageOptions}
					value={age}
					onChange={setAge}
				/>

				<SingleChoiceSection
					id={`${id}-rescheduling`}
					title="Rescheduling notice"
					description="Choose how long before the start time guests can request changes."
					options={reschedulingOptions}
					value={rescheduling}
					onChange={setRescheduling}
				/>

				<SingleChoiceSection
					id={`${id}-cancellation`}
					title="Cancellation policy"
					description="Choose how guests can cancel or reschedule their booking."
					options={cancellationOptions}
					value={cancellation}
					onChange={setCancellation}
				>
					{/* No Figma source: Custom terms are written in a field (annotation: "Create your own
					    cancellation terms"). */}
					{cancellation === "custom" ? (
						<FormField htmlFor={`${id}-custom-terms`} label="Cancellation terms">
							<Textarea
								id={`${id}-custom-terms`}
								placeholder="Explain when guests can cancel and what refund they'll get."
								value={customTerms}
								onChange={(event) => setCustomTerms(event.target.value)}
							/>
						</FormField>
					) : null}
				</SingleChoiceSection>

				<SingleChoiceSection
					id={`${id}-weather`}
					title="Weather policy"
					description={`Define what happens if weather affects the ${listingType}.`}
					options={weatherOptions}
					value={weather}
					onChange={setWeather}
				/>

				<section aria-labelledby={`${id}-allowed`} className="flex flex-col gap-4">
					<SectionHeader id={`${id}-allowed`} description={`Choose what guests are allowed to do during the ${listingType}.`}>
						What’s allowed
					</SectionHeader>
					{/* Figma: 3-column grid, 8px gaps. */}
					<div role="group" aria-labelledby={`${id}-allowed`} className="grid grid-cols-3 gap-2">
						{allowedOptions.map((option) => (
							<ChoiceButtonIcon
								key={option.value}
								icon={option.icon}
								label={option.label}
								isSelected={allowed.includes(option.value)}
								onClick={() => setAllowed((current) => toggle(current, option.value))}
							/>
						))}
					</div>
				</section>

				<section aria-labelledby={`${id}-safety`} className="flex flex-col gap-4">
					<SectionHeader id={`${id}-safety`} description="Let guests know what safety rules they need to follow.">
						Safety requirements
					</SectionHeader>
					{/* Figma: stacked cards, 8px (spacing/2) apart. */}
					<div role="group" aria-labelledby={`${id}-safety`} className="flex flex-col gap-2">
						{safetyOptions.map((option) => (
							<ChoiceCard
								key={option.value}
								role="checkbox"
								label={option.label}
								description={option.description}
								isSelected={safety.includes(option.value)}
								onClick={() => setSafety((current) => toggle(current, option.value))}
							/>
						))}
					</div>
				</section>

				<Button type="submit" size="xl" className="w-full">
					Continue
				</Button>
			</form>
		</NewListingLayout>
	);
}

/**
 * A titled single-choice section: header, a row of equal choice buttons (Figma: `choice-button`,
 * 8px apart) and the picked option's summary, 16px apart. `children` render after the summary.
 */
function SingleChoiceSection({
	id,
	title,
	description,
	options,
	value,
	onChange,
	children,
}: {
	id: string;
	title: string;
	description: string;
	options: PolicyOption[];
	value: string;
	onChange: (value: string) => void;
	children?: React.ReactNode;
}) {
	const summary = options.find((option) => option.value === value)?.summary;
	const lines = typeof summary === "string" ? [summary] : summary ?? [];

	return (
		<section aria-labelledby={id} className="flex flex-col gap-4">
			<SectionHeader id={id} description={description}>
				{title}
			</SectionHeader>
			<ChoiceGroup
				aria-labelledby={id}
				aria-describedby={lines.length > 0 ? `${id}-summary` : undefined}
				options={options}
				value={value}
				onChange={onChange}
			/>
			{typeof summary === "string" ? (
				<Typography id={`${id}-summary`} size="sm">
					{summary}
				</Typography>
			) : lines.length > 0 ? (
				// Figma: bulleted, 21px indent.
				<ul id={`${id}-summary`} className="list-disc">
					{lines.map((line) => (
						<Typography key={line} as="li" size="sm" className="ms-[21px]">
							{line}
						</Typography>
					))}
				</ul>
			) : null}
			{children}
		</section>
	);
}

/** Section title + supporting line in Figma's 48px-tall header: `lg -semibold` over muted `sm`. */
function SectionHeader({ id, description, children }: { id: string; description: string; children: React.ReactNode }) {
	return (
		<div className="flex h-12 flex-col">
			<Typography as="h2" id={id} size="lg" weight="semibold">
				{children}
			</Typography>
			<Typography size="sm" className="text-muted-foreground">
				{description}
			</Typography>
		</div>
	);
}

export { PoliciesStep, samplePolicies, ageOptions, cancellationOptions, weatherOptions };
export type { PoliciesAnswers, PoliciesStepProps };
