import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Required ancestor of every `Tooltip` (Radix throws without one) — wrap the app,
 * or at least the screen/section that uses tooltips. It also shares hover delay,
 * so moving between tooltips skips the wait. shadcn/ui baseline: opens
 * immediately (`delayDuration={0}`).
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/**
 * Short label shown on hover/focus of its trigger. Figma: bethere.ds `Tooltip`.
 * Built on shadcn/ui's Radix tooltip (new-york-v4), reskinned to UCL tokens.
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/** The element that opens the tooltip — usually `asChild` around a button or icon button. */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * The tooltip bubble (Figma `Shape` + arrow): color/foreground/foreground fill,
 * radius/input (12px), 16×8px padding, `sm` label in color/background/accent/background.
 * Enter/exit animation matches `PopoverContent` (fade + zoom + short slide from the trigger).
 */
function TooltipContent({
  className,
  // Radix spaces the bubble by sideOffset + the arrow's 12px box, but the turned square only
  // reaches ≈8.5px out — 0.5 leaves a measured 4px between the arrow tip and the trigger.
  sideOffset = 0.5,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-input bg-foreground px-4 py-2 text-sm text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {/* Figma `Rectangle 7`: a 12px square turned 45°, centered on the bubble's edge (tip ≈ 8.5px out). */}
        <TooltipPrimitive.Arrow className="z-50 size-3 -translate-y-1/2 rotate-45 bg-foreground fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
