import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const choiceButtonVariants = cva(
	// Base pill. Figma: `choice-button` State=Default.
	// Figma State=Hover → hover: card shadow + foreground label.
	"flex h-10 items-center overflow-hidden rounded-card bg-input-fill px-3 py-2 text-sm text-muted-foreground transition-[color,box-shadow] outline-none hover:text-foreground hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none disabled:opacity-50",
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
		/** Centered single-line label that fills the button, truncated with an ellipsis (Figma: `Label`). */
		label: React.ReactNode;
		/** Figma State=active. Exposed as `aria-checked` under `role="radio"`, `aria-pressed` otherwise. */
		isSelected?: boolean;
	};

/**
 * Single selectable pill button — the building block of `ChoiceGroup`.
 * Translated from bethere.ds `choice-button` (State=Default/Hover/Active).
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
			{/* Figma `Label`: fills both axes (flex-1 + h-full), text vertically centered and truncated. */}
			<span className="flex h-full min-w-0 flex-1 flex-col justify-center text-center">
				<span className="truncate leading-[22px]">{label}</span>
			</span>
		</button>
	);
}

export { ChoiceButton, choiceButtonVariants };
export type { ChoiceButtonProps };
