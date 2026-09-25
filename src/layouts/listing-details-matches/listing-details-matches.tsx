import * as React from "react";
import { motion } from "motion/react";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";
import { MatchCard } from "@/components/cards/match-card";
import { StepperExperience } from "@/components/stepper/stepper-experience";
import { Typography } from "@/components/typography";
import {
	motionScale,
	standardTransition,
	subtleSpring,
	useMotionPreference,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type ListingMatch = {
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

type ListingDetailsMatchesProps = {
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
	/** Lookup results, best match first. */
	matches: ListingMatch[];
	/** Called with the chosen match when a card is activated. */
	onSelectMatch?: (match: ListingMatch) => void;
	/** Called when "Refine search" is activated (back to the lookup). */
	onRefineSearch?: () => void;
	/** Called when the "Add manually" button is activated. */
	onAddManually?: () => void;
	/** Called when the back control is activated. */
	onBack?: () => void;
	/** Called when the close control is activated. */
	onClose?: () => void;
};

/**
 * New Listing — asset lookup results ("Which yacht is yours?"). Figma origin:
 * Provider Portal, "5. Listing Details" (node 208:2386): the matches returned
 * by the lookup in `ListingDetails`, one `MatchCard` per result.
 */
function ListingDetailsMatches({
	className,
	showStepper = true,
	steps = 13,
	currentStep = 4,
	stepLabel = "Step 4 of 13",
	heading = "Which yacht is yours?",
	subheading = "Select the vessel that best matches your yacht.",
	matches,
	onSelectMatch,
	onRefineSearch,
	onAddManually,
	onBack = () => {},
	onClose = () => {},
}: ListingDetailsMatchesProps) {
	// Same hover treatment as NewListing's cards: the card under the pointer (or
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

				<div className="flex w-full max-w-[640px] flex-1 flex-col items-center justify-center gap-8">
					<div className="flex flex-col items-center gap-2 text-center">
						<Typography as="h1" size="3xl" weight="semibold">
							{heading}
						</Typography>
						<Typography size="xl" className="text-muted-foreground">
							{subheading}
						</Typography>
					</div>

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
						{/* Figma: 32px link button, no side padding, 16px arrow in a 4px-padded slot, 4px gap.
						    Hover/focus: label + arrow turn foreground instead of underlining. */}
						<Button
							variant="link"
							size="md"
							className="gap-1 px-0 hover:text-foreground hover:no-underline focus-visible:text-foreground"
							onClick={onRefineSearch}
						>
							<ArrowLeftIcon aria-hidden="true" className="mx-1" />
							Refine search
						</Button>
					</div>

					{/* Figma: link Button (lg, 36px, no side padding) with a two-tone label and a
					    trailing 16px chevron in a 2px-padded slot, 4px gap. Hover/focus: only the
					    brand-colored part + chevron turn foreground (the muted prompt stays; no underline). */}
					<Button
						variant="link"
						size="lg"
						className="group gap-1 px-0 hover:no-underline"
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

export { ListingDetailsMatches };
export type { ListingMatch };
