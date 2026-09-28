import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/** Thumb diameter (px). Radix keeps the thumb inside the track, offsetting its center by up to half this at the ends. */
const THUMB_SIZE = 16;

/** Track position (0–100%) of `value`. */
const percentOf = (value: number, min: number, max: number) =>
	max === min ? 0 : ((value - min) / (max - min)) * 100;

/**
 * CSS offset of a thumb center at `percent` along the track — the same in-bounds correction
 * Radix applies to the thumb, so the fill always ends exactly under the thumb.
 */
const thumbCenter = (percent: number) =>
	`calc(${percent}% + ${THUMB_SIZE / 2 - (percent * THUMB_SIZE) / 100}px)`;

/** Default label format: signed percentage ("+15%", "0%", "-100%"). */
const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value}%`;

type SliderProps = Omit<
	React.ComponentProps<typeof SliderPrimitive.Root>,
	"value" | "defaultValue" | "onValueChange" | "onValueCommit" | "min" | "max" | "step"
> & {
	/** Controlled value. Omit to let the slider own it (seeded by `defaultValue`). */
	value?: number;
	defaultValue?: number;
	/** Fires continuously while dragging / on each key step. */
	onValueChange?: (value: number) => void;
	/** Fires once the interaction ends (pointer up / key step). */
	onValueCommit?: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	/**
	 * Where the fill grows from — the fill spans from here to the thumb, so values below and
	 * above it read as a signed adjustment. Defaults to 0 (clamped into `min`–`max`).
	 */
	origin?: number;
	/** Formats the end labels (bounds and live value). Defaults to a signed percentage. */
	formatValue?: (value: number) => string;
	/**
	 * Show the end labels. At the origin both show their bound (`min` left, `max` right); once the
	 * value moves off the origin, the label on that side shows the live value instead.
	 */
	showLabels?: boolean;
	/** Accessible name for the thumb. */
	"aria-label"?: string;
};

/**
 * Single-thumb slider for a signed adjustment around a neutral point (e.g. −100% … +100%, default 0):
 * the fill grows from the origin toward the thumb. Both ends show their bound (subtle) until the
 * value moves toward one, which then shows the live value (emphasized).
 * shadcn/ui Slider (Radix) skinned to bethere.ds `Slider`.
 */
function Slider({
	className,
	value,
	defaultValue,
	onValueChange,
	onValueCommit,
	min = -100,
	max = 100,
	step = 1,
	origin = 0,
	formatValue = formatPercent,
	showLabels = true,
	disabled,
	"aria-label": ariaLabel,
	...props
}: SliderProps) {
	const clampedOrigin = Math.min(max, Math.max(min, origin));
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? clampedOrigin);
	const current = value ?? uncontrolled;

	const originPercent = percentOf(clampedOrigin, min, max);
	const valuePercent = percentOf(current, min, max);
	const from = Math.min(originPercent, valuePercent);
	const to = Math.max(originPercent, valuePercent);

	// Each end shows its bound until the value moves toward it, then the live value.
	const below = current < clampedOrigin;
	const above = current > clampedOrigin;

	return (
		// Figma: card fill, radius/input, 40px tall, 10px side padding, 8px between labels and track.
		<div
			data-slot="slider"
			data-disabled={disabled || undefined}
			className={cn(
				"flex h-10 w-full items-center gap-2 rounded-input bg-card px-2.5 data-[disabled]:opacity-50",
				className,
			)}
		>
			{showLabels ? (
				<EndLabel active={below}>{formatValue(below ? current : min)}</EndLabel>
			) : null}

			<SliderPrimitive.Root
				data-slot="slider-root"
				value={[current]}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				onValueChange={([next]) => {
					setUncontrolled(next);
					onValueChange?.(next);
				}}
				onValueCommit={([next]) => onValueCommit?.(next)}
				className="relative flex h-4 min-w-0 flex-1 touch-none items-center select-none"
				{...props}
			>
				{/* Figma: 4px track in color/foreground/soft. */}
				<SliderPrimitive.Track
					data-slot="slider-track"
					className="relative h-1 grow overflow-hidden rounded-full bg-foreground-soft"
				>
					{/* Fill from the origin to the thumb (Radix's Range always starts at `min`). Figma: color/foreground/foreground. */}
					<span
						data-slot="slider-range"
						className="absolute inset-y-0 rounded-full bg-foreground"
						style={{
							left: thumbCenter(from),
							width: `calc(${thumbCenter(to)} - ${thumbCenter(from)})`,
						}}
					/>
				</SliderPrimitive.Track>
				{/* Figma: 16px white thumb, 1px color/foreground/muted inside stroke, shadow-toast.
				    Hover/focus ring + disabled follow shadcn's Slider thumb (no Figma states). */}
				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					aria-label={ariaLabel}
					aria-valuetext={formatValue(current)}
					className="block size-4 shrink-0 rounded-full border border-muted-foreground bg-white shadow-toast ring-ring/50 transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none"
				/>
			</SliderPrimitive.Root>

			{showLabels ? (
				<EndLabel active={above}>{formatValue(above ? current : max)}</EndLabel>
			) : null}
		</div>
	);
}

/**
 * One end of the slider (48px). Bound: Figma xs in color/foreground/subtle. Live value: sm in
 * color/foreground/foreground. Visual only — the thumb's `aria-valuetext` carries the value.
 */
function EndLabel({ active, children }: { active: boolean; children: React.ReactNode }) {
	return (
		<span
			aria-hidden="true"
			data-active={active || undefined}
			className={cn(
				"w-12 shrink-0 text-center tabular-nums transition-colors",
				active
					? "text-sm leading-[22px] text-foreground"
					: "text-xs leading-[18px] text-foreground-subtle",
			)}
		>
			{children}
		</span>
	);
}

export { Slider };
export type { SliderProps };
