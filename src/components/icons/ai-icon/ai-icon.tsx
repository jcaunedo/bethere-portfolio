import * as React from "react";

/**
 * AI mark (Figma: bethere.ds `AI`) — two sparkles in a blue → cyan → amber
 * gradient, used next to AI-suggested content. Fixed gradient colors — not
 * `currentColor` — since the mark always shows in full color. The gradient id
 * is unique per instance so several marks on one page don't collide.
 */
function AiIcon(props: React.SVGProps<SVGSVGElement>) {
	const gradientId = `ai-icon-${React.useId().replace(/[^a-zA-Z0-9-_]/g, "")}`;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={16}
			height={16}
			viewBox="0 0 16 16"
			fill="none"
			{...props}
		>
			<path
				d="M6.47135 3.72428C6.70279 3.72442 6.88869 3.91324 6.90397 4.14421C7.08738 6.91488 9.08551 8.91301 11.8561 9.09635C12.0871 9.11176 12.2751 9.2975 12.2751 9.52897C12.2751 9.76044 12.0871 9.94618 11.8561 9.96159C9.08553 10.1449 7.0874 12.1431 6.90397 14.9137C6.88869 15.1447 6.70279 15.3335 6.47135 15.3337C6.2398 15.3337 6.05305 15.1448 6.03776 14.9137C5.85432 12.1431 3.85707 10.145 1.08659 9.96159C0.855538 9.9463 0.666671 9.76053 0.666667 9.52897C0.666667 9.29741 0.855535 9.11164 1.08659 9.09635C3.85709 8.91295 5.85435 6.91481 6.03776 4.14421C6.05304 3.91316 6.2398 3.72428 6.47135 3.72428ZM12.3385 0.666667C12.458 0.666756 12.5543 0.764288 12.5622 0.883464C12.6568 2.31314 13.6872 3.34439 15.1169 3.43913C15.2359 3.44701 15.3334 3.54251 15.3337 3.66178C15.3337 3.78128 15.2361 3.87753 15.1169 3.88542C13.6872 3.98016 12.6568 5.01139 12.5622 6.44108C12.5543 6.56026 12.458 6.65779 12.3385 6.65788C12.2191 6.65788 12.1228 6.56031 12.1149 6.44108C12.0203 5.01126 10.9891 3.98001 9.55924 3.88542C9.44016 3.87737 9.34342 3.78117 9.34342 3.66178C9.34368 3.54262 9.44032 3.44716 9.55924 3.43913C10.9891 3.34454 12.0203 2.31327 12.1149 0.883464C12.1228 0.764233 12.2191 0.666667 12.3385 0.666667Z"
				fill={`url(#${gradientId})`}
			/>
			<defs>
				<linearGradient
					id={gradientId}
					x1="13.4896"
					y1="1.14207"
					x2="4.33557"
					y2="12.1524"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#2EB9FF" />
					<stop offset="0.465336" stopColor="#23DFEC" />
					<stop offset="1" stopColor="#FFAF03" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export { AiIcon };
