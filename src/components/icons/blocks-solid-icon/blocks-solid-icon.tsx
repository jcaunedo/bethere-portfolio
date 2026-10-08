import * as React from "react";

/**
 * Solid (filled) Integrations icon — the Active-state counterpart of its outline icon (lucide
 * `Blocks`) in a `SidebarMenuItem`, e.g. the Integrations row of the Account Settings rail (Figma:
 * bethere.ds `blocks-solid`, node 953:4151). Fills with `currentColor`, so it takes the item's color.
 */
function BlocksSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M11 15V20H16V15H11ZM9 20V15H4V20H9ZM4 8V13H9V8H4ZM11 13H16C16.5304 13 17.039 13.2109 17.4141 13.5859C17.7891 13.961 18 14.4696 18 15V20C18 20.5304 17.7891 21.039 17.4141 21.4141C17.039 21.7891 16.5304 22 16 22H4C3.46957 22 2.96101 21.7891 2.58594 21.4141C2.21086 21.039 2 20.5304 2 20V8C2 7.46957 2.21086 6.96101 2.58594 6.58594C2.96101 6.21087 3.46957 6 4 6H9C9.53043 6 10.039 6.21087 10.4141 6.58594C10.7891 6.96101 11 7.46957 11 8V13ZM22 9C22 10.1046 21.1046 11 20 11H15C13.8954 11 13 10.1046 13 9V4C13 2.89543 13.8954 2 15 2H20C21.1046 2 22 2.89543 22 4V9Z" />
		</svg>
	);
}

export { BlocksSolidIcon };
