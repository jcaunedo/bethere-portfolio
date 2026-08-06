import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Tabs({
	className,
	orientation = "horizontal",
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			data-slot='tabs'
			data-orientation={orientation}
			orientation={orientation}
			className={cn(
				"group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
				className,
			)}
			{...props}
		/>
	);
}

/** Figma: Tabs — underline style only (shadcn's `line` TabsList variant). */
function TabsList({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot='tabs-list'
			data-variant='line'
			className={cn(
				"group/tabs-list inline-flex w-fit items-center justify-center gap-4 bg-transparent group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
				className,
			)}
			{...props}
		/>
	);
}

const tabsTriggerVariants = cva(
	// Figma: Tabs, State=Default/Active. Active's underline is drawn by the
	// `after:` pseudo below, not a literal border — matches shadcn's `line`
	// TabsList variant mechanism (see tabs.tsx history / DESIGN.md).
	"relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground after:absolute after:inset-x-0 after:bottom-[-2px] after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity data-[state=active]:after:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			size: {
				md: "px-1 py-[5px] text-sm font-medium",
				lg: "px-1 py-1.5 text-base font-medium",
			},
		},
		defaultVariants: {
			size: "lg",
		},
	},
);

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> &
	VariantProps<typeof tabsTriggerVariants>;

/** A single tab trigger (Figma: Tabs, `Size=lg · 36` / `md · 32`). */
function TabsTrigger({ className, size = "lg", ...props }: TabsTriggerProps) {
	return (
		<TabsPrimitive.Trigger
			data-slot='tabs-trigger'
			data-size={size}
			className={cn(tabsTriggerVariants({ size, className }))}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot='tabs-content'
			className={cn("flex-1 outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsTriggerVariants };
