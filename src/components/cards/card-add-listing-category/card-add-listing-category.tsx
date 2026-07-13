import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const cardAddListingCategoryVariants = cva(
	// Centered icon → title → description stack on a white card.
	// Figma: card-add-listing-category. The Default/Hover states differ only by
	// the elevation drop-shadow, so Hover is expressed as a `hover:` utility
	// rather than a cva variant.
	"flex w-full max-w-[388px] cursor-pointer flex-col items-center justify-center gap-6 overflow-hidden rounded-xl bg-card px-10 py-12 text-center text-foreground outline-none transition-shadow hover:shadow-[0_4px_30px_0_rgba(0,0,0,0.08)] focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
);

type CardAddListingCategoryProps = Omit<
	React.ComponentProps<"button">,
	"title"
> &
	VariantProps<typeof cardAddListingCategoryVariants> & {
		/** Render as a child element (e.g. an `<a>`) instead of a `<button>`. */
		asChild?: boolean;
		/** Leading icon — rendered at 48px and tinted with the brand `primary` color. */
		icon?: React.ReactNode;
		/** Card heading (Figma: `title`). */
		title?: React.ReactNode;
		/** Supporting line below the title (Figma: `description`). */
		description?: React.ReactNode;
	};

/**
 * Card prompting the user to add a listing category — a clickable card with a
 * centered icon, title and description that elevates on hover.
 * Translated from Figma `card-add-listing-category` (bethere.ds).
 */
function CardAddListingCategory({
	className,
	asChild = false,
	icon,
	title,
	description,
	disabled,
	children,
	...props
}: CardAddListingCategoryProps) {
	const Comp = asChild ? Slot.Root : "button";

	const content = (
		<>
			{icon != null && (
				<span
					data-slot="card-add-listing-category-icon"
					// `text-primary` is the solid fallback; stroke-based icons (the DS
					// default) are painted with the `gradient-1` paint-server below.
					className="relative flex shrink-0 items-center justify-center text-primary [&_svg:not([class*='size-'])]:size-12 [&_svg]:[stroke:url('#bethere-gradient-1')]"
				>
					{/* gradient-1 paint-server — mirrors --gradient-1 in theme.css.
					    Top→bottom coral; CSS gradients can't paint an SVG stroke,
					    so the icon stroke references this <linearGradient> instead. */}
					<svg
						aria-hidden="true"
						width="0"
						height="0"
						className="pointer-events-none absolute size-0"
					>
						<defs>
							<linearGradient
								id="bethere-gradient-1"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop offset="0" stopColor="#f26740" />
								<stop offset="1" stopColor="#ffa47d" />
							</linearGradient>
						</defs>
					</svg>
					{icon}
				</span>
			)}
			<span className="flex w-full flex-col gap-2">
				{title != null && (
					// 2xl / semibold / headline (display) font — Figma `2xl-semibold`.
					<span className="block font-display text-2xl font-semibold text-foreground">
						{title}
					</span>
				)}
				{description != null && (
					// lg / regular / bodytext (sans) font — Figma `lg`.
					<span className="block font-sans text-lg text-muted-foreground">
						{description}
					</span>
				)}
			</span>
		</>
	);

	return (
		<Comp
			data-slot="card-add-listing-category"
			className={cn(cardAddListingCategoryVariants({ className }))}
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

export {
	CardAddListingCategory,
	cardAddListingCategoryVariants,
	type CardAddListingCategoryProps,
};
