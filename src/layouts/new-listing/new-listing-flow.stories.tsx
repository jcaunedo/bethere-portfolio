import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { fadeVariants, revealVariants, useMotionPreference } from "@/lib/motion";
import { NewListingHeader } from "./new-listing";
// Steps, in flow order.
import { TypeStep } from "./steps/type/type";
import { CategoryStep } from "./steps/category/category";
import { SearchStep } from "./steps/search/search";
import { MatchesStep, type Match } from "./steps/matches/matches";
import { sampleMatches } from "./steps/matches/sample-matches";
import { AttributesStep } from "./steps/attributes/attributes";
import { ExpectationsStep } from "./steps/expectations/expectations";
import { AvailabilityStep } from "./steps/availability/availability";
import { PricingStep } from "./steps/pricing/pricing";
import { PhotosStep, type Photo } from "./steps/photos/photos";
import { BusinessStep } from "./steps/business/business";
import { sampleBusinesses } from "./steps/business/sample-businesses";
import { PoliciesStep } from "./steps/policies/policies";
import { sampleListingDays } from "./shared/week";

/**
 * The whole New Listing flow, stitched from the step layouts in `./steps/`. Each step is
 * named for what it collects (search, attributes, expectations…), not for one listing type;
 * the order below is the Experience → yacht charter path from product-specs.
 */
const meta: Meta = {
	title: "Layouts/NewListing/Flow",
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj;

const yachtOptions = [
	"Motor Yacht",
	"Sailing Yacht",
	"Catamaran",
	"Sport Fishing Yacht",
	"Party Yacht",
	"Luxury Yacht",
	"Other",
];

const STEPS = 13;
const screens = {
	"type": { step: 1, previous: null },
	"category": { step: 2, previous: "type" },
	"search": { step: 3, previous: "category" },
	"matches": { step: 4, previous: "search" },
	"attributes": { step: 5, previous: "matches" },
	"expectations": { step: 6, previous: "attributes" },
	"availability": { step: 7, previous: "expectations" },
	"pricing": { step: 8, previous: "availability" },
	"photos": { step: 9, previous: "pricing" },
	"business": { step: 10, previous: "photos" },
	"policies": { step: 11, previous: "business" },
} as const;
type Screen = keyof typeof screens;

function NewListingFlow() {
	const [screen, setScreen] = React.useState<Screen>("type");
	// Last lookup query, so "Refine search" (or Back) returns to the lookup as it was left.
	const [searchDetails, setSearchDetails] = React.useState("");
	// Match picked on the results screen — named in the stepper label from then on (Figma).
	const [match, setMatch] = React.useState<Match | null>(null);
	// Attributes is reachable from the lookup ("Add yacht manually") or the results (a match
	// or "Add manually"); Back returns to whichever screen it was opened from.
	const [attributesFrom, setAttributesFrom] = React.useState<Screen>("matches");
	// Days picked on Availability — Pricing offers them for by-day rates, and they're restored on
	// the way back ("Change days" or Back).
	const [listingDays, setListingDays] = React.useState(sampleListingDays);
	// Photos added so far — restored when stepping back to them.
	const [photos, setPhotos] = React.useState<Photo[]>([]);
	const { prefersReducedMotion } = useMotionPreference();
	const { step } = screens[screen];

	// Later steps are long pages — each new screen starts at the top, not where Continue was clicked.
	React.useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [screen]);
	const previous = screen === "attributes" ? attributesFrom : screens[screen].previous;

	const openAttributes = (from: Screen, selected: Match | null) => {
		setMatch(selected);
		setAttributesFrom(from);
		setScreen("attributes");
	};
	// From the attributes step on, the listing is named in the label (Figma).
	const stepLabel =
		(screen === "attributes" ||
			screen === "expectations" ||
			screen === "availability" ||
			screen === "pricing" ||
			screen === "photos" ||
			screen === "business" ||
			screen === "policies") &&
		match
			? `${match.name} · Step ${step} of ${STEPS}`
			: `Step ${step} of ${STEPS}`;

	// Screen content sits in the same slot either way: the layouts' own
	// stepper is off, so drop their full-page sizing/padding in favor of the flow's.
	const screenClassName = "min-h-0 flex-1 p-0";

	return (
		<div className="flex min-h-screen flex-col items-center bg-background p-2">
			{/* One persistent stepper for the whole flow — it advances in place
			    (segment fills, label updates) instead of remounting with each screen; sticky like
			    each step's own header. */}
			<NewListingHeader
				steps={STEPS}
				currentStep={step}
				label={stepLabel}
				onBack={() => {
					if (previous) setScreen(previous);
				}}
				onClose={() => {}}
			/>

			{/* Old content fades out before the new one reveals, so the two never overlap. */}
			<AnimatePresence initial={false} mode="wait">
				<motion.div
					key={screen}
					variants={prefersReducedMotion ? fadeVariants : revealVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					className="flex w-full flex-1 flex-col"
				>
					{screen === "type" ? (
						<TypeStep
							showStepper={false}
							className={screenClassName}
							onSelectExperience={() => setScreen("category")}
						/>
					) : screen === "category" ? (
						<CategoryStep
							showStepper={false}
							className={screenClassName}
							options={yachtOptions}
							onSelect={() => setScreen("search")}
						/>
					) : screen === "search" ? (
						<SearchStep
							showStepper={false}
							className={screenClassName}
							defaultDetails={searchDetails}
							onFind={(details) => {
								setSearchDetails(details);
								setScreen("matches");
							}}
							onAddManually={() => openAttributes("search", null)}
						/>
					) : screen === "matches" ? (
						<MatchesStep
							showStepper={false}
							className={screenClassName}
							matches={sampleMatches}
							onRefineSearch={() => setScreen("search")}
							onSelectMatch={(selected) => openAttributes("matches", selected)}
							onAddManually={() => openAttributes("matches", null)}
						/>
					) : (
						screen === "attributes" ? (
							<AttributesStep
								showStepper={false}
								className={screenClassName}
								onContinue={() => setScreen("expectations")}
							/>
						) : (
							screen === "expectations" ? (
								<ExpectationsStep
									showStepper={false}
									className={screenClassName}
									onContinue={() => setScreen("availability")}
								/>
							) : (
								screen === "availability" ? (
									<AvailabilityStep
										showStepper={false}
										className={screenClassName}
										days={listingDays}
										onDaysChange={setListingDays}
										onContinue={() => setScreen("pricing")}
									/>
								) : screen === "pricing" ? (
									<PricingStep
										showStepper={false}
										className={screenClassName}
										days={listingDays}
										onChangeDays={() => setScreen("availability")}
										onContinue={() => setScreen("photos")}
									/>
								) : screen === "photos" ? (
									<PhotosStep
										showStepper={false}
										className={screenClassName}
										defaultPhotos={photos}
										onPhotosChange={setPhotos}
										onContinue={() => setScreen("business")}
										// Skipping keeps the listing a draft; the flow carries on to the next step.
										onSkip={() => setScreen("business")}
									/>
								) : screen === "business" ? (
									// The common case: the account has one business to confirm.
									<BusinessStep
										showStepper={false}
										className={screenClassName}
										businesses={sampleBusinesses.slice(0, 1)}
										onContinue={() => setScreen("policies")}
									/>
								) : (
									<PoliciesStep showStepper={false} className={screenClassName} />
								)
							)
						)
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

/** Steps 1 → 11: Experience → yacht type → yacht lookup → matches → attributes → expectations → availability → pricing → photos → business → policies; the stepper's back button steps back. */
export const Default: Story = {
	render: () => <NewListingFlow />,
};
