import * as React from "react";

/**
 * Panel-left icon with a short divider — the expanded Sidebar's collapse toggle (Figma: bethere.ds
 * `panel-left-alt`, node 956:4254). Strokes with `currentColor`, so it takes the button's color.
 */
function PanelLeftAltIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M8 7V17M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" />
		</svg>
	);
}

export { PanelLeftAltIcon };
