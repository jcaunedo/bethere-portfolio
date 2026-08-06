import * as React from "react";
import { cva } from "class-variance-authority";
import { FileTextIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const avatarFilesVariants = cva(
	// Figma: avatar-files, Property 1=File. Single-variant component — a
	// 36px square (radius/xl = 12px, not a circle) with a centered file
	// icon, used as RowDocuments' leading icon slot.
	"flex size-9 shrink-0 items-center justify-center rounded-xl bg-fill-subtle",
);

type AvatarFilesProps = React.ComponentProps<"div"> & {
	/** Icon rendered inside the circle (Figma: "file-text, doc"). Defaults to a file icon. */
	icon?: React.ComponentType<{ className?: string }>;
};

/**
 * A 36px icon-avatar tile (12px rounded corners) — a file icon on a subtle
 * fill background. Translated from Figma `avatar-files` (bethere.ds). Used
 * as `RowDocuments`' leading icon slot.
 */
function AvatarFiles({
	className,
	icon: Icon = FileTextIcon,
	...props
}: AvatarFilesProps) {
	return (
		<div
			data-slot='avatar-files'
			className={cn(avatarFilesVariants({ className }))}
			{...props}
		>
			<Icon className='size-4 text-foreground' />
		</div>
	);
}

export { AvatarFiles, avatarFilesVariants };
