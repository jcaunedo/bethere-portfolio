"use client";

import * as React from "react";
import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
	XIcon,
} from "lucide-react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

/**
 * App-wide toast host — mount once near the root, then call `toast()` / `toast.success()` /
 * `toast.error()` / `toast.info()` / `toast.warning()` anywhere.
 * shadcn/ui Sonner, skinned to bethere.ds `Sonner` (Property 1=Error/Variant2 (info)/Success/Warning):
 * white card, border, radius/card, shadow/sonner, 16px tone icon + sm/medium message in the
 * same tone, 24px × close. Light theme only (UCL has no theme provider), so no next-themes.
 */
function Toaster({ toastOptions, className, ...props }: ToasterProps) {
	return (
		<Sonner
			theme="light"
			closeButton
			className={cn("toaster group", className)}
			// Figma toast width.
			style={{ "--width": "360px" } as React.CSSProperties}
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				// Figma reuses circle-check for Warning; triangle-alert (shadcn's default) keeps it
				// distinguishable from Success beyond color.
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
				close: <XIcon className="size-3" />,
			}}
			toastOptions={{
				...toastOptions,
				// Unstyled: Sonner keeps positioning, stacking, swipe and enter/exit motion; the look
				// below comes from UCL tokens.
				unstyled: true,
				classNames: {
					// Figma: 14px (spacing/3_5) top/bottom, 16 left, 10 right → 52px with the 24px close button;
					// shadow/sonner. Inset ring = Figma inside stroke, so it stays 52px (a border would add 2px).
					// No text color here: it's set per type below, so it can't out-rank the tone colors.
					// font-sans on the toast itself: Sonner's injected CSS puts a system font stack on the
					// toaster container (and loads after ours), so inheriting from it isn't enough.
					// Entrance overshoot (`--ease-overshoot`, theme.css): only the incoming toast — Sonner marks
					// it data-front — and never while it's leaving (data-removed), so exit keeps Sonner's plain
					// ease. `!` because Sonner's injected `transition` rule is unlayered and would otherwise
					// beat this layered utility. Reduced motion: Sonner drops all toast transitions itself.
					toast:
						"flex w-(--width) items-center gap-2 rounded-card bg-card py-3.5 pr-2.5 pl-4 font-sans text-sm leading-[22px] font-medium shadow-sonner inset-ring inset-ring-border data-[front=true]:not-data-[removed=true]:ease-overshoot!",
					icon: "flex size-4 shrink-0 items-center justify-center [&>svg]:size-4",
					content: "flex min-w-0 flex-1 flex-col",
					title: "leading-[22px]",
					description: "font-normal text-muted-foreground",
					// Figma `button`: 24px ghost icon button, 12px × in color/icon/subtle. Sonner renders it
					// first in the DOM; `order-last` puts it on the right like Figma.
					closeButton:
						"order-last flex size-6 shrink-0 items-center justify-center rounded-lg text-icon-subtle transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
					actionButton:
						"order-last h-6 shrink-0 rounded-lg bg-primary px-2 text-xs font-medium text-primary-foreground",
					cancelButton: "order-last h-6 shrink-0 rounded-lg bg-accent px-2 text-xs font-medium",
					// Figma tones: message + icon take color/tone/<tone>/<tone>. Plain `toast()` → foreground.
					default: "text-foreground",
					loading: "text-foreground",
					error: "text-danger",
					info: "text-info",
					success: "text-success",
					warning: "text-warning",
					...toastOptions?.classNames,
				},
			}}
			{...props}
		/>
	);
}

export { Toaster, toast };
export type { ToasterProps };
