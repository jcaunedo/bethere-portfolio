import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LayoutGroup, motion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { layoutSpring, useMotionPreference } from "@/lib/motion";

/**
 * The selected tab's value, shared with the triggers so the active one can render the gliding
 * underline (Radix doesn't expose its own state to custom children).
 */
const TabsValueContext = React.createContext<string | undefined>(undefined);

function Tabs({
	className,
	orientation = "horizontal",
	value: valueProp,
	defaultValue,
	onValueChange,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	// Mirrors Radix's own controlled/uncontrolled behavior, so it's the same API as before.
	const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
	const value = valueProp ?? uncontrolledValue;

	return (
		<TabsValueContext.Provider value={value}>
			<TabsPrimitive.Root
				data-slot='tabs'
				data-orientation={orientation}
				orientation={orientation}
				value={value}
				onValueChange={(next) => {
					setUncontrolledValue(next);
					onValueChange?.(next);
				}}
				className={cn(
					"group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
					className,
				)}
				{...props}
			/>
		</TabsValueContext.Provider>
	);
}

/**
 * Figma: Tabs — underline style only (shadcn's `line` TabsList variant). Wraps the list in a
 * `LayoutGroup` with a per-instance id, so two tab lists on one page each keep their own gliding
 * underline.
 */
function TabsList({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
	const id = React.useId();

	return (
		<LayoutGroup id={id}>
			<TabsPrimitive.List
				data-slot='tabs-list'
				data-variant='line'
				className={cn(
					"group/tabs-list inline-flex w-fit items-center justify-center gap-4 bg-transparent group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
					className,
				)}
				{...props}
			/>
		</LayoutGroup>
	);
}

const tabsTriggerVariants = cva(
	// Figma: Tabs, State=Default/Active. Active's underline is a separate `motion.span` (see
	// `TabsTrigger`), not a border or pseudo-element, so it can glide between tabs. Text color
	// fades with `motionDuration.fast` (160ms) on the standard curve — same as verita-ai's tabs.
	"relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-muted-foreground outline-none transition-[color] duration-160 ease-in-out hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

/**
 * A single tab trigger (Figma: Tabs, `Size=lg · 36` / `md · 32`). The active one renders the 2px
 * underline as a `motion.span` with a shared `layoutId`, so on a tab change it glides from the
 * previous tab to the new one on `layoutSpring` (CLAUDE.md "Tabs"; same as verita-ai's
 * `TabUnderline`). Instant under reduced motion.
 */
function TabsTrigger({ className, size = "lg", value, children, ...props }: TabsTriggerProps) {
	const selectedValue = React.useContext(TabsValueContext);
	const { resolve } = useMotionPreference();

	return (
		<TabsPrimitive.Trigger
			data-slot='tabs-trigger'
			data-size={size}
			value={value}
			className={cn(tabsTriggerVariants({ size, className }))}
			{...props}
		>
			{children}
			{selectedValue === value ? (
				<motion.span
					aria-hidden='true'
					data-slot='tabs-indicator'
					layoutId='tabs-indicator'
					transition={resolve(layoutSpring)}
					className='pointer-events-none absolute inset-x-0 bottom-[-2px] h-0.5 bg-foreground'
				/>
			) : null}
		</TabsPrimitive.Trigger>
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
