import * as React from "react";

/**
 * Solid (filled) Documents icon — the Active-state counterpart of its outline icon in a
 * `SidebarMenuItem` (Figma: bethere.ds `file-text-solid`, node 934:4748). Fills with `currentColor`, so it
 * takes the item's color.
 */
function FileTextSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M15 1C15.2652 1 15.5195 1.10543 15.707 1.29297L20.707 6.29297C20.8946 6.4805 21 6.73478 21 7V20C21 20.7957 20.6837 21.5585 20.1211 22.1211C19.5585 22.6837 18.7957 23 18 23H6C5.20435 23 4.44152 22.6837 3.87891 22.1211C3.3163 21.5585 3 20.7957 3 20V4C3 3.20435 3.3163 2.44152 3.87891 1.87891C4.44152 1.3163 5.20435 1 6 1H15ZM8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16H8ZM8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14H16C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12H8ZM8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10H10C10.5523 10 11 9.55228 11 9C11 8.44772 10.5523 8 10 8H8ZM15 6C15 6.26522 15.1054 6.51949 15.293 6.70703C15.4805 6.89457 15.7348 7 16 7H18.5859L15 3.41406V6Z" />
		</svg>
	);
}

export { FileTextSolidIcon };
