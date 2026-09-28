import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/buttons/button";
import { Checkbox } from "@/components/forms/checkbox";
import { ChoiceChip } from "@/components/forms/choice-chip";
import { ChoiceInput } from "@/components/forms/choice-input";
import { DaySelectorGroup } from "@/components/forms/day-selector";
import { NumericInput } from "@/components/forms/numeric-input";
import { Slider } from "@/components/forms/slider";
import { Switch } from "@/components/forms/switch";
import { Typography } from "@/components/typography";
import {
	exitTransition,
	expandVariants,
	fadeVariants,
	standardTransition,
	useMotionPreference,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { AddLink } from "../../shared/add-link";
import { dayTileOptions, sampleListingDays } from "../../shared/week";

/** One priced row (a charter duration or an add-on service). Money in whole dollars. */
type RateRow = {
	id: string;
	label: string;
	/** Included in the listing (chip selected). Excluded rows keep their values but read muted. */
	included: boolean;
	base: number | null;
	/** Provider-typed adjusted rate; `undefined` = use base × (1 + %). */
	adjustedOverride?: number;
	/** Name typed in place (added via "Add service"). */
	custom?: boolean;
};

/** Figma sample data. */
const sampleDurations: RateRow[] = [
	{ id: "2h", label: "2 hr", included: true, base: 200 },
	{ id: "4h", label: "4 hr", included: true, base: 475 },
	{ id: "6h", label: "6 hr", included: true, base: 680 },
	{ id: "10h", label: "10 hr", included: true, base: 1100 },
];

const sampleServices: RateRow[] = [
	{ id: "bartender", label: "Bartender", included: true, base: 45 },
	{ id: "catering", label: "Catering", included: true, base: 120 },
	{ id: "chef", label: "Private Chef", included: true, base: 165 },
	{ id: "photographer", label: "Photographer", included: true, base: 35 },
	{ id: "decorations", label: "Decorations", included: false, base: 100 },
	{ id: "transportation", label: "Transportation", included: false, base: 100 },
	{ id: "dj", label: "DJ", included: false, base: 250 },
];

const adjusted = (base: number | null, percent: number) =>
	base == null ? null : Math.round(base * (1 + percent / 100));

const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value}%`;

type PricingStepProps = NewListingStepProps & {
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
	/** Called by "Change days" — e.g. back to the Availability step. */
	onChangeDays?: () => void;
	/**
	 * Days the listing runs, as selected on the Availability step (values like "tue", any order).
	 * They're the day tiles under "Set different rates by day", in week order. Defaults to the
	 * Figma sample (Tue, Thu, Sat, Sun).
	 */
	days?: string[];
};

/**
 * New Listing — pricing ("Set your charter pricing"): base rates per duration, optional
 * different rates for selected days (a % adjustment with per-row overrides), holiday pricing,
 * seasonal pricing, and hourly add-on services.
 * Figma origin: Provider Portal, "9. Pricing" frame (node 100:3695).
 */
function PricingStep({
	steps = 14,
	currentStep = 9,
	stepLabel = "Little Atocha · Step 9 of 14",
	onContinue,
	onChangeDays,
	days = sampleListingDays,
	...frame
}: PricingStepProps) {
	const id = React.useId();
	const listingDays = dayTileOptions(days);

	// Charter rates.
	const [byDay, setByDay] = React.useState(false);
	// Days picked for a different rate. None until the provider picks some.
	const [adjustedDays, setAdjustedDays] = React.useState<string[]>([]);
	// Only days the listing still runs count (Availability may have changed since they were picked).
	const pickedDays = adjustedDays.filter((day) => days.includes(day));
	const [dayPercent, setDayPercent] = React.useState(0);
	const [durations, setDurations] = React.useState(sampleDurations);

	// Holiday pricing: same durations, their own % and overrides.
	const [holidayOn, setHolidayOn] = React.useState(false);
	const [holidayPercent, setHolidayPercent] = React.useState(0);
	const [holidayOverrides, setHolidayOverrides] = React.useState<Record<string, number | undefined>>({});

	// Seasonal pricing: same content as holiday, with its own % and overrides.
	const [seasonalOn, setSeasonalOn] = React.useState(false);
	const [seasonalPercent, setSeasonalPercent] = React.useState(0);
	const [seasonalOverrides, setSeasonalOverrides] = React.useState<Record<string, number | undefined>>({});

	// Add-on services.
	const [addOnsOn, setAddOnsOn] = React.useState(false);
	const [addOnPercent, setAddOnPercent] = React.useState(0);
	const [services, setServices] = React.useState(sampleServices);
	const nextService = React.useRef(0);
	const servicesRef = React.useRef<HTMLDivElement>(null);

	// The adjusted-days column shows only when rates differ by day and some days are picked.
	const dayColumn =
		byDay && pickedDays.length > 0
			? listingDays
					.filter((day) => pickedDays.includes(day.value))
					.map((day) => day.label)
					.join(", ")
			: null;

	const addService = () => {
		setServices((current) => [
			...current,
			{ id: `service-${nextService.current++}`, label: "", included: true, base: null, custom: true },
		]);
		// Open the new row's name field for typing.
		requestAnimationFrame(() => {
			const triggers = servicesRef.current?.querySelectorAll<HTMLButtonElement>(
				'[data-slot="choice-input"][data-state="default"] button',
			);
			triggers?.[triggers.length - 1]?.click();
		});
	};

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			align="top"
			title="Set your charter pricing"
			description="Choose the charter durations you offer and set your rates."
		>
			{/* Standard 48px (spacing/12) gap between form sections. */}
			<form
				className="flex w-full flex-col gap-12"
				onSubmit={(event) => {
					event.preventDefault();
					onContinue?.();
				}}
			>
				<section aria-labelledby={`${id}-charter`} className="flex flex-col gap-4">
					<SectionHeader id={`${id}-charter`} description="Set your base price for each duration.">
						Charter rates
					</SectionHeader>
					{/* By-day rates need days to pick from: hidden if the listing has none selected yet. */}
					{listingDays.length > 0 ? (
						<div className="flex items-center justify-between">
							<Checkbox
								label="Set different rates by day"
								checked={byDay}
								onCheckedChange={(checked) => {
									setByDay(checked === true);
									// Each time rates start varying by day, no day is picked yet.
									if (checked === true) setAdjustedDays([]);
								}}
							/>
							{/* Only while rates vary by day — it edits the days shown in the tiles. Fades in/out.
							    Figma: sm/regular in color/states/link. */}
							<AnimatePresence initial={false}>
								{byDay ? (
									<motion.button
										type="button"
										onClick={onChangeDays}
										variants={fadeVariants}
										initial="initial"
										animate="animate"
										exit="exit"
										className="rounded-sm text-sm text-link outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
									>
										Change days
									</motion.button>
								) : null}
							</AnimatePresence>
						</div>
					) : null}
					<Reveal show={byDay && listingDays.length > 0}>
						<div className="flex flex-col gap-4">
							{/* The listing's days (Availability step) as Available tiles; pick the ones to adjust.
							    7 columns so tiles keep the week-row width. */}
							<DaySelectorGroup
								aria-label="Days with a different rate"
								options={listingDays}
								availableDays={listingDays.map((day) => day.value)}
								value={pickedDays}
								onValueChange={(next) => {
									// Picking the first day brings in the day sliders: they start at 0 (no adjustment).
									if (pickedDays.length === 0 && next.length > 0) {
										setDayPercent(0);
										setAddOnPercent(0);
									}
									setAdjustedDays(next);
								}}
								style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
							/>
							{/* The slider (like the table's day column) only once a day is picked. */}
							<Reveal show={pickedDays.length > 0}>
								<PercentSlider
									label="Adjust selected days by percentage"
									value={dayPercent}
									onValueChange={setDayPercent}
								/>
							</Reveal>
						</div>
					</Reveal>
					<RateTable
						firstColumn="Duration"
						rows={durations}
						onRowsChange={setDurations}
						showBase
						adjust={dayColumn ? { label: dayColumn, percent: dayPercent } : undefined}
					/>
				</section>

				<section aria-labelledby={`${id}-holiday`} className="flex flex-col gap-4">
					<SectionHeader
						id={`${id}-holiday`}
						description="Apply special rates during holidays and major events."
						checked={holidayOn}
						onCheckedChange={setHolidayOn}
					>
						Holiday pricing
					</SectionHeader>
					<Reveal show={holidayOn} scrollIntoView>
						<DurationAdjustment
							durations={durations}
							onDurationsChange={setDurations}
							percent={holidayPercent}
							onPercentChange={setHolidayPercent}
							overrides={holidayOverrides}
							onOverridesChange={setHolidayOverrides}
						/>
					</Reveal>
				</section>

				<section aria-labelledby={`${id}-seasonal`} className="flex flex-col gap-4">
					<SectionHeader
						id={`${id}-seasonal`}
						description="Create different pricing for peak and off-peak seasons."
						checked={seasonalOn}
						onCheckedChange={setSeasonalOn}
					>
						Seasonal pricing
					</SectionHeader>
					<Reveal show={seasonalOn} scrollIntoView>
						<DurationAdjustment
							durations={durations}
							onDurationsChange={setDurations}
							percent={seasonalPercent}
							onPercentChange={setSeasonalPercent}
							overrides={seasonalOverrides}
							onOverridesChange={setSeasonalOverrides}
						/>
					</Reveal>
				</section>

				<section aria-labelledby={`${id}-addons`} className="flex flex-col gap-4">
					<SectionHeader
						id={`${id}-addons`}
						description="Guests can optionally purchase"
						checked={addOnsOn}
						onCheckedChange={setAddOnsOn}
					>
						Add-on services (hourly rate)
					</SectionHeader>
					<Reveal show={addOnsOn} scrollIntoView>
						<div ref={servicesRef} className="flex flex-col gap-4">
							<Reveal show={dayColumn != null}>
								<PercentSlider
									label="Adjust selected days by percentage"
									value={addOnPercent}
									onValueChange={setAddOnPercent}
								/>
							</Reveal>
							<RateTable
								firstColumn="Service"
								rows={services}
								onRowsChange={setServices}
								showBase
								adjust={dayColumn ? { label: dayColumn, percent: addOnPercent } : undefined}
							/>
							<AddLink onClick={addService}>Add service</AddLink>
						</div>
					</Reveal>
				</section>

				<Button type="submit" size="xl" className="w-full">
					Continue
				</Button>
			</form>
		</NewListingLayout>
	);
}

/** Section title + supporting line, with an optional on/off switch on the right (Figma: 16px apart). */
function SectionHeader({
	id,
	description,
	checked,
	onCheckedChange,
	children,
}: {
	id: string;
	description: string;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	children: React.ReactNode;
}) {
	return (
		// With a switch, the whole header toggles it on click (not just the switch). The Switch stays
		// the accessible, focusable control. Clicks from the switch's own button, or the hidden input
		// Radix renders inside a form (it fires a synthetic click on every change), are left to it —
		// handling them here would toggle twice, or loop.
		<div
			className={cn("flex items-center gap-4", onCheckedChange && "cursor-pointer select-none")}
			onClick={
				onCheckedChange
					? (event) => {
							if ((event.target as Element).closest("button, input")) return;
							onCheckedChange(!checked);
						}
					: undefined
			}
		>
			<div className="flex min-w-0 flex-1 flex-col">
				<Typography as="h2" id={id} size="lg" weight="semibold">
					{children}
				</Typography>
				<Typography size="sm" className="text-muted-foreground">
					{description}
				</Typography>
			</div>
			{onCheckedChange ? (
				<Switch aria-labelledby={id} checked={checked} onCheckedChange={onCheckedChange} />
			) : null}
		</div>
	);
}

/**
 * Body of a special-rates section (Holiday, Seasonal): a percentage slider and the durations in
 * two equal columns (Figma), the rate column being the adjusted rate (base × %), overridable per
 * row with "Reset". Each section keeps its own % and overrides; including/excluding a duration
 * is shared with the charter rates (it's the same duration).
 */
function DurationAdjustment({
	durations,
	onDurationsChange,
	percent,
	onPercentChange,
	overrides,
	onOverridesChange,
}: {
	durations: RateRow[];
	onDurationsChange: React.Dispatch<React.SetStateAction<RateRow[]>>;
	percent: number;
	onPercentChange: (percent: number) => void;
	overrides: Record<string, number | undefined>;
	onOverridesChange: (overrides: Record<string, number | undefined>) => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<PercentSlider label="Adjust rate by percentage" value={percent} onValueChange={onPercentChange} />
			<RateTable
				firstColumn="Duration"
				rows={durations.map((row) => ({ ...row, adjustedOverride: overrides[row.id] }))}
				onRowsChange={(rows) => {
					onDurationsChange((current) =>
						current.map((row) => ({
							...row,
							included: rows.find((r) => r.id === row.id)?.included ?? row.included,
						})),
					);
					onOverridesChange(Object.fromEntries(rows.map((row) => [row.id, row.adjustedOverride])));
				}}
				adjust={{ label: "Base rate", percent }}
			/>
		</div>
	);
}

/** Label + percentage Slider in 5% steps, 8px apart (Figma: sm/regular label). */
function PercentSlider({
	label,
	value,
	onValueChange,
}: {
	label: string;
	value: number;
	onValueChange: (value: number) => void;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Typography size="sm">{label}</Typography>
			<Slider aria-label={label} step={5} value={value} onValueChange={onValueChange} />
		</div>
	);
}

/**
 * Section body that Expands open from its top edge when its switch/checkbox turns on, and
 * collapses back when off (same motion as the Availability time windows). It sits in the
 * sections' 16px-gap column: `-mt-4` cancels the gap above it and `pt-4` restores it inside the
 * animated box, so closed it adds nothing and content below follows the height smoothly.
 */
function Reveal({
	show,
	scrollIntoView = false,
	children,
}: {
	show: boolean;
	/** On opening, scroll the page (smoothly) so the section's content comes into view. */
	scrollIntoView?: boolean;
	children: React.ReactNode;
}) {
	const { prefersReducedMotion } = useMotionPreference();
	// Clipped only while the height animates, so rings/shadows inside aren't cut once open. Set on
	// the element directly: a leaving (exit) element no longer re-renders, so state can't clip it.
	const clip = (el: EventTarget | null, on: boolean) => {
		if (el instanceof HTMLElement) el.style.overflow = on ? "hidden" : "";
	};
	const ref = React.useRef<HTMLDivElement>(null);

	// Scroll once the content has opened: until then the page may not be tall enough to scroll
	// that far (the browser would cap it). Only on opening after mount, never on first render.
	const mounted = React.useRef(false);
	const scrollPending = React.useRef(false);
	React.useEffect(() => {
		if (mounted.current) scrollPending.current = show && scrollIntoView;
		mounted.current = true;
	}, [show, scrollIntoView]);

	return (
		<AnimatePresence initial={false}>
			{show ? (
				<motion.div
					variants={prefersReducedMotion ? fadeVariants : expandVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					ref={ref}
					onAnimationStart={() => clip(ref.current, true)}
					onAnimationComplete={(definition) => {
						clip(ref.current, false);
						if (definition === "animate" && scrollPending.current && ref.current) {
							scrollPending.current = false;
							revealInViewport(ref.current, prefersReducedMotion ? "auto" : "smooth");
						}
					}}
					className="-mt-4"
				>
					<div className="pt-4">{children}</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}

/** Breathing room kept between revealed content and the viewport edge / sticky header. */
const REVEAL_SCROLL_MARGIN = 24;

/**
 * Scrolls the page just enough to show a section that just opened (`el` is its revealed content)
 * in full. Never pushes the section's heading under the sticky stepper header: a section taller
 * than the viewport stops with its heading just below the header. No scroll if it already fits.
 */
function revealInViewport(el: HTMLElement, behavior: ScrollBehavior) {
	const section = el.closest("section") ?? el;
	const header = document.querySelector('[data-slot="new-listing-header"]');
	const top = (header?.getBoundingClientRect().bottom ?? 0) + REVEAL_SCROLL_MARGIN;
	const sectionRect = section.getBoundingClientRect();
	const needed = sectionRect.bottom - (window.innerHeight - REVEAL_SCROLL_MARGIN);
	const delta = Math.min(needed, sectionRect.top - top);
	if (delta > 0) window.scrollBy({ top: delta, behavior });
}

/**
 * Rate grid (Figma: 8px gaps, header row sized to its text, 40px rows, sm muted headers). Columns: the row name (ChoiceChip —
 * toggles inclusion), an optional base rate, and an optional adjusted rate computed from the base ×
 * `adjust.percent` ("+15%" hint) that the provider can overwrite ("Reset" restores it).
 */
function RateTable({
	firstColumn,
	rows,
	onRowsChange,
	showBase = false,
	adjust,
}: {
	firstColumn: string;
	rows: RateRow[];
	onRowsChange: (rows: RateRow[]) => void;
	showBase?: boolean;
	adjust?: { label: string; percent: number };
}) {
	const update = (id: string, patch: Partial<RateRow>) =>
		onRowsChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
	const { resolve } = useMotionPreference();

	// With a base column, the adjusted column comes and goes (days picked or not). It slides in
	// rather than popping: the grid eases between name + base split evenly (Figma, one rate column)
	// and name 2fr + base 1fr + adjusted 1fr, while the column's cells fade. Closed, its track is
	// 0 wide and the grid reaches 8px (one column gap) right, so the base column still ends flush.
	// Its cells are always rendered (every row fills all three tracks — no misplaced cells), showing
	// the last label/values while collapsing, and are clipped, faded and inert while closed.
	const collapsible = showBase;
	const lastAdjust = React.useRef(adjust);
	if (adjust) lastAdjust.current = adjust;
	const column = adjust ?? (collapsible ? lastAdjust.current : undefined);
	const hasColumn = Boolean(adjust) || collapsible;
	const tableRef = React.useRef<HTMLDivElement>(null);
	// Open cells clip their content only while tracks resize (set on the element: see `Reveal`),
	// so input focus rings aren't cut once settled.
	const setResizing = (on: boolean) => {
		if (on) tableRef.current?.setAttribute("data-resizing", "");
		else tableRef.current?.removeAttribute("data-resizing");
	};
	const columnCell = cn(
		"min-w-0 group-data-[resizing]/rate-table:overflow-hidden",
		!adjust && "pointer-events-none overflow-hidden",
	);
	const columnFade = {
		initial: false as const,
		animate: { opacity: adjust ? 1 : 0 },
		transition: resolve(adjust ? standardTransition : exitTransition),
		// Closed or collapsing: out of the tab order and the a11y tree.
		inert: !adjust,
	};

	return (
		<motion.div
			ref={tableRef}
			role="table"
			className={cn(
				"group/rate-table grid grid-rows-[auto] auto-rows-[40px] gap-2",
				!collapsible && (adjust ? "grid-cols-2" : "grid-cols-1"),
			)}
			initial={false}
			animate={
				collapsible
					? adjust
						? { gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)", marginRight: 0 }
						: { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0fr)", marginRight: -8 }
					: undefined
			}
			transition={resolve(standardTransition)}
			onAnimationStart={() => setResizing(true)}
			onAnimationComplete={() => setResizing(false)}
		>
			<div role="row" className="contents">
				<HeaderCell>{firstColumn}</HeaderCell>
				{showBase ? <HeaderCell>Base rate</HeaderCell> : null}
				{hasColumn ? (
					<motion.div className={columnCell} {...columnFade}>
						{column ? <HeaderCell className="truncate">{column.label}</HeaderCell> : null}
					</motion.div>
				) : null}
			</div>
			{rows.map((row) => {
				const name = row.label || "New service";
				const adjust = column;
				const computed = adjust ? adjusted(row.base, adjust.percent) : null;
				const overridden = row.adjustedOverride !== undefined;
				return (
					<div role="row" key={row.id} className="contents">
						<div role="cell">
							{row.custom ? (
								<ChoiceInput
									placeholder="Service name"
									value={row.label}
									onValueChange={(label) =>
										label === ""
											? onRowsChange(rows.filter((r) => r.id !== row.id))
											: update(row.id, { label })
									}
									className="h-full"
								/>
							) : (
								<ChoiceChip
									role="checkbox"
									label={row.label}
									isSelected={row.included}
									onClick={() => update(row.id, { included: !row.included })}
									className="h-full w-full"
								/>
							)}
						</div>
						{showBase ? (
							<div role="cell">
								<RateInput
									aria-label={`${name} base rate`}
									value={row.base}
									muted={!row.included}
									onValueChange={(base) => update(row.id, { base })}
								/>
							</div>
						) : null}
						{hasColumn ? (
							<motion.div role="cell" className={columnCell} {...columnFade}>
								{adjust ? (
									<RateInput
										aria-label={`${name} ${adjust.label} rate`}
										value={overridden ? (row.adjustedOverride ?? null) : computed}
										muted={!row.included}
										onValueChange={(value) => update(row.id, { adjustedOverride: value ?? undefined })}
										suffix={
											overridden && row.included ? (
												<button
													type="button"
													onClick={() => update(row.id, { adjustedOverride: undefined })}
													className="rounded-sm text-link outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
												>
													Reset
												</button>
											) : adjust.percent !== 0 ? (
												formatPercent(adjust.percent)
											) : null
										}
									/>
								) : null}
							</motion.div>
						) : null}
					</div>
				);
			})}
		</motion.div>
	);
}

function HeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<Typography role="columnheader" size="sm" className={cn("text-muted-foreground", className)}>
			{children}
		</Typography>
	);
}

/** "$" money field (Figma Input, 40px). Excluded rows read muted (color/foreground/subtle). */
function RateInput({
	value,
	onValueChange,
	muted,
	suffix,
	"aria-label": ariaLabel,
}: {
	value: number | null;
	onValueChange: (value: number | null) => void;
	muted: boolean;
	suffix?: React.ReactNode;
	"aria-label": string;
}) {
	return (
		<NumericInput
			aria-label={ariaLabel}
			size="xl"
			prefix="$"
			suffix={suffix}
			readOnly={muted}
			value={value ?? ""}
			onChange={(event) => onValueChange(event.target.value === "" ? null : Number(event.target.value))}
			className={cn("text-sm", muted && "read-only:text-foreground-subtle")}
		/>
	);
}

export { PricingStep };
