import * as React from "react";
import { motion } from "motion/react";
import { Compass, HandPlatter } from "lucide-react";

import { StepperExperience } from "@/components/stepper/stepper-experience";
import { CardAddListingCategory } from "@/components/cards/card-add-listing-category";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import {
	motionScale,
	standardTransition,
	subtleSpring,
	useMotionPreference,
} from "@/lib/motion";

type ListingKind = "experience" | "service";

type NewListingProps = {
	className?: string;
	/**
	 * Render the built-in stepper. Set `false` when a parent flow owns a single
	 * persistent stepper across screens (so it advances in place instead of remounting).
	 */
	showStepper?: boolean;
	/** Total step count for the stepper track. Varies per business category/branch — see product-specs/onboarding-master-flow.md. */
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
	className,
	showStepper = true,
	steps = 13,
	currentStep = 1,
	stepLabel = "Step 1 of 13",
	onSelectExperience,
	onSelectService,
	onBack = () => {},
	onClose = () => {},
}: NewListingProps) {
	// Card under the pointer (or keyboard focus) grows; the other recedes and dims to 50%.
	const [active, setActive] = React.useState<ListingKind | null>(null);
	const { prefersReducedMotion, resolve } = useMotionPreference();

	const scaleFor = (kind: ListingKind) => {
		if (active == null || prefersReducedMotion) return 1;
		return kind === active ? motionScale.spotlight : motionScale.recede;
	};

	// Opacity isn't a transform, so it still applies under reduced motion (near-instant via `resolve`).
	const opacityFor = (kind: ListingKind) => (active == null || kind === active ? 1 : 0.5);

	const cardMotion = (kind: ListingKind) => ({
		animate: { scale: scaleFor(kind), opacity: opacityFor(kind) },
		transition: { ...resolve(subtleSpring), opacity: resolve(standardTransition) },
		onMouseEnter: () => setActive(kind),
		onFocus: () => setActive(kind),
		// Same outer sizing the card itself uses, so the wrapper doesn't change the layout.
		className: "flex w-full max-w-[388px]",
	});

	return (
		<div
			className={cn(
				"flex min-h-screen flex-col items-center justify-between bg-background p-2",
				className,
			)}
		>
			{showStepper ? (
				<StepperExperience
					steps={steps}
					currentStep={currentStep}
					label={stepLabel}
					onBack={onBack}
					onClose={onClose}
				/>
			) : null}

			<div className="flex w-full max-w-[800px] flex-1 flex-col items-center justify-center gap-14 pb-14">
				<Typography as="h1" size="3xl" weight="semibold" className="text-center">
					What type of listing are you creating?
				</Typography>

				<div
					className="flex w-full items-center justify-center gap-6 rounded-xl"
					// Reset on leaving the pair, not each card, so crossing the gap doesn't snap back.
					onMouseLeave={() => setActive(null)}
					onBlur={(event) => {
						if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
					}}
				>
					<motion.div {...cardMotion("experience")}>
						<CardAddListingCategory
							icon={<Compass />}
							title="Experience"
							description="Hosted activities, tours, adventures, and events."
							onClick={onSelectExperience}
						/>
					</motion.div>
					<motion.div {...cardMotion("service")}>
						<CardAddListingCategory
							icon={<HandPlatter />}
							title="Service"
							description="Professional services delivered to guests or clients."
							onClick={onSelectService}
						/>
					</motion.div>
				</div>
			</div>

			<div className="flex flex-col items-center py-4 text-center">
				<Typography size="xs" className="text-muted-foreground">
					© 2026 Bethere Corp. All Rights Reserved
				</Typography>
			</div>
		</div>
	);
}

export { NewListing };
