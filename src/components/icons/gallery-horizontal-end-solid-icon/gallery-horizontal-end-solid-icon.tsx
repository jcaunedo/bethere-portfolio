import * as React from "react";

/**
 * Solid (filled) Listings icon — the Active-state counterpart of its outline icon in a
 * `SidebarMenuItem` (Figma: bethere.ds `gallery-horizontal-end-solid`, node 934:4658). Fills with `currentColor`, so it
 * takes the item's color.
 */
function GalleryHorizontalEndSolidIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			{...props}
		>
			<path fillRule="evenodd" clipRule="evenodd" d="M9 5C9 3.34315 10.3431 2 12 2H20C21.6569 2 23 3.34315 23 5V19C23 20.6569 21.6569 22 20 22H12C10.3431 22 9 20.6569 9 19V5ZM6 4C6.55228 4 7 4.44772 7 5V19C7 19.5523 6.55228 20 6 20C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM2 6C2.55228 6 3 6.44772 3 7V17C3 17.5523 2.55228 18 2 18C1.44772 18 1 17.5523 1 17V7C1 6.44772 1.44772 6 2 6Z" />
		</svg>
	);
}

export { GalleryHorizontalEndSolidIcon };
