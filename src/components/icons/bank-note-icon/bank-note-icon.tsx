import * as React from "react";

/**
 * Outline Transactions icon — the Default-state icon of the Transactions `SidebarMenuItem`
 * (Figma: bethere.ds `bank-note-01`); `BankNoteSolidIcon` is its Active-state counterpart.
 * Strokes with `currentColor`, so it takes the item's color.
 */
function BankNoteIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M4.5 8.25V11.25M13.5 6.75V9.75M12.75 3C14.5865 3 15.5798 3.28107 16.0741 3.49908C16.1399 3.52811 16.1728 3.54263 16.2678 3.63328C16.3247 3.68761 16.4287 3.84704 16.4554 3.92107C16.5 4.04455 16.5 4.11206 16.5 4.24706V12.3083V12.3083C16.5 12.9899 16.5 13.3307 16.3978 13.5059C16.2938 13.6841 16.1936 13.7669 15.9989 13.8354C15.8077 13.9027 15.4215 13.8285 14.6491 13.6801C14.1086 13.5763 13.4674 13.5 12.75 13.5C10.5 13.5 8.25 15 5.25 15C3.41347 15 2.42015 14.7189 1.92591 14.5009L1.92561 14.5008C1.85999 14.4718 1.82704 14.4572 1.7322 14.3667C1.67527 14.3124 1.57134 14.153 1.5446 14.0789C1.5 13.9555 1.5 13.888 1.5 13.753V5.69164C1.5 5.01007 1.5 4.66927 1.60221 4.4941C1.70618 4.31592 1.80644 4.23309 2.00105 4.16461C2.19236 4.09729 2.57852 4.17149 3.35087 4.31989C3.89147 4.42376 4.53261 4.5 5.25 4.5C7.5 4.5 9.75 3 12.75 3ZM10.875 9C10.875 10.0355 10.0355 10.875 9 10.875C7.96448 10.875 7.125 10.0355 7.125 9C7.125 7.96448 7.96448 7.125 9 7.125C10.0355 7.125 10.875 7.96448 10.875 9Z" />
		</svg>
	);
}

export { BankNoteIcon };
