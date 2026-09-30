import * as React from "react";
import { motion } from "motion/react";
import { Compass, HandPlatter } from "lucide-react";

import { CardAddListingCategory } from "@/components/cards/card-add-listing-category";
import {
	motionScale,
	standardTransition,
	subtleSpring,
	useMotionPreference,
} from "@/lib/motion";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";

type ListingKind = "experience" | "service";

type TypeStepProps = NewListingStepProps & {
	/** Called when Experience is selected. */
	onSelectExperience?: () => void;
	/** Called when Service is selected. */
	onSelectService?: () => void;
};

/**
 * New Listing — "What type of listing are you creating?" step. Figma origin:
 * Provider Portal, "New Listing" frame (node 72:832). Step 1 of the New
 * Listing flow: choose Experience or Service before listing-specific details.
 * See product-specs/new-listing-flow.md for the product rationale.
 */
function TypeStep({
	steps = 13,
	currentStep = 1,
	stepLabel = "Step 1 of 13",
	onSelectExperience,
	onSelectService,
	...frame
}: TypeStepProps) {
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
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			title="What type of listing are you creating?"
			// Two large cards side by side: 800px column, 56px title → cards gap, and 56px extra bottom
			// breathing room on top of the shell's symmetric 48px (48 + 56 = 104px) so it stays centered as designed.
			width="wide"
			bodyClassName="gap-14 pb-26"
		>
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
		</NewListingLayout>
	);
}

export { TypeStep };
export type { ListingKind };
