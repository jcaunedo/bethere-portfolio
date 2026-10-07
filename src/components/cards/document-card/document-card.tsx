import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FileTextIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge, type badgeVariants } from "@/components/data-display/badge";

const documentCardVariants = cva(
	// Figma: document-card, Property 1=Default — color/input/fill surface,
	// radius/input (12px), spacing/4 × spacing/2_5 padding, 12px gap.
	// Property 1=Hover adds the `card` effect (--shadow-card).
	"flex w-full items-center gap-3 overflow-hidden rounded-input bg-input-fill px-4 py-2.5 text-left outline-none transition-shadow hover:shadow-card focus-visible:ring-[3px] focus-visible:ring-input-ring-outside",
);

type DocumentCardProps = Omit<React.ComponentProps<"a">, "title" | "href"> &
	VariantProps<typeof documentCardVariants> & {
		/** Icon inside the leading circle (Figma: "Avatar Icon"). Defaults to a file icon. Ignored when `avatar` is set. */
		icon?: React.ComponentType<{ className?: string }>;
		/**
		 * Replaces the leading icon circle (Figma: "Avatar User", hidden by
		 * default) — e.g. `<Avatar size="lg">…</Avatar>`.
		 */
		avatar?: React.ReactNode;
		/** Document name (Figma: "Title"). */
		title: React.ReactNode;
		/** Supporting line below the title (Figma: "Description"). Omit to render no description. */
		description?: React.ReactNode;
		/** Trailing status badge label (Figma: "badge"). Omit to render no badge. */
		badgeLabel?: React.ReactNode;
		/** Trailing status badge color (Figma default: "gray"). */
		badgeColor?: NonNullable<VariantProps<typeof badgeVariants>["color"]>;
		/**
		 * URL of the document file. When set, the card becomes clickable and
		 * opens the document in a new tab (`target="_blank"`) — the dismiss "x"
		 * remains a separate action and does not trigger this.
		 */
		documentUrl?: string;
		/** Called when the dismiss "x" is activated (Figma: "X Button"). Omit to hide the button. */
		onDismiss?: () => void;
		/** Accessible label for the dismiss button. */
		dismissLabel?: string;
	};

/**
 * A document/file card: a leading icon circle (or a user avatar), title, an
 * optional description, an optional status badge, and an optional dismiss
 * "x". Translated from Figma `document-card` (bethere.ds). When `documentUrl`
 * is provided, the card itself is clickable and opens the document in a new
 * tab.
 */
function DocumentCard({
	className,
	icon: Icon = FileTextIcon,
	avatar,
	title,
	description,
	badgeLabel,
	badgeColor = "gray",
	documentUrl,
	onDismiss,
	dismissLabel = "Remove document",
	...props
}: DocumentCardProps) {
	return (
		<a
			data-slot='document-card'
			className={cn(documentCardVariants({ className }))}
			href={documentUrl}
			target={documentUrl ? "_blank" : undefined}
			rel={documentUrl ? "noopener noreferrer" : undefined}
			{...props}
		>
			{avatar ?? (
				// Figma: "Avatar Icon" — 36px circle, color/tone/brand/subtle fill,
				// 18px icon in color/tone/brand/brand.
				<div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary'>
					<Icon className='size-[18px]' />
				</div>
			)}
			<div className='flex min-w-0 flex-1 flex-col break-words text-sm'>
				<p className='font-medium text-foreground'>{title}</p>
				{description != null && (
					<p className='text-muted-foreground'>{description}</p>
				)}
			</div>
			{badgeLabel != null && (
				<Badge color={badgeColor} size='sm'>
					{badgeLabel}
				</Badge>
			)}
			{onDismiss && (
				// Figma: "X Button" — 16px, color/icon/subtle. Hover/focus have no
				// Figma source; matches SortableList/SearchInput's dismiss pattern.
				<button
					type='button'
					onClick={(e) => {
						// The card itself is a clickable <a> when documentUrl is set —
						// stop this click from also opening the document.
						e.stopPropagation();
						e.preventDefault();
						onDismiss();
					}}
					aria-label={dismissLabel}
					className='inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-icon-subtle outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50'
				>
					<XIcon className='size-4' />
				</button>
			)}
		</a>
	);
}

export { DocumentCard, documentCardVariants, type DocumentCardProps };
