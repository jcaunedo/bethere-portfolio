import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { DaySelectorGroup } from "@/components/forms/day-selector";
import {
	TimeSlotAccordion,
	type TimeSlotAccordionValue,
} from "@/components/forms/time-slot-accordion";
import { Typography } from "@/components/typography";
import { fadeVariants, layoutSpring, useMotionPreference } from "@/lib/motion";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { StepActions } from "../../shared/step-actions";
import { dayTileOptions, week } from "../../shared/week";
import { useReportAnswers } from "../../shared/use-report-answers";

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

/** Sample business hours of operation (as set in Settings): closed Monday. */
const sampleBusinessHours: TimeSlotAccordionValue = {
	tue: [{ start: "09:00", end: "18:00" }],
	wed: [{ start: "09:00", end: "18:00" }],
	thu: [{ start: "09:00", end: "18:00" }],
	fri: [{ start: "09:00", end: "20:00" }],
	sat: [{ start: "08:00", end: "20:00" }],
	sun: [{ start: "08:00", end: "18:00" }],
};

type AvailabilityStepProps = NewListingStepProps & {
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
	/**
	 * Days the listing runs (values like "tue"). Controlled when set — a flow keeps them to hand
	 * to later steps (Pricing's by-day rates) and to restore them when coming back here.
	 */
	days?: string[];
	/** Initial days when uncontrolled. Defaults to none selected. */
	defaultDays?: string[];
	/** Called with the new selection whenever a day is picked or cleared. */
	onDaysChange?: (days: string[]) => void;
	/** Time windows to start from (e.g. when revisiting the step). Defaults to none set. */
	defaultWindows?: TimeSlotAccordionValue;
	/** Called with every day's time windows whenever they change. */
	onWindowsChange?: (windows: TimeSlotAccordionValue) => void;
	/**
	 * The business's hours of operation (from Settings), per day. A day picked with no time
	 * windows yet starts with that day's business hours as its windows (start and end filled in,
	 * still editable); a day the business is closed (no hours) starts empty, as without this.
	 */
	businessHours?: TimeSlotAccordionValue;
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
	onSaveDraft,
	days: daysProp,
	defaultDays = [],
	onDaysChange,
	defaultWindows = {},
	onWindowsChange,
	businessHours,
	...frame
}: AvailabilityStepProps) {
	const id = React.useId();
	const [ownDays, setOwnDays] = React.useState(defaultDays);
	const days = daysProp ?? ownDays;
	const [windows, setWindows] = React.useState(defaultWindows);
	useReportAnswers(windows, onWindowsChange);
	// The time-window row open for editing; a newly picked day opens so its hours can be set.
	const [openDay, setOpenDay] = React.useState("");
	const setDays = (next: string[]) => {
		if (daysProp === undefined) setOwnDays(next);
		onDaysChange?.(next);
		// Newly picked days, in week order.
		const added = week.filter((day) => next.includes(day.value) && !days.includes(day.value));
		// Seed each with the business hours for that day, unless it already has windows (picked
		// before, or restored) — re-picking a day keeps what the provider set.
		const seeded = added.filter(
			(day) => !windows[day.value]?.length && businessHours?.[day.value]?.length,
		);
		if (seeded.length > 0) {
			setWindows((current) => ({
				...current,
				...Object.fromEntries(
					seeded.map((day) => [day.value, (businessHours?.[day.value] ?? []).map((window) => ({ ...window }))]),
				),
			}));
		}
		// Several added at once (Select all): open the first in week order.
		if (added[0]) setOpenDay(added[0].value);
	};

	// Only the selected days get a time-window row (in week order).
	const selectedDays = week.filter((day) => days.includes(day.value));
	const allSelected = days.length === week.length;
	// Selected days with no complete (start + end) window get the alert dot — the same rule that
	// marks their time-window row Required (Figma: Thu).
	const alertDays = days.filter(
		(day) => !(windows[day] ?? []).some((window) => window.start && window.end),
	);
	// Continue needs at least one day, and every selected day with its hours (no Required row left).
	const canContinue = days.length > 0 && alertDays.length === 0;

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
					if (canContinue) onContinue?.();
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
						alertDays={alertDays}
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
									openDay={openDay}
									onOpenDayChange={setOpenDay}
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
					<StepActions onSaveDraft={onSaveDraft} continueDisabled={!canContinue} />
				</motion.div>
			</motion.form>
		</NewListingLayout>
	);
}

export { AvailabilityStep, sampleBusinessHours, sampleWindows };
