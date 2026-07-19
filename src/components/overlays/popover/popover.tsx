import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Tracks whether the trigger's last open/close interaction was pointer-driven
 * (mouse/touch) vs keyboard, shared between PopoverTrigger and PopoverContent
 * via context since they're composed as siblings under Popover. Used by
 * PopoverContent's onCloseAutoFocus to skip Radix's auto-refocus specifically
 * for pointer closes — without this, closing via a mouse click still
 * refocuses the trigger, and the browser's `:focus-visible` heuristic treats
 * that programmatic refocus as keyboard-like, so a focus-ring border
 * permanently masks `hover:` until the user clicks elsewhere on the page.
 * Keyboard closes (Escape/Tab) are left alone so focus-return still works.
 */
const PopoverPointerContext = React.createContext<React.RefObject<boolean> | null>(
  null
)

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const isPointerRef = React.useRef(false)
  return (
    <PopoverPointerContext.Provider value={isPointerRef}>
      <PopoverPrimitive.Root data-slot="popover" {...props} />
    </PopoverPointerContext.Provider>
  )
}

function PopoverTrigger({
  onPointerDown,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  const isPointerRef = React.useContext(PopoverPointerContext)
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      onPointerDown={(e) => {
        if (isPointerRef) isPointerRef.current = true
        onPointerDown?.(e)
      }}
      {...props}
    />
  )
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const isPointerRef = React.useContext(PopoverPointerContext)
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-[var(--shadow-popover)] outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        onCloseAutoFocus={(e) => {
          if (isPointerRef?.current) {
            e.preventDefault()
            isPointerRef.current = false
          }
          onCloseAutoFocus?.(e)
        }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
