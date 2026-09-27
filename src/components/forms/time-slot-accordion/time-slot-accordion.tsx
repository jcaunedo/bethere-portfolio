import * as React from "react";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon, CircleAlertIcon, Clock4Icon, PlusIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { fadeVariants, layoutSpring, revealVariants, useMotionPreference } from "@/lib/motion";
import { Button } from "@/components/buttons/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/forms/select";

/** One opening window for a day; `null` until picked. Times are 24h "HH:MM". */
type TimeWindow = { start: string | null; end: string | null };

/** Windows per day, keyed by `TimeSlotDay.value`. */
type TimeSlotAccordionValue = Record<string, TimeWindow[]>;

type TimeSlotDay = { value: string; label: string };

const weekDays: TimeSlotDay[] = [
	{ value: "mon", label: "Monday" },
	{ value: "tue", label: "Tuesday" },
	{ value: "wed", label: "Wednesday" },
	{ value: "thu", label: "Thursday" },
	{ value: "fri", label: "Friday" },
	{ value: "sat", label: "Saturday" },
	{ value: "sun", label: "Sunday" },
];

/** "All day" = a single window over the whole day (the end list ends at 11:59 PM for this). */
const DAY_START = "00:00";
const DAY_END = "23:59";

/** 12:00 AM → 11:30 PM every 30 minutes. */
const halfHours = Array.from({ length: 48 }, (_, i) => {
	const h = String(Math.floor(i / 2)).padStart(2, "0");
	return `${h}:${i % 2 ? "30" : "00"}`;
});

function formatTime(time: string) {
	const [h, m] = time.split(":").map(Number);
	const suffix = h < 12 ? "AM" : "PM";
	return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const isComplete = (w: TimeWindow): w is { start: string; end: string } => Boolean(w.start && w.end);

const timeSlotItemVariants = cva(
	// Figma `Time Slot Accordion` — collapsed rows (HasValue / Showing 2 slots / Time Slot):
	// card fill, radius/input, 16px padding (24px right). Edit (open) → card shadow, 16px all round.
	"overflow-hidden rounded-input bg-card has-[[data-slot=time-slot-accordion-trigger]:focus-visible]:ring-[3px] has-[[data-slot=time-slot-accordion-trigger]:focus-visible]:ring-input-ring-outside data-[state=open]:shadow-card",
	{
		variants: {
			// Figma Property 1=Required — no complete window yet: danger tint (collapsed only).
			required: {
				true: "data-[state=closed]:bg-danger-05",
				false: "",
			},
		},
		defaultVariants: {
			required: false,
		},
	},
);

type TimeSlotAccordionProps = Omit<
	React.ComponentProps<"div">,
	"defaultValue" | "onChange" | "dir"
> & {
	/** Days to configure, in display order (defaults to Monday–Sunday). */
	days?: TimeSlotDay[];
	/** Controlled windows per day. Omit to let the accordion own them (seeded by `defaultValue`). */
	value?: TimeSlotAccordionValue;
	defaultValue?: TimeSlotAccordionValue;
	/** Fires with the full value on every window change. */
	onValueChange?: (value: TimeSlotAccordionValue) => void;
	/** Day open initially (one open at a time). */
	defaultOpenDay?: string;
};

/**
 * Per-day opening hours: each day collapses to a summary (its windows, "All day", or
 * "Required" when it has none) and expands to edit its time windows.
 * Translated from bethere.ds `Time Slot Accordion` (Property 1=HasValue/Required/Showing 2
 * slots/Time Slot/Edit), built on the shadcn/Radix Accordion.
 */
function TimeSlotAccordion({
	className,
	days = weekDays,
	value,
	defaultValue = {},
	onValueChange,
	defaultOpenDay,
	...props
}: TimeSlotAccordionProps) {
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
	const windowsByDay = value ?? uncontrolled;
	const { prefersReducedMotion, resolve } = useMotionPreference();

	const setDay = (day: string, windows: TimeWindow[]) => {
		const next = { ...windowsByDay, [day]: windows };
		setUncontrolled(next);
		onValueChange?.(next);
	};

	return (
		<AccordionPrimitive.Root
			type="single"
			collapsible
			defaultValue={defaultOpenDay}
			data-slot="time-slot-accordion"
			// `relative` anchors a leaving row popped out of flow by AnimatePresence.
			className={cn("relative flex w-full flex-col gap-2", className)}
			{...props}
		>
			{/* Days added/removed (e.g. from a day picker): the new row Reveals in, a removed row
			    fades out while leaving the flow at once (popLayout), and the rows below glide to
			    their new place. Reduced motion: opacity only, no movement. */}
			<AnimatePresence initial={false} mode="popLayout">
				{days.map((day) => (
					<motion.div
						key={day.value}
						layout={prefersReducedMotion ? false : "position"}
						variants={prefersReducedMotion ? fadeVariants : revealVariants}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{ layout: resolve(layoutSpring) }}
					>
						<TimeSlotAccordionItem
							day={day}
							windows={windowsByDay[day.value] ?? []}
							onWindowsChange={(windows) => setDay(day.value, windows)}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</AccordionPrimitive.Root>
	);
}

function TimeSlotAccordionItem({
	day,
	windows,
	onWindowsChange,
}: {
	day: TimeSlotDay;
	windows: TimeWindow[];
	onWindowsChange: (windows: TimeWindow[]) => void;
}) {
	const complete = windows.filter(isComplete);
	const required = complete.length === 0;
	const allDay = complete.length === 1 && complete[0].start === DAY_START && complete[0].end === DAY_END;
	const summary = required
		? "--"
		: allDay
			? "All day"
			: complete.map((w) => `${formatTime(w.start)} - ${formatTime(w.end)}`).join(" · ");

	// A day with no windows opens with one empty row to fill in.
	const rows = windows.length > 0 ? windows : [{ start: null, end: null }];
	const updateRow = (index: number, patch: Partial<TimeWindow>) =>
		onWindowsChange(rows.map((w, i) => (i === index ? { ...w, ...patch } : w)));

	return (
		<AccordionPrimitive.Item
			value={day.value}
			data-slot="time-slot-accordion-item"
			data-required={required || undefined}
			className={cn("group/time-slot", timeSlotItemVariants({ required }))}
		>
			<AccordionPrimitive.Header className="flex">
				<AccordionPrimitive.Trigger
					data-slot="time-slot-accordion-trigger"
					// 24px right padding keeps the chevron in the same spot open (Figma Edit uses 16px
					// padding on the card) and closed.
					className="flex flex-1 items-center gap-3 py-4 pr-6 pl-4 text-left outline-none disabled:pointer-events-none disabled:opacity-50"
				>
					{/* Figma: clock-4 in color/tone/brand/brand; circle-alert in color/tone/danger/danger when Required. */}
					{required ? (
						<CircleAlertIcon
							aria-hidden="true"
							className="size-6 shrink-0 text-danger group-data-[state=open]/time-slot:hidden"
						/>
					) : null}
					<Clock4Icon
						aria-hidden="true"
						className={cn(
							"size-6 shrink-0 text-primary",
							required && "hidden group-data-[state=open]/time-slot:block",
						)}
					/>
					<span className="flex min-w-0 flex-1 flex-col">
						<span className="text-sm leading-[22px] font-medium text-foreground">{day.label}</span>
						<span className="text-xs leading-[18px] text-muted-foreground">
							<span className="group-data-[state=open]/time-slot:hidden">{summary}</span>
							<span className="hidden group-data-[state=open]/time-slot:inline">
								Set time windows for this day
							</span>
						</span>
					</span>
					{/* Figma pills: Required (danger) / "N time slots" (info), collapsed only. */}
					{required ? (
						<StatusPill tone="danger">Required</StatusPill>
					) : complete.length > 1 ? (
						<StatusPill tone="info">{complete.length} time slots</StatusPill>
					) : null}
					{/* Figma chevron-down (closed) / chevron-up (Edit), color/icon/subtle — rotated, not swapped. */}
					<ChevronDownIcon
						aria-hidden="true"
						className="size-5 shrink-0 text-icon-subtle transition-transform duration-300 group-data-[state=open]/time-slot:rotate-180 motion-reduce:transition-none"
					/>
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>

			<AccordionPrimitive.Content
				data-slot="time-slot-accordion-content"
				className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none"
			>
				{/* Figma Edit: windows 16px under the header, 12px between rows and before "Add time window". */}
				<div className="flex flex-col gap-3 px-4 pb-4">
					<ol className="flex flex-col gap-3">
						{rows.map((row, index) => (
							<li key={index} className="flex items-center gap-3">
								{/* Figma: sm/regular in color/tone/brand/brand, 24px column. */}
								<span className="w-6 shrink-0 text-center text-sm leading-[22px] text-primary">{index + 1}</span>
								<TimeSelect
									aria-label={`${day.label} window ${index + 1} start`}
									placeholder="Start time"
									value={row.start}
									options={halfHours}
									onValueChange={(start) =>
										updateRow(index, { start, end: row.end && row.end <= start ? null : row.end })
									}
								/>
								<span aria-hidden="true" className="shrink-0 text-xs leading-[18px] text-foreground">
									—
								</span>
								<TimeSelect
									aria-label={`${day.label} window ${index + 1} end`}
									placeholder="End time"
									value={row.end}
									// End list: after the start, up to 11:59 PM (= "All day" when starting at 12:00 AM).
									options={[...halfHours, DAY_END].filter((t) => !row.start || t > row.start)}
									onValueChange={(end) => updateRow(index, { end })}
								/>
								{/* Figma: 36px ghost icon button, 16px ×. */}
								<Button
									type="button"
									variant="ghost"
									size="icon-lg"
									aria-label={`Remove ${day.label} window ${index + 1}`}
									className="text-icon-foreground"
									onClick={() => onWindowsChange(rows.filter((_, i) => i !== index))}
								>
									<XIcon />
								</Button>
							</li>
						))}
					</ol>
					{/* Figma `button` (link, 32px, no side padding): 16px plus in a 4px slot, 4px gap. */}
					<Button
						type="button"
						variant="link"
						size="md"
						className="group/add gap-1 self-start px-0 hover:no-underline"
						onClick={() => onWindowsChange([...rows, { start: null, end: null }])}
					>
						<PlusIcon
							aria-hidden="true"
							className="mx-1 text-primary transition-colors group-hover/add:text-foreground group-focus-visible/add:text-foreground"
						/>
						<span className="text-primary transition-colors group-hover/add:text-foreground group-focus-visible/add:text-foreground">
							Add time window
						</span>
					</Button>
				</div>
			</AccordionPrimitive.Content>
		</AccordionPrimitive.Item>
	);
}

/** Figma status pill: 24px-radius, 8px/2px padding, xs label. */
function StatusPill({ tone, children }: { tone: "danger" | "info"; children: React.ReactNode }) {
	return (
		<span
			className={cn(
				// Collapsed rows only — Figma's Edit state has no pill.
				"shrink-0 rounded-full px-2 py-0.5 text-xs leading-[18px] whitespace-nowrap group-data-[state=open]/time-slot:hidden",
				tone === "danger" ? "bg-danger-05 text-danger" : "bg-info-05 text-info",
			)}
		>
			{children}
		</span>
	);
}

/** 36px time dropdown (Figma `Input` with chevron) over the given "HH:MM" options. */
function TimeSelect({
	value,
	options,
	placeholder,
	onValueChange,
	"aria-label": ariaLabel,
}: {
	value: string | null;
	options: string[];
	placeholder: string;
	onValueChange: (value: string) => void;
	"aria-label": string;
}) {
	return (
		<Select value={value ?? ""} onValueChange={onValueChange}>
			<SelectTrigger size="lg" aria-label={ariaLabel} className="min-w-0 flex-1">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent className="max-h-64">
				{options.map((time) => (
					<SelectItem key={time} value={time}>
						{formatTime(time)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export { TimeSlotAccordion, timeSlotItemVariants };
export type { TimeSlotAccordionProps, TimeSlotAccordionValue, TimeSlotDay, TimeWindow };
