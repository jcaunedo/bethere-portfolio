import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { typographyVariants } from "@/components/typography";

const daySelectorVariants = cva(
	// Base tile. Figma: `Day Selector` Property 1=Default — card fill, radius/input, 80px tall,
	// fills its container's width, centered xl label in muted. Property 1=Hover → hover: card
	// shadow + foreground label.
	cn(
		"flex h-20 w-full min-w-0 items-center justify-center overflow-hidden rounded-input bg-card px-3 py-2 text-muted-foreground transition-[color,box-shadow] outline-none hover:text-foreground hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none disabled:opacity-50",
		typographyVariants({ size: "xl" }),
	),
	{
		variants: {
			// Figma Property 1=Selected. Inset ring = Figma inside stroke (no layout shift).
			selected: {
				true: "inset-ring inset-ring-primary text-foreground",
				false: "",
			},
		},
		defaultVariants: {
			selected: false,
		},
	},
);

type DaySelectorProps = Omit<React.ComponentProps<"button">, "children"> &
	Omit<VariantProps<typeof daySelectorVariants>, "selected"> & {
		/** Centered day label, e.g. "Mon" (Figma: `Day`). */
		label: React.ReactNode;
		/** Figma Property 1=Selected. Exposed as `aria-checked` under `role="checkbox"`/`"radio"`, `aria-pressed` otherwise. */
		isSelected?: boolean;
	};

/**
 * Selectable day tile — the building block of `DaySelectorGroup`.
 * Translated from bethere.ds `Day Selector` (Property 1=Default/Hover/Selected).
 */
function DaySelector({ className, label, isSelected = false, role, ...props }: DaySelectorProps) {
	const ariaState =
		role === "radio" || role === "checkbox"
			? { "aria-checked": isSelected }
			: { "aria-pressed": isSelected };

	return (
		<button
			type="button"
			role={role}
			data-slot="day-selector"
			data-state={isSelected ? "selected" : "default"}
			{...ariaState}
			className={cn(daySelectorVariants({ selected: isSelected, className }))}
			{...props}
		>
			<span className="min-w-0 flex-1 truncate text-center">{label}</span>
		</button>
	);
}

type DaySelectorOption = {
	value: string;
	label: React.ReactNode;
	disabled?: boolean;
};

const weekDays: DaySelectorOption[] = [
	{ value: "mon", label: "Mon" },
	{ value: "tue", label: "Tue" },
	{ value: "wed", label: "Wed" },
	{ value: "thu", label: "Thu" },
	{ value: "fri", label: "Fri" },
	{ value: "sat", label: "Sat" },
	{ value: "sun", label: "Sun" },
];

type DaySelectorGroupProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
	/** Days to render, one equal-width tile each (defaults to Mon–Sun). */
	options?: DaySelectorOption[];
	/** Selected day values. Omit to let the group own them (seeded by `defaultValue`). */
	value?: string[];
	defaultValue?: string[];
	/** Fires with the selected values, in `options` order, on every toggle. */
	onValueChange?: (value: string[]) => void;
	/** Submits each selected value through a hidden input. */
	name?: string;
	disabled?: boolean;
};

/**
 * Row of equal-width `DaySelector` tiles (8px gaps) — pick any combination of days.
 * Composes bethere.ds `Day Selector`; the Figma tile width (≈84.57px) is 7 tiles across 640px.
 */
function DaySelectorGroup({
	className,
	options = weekDays,
	value,
	defaultValue = [],
	onValueChange,
	name,
	disabled = false,
	...props
}: DaySelectorGroupProps) {
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
	const selected = value ?? uncontrolled;

	const toggle = (day: string) => {
		const next = options
			.map((option) => option.value)
			.filter((v) => (v === day ? !selected.includes(v) : selected.includes(v)));
		setUncontrolled(next);
		onValueChange?.(next);
	};

	return (
		<div
			data-slot="day-selector-group"
			role="group"
			className={cn("grid w-full gap-2", className)}
			style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
			{...props}
		>
			{options.map((option) => (
				<DaySelector
					key={option.value}
					role="checkbox"
					label={option.label}
					isSelected={selected.includes(option.value)}
					disabled={disabled || option.disabled}
					onClick={() => toggle(option.value)}
				/>
			))}
			{name != null
				? selected.map((day) => <input key={day} type="hidden" name={name} value={day} />)
				: null}
		</div>
	);
}

export { DaySelector, DaySelectorGroup, daySelectorVariants };
export type { DaySelectorProps, DaySelectorGroupProps, DaySelectorOption };
