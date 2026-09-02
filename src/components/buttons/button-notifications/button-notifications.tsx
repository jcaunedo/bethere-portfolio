import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonNotificationsVariants = cva(
	"inline-flex shrink-0 items-center justify-center rounded-full bg-background text-icon-subtle transition-colors outline-none hover:text-icon focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[current=true]:not-disabled:bg-brand-100 aria-[current=true]:not-disabled:text-icon-primary disabled:pointer-events-none disabled:bg-background disabled:text-icon-subtle disabled:opacity-50 data-[muted=true]:bg-background! data-[muted=true]:text-icon-subtle! data-[muted=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
	active,
	defaultActive = false,
	muted = false,
	onClick,
	icon = <Mail />,
	"aria-label": ariaLabel = "Notifications",
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonNotificationsVariants> & {
		/** Marks the button as the current/opened state (Figma `State=Active`). Omit to let the button manage its own active state on click. */
		active?: boolean;
		/** Initial active state when uncontrolled. */
		defaultActive?: boolean;
		/**
		 * Renders the muted/inactive look regardless of `active` — for a
		 * button that should read as off without being non-interactive
		 * (unlike `disabled`, it stays clickable and focusable).
		 */
		muted?: boolean;
		/** Icon rendered inside the button. Defaults to the Figma `Mail` glyph. */
		icon?: React.ReactNode;
	}) {
	const [uncontrolledActive, setUncontrolledActive] = React.useState(defaultActive);
	const isControlled = active !== undefined;
	const isActive = isControlled ? active : uncontrolledActive;

	const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
		if (!isControlled) {
			setUncontrolledActive((prev) => !prev);
		}
		onClick?.(event);
	};

	return (
		<button
			data-slot='button-notifications'
			data-size={size}
			data-muted={muted}
			aria-current={isActive}
			aria-label={ariaLabel}
			className={cn(buttonNotificationsVariants({ size, className }))}
			onClick={handleClick}
			{...props}
		>
			{icon}
		</button>
	);
}

export { ButtonNotifications, buttonNotificationsVariants };
