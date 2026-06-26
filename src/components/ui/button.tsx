import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				// Solid (Default)
				default: "bg-primary text-primary-foreground hover:bg-sunset-600",
				// Destructive (default — light-red fill, red text)
				destructive:
					"bg-destructive-subtle text-destructive hover:bg-[color-mix(in_srgb,var(--destructive-subtle)_92%,var(--destructive))] focus-visible:ring-destructive/20",
				// Destructive-Solid (alternative — solid red, white text)
				destructiveSolid:
					"bg-destructive text-white hover:bg-[color-mix(in_srgb,var(--destructive)_90%,black)] focus-visible:ring-destructive/20",
				// Flat (Secondary)
				secondary: "bg-accent text-accent-foreground hover:bg-neutral-200",
				// Outlined
				outline:
					"border border-border bg-card text-foreground shadow-xs hover:bg-accent",
				// Ghost
				ghost: "bg-transparent text-foreground hover:bg-accent",
				// Link
				link: "bg-transparent text-primary underline-offset-4 hover:underline",
			},
			size: {
				xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: "h-7 gap-1 rounded-[10px] px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
				md: "h-8 gap-1.5 rounded-xl px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
				lg: "h-9 gap-1.5 rounded-xl px-3.5 text-sm [&_svg:not([class*='size-'])]:size-4",
				xl: "h-10 gap-2 rounded-xl px-4 text-base [&_svg:not([class*='size-'])]:size-4",
				"icon-xs":
					"size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
				"icon-sm":
					"size-7 rounded-[10px] [&_svg:not([class*='size-'])]:size-3.5",
				icon: "size-8 rounded-xl [&_svg:not([class*='size-'])]:size-4",
				"icon-lg":
					"size-9 rounded-xl [&_svg:not([class*='size-'])]:size-4",
				"icon-xl":
					"size-10 rounded-xl [&_svg:not([class*='size-'])]:size-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "lg",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "md",
	asChild = false,
	loading = false,
	disabled,
	children,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		loading?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot='button'
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			disabled={asChild ? undefined : disabled || loading}
			{...props}
		>
			{asChild ? (
				children
			) : (
				<>
					{loading && (
						<span
							className='inline-block size-[1em] animate-spin rounded-full border-2 border-current border-t-transparent'
							aria-hidden='true'
						/>
					)}
					{children}
				</>
			)}
		</Comp>
	);
}

export { Button, buttonVariants };
