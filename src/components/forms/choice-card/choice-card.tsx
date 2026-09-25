import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ChoiceButtonIndicator } from "@/components/primitives/choice-button-indicator";

const choiceCardVariants = cva(
	// Base card: indicator + label/description stack. Figma: `choice-card` State=Default.
	// No Figma Hover state — hover borrows the `card` shadow lift from choice-chip's Hover.
	"flex items-center gap-3 overflow-hidden rounded-card bg-input-fill px-4 py-2.5 text-left text-sm leading-[22px] transition-shadow outline-none hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			// Figma `choice-card` State=Selected.
			selected: {
				true: "shadow-card",
				false: "",
			},
		},
		defaultVariants: {
			selected: false,
		},
	},
);

type ChoiceCardProps = Omit<React.ComponentProps<"button">, "children"> &
	Omit<VariantProps<typeof choiceCardVariants>, "selected"> & {
		/** Medium-weight title (Figma: `Label`). */
		label: React.ReactNode;
		/** Muted supporting line under the label (Figma: `Description`). */
		description?: React.ReactNode;
		/** Figma State=Selected. Exposed as `aria-checked` under `role="radio"`/`"checkbox"`, `aria-pressed` otherwise. */
		isSelected?: boolean;
	};

/**
 * Selectable card with a leading selection indicator, a label, and an optional
 * description. Translated from bethere.ds `choice-card` (State=Default/Selected).
 */
function ChoiceCard({
	className,
	label,
	description,
	isSelected = false,
	role,
	...props
}: ChoiceCardProps) {
	const ariaState =
		role === "radio" || role === "checkbox"
			? { "aria-checked": isSelected }
			: { "aria-pressed": isSelected };

	return (
		<button
			type="button"
			role={role}
			data-slot="choice-card"
			data-state={isSelected ? "active" : "default"}
			{...ariaState}
			className={cn(choiceCardVariants({ selected: isSelected, className }))}
			{...props}
		>
			<ChoiceButtonIndicator isSelected={isSelected} />
			<span className="flex min-w-0 flex-1 flex-col break-words">
				<span className="font-medium text-foreground">{label}</span>
				{description != null ? (
					<span className="text-muted-foreground">{description}</span>
				) : null}
			</span>
		</button>
	);
}

export { ChoiceCard, choiceCardVariants };
export type { ChoiceCardProps };
