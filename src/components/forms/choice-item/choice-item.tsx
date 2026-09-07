import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const choiceItemVariants = cva(
	// Base row: title/description stack + trailing icon slot. Figma: "Choice Item single" / "Choice Item multiple".
	"group flex w-full items-center gap-4 overflow-hidden rounded-card border border-transparent bg-card py-3.5 pl-5 pr-4 text-left outline-none transition-shadow hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.08)] focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			// Figma `default-subtle` — a translucent-background treatment layered on
			// top of `default`, not a mutually exclusive state (no token backs the
			// 50%-opacity white; it's a raw Figma value with no semantic equivalent).
			subtle: {
				true: "bg-white/50",
				false: "",
			},
			// Figma `Selected` (multi-select only). Single-select has no selected
			// visual — selecting it navigates forward instead of persisting state.
			selected: {
				true: "border-primary bg-card",
				false: "",
			},
		},
		defaultVariants: {
			subtle: false,
			selected: false,
		},
	},
);

type ChoiceItemProps = Omit<React.ComponentProps<"button">, "title"> &
	VariantProps<typeof choiceItemVariants> & {
		/**
		 * Single-select rows navigate forward on click and never show a selected
		 * state; multiple-select rows toggle `isSelected` and never navigate.
		 */
		selectionMode: "single" | "multiple";
		/** Row title (Figma: `Title`). */
		title: React.ReactNode;
		/** Optional supporting line below the title (Figma: `Description`). */
		description?: React.ReactNode;
		/** Multi-select only — ignored when `selectionMode="single"`. */
		isSelected?: boolean;
	};

/**
 * Selectable list row — title + optional description, with a trailing
 * forward-chevron (single-select, shown on hover) or checkmark (multi-select,
 * shown when selected). Translated from Figma `Choice Item single` /
 * `Choice Item multiple` (bethere.ds).
 */
function ChoiceItem({
	className,
	subtle = false,
	selectionMode,
	isSelected = false,
	title,
	description,
	...props
}: ChoiceItemProps) {
	const selected = selectionMode === "multiple" && isSelected;

	return (
		<button
			type="button"
			data-slot="choice-item"
			data-selection-mode={selectionMode}
			data-selected={selected}
			aria-pressed={selectionMode === "multiple" ? selected : undefined}
			className={cn(choiceItemVariants({ subtle, selected, className }))}
			{...props}
		>
			<span className="flex min-w-0 flex-1 flex-col items-start">
				<span className="w-full truncate font-sans text-lg font-medium tracking-[0.01em] text-foreground">
					{title}
				</span>
				{description != null && (
					<span className="w-full truncate font-sans text-sm text-muted-foreground">
						{description}
					</span>
				)}
			</span>
			{selectionMode === "single" && (
				<ChevronRightIcon className="size-5 shrink-0 text-icon-subtle group-hover:text-icon-primary" />
			)}
			{selectionMode === "multiple" && selected && (
				<CheckIcon className="size-5 shrink-0 text-icon-primary" />
			)}
		</button>
	);
}

export { ChoiceItem, choiceItemVariants, type ChoiceItemProps };
