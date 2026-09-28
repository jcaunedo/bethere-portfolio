import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  UserRoundIcon,
} from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Tracks whether the trigger's last open/close interaction was pointer-driven
 * vs keyboard. Used by SelectContent's onCloseAutoFocus to skip Radix's
 * auto-refocus on pointer closes — otherwise the browser's `:focus-visible`
 * heuristic treats that programmatic refocus as keyboard-like and the
 * focus ring masks `hover:` until the user clicks elsewhere.
 */
const SelectPointerContext = React.createContext<React.RefObject<boolean> | null>(
  null
)

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const isPointerRef = React.useRef(false)
  return (
    <SelectPointerContext.Provider value={isPointerRef}>
      <SelectPrimitive.Root data-slot="select" {...props} />
    </SelectPointerContext.Provider>
  )
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      // gap lives here (not just on Viewport) since items render as
      // SelectGroup's children, and flex `gap` only applies between a
      // container's direct children. No horizontal padding here — that
      // stays on Viewport only, since SelectGroup nests inside it and
      // padding on both would compound into double the gutter.
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "lg",
  children,
  readOnly,
  avatar,
  onPointerDown,
  onKeyDown,
  onClick,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  // Shared control height scale — xs·24 / sm·28 / md·32 / lg·36★ / xl·40
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  // Focusable and shows the value, but can't be opened — distinct from
  // `disabled` (50% opacity, not focusable). No native HTML equivalent on
  // a button, so open attempts are blocked directly.
  readOnly?: boolean
  /**
   * Optional avatar rendered before the value (Figma `Type=Dropdown,
   * showAvatar`) — e.g. `<Avatar size="sm"><AvatarImage .../><AvatarFallback>
   * AB</AvatarFallback></Avatar>`. Represents the selected option's
   * person/business, not a per-value icon — omit for plain dropdowns.
   */
  avatar?: React.ReactNode
}) {
  const isPointerRef = React.useContext(SelectPointerContext)
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-readonly={readOnly ? "" : undefined}
      aria-readonly={readOnly}
      onPointerDown={(e) => {
        if (readOnly) {
          e.preventDefault()
          return
        }
        if (isPointerRef) isPointerRef.current = true
        onPointerDown?.(e)
      }}
      onClick={(e) => {
        // Radix's onClick can open the menu independently of onPointerDown,
        // so both need the same guard.
        if (readOnly) {
          e.preventDefault()
          return
        }
        onClick?.(e)
      }}
      onKeyDown={(e) => {
        if (readOnly && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault()
          return
        }
        onKeyDown?.(e)
      }}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none hover:border-input-ring focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:text-destructive data-[placeholder]:text-muted-foreground aria-invalid:data-[placeholder]:text-destructive data-[size=xs]:h-6 data-[size=xs]:text-xs data-[size=sm]:h-7 data-[size=sm]:text-xs data-[size=md]:h-8 data-[size=lg]:h-9 data-[size=xl]:h-10 data-[size=xl]:text-base *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[readonly]:cursor-default data-[readonly]:border-input-border-disabled data-[readonly]:bg-input-fill-read-only data-[readonly]:hover:border-input-border-disabled",
        className
      )}
      {...props}
    >
      {avatar}
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const isPointerRef = React.useContext(SelectPointerContext)
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-popover text-popover-foreground shadow-[var(--shadow-popover)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          // Horizontal origin fixed to center (align="start" would otherwise put
          // Radix's computed transform-origin at the left edge, so the zoom
          // animation scaled from top-left instead of top-center).
          "[transform-origin:50%_top]",
          position === "popper" &&
            "data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1",
          // Shifts the panel's TOP edge up to the trigger's TOP edge (Radix's
          // default side="bottom" would put it at the trigger's bottom edge)
          // so it grows downward, covering the trigger.
          "data-[side=bottom]:-translate-y-[var(--radix-select-trigger-height)]",
          // Mirrors the above for Radix's collision-driven side="top" flip
          // (e.g. a trigger near the bottom of the viewport): shifts the
          // panel's BOTTOM edge down to the trigger's BOTTOM edge (Radix's
          // side="top" would otherwise put it flush above, at the trigger's
          // top edge) so it grows upward, covering the trigger instead of
          // floating disconnected above it.
          "data-[side=top]:translate-y-[var(--radix-select-trigger-height)]",
          className
        )}
        position={position}
        align={align}
        sideOffset={0}
        onCloseAutoFocus={(e) => {
          if (isPointerRef?.current) {
            e.preventDefault()
            isPointerRef.current = false
          }
          onCloseAutoFocus?.(e)
        }}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "flex flex-col gap-0.5 px-2 py-2",
            position === "popper" &&
              "w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  shortcut,
  showChevron = false,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label> & {
  shortcut?: string
  showChevron?: boolean
}) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="shrink-0 text-right text-xs text-muted-foreground">
          {shortcut}
        </span>
      )}
      {showChevron && <ChevronRightIcon className="size-4 shrink-0" />}
    </SelectPrimitive.Label>
  )
}

function SelectItem({
  className,
  children,
  icon,
  showIcon = false,
  avatar,
  showCheckbox = false,
  showCircleColor = false,
  circleColor,
  shortcut,
  showChevron = false,
  // Renders a two-line item (Figma `Select Item 2 Lines`) — `children` as
  // the title, this as a muted line underneath. Switches the item from its
  // default single-line row to a stacked column.
  description,
  // Radix's data-[state=checked] marks the item as selected; this only
  // controls which token the checkmark uses once checked.
  checkColor = "default",
  // Visual only — no expand/collapse behavior wired up. Radix's Select.Item
  // has no native parent/child concept, so a consuming app would
  // conditionally render nested items itself.
  tier,
  tierState,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  icon?: React.ReactNode
  showIcon?: boolean
  /**
   * Optional avatar rendered before the item's other leading slots (Figma
   * `Type=Dropdown, showAvatar` list item) — same shape as SelectTrigger's
   * `avatar` prop, e.g. `<Avatar size="sm"><AvatarFallback>AB</AvatarFallback>
   * </Avatar>`. Represents this option's person/business, not a generic
   * icon — independent of `icon`/`showIcon`.
   */
  avatar?: React.ReactNode
  showCheckbox?: boolean
  showCircleColor?: boolean
  circleColor?: string
  shortcut?: string
  showChevron?: boolean
  description?: React.ReactNode
  checkColor?: "default" | "primary"
  tier?: 1
  tierState?: "active" | "collapsed" | "expanded"
}) {
  const isTiered = tier === 1
  const isTwoLines = description != null
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      data-tier={tier}
      data-check-color={checkColor}
      className={cn(
        // text-foreground overrides the popover-foreground inherited from
        // SelectContent. Disabled dims only the text (data-[disabled]:text-muted-foreground),
        // not the whole item — icons/chevron/shortcut keep their normal color.
        // Radix auto-focuses an item on pointer move, so hover and focus fire
        // together — both must use the same subtle state-hover tint (matching
        // Combobox's CommandItem) or the opaque focus:bg-accent paints over it.
        "relative flex w-full cursor-pointer items-center gap-2 rounded-lg py-[7px] pr-8 pl-2 text-sm text-foreground outline-hidden select-none hover:bg-state-hover focus:bg-state-hover data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground data-[state=checked]:bg-state-active [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        isTwoLines
          ? "h-auto flex-col items-start gap-0.5 py-2 pr-8 pl-2.5"
          : "h-9",
        isTiered && "border-l border-border pl-3.5",
        className
      )}
      {...props}
    >
      {avatar}
      {showIcon && (icon ?? <UserRoundIcon className="size-4" />)}
      {showCheckbox && (
        <span
          aria-hidden
          className="box-content size-4 shrink-0 rounded-[4px] border border-foreground bg-background shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
        />
      )}
      {showCircleColor && (
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={circleColor ? { backgroundColor: circleColor } : undefined}
        />
      )}
      {isTiered && tierState !== "active" && (
        <ChevronRightIcon
          className={cn("size-4", tierState === "expanded" && "rotate-90")}
        />
      )}
      <SelectPrimitive.ItemText>
        {/*
          Radix's Select.Value re-renders this ItemText's children inside
          the trigger for the selected item, outside of this SelectItem's
          own DOM — so a plain `font-medium` here would also bold the
          trigger's collapsed value for every Select, not just this row.
          The [[data-slot=select-item]_&] scope only matches while this
          span still has its real select-item ancestor (i.e. inside the
          open dropdown), leaving the trigger's projected copy unstyled.
        */}
        <span
          className={cn(
            isTwoLines && "[[data-slot=select-item]_&]:font-medium",
          )}
        >
          {children}
        </span>
      </SelectPrimitive.ItemText>
      {isTwoLines && (
        <span className="w-full text-xs text-muted-foreground">
          {description}
        </span>
      )}
      {shortcut && (
        <span className="shrink-0 text-right text-xs text-muted-foreground">
          {shortcut}
        </span>
      )}
      {showChevron && <ChevronRightIcon className="size-4" />}
      <span
        data-slot="select-item-indicator"
        className={cn(
          "absolute right-2 flex size-3.5 items-center justify-center",
          isTwoLines && "top-2",
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon
            className={cn(
              "size-4",
              // Must set text-icon explicitly even for "default" — the base
              // item className has a fallback ([&_svg:not([class*='text-'])])
              // that overrides any svg with no text-* class to text-muted-foreground.
              checkColor === "primary" ? "text-icon-primary" : "text-icon"
            )}
          />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
