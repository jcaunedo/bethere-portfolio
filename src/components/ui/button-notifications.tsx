import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonNotificationsVariants = cva(
	"inline-flex shrink-0 items-center justify-center rounded-full bg-background text-icon-subtle transition-colors outline-none hover:text-icon focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-[current=true]:bg-brand-100 aria-[current=true]:text-icon-primary [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			size: {
				md: "size-10 [&_svg:not([class*='size-'])]:size-5",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

/** Circular icon button for the notifications entry point. Figma: bethere.ds `button-notifications`. */
function ButtonNotifications({
	className,
	size = "md",
	active = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonNotificationsVariants> & {
		/** Marks the button as the current/opened state (Figma `State=Active`). */
		active?: boolean;
	}) {
	return (
		<button
			data-slot='button-notifications'
			data-size={size}
			aria-current={active}
			aria-label='Notifications'
			className={cn(buttonNotificationsVariants({ size, className }))}
			{...props}
		>
			<Mail />
		</button>
	);
}

export { ButtonNotifications, buttonNotificationsVariants };
