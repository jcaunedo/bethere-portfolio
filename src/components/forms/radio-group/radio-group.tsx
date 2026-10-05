import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { typographyVariants } from "@/components/typography";

const radioGroupItemVariants = cva(
	[
		// Figma Property 1=Default: white fill, color/foreground/muted ring, shadow-default.
		"peer group/radio aspect-square shrink-0 rounded-full border-muted-foreground bg-card shadow-sm transition-[border-color,box-shadow] outline-none",
		// Figma Property 1=Selected: color/foreground/foreground ring (+ dot, see indicator).
		"data-[state=checked]:border-foreground",
		// Figma Property 1=Disabled: neutral-300 ring, white fill, lighter shadow, full opacity.
		// No Figma Selected+Disabled source: the ring stays neutral-300 when checked too.
		"disabled:cursor-not-allowed disabled:border-input-ring disabled:shadow-xs disabled:data-[state=checked]:border-input-ring",
		// No Figma source: focus follows UCL inputs; hover darkens the unchecked ring (as Checkbox).
		"hover:border-foreground focus-visible:ring-[3px] focus-visible:ring-input-ring-outside aria-invalid:border-destructive",
	],
	{
		variants: {
			size: {
				// Figma default: 16px circle, 1.14px ring.
				md: "size-4 border-[1.14px]",
				// Figma instance at 24px (business-choice-card): 1.71px ring.
				lg: "size-6 border-[1.71px]",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

const radioGroupDotVariants = cva(
	// Figma Selected dot: color/foreground/foreground; neutral-300 when disabled.
	"rounded-full bg-foreground group-disabled/radio:bg-input-ring",
	{
		variants: {
			size: {
				md: "size-[10.2px]",
				lg: "size-[15.3px]",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

/** Single-select group of `RadioGroupItem`s. shadcn/ui RadioGroup (Radix). */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return (
		<RadioGroupPrimitive.Root
			data-slot="radio-group"
			className={cn("grid gap-3", className)}
			{...props}
		/>
	);
}

type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item> &
	VariantProps<typeof radioGroupItemVariants> & {
		/** Optional label; when set, the radio and label render inside one clickable `<label>`. */
		label?: React.ReactNode;
	};

/**
 * Radio button. shadcn/ui RadioGroupItem (Radix) skinned to bethere.ds `Radio Button`
 * (Property 1=Default/Selected/Disabled). Must render inside a `RadioGroup`.
 */
function RadioGroupItem({ className, size = "md", label, id, ...props }: RadioGroupItemProps) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;

	const radio = (
		<RadioGroupPrimitive.Item
			data-slot="radio-group-item"
			data-size={size}
			id={inputId}
			className={cn(radioGroupItemVariants({ size }), label == null && className)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator
				data-slot="radio-group-indicator"
				className="flex size-full items-center justify-center"
			>
				<span className={radioGroupDotVariants({ size })} />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);

	if (label == null) return radio;

	// Figma: 8px between radio and label, 2px vertical padding; label sm/regular, muted when disabled.
	return (
		<label
			htmlFor={inputId}
			data-slot="radio-group-label"
			className={cn(
				"inline-flex items-center gap-2 py-0.5 text-foreground has-[button:disabled]:cursor-not-allowed has-[button:disabled]:text-muted-foreground",
				typographyVariants({ size: "sm" }),
				className,
			)}
		>
			{radio}
			{label}
		</label>
	);
}

export { RadioGroup, RadioGroupItem, radioGroupItemVariants };
export type { RadioGroupItemProps };
