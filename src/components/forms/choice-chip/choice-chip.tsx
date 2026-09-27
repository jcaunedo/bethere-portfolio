import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import {
	exitTransition,
	motionScale,
	pressPattern,
	standardTransition,
	useMotionPreference,
} from "@/lib/motion";
import { ChoiceButtonIndicator } from "@/components/primitives/choice-button-indicator";

const choiceChipVariants = cva(
	// Base chip: left-aligned label on a borderless tile. Figma: `choice-chip` State=Default.
	// Figma State=Hover → hover: card shadow + foreground label.
	// No flex gap: the indicator carries its own 8px spacing so it can animate in from zero width.
	"flex h-10 items-center overflow-hidden rounded-card bg-input-fill px-3 py-2 text-left text-sm text-muted-foreground transition-[color,box-shadow] outline-none hover:text-foreground hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			// Figma `choice-chip` State=Selected.
			selected: {
				true: "text-foreground shadow-card",
				false: "",
			},
		},
		defaultVariants: {
			selected: false,
		},
	},
);

// Native drag/animation handlers collide with Motion's own on `motion.button`.
type ChoiceChipProps = Omit<
	React.ComponentProps<"button">,
	"children" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> &
	Omit<VariantProps<typeof choiceChipVariants>, "selected"> & {
		/** Left-aligned label (Figma: `Label`). */
		label: React.ReactNode;
		/** Figma State=Selected — shows the check indicator. Exposed as `aria-checked` under `role="radio"`/`"checkbox"`, `aria-pressed` otherwise. */
		isSelected?: boolean;
	};

/**
 * Selectable chip with a leading check indicator when selected.
 * Translated from bethere.ds `choice-chip` (State=Default/Hover/Selected).
 */
function ChoiceChip({
	className,
	label,
	isSelected = false,
	role,
	...props
}: ChoiceChipProps) {
	const { prefersReducedMotion, resolve } = useMotionPreference();
	const ariaState =
		role === "radio" || role === "checkbox"
			? { "aria-checked": isSelected }
			: { "aria-pressed": isSelected };

	return (
		<motion.button
			type="button"
			role={role}
			data-slot="choice-chip"
			data-state={isSelected ? "active" : "default"}
			{...ariaState}
			className={cn(choiceChipVariants({ selected: isSelected, className }))}
			// Press: scale down while tapped (transform only, no layout impact). Dropped under reduced motion.
			{...(prefersReducedMotion ? {} : pressPattern)}
			{...props}
		>
			{/* Figma: indicator only appears in State=Selected. It grows in from zero width
			    (fade + soft scale) so the label slides over instead of jumping. */}
			<AnimatePresence initial={false}>
				{isSelected ? (
					<motion.span
						key="indicator"
						className="flex shrink-0 overflow-hidden"
						initial={{ width: 0, opacity: 0, scale: motionScale.iconIn }}
						animate={{ width: "auto", opacity: 1, scale: 1, transition: resolve(standardTransition) }}
						exit={{ width: 0, opacity: 0, scale: motionScale.iconIn, transition: resolve(exitTransition) }}
					>
						<ChoiceButtonIndicator isSelected className="mr-2" />
					</motion.span>
				) : null}
			</AnimatePresence>
			<span className="min-w-0 flex-1 break-words leading-[22px]">{label}</span>
		</motion.button>
	);
}

export { ChoiceChip, choiceChipVariants };
export type { ChoiceChipProps };
