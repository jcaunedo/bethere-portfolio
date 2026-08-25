import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Tracks whether the trigger's last open interaction was pointer-driven vs
 * keyboard, shared between DropdownMenuTrigger and DropdownMenuContent via
 * context since they're composed as siblings under DropdownMenu. Used by
 * DropdownMenuContent's onCloseAutoFocus to skip Radix's auto-refocus
 * specifically for pointer closes — without this, closing via a mouse click
 * (including an outside click) still refocuses the trigger, and the
 * browser's `:focus-visible` heuristic treats that programmatic refocus as
 * keyboard-like, leaving a focus-ring border on the trigger until the user
 * clicks elsewhere. Keyboard closes (Escape/Tab) are left alone so focus
 * return still works. Same pattern as Popover/Select/AccountMenu.
 */
const DropdownMenuPointerContext = React.createContext<
  React.RefObject<boolean> | null
>(null);

/**
 * Generic dropdown menu (Radix `DropdownMenu`) — the base primitive for any
 * trigger-opens-a-list-of-actions menu (row "more actions", overflow
 * menus, etc). Not tied to any one consumer; `AccountMenu` (sidebar account
 * switcher) is a separate, intentionally scoped component and should not be
 * repurposed for other menus.
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  const isPointerRef = React.useRef(false);
  return (
    <DropdownMenuPointerContext.Provider value={isPointerRef}>
      <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
    </DropdownMenuPointerContext.Provider>
  );
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  onPointerDown,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  const isPointerRef = React.useContext(DropdownMenuPointerContext);
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      onPointerDown={(event) => {
        if (isPointerRef) isPointerRef.current = true;
        onPointerDown?.(event);
      }}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  align = "end",
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const isPointerRef = React.useContext(DropdownMenuPointerContext);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        onCloseAutoFocus={(event) => {
          if (isPointerRef?.current) {
            event.preventDefault();
            isPointerRef.current = false;
          }
          onCloseAutoFocus?.(event);
        }}
        className={cn(
          // Figma: bethere.ds "Select Content (Popper)" — same panel shell
          // as SelectContent (w-[208px], py-2 no horizontal padding on the
          // panel itself, gap-0.5, rounded-popover, bg-card/border-border,
          // shadow-popover), reused here since a "click to open a small
          // action list" panel is the same component, just triggered by a
          // plain button instead of a Select.
          "z-50 flex w-[208px] max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-popover border border-border bg-card py-2 text-foreground shadow-[var(--shadow-popover)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  children,
  icon,
  showIcon = false,
  showCheckbox = false,
  showCircleColor = false,
  circleColor,
  shortcut,
  showChevron = false,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  icon?: React.ReactNode;
  showIcon?: boolean;
  showCheckbox?: boolean;
  showCircleColor?: boolean;
  circleColor?: string;
  shortcut?: string;
  showChevron?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        // Figma: "Menu Option/Default" — mx-2 insets from the panel's own
        // (horizontal-padding-free) edges, rounded-select-item (radius/select-item, 8px).
        "relative mx-2 flex h-9 w-[calc(100%-1rem)] cursor-pointer items-center gap-2 rounded-select-item px-2 py-[7px] text-sm text-foreground outline-hidden select-none hover:bg-state-hover focus:bg-state-hover data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive-subtle/50 data-[variant=destructive]:focus:bg-destructive-subtle/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:[&_svg:not([class*='text-'])]:text-destructive",
        className,
      )}
      {...props}
    >
      {showIcon && icon}
      {showCheckbox && (
        <DropdownMenuPrimitive.ItemIndicator asChild forceMount>
          <span
            aria-hidden
            className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-foreground"
          >
            <CheckIcon className="size-3" />
          </span>
        </DropdownMenuPrimitive.ItemIndicator>
      )}
      {showCircleColor && (
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={circleColor ? { backgroundColor: circleColor } : undefined}
        />
      )}
      <span className="flex-1 truncate text-left">{children}</span>
      {shortcut && (
        <span className="shrink-0 text-right text-xs text-muted-foreground">
          {shortcut}
        </span>
      )}
      {showChevron && <ChevronRightIcon className="size-4 shrink-0" />}
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-0.5 h-px w-full bg-border-soft", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
