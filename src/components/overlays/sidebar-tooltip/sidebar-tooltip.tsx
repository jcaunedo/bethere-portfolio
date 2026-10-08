import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import {
  enterTransition,
  exitTransition,
  motionDistance,
  useMotionPreference,
} from "@/lib/motion";

type SidebarTooltipSide = "top" | "right" | "bottom" | "left";

/** Where the bubble starts/ends relative to its resting spot: back toward the trigger. */
const glideFrom: Record<SidebarTooltipSide, { x?: number; y?: number }> = {
  right: { x: -motionDistance.subtle },
  left: { x: motionDistance.subtle },
  bottom: { y: -motionDistance.subtle },
  top: { y: motionDistance.subtle },
};

interface SidebarTooltipProps
  extends Omit<
    React.ComponentProps<typeof TooltipPrimitive.Content>,
    "children" | "asChild" | "forceMount" | "side"
  > {
  /** The tooltip text, e.g. a collapsed nav item's label. Also what screen readers announce. */
  label: string;
  /** The trigger. Rendered via Radix `asChild`, so it must forward refs and props (a native element does). */
  children: React.ReactElement;
  /** Side of the trigger the bubble sits on. Defaults to `"right"` (Figma: beside the collapsed rail). */
  side?: SidebarTooltipSide;
  /** Never opens — e.g. while the sidebar is expanded and the label is already visible. */
  disabled?: boolean;
  /** Starts open (uncontrolled), e.g. for Storybook. */
  defaultOpen?: boolean;
}

/**
 * Pill-shaped label tooltip, e.g. a collapsed sidebar item's name on hover/focus. Figma: bethere.ds
 * `sidebar-tooltip` — card fill, `card` shadow (`shadow-card`), radius/full, 16×8px padding, sm/medium
 * label in color/foreground/foreground, no arrow. Built on Radix's tooltip (hover/focus, Escape,
 * `role="tooltip"`); opens without delay.
 *
 * Motion: fades in while gliding `motionDistance.subtle` (8px) out from the trigger on
 * `enterTransition`, and leaves the same way on the shorter `exitTransition` (CLAUDE.md "Menus and
 * Dropdowns": short fade, small directional movement from the trigger). Opacity only under reduced
 * motion.
 */
function SidebarTooltip({
  label,
  children,
  side = "right",
  sideOffset = 8,
  disabled = false,
  defaultOpen = false,
  className,
  ...props
}: SidebarTooltipProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [prevDisabled, setPrevDisabled] = React.useState(disabled);
  const { resolve, prefersReducedMotion } = useMotionPreference();

  // Radix still reports hover/focus while we hold `open={false}`, but never reports the matching
  // close (it thinks the tooltip is already closed). So ignore open requests while disabled, and
  // drop any open state whenever `disabled` flips — otherwise every item hovered while the sidebar
  // was expanded pops open at once when it collapses.
  if (disabled !== prevDisabled) {
    setPrevDisabled(disabled);
    setOpen(false);
  }
  const handleOpenChange = (next: boolean) => setOpen(disabled ? false : next);
  const isOpen = open && !disabled;
  const offset = prefersReducedMotion ? {} : glideFrom[side];

  return (
    // `disableHoverableContent`: the bubble is pointer-transparent, so close as soon as the pointer
    // leaves the trigger instead of waiting for it to travel toward the bubble.
    <TooltipPrimitive.Provider delayDuration={0} disableHoverableContent>
      <TooltipPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <AnimatePresence>
          {isOpen ? (
            // Kept mounted through the exit by AnimatePresence; `forceMount` stops Radix from
            // unmounting the content itself as soon as `open` turns false.
            <TooltipPrimitive.Portal key="sidebar-tooltip" forceMount>
              <TooltipPrimitive.Content
                forceMount
                asChild
                side={side}
                sideOffset={sideOffset}
                // Radix announces the content through a hidden copy; with `asChild` that copy would be
                // the whole bubble, so give it the plain label instead.
                aria-label={label}
                {...props}
              >
                <motion.div
                  data-slot="sidebar-tooltip"
                  initial={{ opacity: 0, ...offset }}
                  animate={{ opacity: 1, x: 0, y: 0, transition: resolve(enterTransition) }}
                  exit={{ opacity: 0, ...offset, transition: resolve(exitTransition) }}
                  className={cn(
                    "pointer-events-none z-50 inline-flex items-center justify-center rounded-full bg-card px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground shadow-card",
                    className,
                  )}
                >
                  {label}
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          ) : null}
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export { SidebarTooltip };
export type { SidebarTooltipProps, SidebarTooltipSide };
