import * as React from "react";

/**
 * Slack brand mark (Figma: bethere.ds `avatar-logos` → Slack), used in the
 * Integrations settings page. Fixed brand colors — not `currentColor` — since
 * the mark is always shown at full brand color regardless of state.
 */
function SlackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <path
        d="M9.34 25.25a2.92 2.92 0 1 1 0-5.83h2.92v2.92a2.92 2.92 0 0 1-2.92 2.91Z"
        fill="#E01E5A"
      />
      <path
        d="M10.75 19.42a2.92 2.92 0 1 1 0-5.84 2.92 2.92 0 0 1 2.92 2.92v2.92h-2.92Z"
        fill="#E01E5A"
      />
      <path
        d="M16.58 9.75a2.92 2.92 0 1 1 5.84 0v2.92h-2.92a2.92 2.92 0 0 1-2.92-2.92Z"
        fill="#36C5F0"
      />
      <path
        d="M22.42 10.75a2.92 2.92 0 1 1 5.83 0 2.92 2.92 0 0 1-2.91 2.92h-2.92v-2.92Z"
        fill="#36C5F0"
      />
      <path
        d="M32.08 16.58a2.92 2.92 0 1 1 0 5.84h-2.92v-2.92a2.92 2.92 0 0 1 2.92-2.92Z"
        fill="#2EB67D"
      />
      <path
        d="M31.08 22.42a2.92 2.92 0 1 1 0 5.83 2.92 2.92 0 0 1-2.92-2.91v-2.92h2.92Z"
        fill="#2EB67D"
      />
      <path
        d="M25.25 32.08a2.92 2.92 0 1 1-5.83 0v-2.92h2.92a2.92 2.92 0 0 1 2.91 2.92Z"
        fill="#ECB22E"
      />
      <path
        d="M19.42 31.08a2.92 2.92 0 1 1-5.84 0 2.92 2.92 0 0 1 2.92-2.92h2.92v2.92Z"
        fill="#ECB22E"
      />
    </svg>
  );
}

export { SlackIcon };
