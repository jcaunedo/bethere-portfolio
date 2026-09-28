import * as React from "react";

import { cn } from "@/lib/utils";
import { StepIndicator, useStepFillDelay } from "../step-indicator";

/**
 * Simple progress track for onboarding flows. Figma: bethere.ds `Stepper Onboarding`.
 * Steps before `currentStep` render as `done` (clickable, to jump back); the step at
 * `currentStep` renders as `active`; later steps render as `default`. Only `done` steps
 * are interactive — `active`/`default` steps have no hover or click affordance.
 */
function StepperOnboarding({
	className,
	steps,
	currentStep,
	onStepClick,
	...props
}: React.ComponentProps<"div"> & {
	/** Total number of steps in the flow. */
	steps: number;
	/** 1-indexed current step; only this segment renders as active. */
	currentStep: number;
	/** Called with the 1-indexed step number when a completed (`done`) step is clicked. */
	onStepClick?: (step: number) => void;
}) {
	// Segments changing together (a skipped step, a jump back) fill/empty in sequence.
	const fillDelay = useStepFillDelay(currentStep);
	return (
		<div
			data-slot='stepper-onboarding'
			className={cn("flex w-full items-start gap-2", className)}
			role='progressbar'
			aria-valuemin={1}
			aria-valuemax={steps}
			aria-valuenow={currentStep}
			{...props}
		>
			{Array.from({ length: steps }, (_, index) => {
				const step = index + 1;
				const state =
					step < currentStep ? "done" : step === currentStep ? "active" : "default";
				return (
					<StepIndicator
						key={index}
						state={state}
						fillDelay={fillDelay(step)}
						aria-label={`Step ${step}`}
						onClick={state === "done" ? () => onStepClick?.(step) : undefined}
					/>
				);
			})}
		</div>
	);
}

export { StepperOnboarding };
