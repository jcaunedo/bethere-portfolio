import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Figma `alert-inline` (bethere.ds node 896:46): a 16px tone icon, 6px gap (spacing/1_5), and an
 * sm/regular message, both in color/tone/<tone>/<tone>. No fill, border or padding — it sits inline
 * in the flow (a hint under a field or above an action), unlike the boxed `Alert`.
 */
const alertInlineVariants = cva("flex items-center gap-1.5 text-sm leading-[22px] [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		// Figma: Property 1
		variant: {
			info: "text-info",
			warning: "text-warning",
			destructive: "text-destructive",
			success: "text-success",
		},
	},
	defaultVariants: { variant: "info" },
});

/** Icon per tone, matching the Figma component (and `Alert`). */
const alertInlineIcons = {
	info: InfoIcon,
	warning: TriangleAlertIcon,
	destructive: CircleAlertIcon,
	success: CircleCheckIcon,
} as const;

type AlertInlineProps = React.ComponentProps<"p"> & VariantProps<typeof alertInlineVariants>;

/**
 * A one-line inline message in one of four tones. Not announced by default (no `role`): pass
 * `role="alert"` / `role="status"` when it reports something that just happened, or point a
 * control's `aria-describedby` at its `id` when it explains that control.
 */
function AlertInline({ className, variant = "info", children, ...props }: AlertInlineProps) {
	const Icon = alertInlineIcons[variant ?? "info"];
	return (
		<p
			data-slot="alert-inline"
			data-variant={variant}
			className={cn(alertInlineVariants({ variant }), className)}
			{...props}
		>
			<Icon aria-hidden="true" />
			<span className="min-w-0">{children}</span>
		</p>
	);
}

export { AlertInline, alertInlineVariants };
export type { AlertInlineProps };
