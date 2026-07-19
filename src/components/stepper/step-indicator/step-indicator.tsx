import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const stepIndicatorVariants = cva(
	"h-1 min-w-px flex-1 shrink-0 rounded-2xl transition-colors disabled:pointer-events-none",
	{
		variants: {
			state: {
				// Default (Figma `State=Default`) — upcoming step, not reached yet, not clickable
				default: "bg-muted",
				// Active (Figma `State=Active`) — current step, not clickable
				active: "bg-primary",
				// Done (Figma `State=Done`) — completed step; the only clickable/hoverable state
				done: "bg-primary hover:bg-[color-mix(in_srgb,var(--primary)_80%,black)]",
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
 */
function StepIndicator({
	className,
	state = "default",
	...props
}: React.ComponentProps<"button"> & VariantProps<typeof stepIndicatorVariants>) {
	return (
		<button
			data-slot='step-indicator'
			data-state={state}
			type='button'
			disabled={state !== "done"}
			className={cn(stepIndicatorVariants({ state, className }))}
			{...props}
		/>
	);
}

export { StepIndicator, stepIndicatorVariants };
