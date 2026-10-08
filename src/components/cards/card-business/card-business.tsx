import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { BuildingIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge, type badgeVariants } from "@/components/data-display/badge";

const cardBusinessVariants = cva(
	// Figma: Property 1=Default/Hover/Mobile. Hover binds bg to
	// color/states/hover (--state-hover, a ~3% sand-900 tint) — border,
	// shadow, and radius stay the same as Default. Below `md` (Mobile), the
	// badge + chevron move into the info column as a full-width row instead
	// of trailing outside it, so the outer gap only applies at `md` and up.
	"flex w-full items-center rounded-card border border-border bg-card py-6 pl-6 pr-8 text-left shadow-xs outline-none transition-colors hover:bg-state-hover focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:gap-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
);

type CardBusinessProps = Omit<React.ComponentProps<"button">, "title"> &
	VariantProps<typeof cardBusinessVariants> & {
		/** Render as a child element (e.g. an `<a>`) instead of a `<button>`. */
		asChild?: boolean;
		/** Business name (Figma: header text). */
		name: React.ReactNode;
		/** Business address, rendered after an "Address:" label. */
		address: React.ReactNode;
		/** Business owner, rendered after an "Owner:" label. */
		owner: React.ReactNode;
		/** Trailing badge label (Figma default: "Approved"). */
		badgeLabel: React.ReactNode;
		/** Trailing badge color (Figma default: "green"). */
		badgeColor?: NonNullable<VariantProps<typeof badgeVariants>["color"]>;
	};

/**
 * Clickable business summary row: name, address, owner, a status badge, and
 * a trailing disclosure chevron. Translated from Figma `card-business`
 * (bethere.ds).
 */
function CardBusiness({
	className,
	asChild = false,
	name,
	address,
	owner,
	badgeLabel,
	badgeColor = "green",
	disabled,
	children,
	...props
}: CardBusinessProps) {
	const Comp = asChild ? Slot.Root : "button";

	const badge = (
		<Badge color={badgeColor} size='lg' className='shrink-0'>
			{badgeLabel}
		</Badge>
	);
	const chevron = <ChevronRightIcon className='size-5 shrink-0 text-icon-subtle' />;

	const content = (
		<>
			<div className='flex min-w-0 flex-1 flex-col items-start gap-4'>
				<div className='flex w-full items-center gap-4'>
					{/* `building`, the same icon as the settings menu's Business row and the Business Profile heading. */}
					<BuildingIcon className='size-5 shrink-0 text-foreground' />
					<span className='min-w-0 flex-1 truncate font-sans text-lg font-semibold tracking-[0.18px] text-foreground'>
						{name}
					</span>
				</div>
				<div className='flex w-full flex-col text-sm text-muted-foreground'>
					<p className='truncate'>
						Address: <span className='text-foreground'>{address}</span>
					</p>
					<p className='truncate'>
						Owner: <span className='text-foreground'>{owner}</span>
					</p>
				</div>
				{/* Figma: Property 1=Mobile — badge + chevron sit inside the info
				    column as a full-width row below `md`, instead of trailing
				    outside it like Default/Hover. */}
				<div className='flex w-full items-center justify-between md:hidden'>
					{badge}
					{chevron}
				</div>
			</div>
			<span className='hidden md:contents'>
				{badge}
				{chevron}
			</span>
		</>
	);

	return (
		<Comp
			data-slot='card-business'
			className={cn(cardBusinessVariants({ className }))}
			disabled={asChild ? undefined : disabled}
			{...props}
		>
			{asChild ? (
				<>
					<Slot.Slottable>{children}</Slot.Slottable>
					{content}
				</>
			) : (
				content
			)}
		</Comp>
	);
}

export { CardBusiness, cardBusinessVariants, type CardBusinessProps };
