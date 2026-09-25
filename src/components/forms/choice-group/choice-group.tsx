import * as React from "react";

import { cn } from "@/lib/utils";
import { ChoiceButton } from "@/components/forms/choice-button";

/** A single selectable segment, rendered as a `ChoiceButton` (Figma: `choice-button`). */
type ChoiceGroupOption = {
	value: string;
	label: React.ReactNode;
	disabled?: boolean;
};

type ChoiceGroupProps = Omit<React.ComponentProps<"div">, "onChange"> & {
	options: ChoiceGroupOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	disabled?: boolean;
};

/**
 * Row of equal-width selectable pill buttons, exactly one active at a time.
 * Composes bethere.ds `choice-button` (State=default/active);
 * generalized from its 2-option Figma instance to any number of options (see
 * "Captain included?" 2-option and "Crew included?" 3-option usage in the
 * Provider Portal Yacht Attributes screen).
 */
function ChoiceGroup({
	className,
	options,
	value,
	defaultValue,
	onChange,
	name,
	disabled = false,
	...props
}: ChoiceGroupProps) {
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
	const selected = value ?? uncontrolled;

	const select = (optionValue: string) => {
		setUncontrolled(optionValue);
		onChange?.(optionValue);
	};

	return (
		<div
			data-slot="choice-group"
			role="radiogroup"
			className={cn("flex w-full items-center gap-2", className)}
			{...props}
		>
			{options.map((option) => {
				const active = option.value === selected;
				return (
					<ChoiceButton
						key={option.value}
						role="radio"
						isSelected={active}
						label={option.label}
						disabled={disabled || option.disabled}
						onClick={() => select(option.value)}
						className="flex-1"
					/>
				);
			})}
			{name != null ? <input type="hidden" name={name} value={selected ?? ""} /> : null}
		</div>
	);
}

export { ChoiceGroup };
export type { ChoiceGroupProps, ChoiceGroupOption };
