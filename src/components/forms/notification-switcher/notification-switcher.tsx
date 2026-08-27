import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Bell, BellOff, Mail, MessageCircleMore } from "lucide-react";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/forms/switch";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";

const notificationSwitcherVariants = cva(
	"flex w-full items-center gap-4 rounded-full pr-2 transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
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

type NotificationSwitcherProps = Omit<
	React.ComponentProps<"div">,
	"onChange"
> &
	VariantProps<typeof notificationSwitcherVariants> & {
		/** Row label. Figma `Allow Notifications`. */
		label: string;
		/** Which channel icon shows the highlighted/brand treatment (Figma's orange WhatsApp slot). */
		activeChannel?: NotificationChannel;
		/** Notifications on/off. Drives the trailing `Switch`. */
		checked?: boolean;
		/** Called when the switch is toggled. */
		onCheckedChange?: (checked: boolean) => void;
		/** Figma `States=Disabled`. Dims the row, swaps the bell for bell-off, and disables the switch. */
		disabled?: boolean;
	};

/**
 * Notification channel row with a bell icon, label, channel icons
 * (email/SMS/WhatsApp), and a toggle switch. Figma: bethere.ds
 * `notification switcher` (States=Active/Hover/Disabled).
 */
function NotificationSwitcher({
	className,
	label,
	activeChannel = "whatsapp",
	checked,
	onCheckedChange,
	disabled = false,
	...props
}: NotificationSwitcherProps) {
	return (
		<div
			data-slot="notification-switcher"
			data-disabled={disabled}
			aria-disabled={disabled}
			className={cn(
				notificationSwitcherVariants({ disabled, className }),
				!disabled && "hover:bg-state-hover",
			)}
			{...props}
		>
			<div
				className={cn(
					"flex shrink-0 items-center justify-center rounded-full p-[10px] text-icon",
					disabled ? "bg-background text-icon-muted" : "bg-primary-muted",
				)}
			>
				{disabled ? <BellOff /> : <Bell />}
			</div>
			<p
				className={cn(
					"flex-1 text-base leading-6 font-medium",
					disabled ? "text-muted-foreground" : "text-foreground",
				)}
			>
				{label}
			</p>
			<div className="flex shrink-0 items-center gap-[30px] px-24">
				{(["email", "sms", "whatsapp"] as const).map((channel) => (
					<div
						key={channel}
						className={cn(
							"flex size-10 shrink-0 items-center justify-center rounded-full text-icon",
							channel === activeChannel && !disabled
								? "bg-primary-muted"
								: "bg-background",
						)}
					>
						{channelIcons[channel]}
					</div>
				))}
			</div>
			<Switch
				className="shrink-0"
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
			/>
		</div>
	);
}

export { NotificationSwitcher, notificationSwitcherVariants };
export type { NotificationSwitcherProps, NotificationChannel };
