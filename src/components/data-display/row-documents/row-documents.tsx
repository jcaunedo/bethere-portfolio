import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FileTextIcon, EllipsisIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { AvatarFiles } from "@/components/data-display/avatar-files";
import { Badge, type badgeVariants } from "@/components/data-display/badge";
import { Button } from "@/components/buttons/button";

const rowDocumentsVariants = cva(
	// Figma: Property 1=Default/hover. Hover binds bg to color/states/hover
	// (--state-hover) — border stays the same as Default.
	"flex w-full items-center gap-8 border-b border-border px-3 py-4 text-left transition-colors hover:bg-state-hover",
);

type RowDocumentsProps = Omit<React.ComponentProps<"a">, "onClick" | "href"> &
	VariantProps<typeof rowDocumentsVariants> & {
		/** Leading icon (Figma: e.g. "file-text, doc", "id-card"). Defaults to a file icon. */
		icon?: React.ComponentType<{ className?: string }>;
		/** Document name (Figma: e.g. "Business license"). */
		name: React.ReactNode;
		/** Supporting line below the name (Figma: e.g. "Expires May 15, 2026"). Omit to render no description. */
		description?: React.ReactNode;
		/** Trailing status badge label (Figma: e.g. "Expired"). Omit to render no badge. */
		badgeLabel?: React.ReactNode;
		/** Trailing status badge color (Figma default: "red"). */
		badgeColor?: NonNullable<VariantProps<typeof badgeVariants>["color"]>;
		/**
		 * URL of the document file. When set, the row becomes clickable and
		 * opens the document in a new tab (`target="_blank"`) — the "more
		 * actions" button remains a separate action and does not trigger this.
		 */
		documentUrl?: string;
		/** Called when the "more actions" (ellipsis) button is activated. */
		onMoreActions?: () => void;
	};

/**
 * A document/file list row: a leading icon (file icon by default), name, an
 * optional description, an optional status badge (shown only when the
 * document has a status, e.g. "Expired"), and a trailing "more actions"
 * menu trigger. Translated from Figma `row-documents` (bethere.ds). When
 * `documentUrl` is provided, the row itself is clickable and opens the
 * document in a new tab.
 */
function RowDocuments({
	className,
	icon: Icon = FileTextIcon,
	name,
	description,
	badgeLabel,
	badgeColor = "red",
	documentUrl,
	onMoreActions,
	...props
}: RowDocumentsProps) {
	return (
		<a
			data-slot='row-documents'
			className={cn(rowDocumentsVariants({ className }))}
			href={documentUrl}
			target={documentUrl ? "_blank" : undefined}
			rel={documentUrl ? "noopener noreferrer" : undefined}
			{...props}
		>
			<div className='flex min-w-0 flex-1 items-center gap-3'>
				<AvatarFiles icon={Icon} />
				<div className='flex min-w-0 flex-1 flex-col justify-center'>
					<p className='truncate text-sm font-medium text-foreground'>
						{name}
					</p>
					{description != null && (
						<p className='truncate text-xs text-muted-foreground'>
							{description}
						</p>
					)}
				</div>
			</div>
			{badgeLabel != null && (
				<Badge color={badgeColor} size='lg' className='shrink-0'>
					{badgeLabel}
				</Badge>
			)}
			<Button
				type='button'
				variant='ghost'
				size='icon-sm'
				onClick={(e) => {
					// The row itself is a clickable <a> when documentUrl is set —
					// stop this click from also triggering that navigation.
					e.stopPropagation();
					e.preventDefault();
					onMoreActions?.();
				}}
				aria-label='More actions'
				className='shrink-0'
			>
				<EllipsisIcon />
			</Button>
		</a>
	);
}

export { RowDocuments, rowDocumentsVariants, type RowDocumentsProps };
