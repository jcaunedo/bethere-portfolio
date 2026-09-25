import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/data-display/badge";
import { Typography } from "@/components/typography";

// Figma `Match Card` State=Default; State=Variant2 is the hover/focus treatment
// (card shadow + chevron in brand), expressed as state utilities, not a variant.
const matchCardVariants = cva(
	"group flex w-full items-center overflow-hidden rounded-card bg-card p-3 text-left outline-none transition-shadow hover:shadow-card focus-visible:shadow-card focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
);

type MatchCardProps = Omit<React.ComponentProps<"button">, "children"> &
	VariantProps<typeof matchCardVariants> & {
		/** Thumbnail source (3:2, 64px tall). A muted placeholder renders when omitted. */
		image?: string;
		/** Thumbnail alt text; empty by default since `name` already labels the card. */
		imageAlt?: string;
		/** Match title, e.g. the yacht model (Figma: `name`). */
		name: React.ReactNode;
		/** Secondary facts shown as one muted line, separated by "·" (Figma: `detail-1 · detail-2 …`). */
		details?: React.ReactNode[];
		/** Optional green pill next to the name, e.g. "Best match" (Figma `showBadge`). */
		badge?: React.ReactNode;
	};

/**
 * Selectable search-result row: thumbnail, name with an optional badge, a
 * muted details line, and a trailing chevron. Translated from bethere.ds
 * `Match Card` (State=Default/Variant2 — Variant2 is hover).
 */
function MatchCard({
	className,
	image,
	imageAlt = "",
	name,
	details = [],
	badge,
	...props
}: MatchCardProps) {
	return (
		<button
			type="button"
			data-slot="match-card"
			className={cn(matchCardVariants({ className }))}
			{...props}
		>
			<span className="flex min-w-0 flex-1 items-center gap-4">
				<span className="aspect-[3/2] h-16 shrink-0 overflow-hidden rounded-lg bg-muted">
					{image != null ? (
						<img src={image} alt={imageAlt} className="size-full object-cover" />
					) : null}
				</span>
				<span className="flex min-w-0 flex-1 flex-col gap-1">
					<span className="flex min-w-0 items-center gap-2">
						<Typography as="span" size="lg" weight="medium" className="truncate">
							{name}
						</Typography>
						{badge != null ? (
							// Figma `Badge / Flat`: 18px tall, 6px side padding — tighter than Badge sm (24px / 8px).
							<Badge color="green" size="sm" className="h-[18px] px-1.5">
								{badge}
							</Badge>
						) : null}
					</span>
					{details.length > 0 ? (
						<Typography as="span" size="sm" className="truncate text-muted-foreground">
							{details.map((detail, index) => (
								<React.Fragment key={index}>
									{/* Figma separates details with two spaces either side of the dot. */}
									{index > 0 ? "  ·  " : null}
									{detail}
								</React.Fragment>
							))}
						</Typography>
					) : null}
				</span>
			</span>
			<span className="flex shrink-0 items-center px-2">
				<ChevronRightIcon
					aria-hidden="true"
					className="size-5 text-icon-subtle transition-colors group-hover:text-primary group-focus-visible:text-primary"
				/>
			</span>
		</button>
	);
}

export { MatchCard, matchCardVariants };
export type { MatchCardProps };
