import * as React from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";
import { Calendar } from "@/components/forms/calendar";
import { Checkbox } from "@/components/forms/checkbox";
import { ChoiceChip } from "@/components/forms/choice-chip";
import { ChoiceInput } from "@/components/forms/choice-input";
import { DaySelectorGroup } from "@/components/forms/day-selector";
import { Input } from "@/components/forms/input";
import { NumericInput } from "@/components/forms/numeric-input";
import { Slider } from "@/components/forms/slider";
import { Switch } from "@/components/forms/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/overlays/popover";
import { Typography } from "@/components/typography";
import {
	exitTransition,
	expandVariants,
	fadeVariants,
	layoutSpring,
	revealVariants,
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

/** A day of the year with no year — seasons repeat annually. `month` is 0–11. */
type MonthDay = { month: number; day: number };

/** A seasonal rate: its own date range, % adjustment and per-duration overrides. */
type Season = {
	id: string;
	name: string;
	start: MonthDay | null;
	end: MonthDay | null;
	percent: number;
	overrides: Record<string, number | undefined>;
	/** Added by the provider ("Add season") — only these can be removed. */
	custom?: boolean;
};

/** Figma sample seasons (always offered). */
const sampleSeasons: Season[] = [
	{ id: "peak", name: "Peak Season", start: { month: 11, day: 15 }, end: { month: 3, day: 30 }, percent: 0, overrides: {} },
	{ id: "summer", name: "Summer", start: { month: 4, day: 1 }, end: { month: 7, day: 31 }, percent: 15, overrides: {} },
	{ id: "christmas", name: "Christmas & New Year", start: { month: 11, day: 24 }, end: { month: 0, day: 2 }, percent: 0, overrides: {} },
];

/** A leap year, so Feb 29 is pickable; only month + day are kept. */
const SEASON_YEAR = 2024;
const toDate = ({ month, day }: MonthDay) => new Date(SEASON_YEAR, month, day);
const formatMonthDay = (value: MonthDay) => format(toDate(value), "MMM d");

/** A season's price differs from the base rates (a % or any custom rate). */
const isSeasonModified = (season: Season) =>
	season.percent !== 0 || Object.values(season.overrides).some((value) => value !== undefined);

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

	// Seasonal pricing: a list of seasons, each with its own dates, % and overrides. One open at a time.
	const [seasonalOn, setSeasonalOn] = React.useState(false);
	const [seasons, setSeasons] = React.useState(sampleSeasons);
	const [openSeason, setOpenSeason] = React.useState(sampleSeasons[0].id);
	const nextSeason = React.useRef(0);

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
						{/* Figma: seasons 8px apart, "Add season" 16px below. */}
						<div className="flex flex-col gap-4">
							<SeasonList
								seasons={seasons}
								onSeasonsChange={setSeasons}
								open={openSeason}
								onOpenChange={setOpenSeason}
								durations={durations}
								onDurationsChange={setDurations}
							/>
							<AddLink
								onClick={() => {
									const id = `season-${nextSeason.current++}`;
									setSeasons((current) => [
										...current,
										{ id, name: "", start: null, end: null, percent: 0, overrides: {}, custom: true },
									]);
									setOpenSeason(id);
								}}
							>
								Add season
							</AddLink>
						</div>
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
	surface = "default",
}: {
	durations: RateRow[];
	onDurationsChange: React.Dispatch<React.SetStateAction<RateRow[]>>;
	percent: number;
	onPercentChange: (percent: number) => void;
	overrides: Record<string, number | undefined>;
	onOverridesChange: (overrides: Record<string, number | undefined>) => void;
	/**
	 * `neutral` on a white card (a season): the slider and unselected chips take
	 * color/background/accent/background so they don't vanish into the card (Figma choice-chip Default-alt).
	 */
	surface?: "default" | "neutral";
}) {
	return (
		<div className="flex flex-col gap-4">
			<PercentSlider
				label="Adjust rate by percentage"
				value={percent}
				onValueChange={onPercentChange}
				className={surface === "neutral" ? "bg-background" : undefined}
			/>
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
				surface={surface}
			/>
		</div>
	);
}

/** gradient-1 paint server for season icons (mirrors --gradient-1; CSS gradients can't paint an SVG stroke). */
const SEASON_GRADIENT_ID = "pricing-season-gradient-1";

/**
 * Seasons as an accordion (one open at a time), styled like the Availability time windows
 * (Figma `Time Slot Accordion` / `Time Slot`). Seasons added/removed Reveal in and fade out,
 * the rows below gliding to their new place.
 */
function SeasonList({
	seasons,
	onSeasonsChange,
	open,
	onOpenChange,
	durations,
	onDurationsChange,
}: {
	seasons: Season[];
	onSeasonsChange: React.Dispatch<React.SetStateAction<Season[]>>;
	open: string;
	onOpenChange: (id: string) => void;
	durations: RateRow[];
	onDurationsChange: React.Dispatch<React.SetStateAction<RateRow[]>>;
}) {
	const { prefersReducedMotion, resolve } = useMotionPreference();
	const update = (id: string, patch: Partial<Season>) =>
		onSeasonsChange((current) => current.map((season) => (season.id === id ? { ...season, ...patch } : season)));

	return (
		<AccordionPrimitive.Root
			type="single"
			collapsible
			value={open}
			onValueChange={onOpenChange}
			className="relative flex w-full flex-col gap-2"
		>
			<svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute size-0">
				<defs>
					{/* In the icon's 24px viewBox, not per shape: a straight line has a zero-size box,
					    so a bounding-box gradient would paint nothing on it. */}
					<linearGradient id={SEASON_GRADIENT_ID} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="24">
						<stop offset="0" stopColor="#f26740" />
						<stop offset="1" stopColor="#ffa47d" />
					</linearGradient>
				</defs>
			</svg>
			<AnimatePresence initial={false} mode="popLayout">
				{seasons.map((season) => (
					<motion.div
						key={season.id}
						layout={prefersReducedMotion ? false : "position"}
						variants={prefersReducedMotion ? fadeVariants : revealVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ layout: resolve(layoutSpring) }}
					>
						<SeasonItem
							season={season}
							onSeasonChange={(patch) => update(season.id, patch)}
							onRemove={() => onSeasonsChange((current) => current.filter((s) => s.id !== season.id))}
							durations={durations}
							onDurationsChange={onDurationsChange}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</AccordionPrimitive.Root>
	);
}

/**
 * One season. Collapsed: card with calendar icon, name, date range and — when its price is
 * modified (a % or a custom rate) — a brand badge and the gradient-1 icon; icon-subtle otherwise.
 * Open (card shadow): name + date range, then the % slider and duration rates.
 */
function SeasonItem({
	season,
	onSeasonChange,
	onRemove,
	durations,
	onDurationsChange,
}: {
	season: Season;
	onSeasonChange: (patch: Partial<Season>) => void;
	onRemove: () => void;
	durations: RateRow[];
	onDurationsChange: React.Dispatch<React.SetStateAction<RateRow[]>>;
}) {
	const modified = isSeasonModified(season);
	const name = season.name || "New season";
	const range =
		season.start && season.end
			? `${formatMonthDay(season.start)} – ${formatMonthDay(season.end)}`
			: "Set the season dates";

	return (
		<AccordionPrimitive.Item
			value={season.id}
			// Shadow fades with the expand/collapse (Tailwind's default ease = the standard curve).
			className="group/season overflow-hidden rounded-input bg-card transition-shadow duration-300 has-[[data-slot=season-trigger]:focus-visible]:ring-[3px] has-[[data-slot=season-trigger]:focus-visible]:ring-input-ring-outside data-[state=open]:shadow-card motion-reduce:transition-none"
		>
			<AccordionPrimitive.Header className="flex">
				{/* Figma `Time Slot`: 16px padding (24px right), 12px gaps. */}
				<AccordionPrimitive.Trigger
					data-slot="season-trigger"
					className="flex flex-1 items-center gap-3 py-4 pr-6 pl-4 text-left outline-none"
				>
					<CalendarIcon
						aria-hidden="true"
						className={cn(
							"size-6 shrink-0",
							modified ? "text-primary [stroke:url('#pricing-season-gradient-1')]" : "text-icon-subtle",
						)}
					/>
					<span className="flex min-w-0 flex-1 flex-col">
						<span className="truncate text-sm leading-[22px] font-medium text-foreground">{name}</span>
						<span className="text-xs leading-[18px] text-muted-foreground">{range}</span>
					</span>
					{/* Figma pill: color/tone/brand/subtle fill, brand xs label. */}
					{modified ? (
						<span className="shrink-0 rounded-full bg-primary-subtle px-2 py-0.5 text-xs leading-[18px] whitespace-nowrap text-primary">
							{season.percent !== 0 ? formatPercent(season.percent) : "Custom"}
						</span>
					) : null}
					<ChevronDownIcon
						aria-hidden="true"
						className="size-5 shrink-0 text-icon-subtle transition-transform duration-300 group-data-[state=open]/season:rotate-180 motion-reduce:transition-none"
					/>
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
			{/* Collapse mirrors the expand (standard: 300ms, cubic-bezier(0.4, 0, 0.2, 1) — same values as
			    --animate-accordion-down) instead of the 160ms exit, which reads abrupt on a panel this tall. */}
			<AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.3s_cubic-bezier(0.4,0,0.2,1)] data-[state=open]:animate-accordion-down motion-reduce:animate-none">
				{/* Figma: body inset 16px inside the 16px card padding, 32px bottom; 24px between groups. */}
				<div className="flex flex-col gap-6 px-8 pb-8">
					<div className="grid grid-cols-2 gap-4">
						<Input
							size="xl"
							aria-label="Season name"
							placeholder="Season name"
							value={season.name}
							onChange={(event) => onSeasonChange({ name: event.target.value })}
							className="text-sm"
						/>
						<div className="flex items-center gap-2">
							<MonthDayPicker
								aria-label={`${name} start date`}
								placeholder="Start"
								value={season.start}
								onValueChange={(start) => onSeasonChange({ start })}
							/>
							<span aria-hidden="true" className="shrink-0 text-sm text-foreground">
								–
							</span>
							<MonthDayPicker
								aria-label={`${name} end date`}
								placeholder="End"
								value={season.end}
								onValueChange={(end) => onSeasonChange({ end })}
							/>
						</div>
					</div>
					<DurationAdjustment
						surface="neutral"
						durations={durations}
						onDurationsChange={onDurationsChange}
						percent={season.percent}
						onPercentChange={(percent) => onSeasonChange({ percent })}
						overrides={season.overrides}
						onOverridesChange={(overrides) => onSeasonChange({ overrides })}
					/>
					{/* Only seasons the provider added can be removed; the three defaults always stay. */}
					{season.custom ? (
						<button
							type="button"
							onClick={onRemove}
							className="self-start rounded-sm text-sm text-link outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
						>
							Remove season
						</button>
					) : null}
				</div>
			</AccordionPrimitive.Content>
		</AccordionPrimitive.Item>
	);
}

/**
 * Month + day field (Figma `Input` Type=Dropdown, 40px, chevron): opens a calendar with no year,
 * since seasons repeat every year. Shows e.g. "Dec 15".
 */
function MonthDayPicker({
	value,
	onValueChange,
	placeholder,
	"aria-label": ariaLabel,
}: {
	value: MonthDay | null;
	onValueChange: (value: MonthDay) => void;
	placeholder: string;
	"aria-label": string;
}) {
	const [open, setOpen] = React.useState(false);
	const selected = value ? toDate(value) : undefined;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label={ariaLabel}
					className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-input bg-card px-3 text-left text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none hover:border-input-ring focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-input-ring-outside data-[state=open]:border-ring data-[state=open]:ring-[3px] data-[state=open]:ring-input-ring-outside"
				>
					<span className={cn("flex-1 truncate", !value && "text-muted-foreground")}>
						{value ? formatMonthDay(value) : placeholder}
					</span>
					<ChevronDownIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground opacity-50" />
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-0">
				<Calendar
					mode="single"
					selected={selected}
					defaultMonth={selected}
					// Month only in the caption — the year doesn't matter for a season.
					formatters={{ formatCaption: (date) => format(date, "MMMM") }}
					onSelect={(date) => {
						if (!date) return;
						onValueChange({ month: date.getMonth(), day: date.getDate() });
						setOpen(false);
					}}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

/** Label + percentage Slider in 5% steps, 8px apart (Figma: sm/regular label). */
function PercentSlider({
	label,
	value,
	onValueChange,
	className,
}: {
	label: string;
	value: number;
	onValueChange: (value: number) => void;
	/** Slider fill override (e.g. on a white card). */
	className?: string;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Typography size="sm">{label}</Typography>
			<Slider aria-label={label} step={5} value={value} onValueChange={onValueChange} className={className} />
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
	surface,
}: {
	firstColumn: string;
	rows: RateRow[];
	onRowsChange: (rows: RateRow[]) => void;
	showBase?: boolean;
	adjust?: { label: string; percent: number };
	/** Chip surface — `neutral` when the table sits on a white card. */
	surface?: "default" | "neutral";
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
									surface={surface}
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
										// Excluded rows show neither "Reset" nor the % hint.
										suffix={
											!row.included ? null : overridden ? (
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
