import * as React from "react";

import { cn } from "@/lib/utils";

/** A single selectable segment (Figma: `button-binary-choice`). */
type ChoiceGroupOption = {
	value: string;
	label: React.ReactNode;
	/** Supporting line under the label (Figma `showDescription`). */
	description?: React.ReactNode;
	/** Leading 18px icon (Figma `showIcon`). */
	icon?: React.ReactNode;
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
 * Translated from bethere.ds `button-binary-choice` (Property 1=default/active);
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
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={active}
						data-slot="choice-group-item"
						data-state={active ? "active" : "default"}
						disabled={disabled || option.disabled}
						onClick={() => select(option.value)}
						className={cn(
							"flex h-10 flex-1 items-center justify-center gap-2 overflow-hidden rounded-input border border-transparent bg-input-fill px-3 py-2 text-sm text-muted-foreground transition-colors outline-none",
							"hover:text-foreground",
							"focus-visible:ring-[3px] focus-visible:ring-input-ring-outside",
							"disabled:pointer-events-none disabled:opacity-50",
							active && "border-primary text-foreground",
						)}
					>
						{option.icon != null ? (
							<span className="size-[18px] shrink-0">{option.icon}</span>
						) : null}
						<span className="flex min-w-0 flex-1 flex-col items-center">
							<span className="w-full truncate text-center leading-[22px]">
								{option.label}
							</span>
							{option.description != null ? (
								<span className="w-full truncate text-center text-muted-foreground leading-[22px]">
									{option.description}
								</span>
							) : null}
						</span>
					</button>
				);
			})}
			{name != null ? <input type="hidden" name={name} value={selected ?? ""} /> : null}
		</div>
	);
}

export { ChoiceGroup };
export type { ChoiceGroupProps, ChoiceGroupOption };
