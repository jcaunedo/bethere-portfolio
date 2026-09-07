import * as React from "react";
import { Compass, HandPlatter } from "lucide-react";

import { StepperExperience } from "@/components/stepper/stepper-experience";
import { CardAddListingCategory } from "@/components/cards/card-add-listing-category";
import { Typography } from "@/components/typography";

type NewListingProps = {
	/** Total step count for the stepper track. Varies per business category/branch — see product-specs/master-flow.md. */
	steps?: number;
	/** 1-indexed current step. */
	currentStep?: number;
	/** Stepper center label. */
	stepLabel?: string;
	/** Called when Experience is selected. */
	onSelectExperience?: () => void;
	/** Called when Service is selected. */
	onSelectService?: () => void;
	/** Called when the back control is activated. */
	onBack?: () => void;
	/** Called when the close control is activated. */
	onClose?: () => void;
};

/**
 * New Listing — "What type of listing are you creating?" step. Figma origin:
 * Provider Portal, "New Listing" frame (node 72:832). Step 1 of the New
 * Listing flow: choose Experience or Service before listing-specific details.
 * See product-specs/new-listing-flow.md for the product rationale.
 */
function NewListing({
	steps = 13,
	currentStep = 1,
	stepLabel = "Step 1 of 13",
	onSelectExperience,
	onSelectService,
	onBack = () => {},
	onClose = () => {},
}: NewListingProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-between bg-background p-2">
			<StepperExperience
				steps={steps}
				currentStep={currentStep}
				label={stepLabel}
				onBack={onBack}
				onClose={onClose}
			/>

			<div className="flex w-full max-w-[800px] flex-1 flex-col items-center justify-center gap-14 pb-14">
				<Typography as="h1" size="3xl" weight="semibold" className="text-center">
					What type of listing are you creating?
				</Typography>

				<div className="flex w-full items-center justify-center gap-6 rounded-xl">
					<CardAddListingCategory
						icon={<Compass />}
						title="Experience"
						description="Hosted activities, tours, adventures, and events."
						onClick={onSelectExperience}
					/>
					<CardAddListingCategory
						icon={<HandPlatter />}
						title="Service"
						description="Professional services delivered to guests or clients."
						onClick={onSelectService}
					/>
				</div>
			</div>

			<div className="flex flex-col items-center py-4 text-center">
				<Typography size="xs" className="text-muted-foreground">
					© 2026 BeThere Corp. All Rights Reserved
				</Typography>
			</div>
		</div>
	);
}

export { NewListing };
