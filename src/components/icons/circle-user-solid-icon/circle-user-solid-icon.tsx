import * as React from "react";

/**
 * Solid (filled) My profile icon — the Active-state counterpart of its outline icon (`circle-user`) in a
 * `SidebarMenuItem`, e.g. the Account Settings rail (Figma: bethere.ds `circle-user-solid`, node 946:1694).
 * Fills with `currentColor`, so it takes the item's color.
 */
function CircleUserSolidIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 3C7.02944 3 3 7.02944 3 12C3 14.6718 4.16424 17.0717 6.01309 18.72C6.07802 18.0271 6.38245 17.3749 6.87868 16.8787C7.44129 16.3161 8.20435 16 9 16H15C15.7957 16 16.5587 16.3161 17.1213 16.8787C17.6175 17.3749 17.922 18.0271 17.9869 18.72C19.8358 17.0717 21 14.6718 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10Z"
			/>
		</svg>
	);
}

export { CircleUserSolidIcon };
