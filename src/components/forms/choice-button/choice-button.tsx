import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const choiceButtonVariants = cva(
	// Base pill. Figma: `choice-button` State=default.
	"flex h-10 items-center overflow-hidden rounded-card bg-input-fill px-3 py-2 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			// Figma `choice-button` State=active. Inset ring = Figma inside stroke (keeps the full 182px label width).
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

type ChoiceButtonProps = Omit<React.ComponentProps<"button">, "children"> &
	Omit<VariantProps<typeof choiceButtonVariants>, "selected"> & {
		/** Centered single-line label, truncated with an ellipsis (Figma: `Label`). */
		label: React.ReactNode;
		/** Figma State=active. Exposed as `aria-checked` under `role="radio"`, `aria-pressed` otherwise. */
		isSelected?: boolean;
	};

/**
 * Single selectable pill button — the building block of `ChoiceGroup`.
 * Translated from bethere.ds `choice-button` (State=default/active).
 */
function ChoiceButton({
	className,
	label,
	isSelected = false,
	role,
	...props
}: ChoiceButtonProps) {
	const ariaState =
		role === "radio" || role === "checkbox"
			? { "aria-checked": isSelected }
			: { "aria-pressed": isSelected };

	return (
		<button
			type="button"
			role={role}
			data-slot="choice-button"
			data-state={isSelected ? "active" : "default"}
			{...ariaState}
			className={cn(choiceButtonVariants({ selected: isSelected, className }))}
			{...props}
		>
			<span className="min-w-0 flex-1 truncate text-center leading-[22px]">{label}</span>
		</button>
	);
}

export { ChoiceButton, choiceButtonVariants };
export type { ChoiceButtonProps };
