import * as React from "react";
import { cva } from "class-variance-authority";
import { motion } from "motion/react";

import { StepperExperience } from "@/components/stepper/stepper-experience";
import { Typography } from "@/components/typography";
import { layoutSpring, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Props every New Listing step accepts and forwards to `NewListingLayout` — the stepper
 * and page-frame controls. A step's own props extend this.
 */
type NewListingStepProps = {
	className?: string;
	/**
	 * Render the built-in stepper. Set `false` when a parent flow owns a single
	 * persistent stepper across screens (so it advances in place instead of remounting).
	 */
	showStepper?: boolean;
	/** Total step count for the stepper track. Varies per listing path — see product-specs/onboarding-master-flow.md. */
	steps?: number;
	/** 1-indexed current step. */
	currentStep?: number;
	/** Stepper center label. */
	stepLabel?: string;
	/** Called when the back control is activated. */
	onBack?: () => void;
	/** Called when the close control is activated. */
	onClose?: () => void;
};

const frameVariants = cva("flex w-full flex-1 flex-col items-center", {
	variants: {
		align: {
			center: "h-full min-h-0 justify-between",
			top: "",
		},
	},
	defaultVariants: { align: "center" },
});

// Content always sits at least 48px under the stepper header. The space is padding on the body
// (not a frame gap) so it also holds inside a flow that renders one shared stepper above the steps.
const bodyVariants = cva("flex w-full flex-1 flex-col items-center gap-8", {
	variants: {
		align: {
			// Short steps: centered between stepper and footer. Symmetric 48px keeps the centered
			// position unchanged while guaranteeing the minimum when space runs short.
			center: "justify-center py-12",
			// Long forms: start 48px under the stepper; 40px before the footer.
			top: "pt-12 pb-10",
		},
		// Body column width: 640px (Figma form column) by default.
		width: {
			default: "max-w-[640px]",
			wide: "max-w-[800px]",
			full: "",
		},
	},
	defaultVariants: { align: "center", width: "default" },
});

type NewListingLayoutProps = NewListingStepProps & {
	/** Step question (Figma `3xl -semibold`). */
	title: React.ReactNode;
	/** Supporting line under the title (Figma `xl`, muted). */
	description?: React.ReactNode;
	/** "center" for short steps, "top" for long forms. */
	align?: "center" | "top";
	/** Body column width: "default" 640px, "wide" 800px, "full" uncapped. */
	width?: "default" | "wide" | "full";
	/** Extra classes for the body column (e.g. a step-specific title → content gap). */
	bodyClassName?: string;
	/** The step's content, rendered under the title. */
	children?: React.ReactNode;
};

/**
 * Provider Portal "New Listing" page frame shared by every step under
 * `src/layouts/new-listing/steps/`: the Stepper Experience header, the step's title
 * and description, its content column, and the copyright footer. Steps pass their own
 * content as `children` — the New Listing counterpart of `AccountSettingsLayout`.
 */
function NewListingLayout({
	className,
	showStepper = true,
	steps = 14,
	currentStep = 1,
	stepLabel,
	onBack = () => {},
	onClose = () => {},
	title,
	description,
	align = "center",
	width = "default",
	bodyClassName,
	children,
}: NewListingLayoutProps) {
	const { prefersReducedMotion, resolve } = useMotionPreference();

	return (
		<div
			data-slot="new-listing-layout"
			className={cn("flex min-h-screen flex-col items-center bg-background p-2", className)}
		>
			<div className={frameVariants({ align })}>
				{showStepper ? (
					<StepperExperience
						steps={steps}
						currentStep={currentStep}
						label={stepLabel ?? `Step ${currentStep} of ${steps}`}
						onBack={onBack}
						onClose={onClose}
					/>
				) : null}

				<div className={cn(bodyVariants({ align, width }), bodyClassName)}>
					{/* Glides (layout) when a centered step re-centers because its content changed height,
					    e.g. Availability adding a day's row. Reduced motion: no movement. */}
					<motion.div
						layout={prefersReducedMotion ? false : "position"}
						transition={{ layout: resolve(layoutSpring) }}
						className="flex flex-col items-center gap-2 text-center"
					>
						<Typography as="h1" size="3xl" weight="semibold">
							{title}
						</Typography>
						{description != null ? (
							<Typography size="xl" className="text-muted-foreground">
								{description}
							</Typography>
						) : null}
					</motion.div>
					{children}
				</div>

				<div className="flex flex-col items-center py-4 text-center">
					<Typography size="xs" className="text-muted-foreground">
						© 2026 Bethere Corp. All Rights Reserved
					</Typography>
				</div>
			</div>
		</div>
	);
}

export { NewListingLayout };
export type { NewListingLayoutProps, NewListingStepProps };
