import * as React from "react";

import { BusinessChoiceCard } from "@/components/forms/business-choice-card";
import { RadioGroup } from "@/components/forms/radio-group";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { StepActions } from "../../shared/step-actions";
import { AddLink } from "../../shared/add-link";
import type { ListingKind } from "../type/type";

/** One business the provider's account owns or operates. */
type Business = {
	id: string;
	name: string;
	address: string;
	/** EIN / Tax ID value. */
	taxId?: string;
	/** Map preview (an `<img>`, static map, or embed). */
	map: React.ReactNode;
};

type BusinessStepProps = NewListingStepProps & {
	/** Listing type picked on the Type step — names it in the copy ("…operates this service"). */
	listingType?: ListingKind;
	/** The account's businesses. One shows the confirm screen; two or more show the picker. */
	businesses: Business[];
	/** Called when "Add another business" is activated. */
	onAddBusiness?: () => void;
	/** Called on "Continue" with the confirmed (single) or selected (multiple) business. */
	onContinue?: (business: Business) => void;
};

/**
 * New Listing — business: confirm which business owns or operates the listing.
 * One business (the common case): its card, confirmed with "Yes, this is the business for this listing".
 * Several: radio cards to pick from, nothing preselected. Either way, Continue unlocks only
 * once the provider explicitly confirms or chooses.
 * Figma origin: Provider Portal, "11. Verify Business - Single" (106:2827) and
 * "11. Verify Business - Multiple" (110:3850).
 */
function BusinessStep({
	steps = 14,
	currentStep = 11,
	stepLabel = "Little Atocha · Step 11 of 14",
	listingType = "experience",
	businesses,
	onAddBusiness = () => {},
	onContinue,
	onSaveDraft,
	...frame
}: BusinessStepProps) {
	const multiple = businesses.length > 1;
	const [selectedId, setSelectedId] = React.useState<string>();
	const [confirmed, setConfirmed] = React.useState(false);
	const business = multiple ? businesses.find((b) => b.id === selectedId) : businesses[0];
	const canContinue = business != null && (multiple || confirmed);

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			title={multiple ? `Select the business for this ${listingType}` : "Confirm your business"}
			description={
				multiple
					? "Choose the business that owns or operates this listing."
					: `Confirm this is the business that owns or operates this ${listingType}.`
			}
		>
			{/* Figma: business list + "Add another business" → Continue 24px. */}
			<form
				className="flex w-full flex-col gap-6"
				onSubmit={(event) => {
					event.preventDefault();
					if (business && canContinue) onContinue?.(business);
				}}
			>
				{/* Figma: cards and the add link stack 16px apart (spacing/4). */}
				<div className="flex flex-col gap-4">
					{multiple ? (
						<RadioGroup
							value={selectedId ?? ""}
							onValueChange={setSelectedId}
							aria-label="Business"
							className="gap-4"
						>
							{businesses.map(({ id, ...card }) => (
								<BusinessChoiceCard key={id} variant="multiple" value={id} {...card} />
							))}
						</RadioGroup>
					) : business ? (
						<BusinessChoiceCard
							name={business.name}
							address={business.address}
							taxId={business.taxId}
							map={business.map}
							confirmed={confirmed}
							onConfirmedChange={setConfirmed}
						/>
					) : null}
					<AddLink onClick={onAddBusiness}>Add another business</AddLink>
				</div>

				<StepActions onSaveDraft={onSaveDraft} continueDisabled={!canContinue} />
			</form>
		</NewListingLayout>
	);
}

export { BusinessStep };
export type { Business, BusinessStepProps };
