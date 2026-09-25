import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { StepperExperience } from "@/components/stepper/stepper-experience";
import { ExperienceCategorySelector } from "@/layouts/experience-category-selector/experience-category-selector";
import { ListingDetails } from "@/layouts/listing-details/listing-details";
import { ListingDetailsMatches } from "@/layouts/listing-details-matches/listing-details-matches";
import { sampleMatches } from "@/layouts/listing-details-matches/sample-matches";
import { fadeVariants, revealVariants, useMotionPreference } from "@/lib/motion";
import { NewListing } from "./new-listing";

const meta: Meta<typeof NewListing> = {
	title: "Layouts/NewListing",
	component: NewListing,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof NewListing>;

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
	"listing-type": { step: 1, previous: null },
	"experience-category": { step: 2, previous: "listing-type" },
	"listing-details": { step: 3, previous: "experience-category" },
	"listing-details-matches": { step: 4, previous: "listing-details" },
} as const;
type Screen = keyof typeof screens;

function NewListingFlow() {
	const [screen, setScreen] = React.useState<Screen>("listing-type");
	// Last lookup query, so "Refine search" (or Back) returns to the lookup as it was left.
	const [searchDetails, setSearchDetails] = React.useState("");
	const { prefersReducedMotion } = useMotionPreference();
	const { step, previous } = screens[screen];

	// Screen content sits in the same slot either way: the layouts' own
	// stepper is off, so drop their full-page sizing/padding in favor of the flow's.
	const screenClassName = "min-h-0 flex-1 p-0";

	return (
		<div className="flex min-h-screen flex-col items-center bg-background p-2">
			{/* One persistent stepper for the whole flow — it advances in place
			    (segment fills, label updates) instead of remounting with each screen. */}
			<StepperExperience
				steps={STEPS}
				currentStep={step}
				label={`Step ${step} of ${STEPS}`}
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
					{screen === "listing-type" ? (
						<NewListing
							showStepper={false}
							className={screenClassName}
							onSelectExperience={() => setScreen("experience-category")}
						/>
					) : screen === "experience-category" ? (
						<ExperienceCategorySelector
							showStepper={false}
							className={screenClassName}
							options={yachtOptions}
							onSelect={() => setScreen("listing-details")}
						/>
					) : screen === "listing-details" ? (
						<ListingDetails
							showStepper={false}
							className={screenClassName}
							defaultDetails={searchDetails}
							onFind={(details) => {
								setSearchDetails(details);
								setScreen("listing-details-matches");
							}}
						/>
					) : (
						<ListingDetailsMatches
							showStepper={false}
							className={screenClassName}
							matches={sampleMatches}
							onRefineSearch={() => setScreen("listing-details")}
						/>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

/** Steps 1 → 4: Experience → yacht type → yacht lookup → matches; the stepper's back button steps back. */
export const Default: Story = {
	render: () => <NewListingFlow />,
};
