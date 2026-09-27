import * as React from "react";
import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";
import { FormField } from "@/components/forms/field";
import { Textarea } from "@/components/forms/textarea";
import { useMotionPreference } from "@/lib/motion";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";

/** Placeholder typewriter timing (ms). */
const TYPE_MS = 70; // per character typed
const ERASE_MS = 35; // per character erased — faster than typing, like a real backspace
const HOLD_MS = 1000; // fully typed example stays readable
const GAP_MS = 150; // empty pause before the next example starts
/** Reduced motion: whole examples swap on this interval instead of typing. */
const PLACEHOLDER_ROTATION_MS = 2000;

const defaultPlaceholders = [
	"55' Azimut Fly 2021",
	"Sunseeker Manhattan 68 2022",
	"Princess F55 2020",
	"60' Galeon Fly 2021",
	"Ferretti 720 2022",
];

type SearchStepProps = NewListingStepProps & {
	/**
	 * Question heading. Figma notes this scales per category: "Which boat /
	 * vehicle / location will host this experience?".
	 */
	heading?: string;
	/** Supporting line below the heading. */
	subheading?: string;
	/** Field label. */
	label?: string;
	/** Example values the empty field's placeholder rotates through. */
	placeholders?: string[];
	/** Initial field value, e.g. the previous search when returning via "Refine search". */
	defaultDetails?: string;
	/** Called with the entered details when "Find my yacht" is submitted. */
	onFind?: (details: string) => void;
	/** Called when "Add yacht manually" is activated. */
	onAddManually?: () => void;
};

/**
 * New Listing — search ("Which yacht will host this experience?").
 * Figma origin: Provider Portal, "4. Listing Details" frame (node 87:3808) —
 * the search step, where categorization is finished and the
 * flow moves on to the listing's attributes.
 */
function SearchStep({
	steps = 13,
	currentStep = 3,
	stepLabel = "Step 3 of 13",
	heading = "Which yacht will host this experience?",
	subheading = "Enter your yacht’s brand, model, and year to find matching details.",
	label = "Yacht details",
	placeholders = defaultPlaceholders,
	defaultDetails = "",
	onFind,
	onAddManually,
	...frame
}: SearchStepProps) {
	const fieldId = React.useId();
	const [details, setDetails] = React.useState(defaultDetails);

	const placeholder = useTypewriterPlaceholder(placeholders, details === "");

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			title={heading}
			description={subheading}
		>
			<form
				className="flex w-full flex-col gap-6"
				onSubmit={(event) => {
					event.preventDefault();
					onFind?.(details.trim());
				}}
			>
				<FormField htmlFor={fieldId} label={label}>
					<Textarea
						id={fieldId}
						size="xl"
						value={details}
						onChange={(event) => setDetails(event.target.value)}
						placeholder={placeholder}
					/>
				</FormField>
				{/* Disabled until the field has real input (whitespace alone doesn't count). */}
				<Button type="submit" size="xl" className="w-full" disabled={details.trim() === ""}>
					Find my yacht
				</Button>
			</form>

			{/* Same CTA as MatchesStep: link Button (lg, 36px, no side padding) with a
			    label and a trailing 16px chevron in a 2px-padded slot, 4px gap.
			    Hover/focus: label + chevron turn foreground (no underline). */}
			<Button
				variant="link"
				size="lg"
				className="group gap-1 px-0 hover:no-underline"
				onClick={onAddManually}
			>
				<span className="text-primary transition-colors group-hover:text-foreground group-focus-visible:text-foreground">
					Add yacht manually
				</span>
				<ChevronRightIcon
					aria-hidden="true"
					className="mx-0.5 text-primary transition-colors group-hover:text-foreground group-focus-visible:text-foreground"
				/>
			</Button>
		</NewListingLayout>
	);
}

/**
 * Figma annotation "Rotating Placeholders": loops through the examples with a
 * typewriter effect (type → hold → erase → next). Pauses while `active` is
 * false (the field has a value, so the placeholder is hidden anyway). Under
 * reduced motion, whole examples swap on an interval instead of typing.
 */
function useTypewriterPlaceholder(examples: string[], active: boolean) {
	const { prefersReducedMotion } = useMotionPreference();
	const [index, setIndex] = React.useState(0);
	const [length, setLength] = React.useState(0);
	const [erasing, setErasing] = React.useState(false);

	const example = examples[index % examples.length] ?? "";

	React.useEffect(() => {
		if (!active || examples.length === 0) return;

		if (prefersReducedMotion) {
			if (examples.length < 2) return;
			const id = window.setTimeout(
				() => setIndex((i) => (i + 1) % examples.length),
				PLACEHOLDER_ROTATION_MS,
			);
			return () => window.clearTimeout(id);
		}

		let delay: number;
		let step: () => void;
		if (!erasing && length < example.length) {
			delay = TYPE_MS;
			step = () => setLength((l) => l + 1);
		} else if (!erasing) {
			delay = HOLD_MS;
			step = () => setErasing(true);
		} else if (length > 0) {
			delay = ERASE_MS;
			step = () => setLength((l) => l - 1);
		} else {
			delay = GAP_MS;
			step = () => {
				setErasing(false);
				setIndex((i) => (i + 1) % examples.length);
			};
		}
		const id = window.setTimeout(step, delay);
		return () => window.clearTimeout(id);
	}, [active, prefersReducedMotion, erasing, length, example.length, examples.length]);

	return prefersReducedMotion ? example : example.slice(0, length);
}

export { SearchStep };
