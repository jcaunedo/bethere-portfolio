import * as React from "react";

/**
 * Outline Home icon — the Default-state icon of the Home `SidebarMenuItem`
 * (Figma: bethere.ds `home-line`, node 62:938); `HomeSolidIcon` is its Active-state counterpart.
 * Strokes with `currentColor`, so it takes the item's color.
 */
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={18}
			height={18}
			viewBox="0 0 18 18"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M6 12.75H12M8.26328 2.073L3.17654 6.02934L3.17653 6.02935C2.83651 6.29382 2.6665 6.42605 2.54402 6.59165C2.43553 6.73833 2.3547 6.90358 2.30552 7.07929C2.25 7.27764 2.25 7.49302 2.25 7.92382V13.35C2.25 14.1901 2.25 14.6101 2.41349 14.931C2.5573 15.2132 2.78677 15.4427 3.06902 15.5865C3.38988 15.75 3.80992 15.75 4.65 15.75H13.35C14.1901 15.75 14.6102 15.75 14.931 15.5865C15.2132 15.4427 15.4427 15.2132 15.5865 14.931C15.75 14.6101 15.75 14.1901 15.75 13.35V7.92382C15.75 7.49302 15.75 7.27764 15.6945 7.07929C15.6453 6.90358 15.5645 6.73833 15.456 6.59165C15.3335 6.42605 15.1635 6.29381 14.8235 6.02935L9.73672 2.073C9.47325 1.86806 9.34148 1.76559 9.19598 1.7262C9.06765 1.69145 8.93235 1.69145 8.80402 1.7262C8.65852 1.76559 8.52675 1.86806 8.26328 2.073Z" />
		</svg>
	);
}

export { HomeIcon };
