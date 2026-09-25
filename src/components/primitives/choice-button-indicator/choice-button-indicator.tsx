import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckIcon, CircleDashedIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const choiceButtonIndicatorVariants = cva("size-[18px] shrink-0", {
	variants: {
		selected: {
			// Figma: selected — circle-check in color/tone/brand/brand.
			true: "text-primary",
			// Figma: unselected — dashed circle in color/icon/subtle.
			false: "text-icon-subtle",
		},
	},
	defaultVariants: {
		selected: false,
	},
});

type ChoiceButtonIndicatorProps = React.ComponentProps<"svg"> &
	Omit<VariantProps<typeof choiceButtonIndicatorVariants>, "selected"> & {
		isSelected?: boolean;
	};

/**
 * 18px selection marker used by the choice-* components — a dashed circle when
 * unselected, a circle-check when selected. Purely visual (`aria-hidden`); the
 * parent control carries the selected state. Translated from bethere.ds
 * `choice-button-indicator` (lucide CircleDashed / CircleCheck match its geometry 1:1).
 */
function ChoiceButtonIndicator({ className, isSelected = false, ...props }: ChoiceButtonIndicatorProps) {
	const Icon = isSelected ? CircleCheckIcon : CircleDashedIcon;
	return (
		<Icon
			aria-hidden="true"
			data-slot="choice-button-indicator"
			data-state={isSelected ? "active" : "default"}
			className={cn(choiceButtonIndicatorVariants({ selected: isSelected, className }))}
			{...props}
		/>
	);
}

export { ChoiceButtonIndicator, choiceButtonIndicatorVariants };
export type { ChoiceButtonIndicatorProps };
