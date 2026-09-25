import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const choiceButtonIconVariants = cva(
	// Base tile: 24px icon stacked over a centered label. Figma: `choice-button-icon` State=default.
	"flex flex-col items-center justify-center gap-2 overflow-hidden rounded-card bg-input-fill px-3 py-4 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			// Figma `choice-button-icon` State=active. Inset ring = Figma inside stroke (no layout shift on the auto-height tile).
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

type ChoiceButtonIconProps = Omit<React.ComponentProps<"button">, "children"> &
	Omit<VariantProps<typeof choiceButtonIconVariants>, "selected"> & {
		/** 24px icon above the label (Figma: `Icon`). Colored `icon-subtle`, `icon-primary` when selected. */
		icon: React.ReactNode;
		/** Centered label (Figma: `Label`). */
		label: React.ReactNode;
		/** Figma State=active. Exposed as `aria-checked` under `role="radio"`, `aria-pressed` otherwise. */
		isSelected?: boolean;
	};

/**
 * Selectable tile with a leading icon stacked over its label — the icon
 * counterpart of `ChoiceButton`. Translated from bethere.ds
 * `choice-button-icon` (State=default/active).
 */
function ChoiceButtonIcon({
	className,
	icon,
	label,
	isSelected = false,
	role,
	...props
}: ChoiceButtonIconProps) {
	const ariaState =
		role === "radio" || role === "checkbox"
			? { "aria-checked": isSelected }
			: { "aria-pressed": isSelected };

	return (
		<button
			type="button"
			role={role}
			data-slot="choice-button-icon"
			data-state={isSelected ? "active" : "default"}
			{...ariaState}
			className={cn(choiceButtonIconVariants({ selected: isSelected, className }))}
			{...props}
		>
			<span
				className={cn(
					"size-6 shrink-0",
					isSelected ? "text-icon-primary" : "text-icon-subtle",
				)}
			>
				{icon}
			</span>
			<span className="w-full break-words text-center leading-[22px]">{label}</span>
		</button>
	);
}

export { ChoiceButtonIcon, choiceButtonIconVariants };
export type { ChoiceButtonIconProps };
