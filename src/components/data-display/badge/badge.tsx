import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-badge font-normal [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			// Figma: Color
			color: {
				gray: "bg-badge-gray-bg text-badge-gray-fg",
				red: "bg-badge-red-bg text-badge-red-fg",
				yellow: "bg-badge-yellow-bg text-badge-yellow-fg",
				green: "bg-badge-green-bg text-badge-green-fg",
				blue: "bg-badge-blue-bg text-badge-blue-fg",
				purple: "bg-badge-purple-bg text-badge-purple-fg",
				violet: "bg-badge-violet-bg text-badge-violet-fg",
				pink: "bg-badge-pink-bg text-badge-pink-fg",
				orange: "bg-badge-orange-bg text-badge-orange-fg",
				amber: "bg-badge-amber-bg text-badge-amber-fg",
			},
			// Figma: Size
			size: {
				sm: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-2.5",
				lg: "h-7 gap-1 px-2.5 text-sm [&_svg:not([class*='size-'])]:size-2.5",
			},
		},
		defaultVariants: {
			color: "gray",
			size: "lg",
		},
	},
);

/**
 * A pill-shaped status/category label in one of ten tint colors, with an
 * optional dismiss affordance. Origin: Figma "badge".
 */
function Badge({
	className,
	color = "gray",
	size = "lg",
	asChild = false,
	showX = false,
	onDismiss,
	children,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
		/** Shows a dismiss "x" affordance at the end of the badge. */
		showX?: boolean;
		/** Called when the dismiss "x" is activated. Requires `showX`. */
		onDismiss?: () => void;
	}) {
	const Comp = asChild ? Slot.Root : "span";

	return (
		<Comp
			data-slot='badge'
			data-color={color}
			data-size={size}
			className={cn(badgeVariants({ color, size, className }))}
			{...props}
		>
			{children}
			{showX && (
				<button
					type='button'
					onClick={onDismiss}
					aria-label='Remove'
					className='-mr-0.5 inline-flex shrink-0 rounded-full opacity-50 outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[2px] focus-visible:ring-ring/50'
				>
					<XIcon className='size-2.5' />
				</button>
			)}
		</Comp>
	);
}

export { Badge, badgeVariants };
