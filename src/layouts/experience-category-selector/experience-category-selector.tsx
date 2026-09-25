import * as React from "react";
import { motion } from "motion/react";

import { StepperExperience } from "@/components/stepper/stepper-experience";
import { ChoiceItem } from "@/components/forms/choice-item";
import { Typography } from "@/components/typography";
import {
	motionDistance,
	standardTransition,
	subtleSpring,
	useMotionPreference,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type ExperienceCategorySelectorProps = {
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
	/** Called when the back control is activated. */
	onBack?: () => void;
	/** Called when the close control is activated. */
	onClose?: () => void;
};

/**
 * New Listing — category follow-up step ("Great, what type of yacht do you
 * have?" in Figma). Figma origin: Provider Portal, "Experience Category
 * Selector" frame (node 87:3145). Single-select list of options scoped to the
 * business's onboarding category + Experience/Service choice — see
 * product-specs/taxonomy.md for the per-category option sets this generalizes to.
 */
function ExperienceCategorySelector({
	className,
	showStepper = true,
	// Step 2 of the New Listing flow — the old generic Step 2 was removed (product-specs/new-listing-flow.md).
	steps = 13,
	currentStep = 2,
	stepLabel = "Step 2 of 13",
	heading = "Great, what type of yacht do you have?",
	subheading = "Select the option that best matches your vessel.",
	options,
	onSelect,
	onBack = () => {},
	onClose = () => {},
}: ExperienceCategorySelectorProps) {
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
		<div className={cn("flex min-h-screen flex-col items-center bg-background p-2", className)}>
			<div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-between">
				{showStepper ? (
					<StepperExperience
						steps={steps}
						currentStep={currentStep}
						label={stepLabel}
						onBack={onBack}
						onClose={onClose}
					/>
				) : null}

				<div className="flex w-full flex-1 flex-col items-center justify-center gap-10">
					<div className="flex flex-col items-center gap-2 text-center">
						<Typography as="h1" size="3xl" weight="semibold">
							{heading}
						</Typography>
						<Typography size="xl" className="text-muted-foreground">
							{subheading}
						</Typography>
					</div>

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
				</div>

				<div className="flex flex-col items-center py-4 text-center">
					<Typography size="xs" className="text-muted-foreground">
						© 2026 BeThere Corp. All Rights Reserved
					</Typography>
				</div>
			</div>
		</div>
	);
}

export { ExperienceCategorySelector };
