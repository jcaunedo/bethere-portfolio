import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Bell, BellOff, Mail, MessageCircleMore } from "lucide-react";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/forms/switch";
import { ButtonNotifications } from "@/components/buttons/button-notifications";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";

const notificationSwitcherVariants = cva(
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

type NotificationChannel = "email" | "sms" | "whatsapp";

const channelIcons: Record<NotificationChannel, React.ReactNode> = {
	email: <Mail />,
	sms: <MessageCircleMore />,
	whatsapp: <WhatsappIcon />,
};

const channelLabels: Record<NotificationChannel, string> = {
	email: "Email",
	sms: "SMS",
	whatsapp: "WhatsApp",
};

type NotificationSwitcherProps = Omit<
	React.ComponentProps<"div">,
	"onChange"
> &
	VariantProps<typeof notificationSwitcherVariants> & {
		/** Row label. Figma `Allow Notifications`. */
		label: string;
		/**
		 * Which channel icons show the highlighted/active treatment. Each
		 * channel button is independently clickable and toggles itself
		 * unless this is passed (controlled). While the row is off, any
		 * channel click just turns the row back on (that channel's own
		 * active/inactive state is unchanged, since it's shown muted rather
		 * than live while off) — while on, clicking toggles that channel's
		 * membership, and deactivating the last active one turns the row
		 * off instead of leaving it checked with nothing selected.
		 */
		activeChannels?: NotificationChannel[];
		/** Initial active channels when uncontrolled. */
		defaultActiveChannels?: NotificationChannel[];
		/** Called with the updated set whenever a channel button is clicked. */
		onActiveChannelsChange?: (channels: NotificationChannel[]) => void;
		/**
		 * Notifications on/off. Drives the trailing `Switch` plus the row's
		 * own on/off treatment (bell vs. bell-off icon, muted text/icons,
		 * channel-icon highlight) — Figma's `States=Active` (checked) vs.
		 * `States=Disabled` (unchecked) are this same toggle, not a
		 * separate blocked-interaction state. See `disabled` below for
		 * that. Omit to let the row manage its own checked state, coupled
		 * to `activeChannels` per the rules on `onCheckedChange`.
		 */
		checked?: boolean;
		/** Initial checked state when uncontrolled. */
		defaultChecked?: boolean;
		/**
		 * Called when the switch is toggled, or implicitly when a channel
		 * click changes the row's on/off state (see `onActiveChannelsChange`).
		 * Turning on with no active channel defaults `activeChannels` to
		 * `["email"]`; turning off leaves `activeChannels` untouched so it's
		 * restored if the row is re-enabled.
		 */
		onCheckedChange?: (checked: boolean) => void;
		/** Blocks interaction entirely (the row can't be toggled at all, not even to call `onLockedInteraction`) — distinct from `checked={false}`, which is the normal "notifications off" appearance, and from `locked` below. */
		disabled?: boolean;
		/**
		 * Renders the row as off — bell-off icon, muted label, switch shown
		 * unchecked, channel buttons muted — regardless of the real
		 * `checked`/`activeChannels`, but stays clickable: a click anywhere
		 * on the row (switch or a channel button) calls `onLockedInteraction`
		 * instead of changing the row's own state. The real `checked`/
		 * `activeChannels` are preserved underneath and reappear as soon as
		 * `locked` is false again. For a row whose on/off state is governed
		 * by something else (e.g. a master switch above it) and should hand
		 * control back to that instead of toggling itself.
		 */
		locked?: boolean;
		/** Called when the row is clicked anywhere while `locked`. */
		onLockedInteraction?: () => void;
	};

/**
 * Notification channel row with a bell icon, label, channel icons
 * (email/SMS/WhatsApp), and a toggle switch. Figma: bethere.ds
 * `notification switcher` (States=Active/Hover/Disabled — Active/Disabled
 * are this component's checked/unchecked appearance, not interaction-
 * blocking; Hover is a hover treatment on top of either).
 */
function NotificationSwitcher({
	className,
	label,
	activeChannels,
	defaultActiveChannels = [],
	onActiveChannelsChange,
	checked,
	defaultChecked = false,
	onCheckedChange,
	disabled = false,
	locked = false,
	onLockedInteraction,
	...props
}: NotificationSwitcherProps) {
	const [uncontrolledActiveChannels, setUncontrolledActiveChannels] =
		React.useState(defaultActiveChannels);
	const isChannelsControlled = activeChannels !== undefined;
	const currentActiveChannels = isChannelsControlled
		? activeChannels
		: uncontrolledActiveChannels;

	const [uncontrolledChecked, setUncontrolledChecked] =
		React.useState(defaultChecked);
	const isCheckedControlled = checked !== undefined;
	const isChecked = isCheckedControlled ? checked : uncontrolledChecked;

	function commit(nextChecked: boolean, nextActiveChannels: NotificationChannel[]) {
		if (!isCheckedControlled) setUncontrolledChecked(nextChecked);
		if (!isChannelsControlled) setUncontrolledActiveChannels(nextActiveChannels);
		if (nextChecked !== isChecked) onCheckedChange?.(nextChecked);
		onActiveChannelsChange?.(nextActiveChannels);
	}

	// Turning the switch on with no channel active defaults to Email, since a
	// checked row with zero active channels would deliver nothing — turning
	// it off just leaves whichever channels were selected untouched so they
	// reappear if the row is re-enabled.
	function handleCheckedChange(nextChecked: boolean) {
		if (locked) {
			onLockedInteraction?.();
			return;
		}
		const nextActiveChannels =
			nextChecked && currentActiveChannels.length === 0
				? (["email"] as NotificationChannel[])
				: currentActiveChannels;
		commit(nextChecked, nextActiveChannels);
	}

	// While the row is off, any channel click just turns the row back on —
	// the channel's own active/inactive membership doesn't change, since a
	// muted button while off isn't a live toggle (see `muted` below). While
	// the row is on, clicking toggles that channel's membership normally;
	// deactivating the last active one turns the row off instead of leaving
	// it checked with nothing selected.
	function handleChannelClick(channel: NotificationChannel) {
		if (locked) {
			onLockedInteraction?.();
			return;
		}
		if (!isChecked) {
			const nextActiveChannels = currentActiveChannels.includes(channel)
				? currentActiveChannels
				: [...currentActiveChannels, channel];
			commit(true, nextActiveChannels);
			return;
		}

		const isActive = currentActiveChannels.includes(channel);
		const nextActiveChannels = isActive
			? currentActiveChannels.filter((c) => c !== channel)
			: [...currentActiveChannels, channel];
		const nextChecked = nextActiveChannels.length > 0;
		commit(nextChecked, nextActiveChannels);
	}

	// Locked always displays as off — the real isChecked/currentActiveChannels
	// stay intact underneath (untouched by the locked click handlers above)
	// and reappear the instant `locked` goes back to false.
	const displayChecked = locked ? false : isChecked;
	const displayActiveChannels = locked ? [] : currentActiveChannels;

	return (
		<div
			data-slot="notification-switcher"
			data-disabled={disabled}
			data-locked={locked}
			aria-disabled={disabled}
			className={cn(
				notificationSwitcherVariants({ disabled, className }),
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
					displayChecked
						? "bg-primary-muted text-icon-primary"
						: "bg-background text-icon-muted",
				)}
			>
				{displayChecked ? <Bell /> : <BellOff />}
			</div>
			<p
				className={cn(
					"flex-1 text-base leading-6 font-medium",
					displayChecked ? "text-foreground" : "text-muted-foreground",
				)}
			>
				{label}
			</p>
			<div className="flex shrink-0 items-center gap-[30px] px-24">
				{(["email", "sms", "whatsapp"] as const).map((channel) => (
					<ButtonNotifications
						key={channel}
						icon={channelIcons[channel]}
						aria-label={channelLabels[channel]}
						active={displayActiveChannels.includes(channel)}
						muted={!displayChecked}
						disabled={disabled}
						onClick={() => handleChannelClick(channel)}
					/>
				))}
			</div>
			<Switch
				className="shrink-0"
				checked={displayChecked}
				onCheckedChange={handleCheckedChange}
				disabled={disabled}
			/>
		</div>
	);
}

export { NotificationSwitcher, notificationSwitcherVariants };
export type { NotificationSwitcherProps, NotificationChannel };
