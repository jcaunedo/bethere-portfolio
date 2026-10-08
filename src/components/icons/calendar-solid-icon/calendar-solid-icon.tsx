import * as React from "react";

/**
 * Solid (filled) Calendar icon — the Active-state counterpart of its outline icon in a
 * `SidebarMenuItem` (Figma: bethere.ds `calendar-alt-solid`, node 934:4744). Fills with `currentColor`, so it
 * takes the item's color.
 */
function CalendarSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M16 1C16.5523 1 17 1.44772 17 2V3H19C20.6569 3 22 4.34315 22 6V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V6C2 4.34315 3.34315 3 5 3H7V2C7 1.44772 7.44772 1 8 1C8.55228 1 9 1.44772 9 2V3H15V2C15 1.44772 15.4477 1 16 1ZM5 5C4.44772 5 4 5.44772 4 6V9H20V6C20 5.44771 19.5523 5 19 5H17V6C17 6.55228 16.5523 7 16 7C15.4477 7 15 6.55228 15 6V5H9V6C9 6.55228 8.55228 7 8 7C7.44772 7 7 6.55228 7 6V5H5Z" />
		</svg>
	);
}

export { CalendarSolidIcon };
