import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ChoiceButtonIndicator } from "@/components/primitives/choice-button-indicator";

const choiceChipVariants = cva(
	// Base chip: left-aligned label on a borderless tile. Figma: `choice-chip` State=Default.
	// Figma State=Hover → hover: card shadow + foreground label.
	"flex h-10 items-center gap-2 overflow-hidden rounded-card bg-input-fill px-3 py-2 text-left text-sm text-muted-foreground transition-[color,box-shadow] outline-none hover:text-foreground hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none disabled:opacity-50",
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

type ChoiceChipProps = Omit<React.ComponentProps<"button">, "children"> &
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
	const ariaState =
		role === "radio" || role === "checkbox"
			? { "aria-checked": isSelected }
			: { "aria-pressed": isSelected };

	return (
		<button
			type="button"
			role={role}
			data-slot="choice-chip"
			data-state={isSelected ? "active" : "default"}
			{...ariaState}
			className={cn(choiceChipVariants({ selected: isSelected, className }))}
			{...props}
		>
			{/* Figma: indicator only appears in State=Selected. */}
			{isSelected ? <ChoiceButtonIndicator isSelected /> : null}
			<span className="min-w-0 flex-1 break-words leading-[22px]">{label}</span>
		</button>
	);
}

export { ChoiceChip, choiceChipVariants };
export type { ChoiceChipProps };
