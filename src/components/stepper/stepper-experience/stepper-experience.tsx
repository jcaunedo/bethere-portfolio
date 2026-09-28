import * as React from "react";
import { ArrowLeft, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { StepIndicator, useStepFillDelay } from "../step-indicator";

/**
 * Progress track with back/close controls for the experience creation flow. Figma: bethere.ds `Stepper Experience`.
 * Steps before `currentStep` render as `done` (clickable, to jump back); the step at
 * `currentStep` renders as `active`; later steps render as `default`. Only `done` steps
 * are interactive — `active`/`default` steps have no hover or click affordance.
 */
function StepperExperience({
	className,
	steps,
	currentStep,
	label,
	onBack,
	onClose,
	onStepClick,
	...props
}: React.ComponentProps<"div"> & {
	/** Total number of steps in the flow. */
	steps: number;
	/** 1-indexed current step; only this segment renders as active. */
	currentStep: number;
	/** Center label, e.g. "Step 2 of 12 · Description (optional)". */
	label: string;
	/** Called when the back control is activated. Omit to hide the back button. */
	onBack?: () => void;
	/** Called when the close control is activated. Omit to hide the close button. */
	onClose?: () => void;
	/** Called with the 1-indexed step number when a completed (`done`) step is clicked. */
	onStepClick?: (step: number) => void;
}) {
	// Segments changing together (a skipped step, a jump back) fill/empty in sequence.
	const fillDelay = useStepFillDelay(currentStep);
	return (
		<div
			data-slot='stepper-experience'
			className={cn("flex w-full flex-col items-start", className)}
			{...props}
		>
			<div
				className='flex w-full items-start gap-2'
				role='progressbar'
				aria-valuemin={1}
				aria-valuemax={steps}
				aria-valuenow={currentStep}
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
			<div className='flex w-full items-center justify-between px-4 py-5'>
				{onBack ? (
					<button
						type='button'
						onClick={onBack}
						aria-label='Back'
						className='inline-flex size-5 shrink-0 items-center justify-center text-icon outline-none transition-colors hover:text-icon-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-full'
					>
						<ArrowLeft />
					</button>
				) : (
					<span className='size-5 shrink-0' aria-hidden='true' />
				)}
				<p className='text-center text-sm text-muted-foreground'>{label}</p>
				{onClose ? (
					<button
						type='button'
						onClick={onClose}
						aria-label='Close'
						className='inline-flex size-5 shrink-0 items-center justify-center text-icon outline-none transition-colors hover:text-icon-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-full'
					>
						<X />
					</button>
				) : (
					<span className='size-5 shrink-0' aria-hidden='true' />
				)}
			</div>
		</div>
	);
}

export { StepperExperience };
