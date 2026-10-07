import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { PencilIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

const summaryCardVariants = cva(
	// Figma `summary-card` (bethere.ds 928:4099): color/card/card fill, radius/card, spacing/3 padding,
	// 16px between the thumbnail, the content and the pencil, top-aligned (a wrapped detail or several
	// entries grow the card downward). Hover (Property 1=Hover) adds the `card` shadow — the pencil's
	// hit area covers the whole card, so hovering anywhere on it counts.
	"relative flex items-start gap-4 rounded-card bg-card p-3 transition-shadow has-[[data-slot=summary-card-edit]:hover]:shadow-card",
	{
		variants: {
			// Not in the Figma set yet: TimeSlotAccordion's Required look (bethere.ds 874:1447) — card fill
			// with a 1px color/tone/desctructive/destructive stroke, as an inset ring so the size holds.
			required: {
				true: "inset-ring inset-ring-destructive",
				false: "",
			},
		},
		defaultVariants: { required: false },
	},
);

/** One answer on the card: a value and its optional detail line. */
type SummaryCardEntry = {
	/** The answer itself (Figma `value`, base/medium). */
	value: React.ReactNode;
	/** Supporting line under it (Figma `detail`, sm muted), e.g. "55 ft · 13 guests". */
	detail?: React.ReactNode;
};

type SummaryCardProps = Omit<React.ComponentProps<"div">, "children"> &
	VariantProps<typeof summaryCardVariants> & {
		/** Small uppercase line naming what's summarized (Figma `eyebrow`): "Yacht", "Pricing"… */
		eyebrow: React.ReactNode;
		/** The answer itself (Figma `value`, base/medium). Ignored when `entries` is set. */
		value?: React.ReactNode;
		/** Supporting line under the value (Figma `detail`, sm muted), e.g. "55 ft · 13 guests". */
		detail?: React.ReactNode;
		/**
		 * Several answers under one eyebrow (Figma Property 1=Multiple), e.g. two captains: each a
		 * value + detail pair, 8px apart. Takes the place of `value`/`detail`.
		 */
		entries?: SummaryCardEntry[];
		/** Icon for the 64px thumbnail tile (brand-subtle fill, gradient-1 icon). Ignored when `imageSrc` is set. */
		icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
		/** A photo for the thumbnail instead of an icon (e.g. a listing's cover photo). */
		imageSrc?: string;
		/** Brand pill beside the pencil, e.g. a pricing adjustment ("+15%"). Not in the Figma set yet. */
		badge?: React.ReactNode;
		/** Called by the pencil — anywhere on the card — to go edit what's summarized. */
		onEdit?: () => void;
		/** Accessible name for the pencil. Defaults to "Edit". Make it specific, e.g. "Edit yacht: Little Atocha". */
		editLabel?: string;
	};

/**
 * One summarized answer — or several, under one eyebrow — with a pencil to go back and change it,
 * e.g. a step of the New Listing wizard on its Review step. A 64px thumbnail (icon tile or photo),
 * an uppercase eyebrow over the value(s) and optional detail lines, then the pencil, whose hit area
 * stretches over the whole card (one button, no nested controls).
 * Figma origin: bethere.ds `summary-card` (928:4099 — Default, Hover, Multiple).
 */
function SummaryCard({
	className,
	required = false,
	eyebrow,
	value,
	detail,
	entries,
	icon: Icon,
	imageSrc,
	badge,
	onEdit,
	editLabel = "Edit",
	...props
}: SummaryCardProps) {
	// gradient-1 for the icon stroke — a CSS gradient can't paint an SVG stroke, so it's an SVG paint
	// server (stops mirror --gradient-1 in theme.css). One per card, so the card works on any page.
	// useId's punctuation stripped, so the id is safe inside CSS `url(#…)` (also when server-rendered).
	const gradientId = `summary-card-gradient-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
	const answers = entries ?? [{ value, detail }];

	return (
		<div
			data-slot="summary-card"
			data-required={required || undefined}
			className={cn(summaryCardVariants({ required }), className)}
			{...props}
		>
			{/* Figma `Thumbnail`: 64px, radius/lg, color/tone/brand/subtle fill, 24px gradient-1 icon, in a
			    container with 2px above and below — so it centers on the first 68px (eyebrow + one entry). */}
			{imageSrc ? (
				<img src={imageSrc} alt="" className="my-0.5 size-16 shrink-0 rounded-lg object-cover" />
			) : (
				<div className="my-0.5 flex size-16 shrink-0 items-center justify-center rounded-lg bg-primary-subtle">
					{Icon ? (
						<>
							<svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute size-0">
								<defs>
									{/* In the icon's 24px viewBox, not per shape: a straight line has a zero-size box,
									    so a bounding-box gradient would paint nothing on it. */}
									<linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="24">
										<stop offset="0" stopColor="#f26740" />
										<stop offset="1" stopColor="#ffa47d" />
									</linearGradient>
								</defs>
							</svg>
							<Icon aria-hidden="true" className="size-6 text-primary" style={{ stroke: `url(#${gradientId})` }} />
						</>
					) : null}
				</div>
			)}

			{/* Figma `Content`: 4px under the eyebrow; entries 8px apart (spacing/2); each value sits right
			    on top of its detail, no gap. */}
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				{/* No 10px type token: Figma's literal headline 10/18, +0.4px tracking, uppercase, muted. */}
				<span className="font-display text-[10px] leading-[18px] tracking-[0.04em] text-muted-foreground uppercase">
					{eyebrow}
				</span>
				<div className="flex min-w-0 flex-col gap-2">
					{answers.map((entry, index) => (
						<div key={index} className="flex min-w-0 flex-col">
							{/* Figma `base/base -medium` (16/24). */}
							<Typography size="base" weight="medium" className="truncate">
								{entry.value}
							</Typography>
							{entry.detail != null ? (
								// Figma `sm/sm` (14/22) in color/foreground/muted. Wraps onto more lines (breaking
								// long words) instead of truncating; the card grows downward.
								<Typography size="sm" className="break-words text-muted-foreground">
									{entry.detail}
								</Typography>
							) : null}
						</div>
					))}
				</div>
			</div>

			{/* Pills + pencil, centered on the first 68px like the thumbnail (Figma: the pencil button
			    stretches to at most 68px, its icon centered). Not positioned, so the pencil's hit area
			    still stretches over the whole card. */}
			<div className="flex h-[68px] shrink-0 items-center gap-4">
				{/* Same pill as the Pricing step's season cards: color/tone/brand/subtle fill, brand xs label. */}
				{badge != null ? (
					<span className="shrink-0 rounded-full bg-primary-subtle px-2 py-0.5 text-xs leading-[18px] whitespace-nowrap text-primary">
						{badge}
					</span>
				) : null}
				{/* Same pill as TimeSlotAccordion's Required row: color/tone/danger fill + label. */}
				{required ? (
					<span className="shrink-0 rounded-full bg-danger-05 px-2 py-0.5 text-xs leading-[18px] whitespace-nowrap text-danger">
						Required
					</span>
				) : null}
				{/* Figma `button` (32px, radius/button-md, 16px pencil): color/icon/subtle; on hover
				    color/icon/foreground, with no fill. `after:` stretches the hit area over the card. */}
				<Button
					type="button"
					variant="ghost"
					size="icon"
					data-slot="summary-card-edit"
					className="text-icon-subtle after:absolute after:inset-0 after:rounded-card hover:bg-transparent hover:text-icon-foreground"
					aria-label={editLabel}
					onClick={onEdit}
				>
					<PencilIcon />
				</Button>
			</div>
		</div>
	);
}

export { SummaryCard, summaryCardVariants };
export type { SummaryCardEntry, SummaryCardProps };
