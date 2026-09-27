import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/buttons/button";
import { ChoiceChip } from "@/components/forms/choice-chip";
import { ChoiceGroup } from "@/components/forms/choice-group";
import { ChoiceInput } from "@/components/forms/choice-input";
import { FormField } from "@/components/forms/field";
import { Input } from "@/components/forms/input";
import { NumericInput } from "@/components/forms/numeric-input";
import { StepperExperience } from "@/components/stepper/stepper-experience";
import { Typography } from "@/components/typography";
import { fadeVariants, layoutSpring, revealVariants, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

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

type ListingAttributesProps = {
	className?: string;
	/**
	 * Render the built-in stepper. Set `false` when a parent flow owns a single
	 * persistent stepper across screens (so it advances in place instead of remounting).
	 */
	showStepper?: boolean;
	/** Total step count for the stepper track. */
	steps?: number;
	/** 1-indexed current step. */
	currentStep?: number;
	/** Stepper center label. */
	stepLabel?: string;
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
	/** Called when the back control is activated. */
	onBack?: () => void;
	/** Called when the close control is activated. */
	onClose?: () => void;
};

/**
 * New Listing — listing attributes: the features and amenities of whatever hosts the
 * experience (boat, vehicle, venue…). Default content is the yacht example from
 * Figma origin: Provider Portal, "6. Yacht Attributes" frame (node 91:846).
 */
function ListingAttributes({
	className,
	showStepper = true,
	steps = 14,
	currentStep = 6,
	stepLabel = "Azimut 55 Flybridge (2021) · Step 6 of 14",
	onContinue,
	onBack = () => {},
	onClose = () => {},
}: ListingAttributesProps) {
	const id = React.useId();
	const [captain, setCaptain] = React.useState("yes");
	const [crew, setCrew] = React.useState("no");
	const [features, setFeatures] = React.useState(
		() =>
			new Set([
				"Air Conditioning",
				"Sound System",
				"Wi-Fi",
				"Refrigerator",
				"Ice Maker",
				"BBQ Grill",
			]),
	);
	const [toys, setToys] = React.useState(
		() => new Set(["Seabob", "E-Foil", "Floating Mat", "Snorkeling Gear", "Fishing Equipment"]),
	);
	const [access, setAccess] = React.useState(() => new Set(["Senior friendly"]));

	return (
		<div className={cn("flex min-h-screen flex-col items-center bg-background p-2", className)}>
			<div className="flex w-full flex-1 flex-col items-center gap-10">
				{showStepper ? (
					<StepperExperience
						steps={steps}
						currentStep={currentStep}
						label={stepLabel}
						onBack={onBack}
						onClose={onClose}
					/>
				) : null}

				<div className="flex w-full max-w-[640px] flex-1 flex-col items-center gap-8">
					<div className="flex flex-col items-center gap-2 text-center">
						<Typography as="h1" size="3xl" weight="semibold">
							Tell guests about your yacht
						</Typography>
						<Typography size="xl" className="text-muted-foreground">
							Highlight the features and amenities available on board.
						</Typography>
					</div>

					<form
						className="flex w-full flex-col gap-10"
						onSubmit={(event) => {
							event.preventDefault();
							onContinue?.();
						}}
					>
						<section aria-labelledby={`${id}-details`} className="flex flex-col gap-4">
							<SectionHeading id={`${id}-details`}>Yacht details</SectionHeading>
							<FormField htmlFor={`${id}-name`} label="Yacht Name" className="gap-2">
								<Input id={`${id}-name`} size="xl" className="text-sm" defaultValue="Little Atocha" />
							</FormField>
							<div className="grid grid-cols-2 gap-4">
								<FormField htmlFor={`${id}-length`} label="Length (ft)" className="gap-2">
									<NumericInput id={`${id}-length`} size="xl" className="text-sm" steppers defaultValue={55} />
								</FormField>
								<FormField htmlFor={`${id}-cabins`} label="Cabins" className="gap-2">
									<NumericInput id={`${id}-cabins`} size="xl" className="text-sm" steppers defaultValue={3} />
								</FormField>
								<FormField htmlFor={`${id}-bathrooms`} label="Bathrooms" className="gap-2">
									<NumericInput id={`${id}-bathrooms`} size="xl" className="text-sm" steppers defaultValue={2} />
								</FormField>
								<FormField htmlFor={`${id}-guests`} label="Maximum Guests" className="gap-2">
									<NumericInput id={`${id}-guests`} size="xl" className="text-sm" steppers defaultValue={13} />
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
				</div>

				<div className="flex flex-col items-center py-4 text-center">
					<Typography size="xs" className="text-muted-foreground">
						© 2026 Bethere Corp. All Rights Reserved
					</Typography>
				</div>
			</div>
		</div>
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
	const toggle = (option: string) => {
		const next = new Set(selected);
		if (next.has(option)) next.delete(option);
		else next.add(option);
		onSelectedChange(next);
	};

	// Custom options added through the trailing "Add" tile. Committing a value moves
	// that tile into this list (same key → same instance, so its focus hands off to
	// the remove button) and a fresh empty "Add" tile takes its place.
	const nextId = React.useRef(0);
	const [custom, setCustom] = React.useState<{ id: number; value: string }[]>([]);
	const [addId, setAddId] = React.useState(() => nextId.current++);

	const addCustom = (value: string) => {
		if (!value) return;
		setCustom((items) => [...items, { id: addId, value }]);
		setAddId(nextId.current++);
	};

	// Edited in place (click an added value), or removed when cleared via its × button.
	const updateCustom = (id: number, value: string) =>
		setCustom((items) =>
			value === ""
				? items.filter((item) => item.id !== id)
				: items.map((item) => (item.id === id ? { ...item, value } : item)),
		);

	// Custom tiles Reveal in / fade out, and siblings glide to their new cell (layout).
	// Reduced motion: opacity only, no movement.
	const { prefersReducedMotion, resolve } = useMotionPreference();
	const tileMotion = {
		layout: prefersReducedMotion ? false : ("position" as const),
		variants: prefersReducedMotion ? fadeVariants : revealVariants,
		initial: "initial",
		animate: "animate",
		exit: "exit",
		transition: { layout: resolve(layoutSpring) },
		className: "h-full",
	};

	return (
		<section className="flex flex-col gap-3">
			<SectionHeading id={id}>{title}</SectionHeading>
			{/* Figma: 3 equal columns, 8px gaps, 38px rows (instances stretch to the row).
			    `relative` anchors exiting tiles popped out of flow by AnimatePresence. */}
			<div role="group" aria-labelledby={id} className="relative grid auto-rows-[38px] grid-cols-3 gap-2">
				{options.map((option) => (
					<ChoiceChip
						key={option}
						role="checkbox"
						label={option}
						isSelected={selected.has(option)}
						onClick={() => toggle(option)}
						className="h-full"
					/>
				))}
				{/* One flat keyed array, so the committed "Add" tile is moved (not remounted) into the list.
				    popLayout: a removed tile leaves the grid flow at once, so the rest reflow while it fades. */}
				{allowCustom ? (
					<AnimatePresence initial={false} mode="popLayout">
						{[
							...custom.map((item) => (
								<motion.div key={item.id} {...tileMotion}>
									<ChoiceInput
										value={item.value}
										onValueChange={(value) => updateCustom(item.id, value)}
										className="h-full"
									/>
								</motion.div>
							)),
							<motion.div key={addId} {...tileMotion}>
								<ChoiceInput value="" onValueChange={addCustom} className="h-full" />
							</motion.div>,
						]}
					</AnimatePresence>
				) : null}
			</div>
		</section>
	);
}

export { ListingAttributes };
