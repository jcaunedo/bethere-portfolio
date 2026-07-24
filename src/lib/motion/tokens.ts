/**
 * Motion tokens — the only place raw timing/distance/scale numbers should
 * live. See CLAUDE.md "Motion System" for the design rationale behind each
 * value. Everything in `transitions.ts`/`variants.ts`/`patterns.ts` is built
 * from these; components should reference those, not these, directly.
 */

/** Seconds. CLAUDE.md "Recommended timing ranges". */
const motionDuration = {
	/** Instant feedback: 100–150ms. */
	instant: 0.12,
	/** Hover/press feedback: 120–180ms. */
	fast: 0.16,
	/** Standard UI transitions: 300ms. */
	normal: 0.3,
	/** Panels and overlays: 500ms. */
	slow: 0.5,
	/** Page-level transitions: 600ms. */
	deliberate: 0.6,
} as const;

/** Pixels. CLAUDE.md "Spatial Rules". */
const motionDistance = {
	/** Hover movement: 2–4px. */
	hover: 3,
	/** Small element reveal: 4–8px. */
	subtle: 8,
	/** Component transition: 8–16px. */
	small: 12,
	/** Panel transition: 16–32px. */
	medium: 24,
	/** Page transition: 24–48px. */
	large: 40,
} as const;

/** Unitless scale factors. CLAUDE.md "Press"/"Cards". */
const motionScale = {
	/** Buttons/cards while pressed. */
	press: 0.98,
	/** Cards/surfaces on hover (Lift pattern). */
	hover: 1.01,
	/** Media (images/thumbnails) on hover, inside a Lift card. */
	mediaHover: 1.03,
	/** Menu/dropdown content entering (Menus and Dropdowns). */
	popIn: 0.98,
} as const;

/** Seconds, for `staggerChildren`/`delayChildren`. CLAUDE.md "Flow". */
const motionStagger = {
	/** Short list/group entrance (Flow pattern) — keep intervals short. */
	fast: 0.04,
	normal: 0.06,
} as const;

export { motionDuration, motionDistance, motionScale, motionStagger };
