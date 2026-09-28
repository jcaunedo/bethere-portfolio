import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/buttons/button";
import { DaySelectorGroup } from "@/components/forms/day-selector";
import {
	TimeSlotAccordion,
	type TimeSlotAccordionValue,
} from "@/components/forms/time-slot-accordion";
import { Typography } from "@/components/typography";
import { fadeVariants, layoutSpring, useMotionPreference } from "@/lib/motion";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { dayTileOptions, sampleListingDays, week } from "../../shared/week";

const dayOptions = dayTileOptions(week.map((day) => day.value));

/** Figma sample: Tue one window, Thu none yet (Required), Sat two windows, Sun all day. */
const sampleWindows: TimeSlotAccordionValue = {
	tue: [{ start: "09:00", end: "16:00" }],
	sat: [
		{ start: "09:00", end: "14:00" },
		{ start: "16:00", end: "23:30" },
	],
	sun: [{ start: "00:00", end: "23:59" }],
};

type AvailabilityStepProps = NewListingStepProps & {
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
	/**
	 * Days the listing runs (values like "tue"). Controlled when set — a flow keeps them to hand
	 * to later steps (Pricing's by-day rates) and to restore them when coming back here.
	 */
	days?: string[];
	/** Initial days when uncontrolled. Defaults to the Figma sample (Tue, Thu, Sat, Sun). */
	defaultDays?: string[];
	/** Called with the new selection whenever a day is picked or cleared. */
	onDaysChange?: (days: string[]) => void;
};

/**
 * New Listing — availability ("Availability"): pick the days the experience runs, then set
 * each selected day's time windows.
 * Figma origin: Provider Portal, "8. Experiece Availability" frame (node 189:9286).
 */
function AvailabilityStep({
	steps = 14,
	currentStep = 8,
	stepLabel = "Little Atocha · Step 8 of 14",
	onContinue,
	days: daysProp,
	defaultDays = sampleListingDays,
	onDaysChange,
	...frame
}: AvailabilityStepProps) {
	const id = React.useId();
	const [ownDays, setOwnDays] = React.useState(defaultDays);
	const days = daysProp ?? ownDays;
	const setDays = (next: string[]) => {
		if (daysProp === undefined) setOwnDays(next);
		onDaysChange?.(next);
	};
	const [windows, setWindows] = React.useState(sampleWindows);

	// Only the selected days get a time-window row (in week order).
	const selectedDays = week.filter((day) => days.includes(day.value));
	const allSelected = days.length === week.length;

	// Selecting/deselecting a day adds/removes its time-window row (TimeSlotAccordion animates the
	// rows); the form and what follows the rows glide to their new place instead of jumping.
	const { prefersReducedMotion, resolve } = useMotionPreference();
	const glide = prefersReducedMotion
		? {}
		: { layout: "position" as const, transition: { layout: resolve(layoutSpring) } };
	const fade = {
		variants: fadeVariants,
		initial: "initial",
		animate: "animate",
		exit: "exit",
	};

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			title="Availability"
			description="Set the days and times your experience is available for booking."
			// Figma: 48px (spacing/12) from the title to the first section, like between sections.
			bodyClassName="gap-12"
		>
			{/* Standard 48px (spacing/12) gap between sections and before Continue; no dividers (Figma). */}
			<motion.form
				{...glide}
				className="flex w-full flex-col gap-12"
				onSubmit={(event) => {
					event.preventDefault();
					onContinue?.();
				}}
			>
				<section aria-labelledby={`${id}-days`} className="flex flex-col gap-4">
					<div className="flex flex-col">
						<Typography as="h2" id={`${id}-days`} size="lg" weight="semibold">
							Days available
						</Typography>
						<div className="flex items-start">
							<Typography size="sm" className="min-w-0 flex-1 text-muted-foreground">
								Select the days of the week this experience runs.
							</Typography>
							{/* Figma: sm/regular in color/states/link. */}
							<button
								type="button"
								onClick={() => setDays(allSelected ? [] : week.map((day) => day.value))}
								className="shrink-0 rounded-sm text-sm whitespace-nowrap text-link outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
							>
								{allSelected ? "Deselect all" : "Select all"}
							</button>
						</div>
					</div>
					<DaySelectorGroup
						aria-labelledby={`${id}-days`}
						options={dayOptions}
						value={days}
						onValueChange={setDays}
					/>
				</section>

				<section aria-labelledby={`${id}-windows`} className="flex flex-col gap-4">
					<div className="flex flex-col">
						<Typography as="h2" id={`${id}-windows`} size="lg" weight="semibold">
							Time windows
						</Typography>
						<Typography size="sm" className="text-muted-foreground">
							Set the hours guests can reserve and begin this experience each day.
						</Typography>
					</div>
					{/* No days ↔ some days: the list and the empty note crossfade (the note waits for
					    the list to fade out, so they never overlap). */}
					<AnimatePresence initial={false} mode="wait">
						{selectedDays.length > 0 ? (
							<motion.div key="windows" {...fade}>
								<TimeSlotAccordion
									days={selectedDays.map(({ value, label }) => ({ value, label }))}
									value={windows}
									onValueChange={setWindows}
								/>
							</motion.div>
						) : (
							<motion.div key="empty" {...fade}>
								<Typography size="sm" className="text-muted-foreground">
									Select at least one day above to set its hours.
								</Typography>
							</motion.div>
						)}
					</AnimatePresence>
				</section>

				<motion.div {...glide}>
					<Button type="submit" size="xl" className="w-full">
						Continue
					</Button>
				</motion.div>
			</motion.form>
		</NewListingLayout>
	);
}

export { AvailabilityStep };
