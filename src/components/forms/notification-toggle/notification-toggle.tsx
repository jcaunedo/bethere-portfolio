import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Bell, BellOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/forms/switch";

const notificationToggleVariants = cva(
	"flex w-full items-center gap-4 rounded-full pr-2 transition-[background-color,box-shadow] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
	{
		variants: {
			disabled: {
				false: "",
				true: "pointer-events-none",
			},
		},
		defaultVariants: {
			disabled: false,
		},
	},
);

type NotificationToggleProps = Omit<
	React.ComponentProps<"button">,
	"onChange" | "onClick"
> &
	VariantProps<typeof notificationToggleVariants> & {
		/** Row label. Figma `Allow Notifications`. */
		label: string;
		/**
		 * Notifications on/off. Drives the trailing `Switch` plus the row's own
		 * on/off treatment (bell vs. bell-off icon, muted text/icon). Figma's
		 * `States=Active` (checked) vs. `States=Disabled` (unchecked) are this
		 * same toggle, not a separate blocked-interaction state — see
		 * `disabled` below for that.
		 */
		checked?: boolean;
		/** Initial checked state when uncontrolled. */
		defaultChecked?: boolean;
		/** Called when the switch is toggled. */
		onCheckedChange?: (checked: boolean) => void;
		/** Blocks interaction entirely — the row can't be toggled at all. */
		disabled?: boolean;
		/**
		 * Overrides the leading bell/bell-off icon (Figma `icon` override on
		 * `notification-toggle`) — e.g. a channel-specific glyph like Mail or
		 * MessageCircle for a delivery-channel row. Defaults to Bell (checked)
		 * / BellOff (unchecked).
		 */
		icon?: React.ReactNode;
		/**
		 * Renders the row as off — bell-off icon, muted label, switch shown
		 * unchecked — regardless of the real `checked`, but stays clickable: a
		 * click anywhere on the row calls `onLockedInteraction` instead of
		 * changing the row's own state. The real `checked` is preserved
		 * underneath and reappears as soon as `locked` is false again. For a
		 * row whose on/off state is governed by something else (e.g. a set of
		 * delivery-channel toggles above it) and should hand control back to
		 * that instead of toggling itself.
		 */
		locked?: boolean;
		/** Called when the row is clicked anywhere while `locked`. */
		onLockedInteraction?: () => void;
	};

/**
 * Simple notification row with a bell icon, label, and a toggle switch — no
 * channel selector. Figma: bethere.ds `notification-toggle`
 * (States=Active/Hover/Disabled — Active/Disabled are this component's
 * checked/unchecked appearance, not interaction-blocking; Hover is a hover
 * treatment on top of either). A stripped-down sibling of
 * `NotificationSwitcher`, which additionally exposes per-channel toggles.
 */
function NotificationToggle({
	className,
	label,
	checked,
	defaultChecked = false,
	onCheckedChange,
	disabled = false,
	icon,
	locked = false,
	onLockedInteraction,
	...props
}: NotificationToggleProps) {
	const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
	const isControlled = checked !== undefined;
	const isChecked = isControlled ? checked : uncontrolledChecked;

	function toggle() {
		if (disabled) return;
		if (locked) {
			onLockedInteraction?.();
			return;
		}
		const next = !isChecked;
		if (!isControlled) setUncontrolledChecked(next);
		onCheckedChange?.(next);
	}

	// Locked always displays as off — the real isChecked stays intact
	// underneath (untouched by the locked click handler above) and reappears
	// the instant `locked` goes back to false.
	const displayChecked = locked ? false : isChecked;

	return (
		<button
			type="button"
			role="switch"
			aria-checked={displayChecked}
			data-slot="notification-toggle"
			data-disabled={disabled}
			data-locked={locked}
			disabled={disabled}
			onClick={toggle}
			className={cn(
				notificationToggleVariants({ disabled, className }),
				"text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
				locked && "opacity-50",
				!disabled &&
					!locked &&
					"hover:bg-state-hover hover:shadow-[0_0_0_8px_var(--color-state-hover)]",
			)}
			{...props}
		>
			<div
				className={cn(
					"flex shrink-0 items-center justify-center rounded-full p-[10px]",
					displayChecked ? "bg-primary-muted text-icon-primary" : "bg-background text-icon-muted",
				)}
			>
				{icon ?? (displayChecked ? <Bell /> : <BellOff />)}
			</div>
			<p
				className={cn(
					"flex-1 text-base leading-6 font-medium",
					displayChecked ? "text-foreground" : "text-muted-foreground",
				)}
			>
				{label}
			</p>
			<Switch
				className="pointer-events-none shrink-0"
				checked={displayChecked}
				tabIndex={-1}
			/>
		</button>
	);
}

export { NotificationToggle, notificationToggleVariants };
export type { NotificationToggleProps };
