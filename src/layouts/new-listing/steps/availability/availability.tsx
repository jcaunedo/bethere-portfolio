import * as React from "react";

import { Button } from "@/components/buttons/button";
import { DaySelectorGroup } from "@/components/forms/day-selector";
import {
	TimeSlotAccordion,
	type TimeSlotAccordionValue,
} from "@/components/forms/time-slot-accordion";
import { Typography } from "@/components/typography";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";

/** Week in display order: short labels for the day tiles, full names for the time-window rows. */
const week = [
	{ value: "mon", short: "Mon", label: "Monday" },
	{ value: "tue", short: "Tue", label: "Tuesday" },
	{ value: "wed", short: "Wed", label: "Wednesday" },
	{ value: "thu", short: "Thu", label: "Thursday" },
	{ value: "fri", short: "Fri", label: "Friday" },
	{ value: "sat", short: "Sat", label: "Saturday" },
	{ value: "sun", short: "Sun", label: "Sunday" },
];

const dayOptions = week.map((day) => ({ value: day.value, label: day.short }));

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
	...frame
}: AvailabilityStepProps) {
	const id = React.useId();
	const [days, setDays] = React.useState(["tue", "thu", "sat", "sun"]);
	const [windows, setWindows] = React.useState(sampleWindows);

	// Only the selected days get a time-window row (in week order).
	const selectedDays = week.filter((day) => days.includes(day.value));
	const allSelected = days.length === week.length;

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			title="Availability"
			description="Set the days and times your experience is available for booking."
		>
			{/* Figma: sections split by border-soft dividers, 24px either side (= the 48px section standard). */}
			<form
				className="flex w-full flex-col gap-6"
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

				<hr className="border-border-soft" />

				<section aria-labelledby={`${id}-windows`} className="flex flex-col gap-4">
					<div className="flex flex-col">
						<Typography as="h2" id={`${id}-windows`} size="lg" weight="semibold">
							Time windows
						</Typography>
						<Typography size="sm" className="text-muted-foreground">
							Set the hours guests can reserve and begin this experience each day.
						</Typography>
					</div>
					{selectedDays.length > 0 ? (
						<TimeSlotAccordion
							days={selectedDays.map(({ value, label }) => ({ value, label }))}
							value={windows}
							onValueChange={setWindows}
						/>
					) : (
						<Typography size="sm" className="text-muted-foreground">
							Select at least one day above to set its hours.
						</Typography>
					)}
				</section>

				<hr className="border-border-soft" />

				<Button type="submit" size="xl" className="w-full">
					Continue
				</Button>
			</form>
		</NewListingLayout>
	);
}

export { AvailabilityStep };
