import type { Variants } from "motion/react";

import { motionDistance, motionDuration, motionScale, motionStagger } from "./tokens";
import { enterTransition, exitTransition, standardTransition, swapEnterTransition } from "./transitions";
import { reducedMotionTransition } from "./reduced-motion";

/**
 * Reusable `Variants` for `initial`/`animate`/`exit`. Named after the
 * CLAUDE.md "Motion Vocabulary" — use these before inventing a new variant.
 * Each expects the component to also pass the matching transition (or
 * relies on the one embedded below where the pattern is direction-neutral).
 */

/** Plain opacity fade — no movement. Crossfades, simple mount/unmount. */
const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: standardTransition },
  exit: { opacity: 0, transition: exitTransition },
};

/** Content appearing in context: fade + small upward move. CLAUDE.md "Reveal". */
const revealVariants: Variants = {
  initial: { opacity: 0, y: motionDistance.subtle },
  animate: { opacity: 1, y: 0, transition: enterTransition },
  exit: { opacity: 0, y: motionDistance.subtle, transition: exitTransition },
};

/**
 * An existing region opening/closing in place, from its top edge like an accordion: height
 * 0 → auto with a fade (same timings as the Radix accordion keyframes in theme.css). CLAUDE.md
 * "Expand". The caller clips the element only while it animates (`overflow: hidden` from
 * `onAnimationStart` to `onAnimationComplete`), so focus rings and shadows aren't cut once open.
 */
const expandVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1, transition: standardTransition },
  // Documented exception to "exit shorter than enter": an ease-in height collapse ends at full
  // speed and reads as a hard stop, so the height closes on the same decelerating curve as the
  // open, while the content fades out on the (quicker) exit timing and is gone before it settles.
  exit: {
    height: 0,
    opacity: 0,
    transition: { ...standardTransition, opacity: exitTransition },
  },
};

/** Content being removed/closed: shorter than its entrance. CLAUDE.md "Dismiss". */
const dismissVariants: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: motionDistance.hover, transition: exitTransition },
};

/**
 * Overlay/scrim backdrop for dialogs and overlays (fade only — the dialog
 * surface itself should use `panelVariants` or a Motion `layout` animation).
 */
const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: standardTransition },
  exit: { opacity: 0, transition: exitTransition },
};

/**
 * Drawer/panel surface sliding in from an edge. Callers should set the
 * appropriate axis before spreading — this default assumes a right-edge
 * panel (matching most drawer usage); pass a custom `initial`/`exit` `x`/`y`
 * for other edges rather than forking this variant.
 */
const panelVariants: Variants = {
  initial: { opacity: 0, x: motionDistance.medium },
  animate: { opacity: 1, x: 0, transition: standardTransition },
  exit: { opacity: 0, x: motionDistance.medium, transition: exitTransition },
};

/**
 * Directional screen/section transition. CLAUDE.md "Glide" — match the
 * direction of navigation: pass `custom={1}` to slide in from the right
 * (the "forward"/push case, e.g. navigating into a sub-page) or
 * `custom={-1}` to slide in from the left ("back"/pop, e.g. returning to a
 * parent screen). The outgoing screen continues in the *same* direction
 * the incoming screen is heading, so the pair reads as one continuous
 * strip sliding through rather than converging on the same side.
 *
 * Unlike `glidePattern` (a gesture-prop bundle with no transition of its
 * own), this is `Variants`-shaped for `AnimatePresence` mount/unmount and
 * uses `enterTransition`/`exitTransition` like the rest of this file. Each
 * key is a function of Motion's `custom` prop (not a `direction` argument
 * called ahead of time) — this matters for `AnimatePresence`: an exiting
 * element's `custom` is snapshotted at the moment it's removed, so its
 * `exit` animation stays correct even if the direction state driving new
 * renders has already changed by the time the exit plays out. Usage:
 * `<motion.div custom={direction} variants={slideVariants} ... />`.
 */
const slideVariants: Variants = {
  initial: (direction: 1 | -1 = 1) => ({
    opacity: 0,
    x: direction * motionDistance.medium,
  }),
  animate: { opacity: 1, x: 0, transition: enterTransition },
  exit: (direction: 1 | -1 = 1) => ({
    opacity: 0,
    x: -direction * motionDistance.medium,
    transition: exitTransition,
  }),
};

/**
 * Stagger container for the Flow pattern — small groups of related items
 * entering together. Apply to the parent; children should use
 * `revealVariants` (or similar) and inherit timing via variant propagation.
 */
const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: motionStagger.fast,
      delayChildren: 0,
    },
  },
};

/**
 * Account menu entrance: a fade plus a `motionDistance.small` (12px) slide up, on
 * `standardTransition`. It opens over its trigger at the bottom of the screen, so it should read as
 * rising out of it. No scale: the slide already carries the arrival. Exit is a plain fade.
 * Under reduced motion, use `fadeVariants`.
 */
const accountMenuVariants: Variants = {
  initial: { opacity: 0, y: motionDistance.small },
  animate: { opacity: 1, y: 0, transition: standardTransition },
  exit: { opacity: 0, transition: exitTransition },
};

/**
 * Swap: two small elements stacked in place, one handing off to the other (e.g. the collapsed
 * Sidebar's logo mark and expand icon on hover). Animate the one leaving to `hidden` and the one
 * arriving to `shown`: the leaving one dissolves quickly (`exitTransition`) while the arriving one
 * fades in and grows from `motionScale.swapIn` (`swapEnterTransition`).
 * - `iconSwapReducedVariants` — the same states under reduced motion: an instant switch, no fade or
 *   scale. The variants carry their own transitions (which win over a component's `transition`
 *   prop), so reduced motion needs its own variants rather than a `resolve()` override.
 */
const iconSwapVariants: Variants = {
  shown: { opacity: 1, scale: 1, transition: swapEnterTransition },
  hidden: { opacity: 0, scale: motionScale.swapIn, transition: exitTransition },
};

const iconSwapReducedVariants: Variants = {
  shown: { opacity: 1, scale: 1, transition: reducedMotionTransition },
  hidden: { opacity: 0, scale: 1, transition: reducedMotionTransition },
};

/**
 * Pending: something is working on the element's behalf (e.g. AI generating text). A looping
 * pulse — `animate="pending"` while busy, `"idle"` otherwise; returning to idle eases back to rest.
 * CLAUDE.md "Skeletons and Loading States" (opacity pulse). Three variants:
 * - `pendingIconVariants` — the small control that started the work: scale + fade.
 * - `pendingIconReducedVariants` — the same control under reduced motion: fade only, no scale.
 * - `pendingSurfaceVariants` — the content being worked on (a field, a card): fade only.
 */
const pendingLoop = { duration: motionDuration.pendingLoop, repeat: Infinity, ease: "easeInOut" } as const;

const pendingIconVariants: Variants = {
  idle: { scale: 1, opacity: 1, transition: standardTransition },
  pending: { scale: [1, motionScale.pendingIcon, 1], opacity: [1, 0.35, 1], transition: pendingLoop },
};

const pendingIconReducedVariants: Variants = {
  idle: { opacity: 1, transition: standardTransition },
  pending: { opacity: [1, 0.35, 1], transition: pendingLoop },
};

const pendingSurfaceVariants: Variants = {
  idle: { opacity: 1, transition: standardTransition },
  pending: { opacity: [1, 0.5, 1], transition: pendingLoop },
};

export {
  fadeVariants,
  revealVariants,
  expandVariants,
  dismissVariants,
  overlayVariants,
  panelVariants,
  slideVariants,
  staggerContainerVariants,
  accountMenuVariants,
  iconSwapVariants,
  iconSwapReducedVariants,
  pendingIconVariants,
  pendingIconReducedVariants,
  pendingSurfaceVariants,
};
