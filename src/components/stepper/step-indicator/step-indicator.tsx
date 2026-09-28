import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";

import { standardTransition, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

// The segment is the unfilled track; its color for reached steps is a fill layer on top (below),
// so reaching or leaving a step can fill/empty it along the track instead of swapping color.
const stepIndicatorVariants = cva(
	"group/step relative h-1 min-w-px flex-1 shrink-0 overflow-hidden rounded-2xl bg-muted disabled:pointer-events-none",
	{
		variants: {
			state: {
				// Default (Figma `State=Default`) — upcoming step, not reached yet, not clickable
				default: "",
				// Active (Figma `State=Active`) — current step, not clickable
				active: "",
				// Done (Figma `State=Done`) — completed step; the only clickable/hoverable state
				done: "",
			},
		},
		defaultVariants: {
			state: "default",
		},
	},
);

/**
 * Single segment of a {@link Stepper}'s progress track. Figma: bethere.ds `Step`.
 * Renders as a `button`, disabled unless `state="done"` — only completed steps are clickable
 * (to jump back to them); the current and upcoming steps have no hover/click affordance.
 *
 * Motion: when a step is reached (advancing), its fill grows left → right across the segment,
 * pointing the way forward; when it's left (going back), the fill retracts right → left. Several
 * segments changing at once (a skipped step) play one after another via `fillDelay`. Only
 * on change — a stepper that mounts on a later step shows its reached steps already filled.
 * Reduced motion: the fill still changes, near-instantly.
 */
function StepIndicator({
	className,
	state = "default",
	fillDelay = 0,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof stepIndicatorVariants> & {
		/** Seconds to wait before filling/emptying — sequences segments when several change at once (see `useStepFillDelay`). */
		fillDelay?: number;
	}) {
	const { resolve } = useMotionPreference();
	const reached = state === "active" || state === "done";

	return (
		<button
			data-slot='step-indicator'
			data-state={state}
			type='button'
			disabled={state !== "done"}
			className={cn(stepIndicatorVariants({ state, className }))}
			{...props}
		>
			{/* Fill (Figma Active/Done: color/primary). Done darkens on hover (only Done takes pointer
			    events — the others are disabled). Scales from the left edge. */}
			<motion.span
				aria-hidden='true'
				className='absolute inset-0 origin-left bg-primary transition-colors group-hover/step:bg-[color-mix(in_srgb,var(--primary)_80%,black)]'
				initial={false}
				animate={{ scaleX: reached ? 1 : 0 }}
				transition={resolve({ ...standardTransition, delay: fillDelay })}
			/>
		</button>
	);
}

/**
 * Per-segment fill delays for a stepper track, so a jump of several steps plays in order rather
 * than all at once: skipping ahead (3 → 5) fills 4, then 5; going back (5 → 2) empties 5, then
 * 4, then 3. Each segment starts as the previous one finishes (one standard transition apart).
 * Returns `(step) => seconds` for `StepIndicator`'s `fillDelay`; 0 for segments that don't change.
 */
function useStepFillDelay(currentStep: number) {
	// The step the track is moving from: the previous `currentStep`, updated during render when it
	// changes (React's "store the previous prop" pattern), so delays are right on the same render.
	const [shown, setShown] = React.useState(currentStep);
	const [from, setFrom] = React.useState(currentStep);
	if (currentStep !== shown) {
		setFrom(shown);
		setShown(currentStep);
	}
	const segment = standardTransition.duration ?? 0;

	return (step: number) => {
		if (currentStep > from && step > from && step <= currentStep) return (step - from - 1) * segment;
		if (currentStep < from && step > currentStep && step <= from) return (from - step) * segment;
		return 0;
	};
}

export { StepIndicator, stepIndicatorVariants, useStepFillDelay };
