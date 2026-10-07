import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { Toaster } from "@/components/feedback/sonner";
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
import { AvailabilityStep, sampleBusinessHours } from "./steps/availability/availability";
import { PricingStep } from "./steps/pricing/pricing";
import { PhotosStep, type Photo } from "./steps/photos/photos";
import { BusinessStep } from "./steps/business/business";
import { sampleBusinesses } from "./steps/business/sample-businesses";
import { PoliciesStep } from "./steps/policies/policies";
import { DocumentsStep } from "./steps/documents/documents";
import { ReviewStep, type ReviewSection } from "./steps/review/review";
import { improveWithClaude } from "./shared/improve-with-claude";
import { saveDraftSample } from "./shared/save-draft-sample";
import { buildReviewSummary, sampleListingAnswers, type ListingAnswers } from "./shared/listing-summary";

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
	"documents": { step: 12, previous: "policies" },
	"review": { step: 13, previous: "documents" },
} as const;
type Screen = keyof typeof screens;

// Review's pencils go back to the step that collected each summary row.
const reviewEditScreen: Record<ReviewSection, Screen> = {
	photos: "photos",
	yacht: "attributes",
	location: "expectations",
	duration: "expectations",
	destinations: "expectations",
	experienceTypes: "expectations",
	included: "expectations",
	business: "business",
	availability: "availability",
	pricing: "pricing",
	documents: "documents",
	addons: "pricing",
	policies: "policies",
};

/**
 * The answers as a comparable string: object keys sorted (so build order doesn't matter), React
 * elements (e.g. a business's map preview) left out.
 */
function answersKey(answers: ListingAnswers) {
	return JSON.stringify(answers, (_key, value: unknown) => {
		if (value && typeof value === "object" && !Array.isArray(value)) {
			if ("$$typeof" in value) return undefined;
			const record = value as Record<string, unknown>;
			return Object.fromEntries(Object.keys(record).sort().map((key) => [key, record[key]]));
		}
		return value;
	});
}

function NewListingFlow() {
	const [screen, setScreen] = React.useState<Screen>("type");
	// Last lookup query, so "Refine search" (or Back) returns to the lookup as it was left.
	const [searchDetails, setSearchDetails] = React.useState("");
	// Match picked on the results screen — named in the stepper label from then on (Figma).
	const [match, setMatch] = React.useState<Match | null>(null);
	// Attributes is reachable from the lookup ("Add yacht manually") or the results (a match
	// or "Add manually"); Back returns to whichever screen it was opened from.
	const [attributesFrom, setAttributesFrom] = React.useState<Screen>("matches");
	// What each step collected, starting from their sample defaults. Steps report changes here and
	// are seeded from it when revisited, so their answers survive going back (Back, "Change days",
	// a Review pencil) — and Review's summary cards show exactly what was chosen. Days, time
	// windows and photos start empty.
	const [answers, setAnswers] = React.useState<ListingAnswers>(() => ({
		...sampleListingAnswers,
		match: null,
		days: [],
		windows: {},
		photos: [],
		// Nothing confirmed until the Business step's Continue.
		business: null,
	}));
	const setAnswer =
		<K extends keyof ListingAnswers>(key: K) =>
		(value: ListingAnswers[K]) =>
			setAnswers((current) => ({ ...current, [key]: value }));
	const listingDays = answers.days;
	const setListingDays = setAnswer("days");
	const photos = answers.photos;
	const setPhotos = setAnswer("photos") as (photos: Photo[]) => void;
	// Opened from a Review card (edit mode): the answers as they were then — to tell whether anything
	// changed ("Save and review" waits for a change) and to restore them on "Discard changes".
	const [reviewSnapshot, setReviewSnapshot] = React.useState<ListingAnswers | null>(null);
	// Bumped by "Discard changes" to re-open the step, so every field shows its original value again.
	const [discards, setDiscards] = React.useState(0);
	const editingFromReview = reviewSnapshot !== null;
	const reviewEdit = reviewSnapshot
		? {
				changed: answersKey(answers) !== answersKey(reviewSnapshot),
				onBackToReview: () => {
					setReviewSnapshot(null);
					setScreen("review");
				},
				onDiscard: () => {
					setAnswers(reviewSnapshot);
					setDiscards((count) => count + 1);
				},
			}
		: undefined;
	const advance = (next: Screen) => {
		if (editingFromReview) {
			setReviewSnapshot(null);
			setScreen("review");
		} else {
			setScreen(next);
		}
	};
	const { prefersReducedMotion } = useMotionPreference();
	const { step } = screens[screen];

	// Later steps are long pages — each new screen starts at the top, not where Continue was clicked.
	React.useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [screen]);
	const previous = screen === "attributes" ? attributesFrom : screens[screen].previous;

	const openAttributes = (from: Screen, selected: Match | null) => {
		setMatch(selected);
		setAnswers((current) => ({ ...current, match: selected }));
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
			screen === "policies" ||
			screen === "documents" ||
			screen === "review") &&
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
					// Stepping back leaves the edit-from-Review shortcut; Continue walks forward again.
					setReviewSnapshot(null);
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
					{/* Re-keyed by "Discard changes": the step re-opens with its original answers (no screen transition). */}
					<React.Fragment key={discards}>
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
								reviewEdit={reviewEdit}
								onSaveDraft={saveDraftSample}
								className={screenClassName}
								defaultAnswers={answers.attributes}
								onAnswersChange={setAnswer("attributes")}
								onContinue={() => advance("expectations")}
							/>
						) : (
							screen === "expectations" ? (
								<ExpectationsStep
									showStepper={false}
									reviewEdit={reviewEdit}
									onSaveDraft={saveDraftSample}
									className={screenClassName}
									defaultAnswers={answers.expectations}
									onAnswersChange={setAnswer("expectations")}
									onContinue={() => advance("availability")}
								/>
							) : (
								screen === "availability" ? (
									<AvailabilityStep
										showStepper={false}
										reviewEdit={reviewEdit}
										onSaveDraft={saveDraftSample}
										className={screenClassName}
										days={listingDays}
										onDaysChange={setListingDays}
										defaultWindows={answers.windows}
										onWindowsChange={setAnswer("windows")}
										// Picked days start from the business's hours of operation (Settings).
										businessHours={sampleBusinessHours}
										onContinue={() => advance("pricing")}
									/>
								) : screen === "pricing" ? (
									<PricingStep
										showStepper={false}
										reviewEdit={reviewEdit}
										onSaveDraft={saveDraftSample}
										className={screenClassName}
										days={listingDays}
										defaultAnswers={answers.pricing}
										onAnswersChange={setAnswer("pricing")}
										onChangeDays={() => setScreen("availability")}
										onContinue={() => advance("photos")}
									/>
								) : screen === "photos" ? (
									<PhotosStep
										showStepper={false}
										reviewEdit={reviewEdit}
										onSaveDraft={saveDraftSample}
										className={screenClassName}
										defaultPhotos={photos}
										onPhotosChange={setPhotos}
										onContinue={() => advance("business")}
										// Skipping keeps the listing a draft; the flow carries on to the next step.
										onSkip={() => advance("business")}
									/>
								) : screen === "business" ? (
									// The common case: the account has one business to confirm.
									<BusinessStep
										showStepper={false}
										// Its confirmation stays inside the step until Continue, so "changed" isn't tracked here.
										reviewEdit={reviewEdit && { ...reviewEdit, changed: undefined }}
										onSaveDraft={saveDraftSample}
										className={screenClassName}
										businesses={sampleBusinesses.slice(0, 1)}
										// Review's Business card shows the confirmed business.
										onContinue={(business) => {
											setAnswer("business")(business);
											advance("policies");
										}}
									/>
								) : screen === "policies" ? (
									<PoliciesStep
										showStepper={false}
										reviewEdit={reviewEdit}
										onSaveDraft={saveDraftSample}
										className={screenClassName}
										defaultAnswers={answers.policies}
										onAnswersChange={setAnswer("policies")}
										onContinue={() => advance("documents")}
									/>
								) : (
									screen === "documents" ? (
										<DocumentsStep
											showStepper={false}
											reviewEdit={reviewEdit}
											onSaveDraft={saveDraftSample}
											className={screenClassName}
											defaultDocuments={answers.documents}
											onDocumentsChange={setAnswer("documents")}
											onContinue={() => advance("review")}
										/>
									) : (
										<ReviewStep
											showStepper={false}
											className={screenClassName}
											summary={buildReviewSummary(answers)}
											onEdit={(section) => {
												setReviewSnapshot(answers);
												setScreen(reviewEditScreen[section]);
											}}
											onImprove={improveWithClaude}
											onSaveDraft={saveDraftSample}
										/>
									)
								)
							)
						)
					)}
					</React.Fragment>
				</motion.div>
			</AnimatePresence>

			{/* The app's toast host — Review's "Save as draft" confirms with a toast. */}
			<Toaster />
		</div>
	);
}

/**
 * Steps 1 → 13: Experience → yacht type → yacht lookup → matches → attributes → expectations →
 * availability → pricing → photos → business → policies → documents → review; the stepper's back
 * button steps back. Review's summary shows what was chosen along the way; a card's pencil opens
 * its step, and that step's Continue returns to Review.
 */
export const Default: Story = {
	render: () => <NewListingFlow />,
};
