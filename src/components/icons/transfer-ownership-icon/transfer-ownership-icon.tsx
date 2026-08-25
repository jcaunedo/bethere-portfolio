import * as React from "react";

/**
 * "Transfer ownership" icon (Figma: bethere.ds `transfer-ownership, person`,
 * node 35:3913) — not part of the lucide-react set, so it's vendored here as
 * a one-off `currentColor` SVG matching lucide's component shape.
 */
function TransferOwnershipIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3ZM5 6C5 3.23858 7.23858 1 10 1C12.7614 1 15 3.23858 15 6C15 8.76142 12.7614 11 10 11C7.23858 11 5 8.76142 5 6ZM3.46447 14.4645C4.40215 13.5268 5.67392 13 7 13H11.5C12.0523 13 12.5 13.4477 12.5 14C12.5 14.5523 12.0523 15 11.5 15H7C6.20435 15 5.44129 15.3161 4.87868 15.8787C4.31607 16.4413 4 17.2044 4 18V20C4 20.5523 3.55228 21 3 21C2.44772 21 2 20.5523 2 20V18C2 16.6739 2.52678 15.4021 3.46447 14.4645ZM16.2929 12.2929C16.6834 11.9024 17.3166 11.9024 17.7071 12.2929L21.7071 16.2929C22.0976 16.6834 22.0976 17.3166 21.7071 17.7071L17.7071 21.7071C17.3166 22.0976 16.6834 22.0976 16.2929 21.7071C15.9024 21.3166 15.9024 20.6834 16.2929 20.2929L18.5858 18H13C12.4477 18 12 17.5523 12 17C12 16.4477 12.4477 16 13 16H18.5858L16.2929 13.7071C15.9024 13.3166 15.9024 12.6834 16.2929 12.2929Z"
        fill="currentColor"
      />
    </svg>
  );
}

export { TransferOwnershipIcon };
