import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";

const integrationCardVariants = cva(
	// Figma: card-business "Property 1=Default/Connected". Default lays the
	// icon/title/description and the Connect button out on one row; Connected
	// stacks that same row above a connection-details block, so the gap axis
	// differs by variant (a row gap between icon and button vs. a column gap
	// between the header row and the details block).
	"flex w-full rounded-card border border-border bg-card p-6 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			connected: {
				false: "items-center gap-14",
				true: "flex-col items-start justify-center gap-4",
			},
		},
		defaultVariants: {
			connected: false,
		},
	},
);

type IntegrationCardDetail = {
	/** Detail row label, e.g. "Connected as". Rendered muted, followed by ": ". */
	label: React.ReactNode;
	/** Detail row value, e.g. "lucysmith@gmail.com". Rendered at full foreground contrast. */
	value: React.ReactNode;
	/**
	 * Trailing "Edit" link text, shown after the value when present (Figma:
	 * the "Calendars" row's `Edit` link — not every detail row has one, e.g.
	 * "Connected as" doesn't).
	 */
	editLabel?: React.ReactNode;
	/** Called when the row's edit link is activated. Required alongside `editLabel` to actually render the link. */
	onEditClick?: () => void;
};

type IntegrationCardProps = Omit<React.ComponentProps<"div">, "title"> &
	VariantProps<typeof integrationCardVariants> & {
		/** Provider mark — an `<img>` app icon (e.g. `google-calendar.png`) or an SVG icon component (e.g. `<SlackIcon />`). Figma only shows the Google mark, but the slot is generic and clips/covers to a 40×40 rounded square either way. */
		icon: React.ReactNode;
		/** Integration name (Figma: "Title"). */
		title: React.ReactNode;
		/** Integration summary copy (Figma: "Description"). */
		description: React.ReactNode;
		/**
		 * Connection detail rows, shown only when `connected`. Figma's
		 * "Connection Info Container" is a generic label/value list — the
		 * design's own example happens to be "Connected as" + "Calendar", but
		 * any number of rows renders the same way.
		 */
		details?: IntegrationCardDetail[];
		/** Called when the "Connect" button is activated. Only relevant while `!connected` — the card itself never flips its own state. */
		onConnect?: () => void;
		/** Called when the "Disconnect" button is activated. Only relevant while `connected` — the card itself never flips its own state. */
		onDisconnect?: () => void;
	};

/**
 * Integration summary row: provider icon, name, description, and either a
 * "Connect" action (default) or a "Disconnect" action plus connection
 * details (connected). Purely presentational — `connected` selects which
 * variant renders, and the parent owns the actual connect/disconnect logic
 * via `onConnect`/`onDisconnect`. Figma origin: bethere.ds `integrations-card`
 * (Property 1=Default/Connected).
 */
function IntegrationCard({
	className,
	connected = false,
	icon,
	title,
	description,
	details = [],
	onConnect,
	onDisconnect,
	...props
}: IntegrationCardProps) {
	return (
		<div
			data-slot='integration-card'
			data-connected={connected}
			className={cn(integrationCardVariants({ connected, className }))}
			{...props}
		>
			<div
				className={cn(
					"flex items-center gap-14",
					connected ? "w-full shrink-0" : "min-w-0 flex-1",
				)}
			>
				<div className='flex min-w-0 flex-1 items-start gap-4'>
					<div className='flex h-[50px] shrink-0 items-center'>
						<div className='flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg [&>img]:size-full [&>img]:object-cover [&_svg]:size-12'>
							{icon}
						</div>
					</div>
					<div className='flex min-w-0 flex-1 flex-col items-start justify-center gap-[2px]'>
						<span className='truncate font-sans text-lg font-semibold tracking-[0.18px] text-foreground'>
							{title}
						</span>
						<span className='text-base text-muted-foreground'>
							{description}
						</span>
					</div>
				</div>

				{connected ? (
					<Button
						variant='destructive'
						size='lg'
						className='shrink-0'
						onClick={onDisconnect}
					>
						Disconnect
					</Button>
				) : (
					<Button
						variant='outline'
						size='lg'
						className='shrink-0'
						onClick={onConnect}
					>
						Connect
					</Button>
				)}
			</div>

			{connected && details.length > 0 && (
				<div className='flex flex-col gap-0.5 pl-16 text-sm text-muted-foreground'>
					{details.map((detail, index) => (
						<div key={index} className='flex items-start gap-2'>
							<p>
								{detail.label}: <span className='text-foreground'>{detail.value}</span>
							</p>
							{detail.editLabel && detail.onEditClick && (
								<button
									type='button'
									className='text-primary underline-offset-4 hover:underline'
									onClick={detail.onEditClick}
								>
									{detail.editLabel}
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export { IntegrationCard, integrationCardVariants };
export type { IntegrationCardProps, IntegrationCardDetail };
