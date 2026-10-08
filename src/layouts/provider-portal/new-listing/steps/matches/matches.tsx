import * as React from "react";
import { motion } from "motion/react";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";
import { MatchCard } from "@/components/cards/match-card";
import { Typography } from "@/components/typography";
import {
	motionScale,
	standardTransition,
	subtleSpring,
	useMotionPreference,
} from "@/lib/motion";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";

type Match = {
	id: string;
	/** e.g. "Azimut 55 Fly (2021)". */
	name: string;
	/** 3:2 thumbnail source. */
	image?: string;
	/** Muted facts line, e.g. ["55 ft", "13 guests", "3 cabins", "2 bathrooms"]. */
	details?: string[];
	/** Optional pill next to the name, e.g. "Best match". */
	badge?: string;
};

type MatchesStepProps = NewListingStepProps & {
	/** Question heading. */
	heading?: string;
	/** Supporting line below the heading. */
	subheading?: string;
	/** Lookup results, best match first. */
	matches: Match[];
	/** Called with the chosen match when a card is activated. */
	onSelectMatch?: (match: Match) => void;
	/** Called when "Refine search" is activated (back to the lookup). */
	onRefineSearch?: () => void;
	/** Called when the "Add manually" button is activated. */
	onAddManually?: () => void;
};

/**
 * New Listing — search results ("Which yacht is yours?"). Figma origin:
 * Provider Portal, "5. Listing Details" (node 208:2386): the matches returned
 * by the lookup in `SearchStep`, one `MatchCard` per result.
 */
function MatchesStep({
	steps = 13,
	currentStep = 4,
	stepLabel = "Step 4 of 13",
	heading = "Which yacht is yours?",
	subheading = "Select the vessel that best matches your yacht.",
	matches,
	onSelectMatch,
	onRefineSearch,
	onAddManually,
	...frame
}: MatchesStepProps) {
	// Same hover treatment as TypeStep's cards: the card under the pointer (or
	// keyboard focus) grows; the others recede and dim to 50%.
	const [activeId, setActiveId] = React.useState<string | null>(null);
	const { prefersReducedMotion, resolve } = useMotionPreference();

	const scaleFor = (id: string) => {
		if (activeId == null || prefersReducedMotion) return 1;
		return id === activeId ? motionScale.spotlight : motionScale.recede;
	};

	// Opacity isn't a transform, so it still applies under reduced motion (near-instant via `resolve`).
	const opacityFor = (id: string) => (activeId == null || id === activeId ? 1 : 0.5);

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			title={heading}
			description={subheading}
		>
			<div className="flex w-full flex-col items-start gap-4">
				<Typography size="sm">
					{matches.length} possible {matches.length === 1 ? "match" : "matches"} found
				</Typography>
				<ul
					className="flex w-full flex-col gap-2"
					// Reset on leaving the whole list, not each card, so crossing the gap doesn't snap back.
					onMouseLeave={() => setActiveId(null)}
					onBlur={(event) => {
						if (!event.currentTarget.contains(event.relatedTarget)) setActiveId(null);
					}}
				>
					{matches.map((match) => (
						<motion.li
							key={match.id}
							animate={{ scale: scaleFor(match.id), opacity: opacityFor(match.id) }}
							transition={{ ...resolve(subtleSpring), opacity: resolve(standardTransition) }}
							onMouseEnter={() => setActiveId(match.id)}
							onFocus={() => setActiveId(match.id)}
						>
							<MatchCard
								image={match.image}
								name={match.name}
								details={match.details}
								badge={match.badge}
								onClick={() => onSelectMatch?.(match)}
							/>
						</motion.li>
					))}
				</ul>
				{/* Figma: 32px link button, 16px arrow in a 4px-padded slot, 4px gap. */}
				<Button
					variant="link"
					size="md"
					className="gap-1"
					onClick={onRefineSearch}
				>
					<ArrowLeftIcon aria-hidden="true" className="mx-1" />
					Refine search
				</Button>
			</div>

			{/* Figma: link Button (lg, 36px) with a two-tone label and a trailing 16px chevron in a
			    2px-padded slot, 4px gap. Hover/focus: only the brand-colored part + chevron turn
			    foreground (the muted prompt keeps its own color). */}
			<Button
				variant="link"
				size="lg"
				className="group gap-1"
				onClick={onAddManually}
			>
				{/* One label span, so Button's gap only separates the label from the icon.
				    Figma separates the two phrases with two spaces. Prompt is muted (Figma has
				    it white, which is invisible on the page background — confirmed as an error). */}
				<span className="whitespace-pre">
					<span className="text-muted-foreground">{"Can't find your yacht?  "}</span>
					<span className="text-primary transition-colors group-hover:text-foreground group-focus-visible:text-foreground">
						Add manually
					</span>
				</span>
				<ChevronRightIcon
					aria-hidden="true"
					className="mx-0.5 text-primary transition-colors group-hover:text-foreground group-focus-visible:text-foreground"
				/>
			</Button>
		</NewListingLayout>
	);
}

export { MatchesStep };
export type { Match };
