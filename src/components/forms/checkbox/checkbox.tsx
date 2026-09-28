import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { typographyVariants } from "@/components/typography";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	/** Optional label; when set, the box and label render inside one clickable `<label>`. */
	label?: React.ReactNode;
};

/**
 * Checkbox. shadcn/ui Checkbox (Radix) skinned to bethere.ds `Checkbox`
 * (Property 1=Default/Selected/Partial/Disabled). Partial = `checked="indeterminate"`.
 */
function Checkbox({ className, label, id, ...props }: CheckboxProps) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;

	const box = (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			id={inputId}
			className={cn(
				// Figma Default: 16px, 4px radius, white fill, 1px color/foreground/muted border, shadow-sm.
				"peer group/checkbox size-4 shrink-0 rounded-[4px] border border-muted-foreground bg-card text-background shadow-sm transition-[border-color,background-color,box-shadow] outline-none",
				// Figma Selected / Partial: color/foreground/foreground fill + border, white glyph.
				"data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=indeterminate]:border-foreground data-[state=indeterminate]:bg-foreground",
				// Figma Disabled: neutral-300 border, white fill, lighter shadow, full opacity.
				"disabled:cursor-not-allowed disabled:border-input-ring disabled:shadow-xs",
				// No Figma source: focus follows UCL inputs; hover darkens the unchecked border.
				"hover:border-foreground focus-visible:ring-[3px] focus-visible:ring-input-ring-outside aria-invalid:border-destructive",
				label == null && className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="grid place-content-center text-current transition-none"
			>
				<CheckIcon className="size-3.5 group-data-[state=indeterminate]/checkbox:hidden" strokeWidth={3} />
				<MinusIcon className="hidden size-3.5 group-data-[state=indeterminate]/checkbox:block" strokeWidth={3} />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);

	if (label == null) return box;

	// Figma: 8px between box and label, 2px vertical padding; label sm/regular, muted when disabled.
	return (
		<label
			htmlFor={inputId}
			data-slot="checkbox-label"
			className={cn(
				"inline-flex items-center gap-2 py-0.5 text-foreground has-[button:disabled]:cursor-not-allowed has-[button:disabled]:text-muted-foreground",
				typographyVariants({ size: "sm" }),
				className,
			)}
		>
			{box}
			{label}
		</label>
	);
}

export { Checkbox };
export type { CheckboxProps };
