import * as React from "react";
import { motion } from "motion/react";

import { ChoiceItem } from "@/components/forms/choice-item";
import {
	motionDistance,
	standardTransition,
	subtleSpring,
	useMotionPreference,
} from "@/lib/motion";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";

type CategoryStepProps = NewListingStepProps & {
	/** Question heading. */
	heading?: string;
	/** Supporting line below the heading. */
	subheading?: string;
	/**
	 * Selectable options, driven by the business's onboarding category and
	 * Experience/Service selection (Figma has this hardcoded to yacht types;
	 * see product-specs/taxonomy.md for the full per-category option sets).
	 */
	options: string[];
	/** Called with the selected option when a row is chosen. */
	onSelect?: (option: string) => void;
};

/**
 * New Listing — category follow-up step ("Great, what type of yacht do you
 * have?" in Figma). Figma origin: Provider Portal, "Experience Category
 * Selector" frame (node 87:3145). Single-select list of options scoped to the
 * business's onboarding category + Experience/Service choice — see
 * product-specs/taxonomy.md for the per-category option sets this generalizes to.
 */
function CategoryStep({
	// Step 2 of the New Listing flow — the old generic Step 2 was removed (product-specs/new-listing-flow.md).
	steps = 13,
	currentStep = 2,
	stepLabel = "Step 2 of 13",
	heading = "Great, what type of yacht do you have?",
	subheading = "Select the option that best matches your vessel.",
	options,
	onSelect,
	...frame
}: CategoryStepProps) {
	// Row under the pointer (or keyboard focus). Rows above it nudge up, rows
	// below nudge down, and every other row dims to 50% — sets the active row apart.
	const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
	const { prefersReducedMotion, resolve } = useMotionPreference();

	const offsetFor = (index: number) => {
		if (activeIndex == null || prefersReducedMotion || index === activeIndex) return 0;
		return index < activeIndex ? -motionDistance.hover : motionDistance.hover;
	};

	// Opacity isn't a transform, so it still applies under reduced motion (near-instant via `resolve`).
	const opacityFor = (index: number) =>
		activeIndex == null || index === activeIndex ? 1 : 0.5;

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			title={heading}
			description={subheading}
			// Full-width body: the heading is not capped; the option list is (640px). 40px title → list gap.
			width="full"
			bodyClassName="gap-10"
		>
			<div
				className="flex w-full max-w-[640px] flex-col gap-2"
				// Reset on leaving the whole list, not each row, so crossing the
				// gap between rows doesn't snap everything back mid-move.
				onMouseLeave={() => setActiveIndex(null)}
				onBlur={(event) => {
					if (!event.currentTarget.contains(event.relatedTarget)) setActiveIndex(null);
				}}
			>
				{options.map((option, index) => (
					<motion.div
						key={option}
						animate={{ y: offsetFor(index), opacity: opacityFor(index) }}
						transition={{
							...resolve(subtleSpring),
							opacity: resolve(standardTransition),
						}}
						onMouseEnter={() => setActiveIndex(index)}
						onFocus={() => setActiveIndex(index)}
					>
						<ChoiceItem
							selectionMode="single"
							title={option}
							onClick={() => onSelect?.(option)}
						/>
					</motion.div>
				))}
			</div>
		</NewListingLayout>
	);
}

export { CategoryStep };
