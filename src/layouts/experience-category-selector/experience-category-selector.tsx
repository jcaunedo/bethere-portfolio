import * as React from "react";

import { StepperExperience } from "@/components/stepper/stepper-experience";
import { ChoiceItem } from "@/components/forms/choice-item";
import { Typography } from "@/components/typography";

type ExperienceCategorySelectorProps = {
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
	steps = 14,
	currentStep = 3,
	stepLabel = "Step 3 of 14",
	heading = "Great, what type of yacht do you have?",
	subheading = "Select the option that best matches your vessel.",
	options,
	onSelect,
	onBack = () => {},
	onClose = () => {},
}: ExperienceCategorySelectorProps) {
	return (
		<div className="flex min-h-screen flex-col items-center bg-background p-2">
			<div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-between">
				<StepperExperience
					steps={steps}
					currentStep={currentStep}
					label={stepLabel}
					onBack={onBack}
					onClose={onClose}
				/>

				<div className="flex w-full flex-1 flex-col items-center justify-center gap-10">
					<div className="flex flex-col items-center gap-2 text-center">
						<Typography as="h1" size="3xl" weight="semibold">
							{heading}
						</Typography>
						<Typography size="xl" className="text-muted-foreground">
							{subheading}
						</Typography>
					</div>

					<div className="flex w-full max-w-[640px] flex-col gap-2">
						{options.map((option) => (
							<ChoiceItem
								key={option}
								selectionMode="single"
								title={option}
								onClick={() => onSelect?.(option)}
							/>
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
