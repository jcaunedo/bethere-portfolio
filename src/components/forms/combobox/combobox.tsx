"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/overlays/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/overlays/popover";

// Identical field look to SelectTrigger (bethere.ds Input / Type=Combobox
// shares the same border/radius/shadow/state treatment as Type=Dropdown).
// Applied to a real <input> (via CommandPrimitive.Input) rather than a
// <button> — shadcn's Combobox types directly in the trigger itself instead
// of opening a separate search box inside the popover.
const comboboxTrigger =
  "flex w-full items-center justify-between gap-2 rounded-xl border border-input bg-card px-3 py-2 text-left text-sm text-foreground whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none " +
  "hover:border-neutral-400 " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  // Figma State=Focus: border uses color/input/ring-focus (sunset-500), outer
  // halo is a separate fully-opaque color/input/ring-outside (sunset-100) —
  // not a translucent tint of the border color.
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-input-ring-outside " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
  "dark:bg-input/30 dark:aria-invalid:ring-destructive/40 " +
  // Figma State=Read-only: focusable, full-opacity text, dropdown can't open —
  // distinct from disabled (50% opacity, pointer-events none, not focusable).
  "data-[readonly]:cursor-default data-[readonly]:border-input-border-disabled data-[readonly]:bg-input-fill-read-only data-[readonly]:hover:border-input-border-disabled " +
  "data-[size=lg]:h-9 data-[size=xl]:h-10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";

type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  size?: "lg" | "xl";
  disabled?: boolean;
  /** Figma State=Read-only: focusable, value visible, but the popover can't open. */
  readOnly?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
  /** Show an inline clear (×) button when a value is selected. Defaults to false. */
  showClear?: boolean;
};

/**
 * Searchable single-select. Figma origin: bethere.ds Input / Type=Combobox.
 * The trigger field itself becomes the search input once opened (typing
 * filters the list in place) — no separate search box inside the popover,
 * matching shadcn's Combobox behavior. Closing reverts the field to showing
 * the selected label (or placeholder), same as a plain Select trigger.
 */
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  size = "lg",
  disabled,
  readOnly = false,
  className,
  showClear = false,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const selected = options.find((o) => o.value === value);
  const canClear = showClear && !disabled && !readOnly && !!selected;
  const triggerRef = React.useRef<HTMLInputElement>(null);

  const openPopover = () => {
    if (readOnly || disabled || open) return;
    setOpen(true);
  };

  return (
    <CommandPrimitive
      shouldFilter
      onKeyDown={(e) => {
        // Command already handles Escape by clearing search; only close/blur
        // the popover on top of that.
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (readOnly) return;
          setOpen(next);
          if (!next) setSearch("");
        }}
      >
        <PopoverAnchor asChild>
          <div className="relative">
            <CommandPrimitive.Input
              ref={triggerRef}
              value={open ? search : (selected?.label ?? "")}
              onValueChange={setSearch}
              placeholder={open ? searchPlaceholder : placeholder}
              disabled={disabled}
              role="combobox"
              aria-expanded={open}
              aria-readonly={readOnly}
              data-slot="combobox"
              data-size={size}
              data-readonly={readOnly ? "" : undefined}
              className={cn(comboboxTrigger, canClear && "pr-9", className)}
              onFocus={openPopover}
              onClick={openPopover}
              onKeyDown={(e) => {
                if (readOnly) {
                  e.preventDefault();
                  return;
                }
                if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
              {...props}
            />
            {/* Chevron is decorative (not a click target) since the field itself
                is the trigger; clear button replaces it when a value is selected. */}
            {!canClear && (
              <ChevronsUpDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-50" />
            )}
            {canClear && (
              <button
                type="button"
                data-slot="combobox-clear"
                aria-label="Clear selection"
                onClick={(e) => {
                  e.stopPropagation();
                  onValueChange?.("");
                }}
                className="absolute top-1/2 right-3 inline-flex size-4 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <XIcon />
              </button>
            )}
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          // Opens straight below the trigger (standard sideOffset gap) — unlike
          // SelectContent, which covers the trigger by design, Combobox's popover
          // sits below it since the trigger field stays visible/editable above it.
          sideOffset={4}
          // Matches SelectContent's exact panel styling (Figma: bethere.ds Select
          // Content, radius/popover = 12px, border-border, shadow-popover) rather
          // than Popover's default rounded-md/border-border/shadow-md.
          className="w-[var(--radix-popover-trigger-width)] rounded-xl border-border p-0 shadow-[var(--shadow-popover)]"
          onOpenAutoFocus={(e) => e.preventDefault()}
          // The trigger is a PopoverAnchor, not a PopoverTrigger — Radix only
          // auto-exempts a real Trigger's own click from its outside-dismiss
          // logic, so without this guard the same click that opens the
          // popover (via the input's onClick/onFocus) is immediately treated
          // as an outside interaction and closes it again.
          onInteractOutside={(e) => {
            if (triggerRef.current?.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
        >
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="p-2">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange?.(option.value === value ? "" : option.value);
                    setOpen(false);
                  }}
                  // Matches SelectItem's exact item styling/spacing/hover/active
                  // treatment and check-indicator position. cmdk's data-selected
                  // is keyboard/mouse highlight (→ SelectItem's hover treatment),
                  // distinct from "is the chosen value" (→ checked/active treatment).
                  className={cn(
                    "relative h-9 rounded-lg py-[7px] pr-8 pl-2 data-[selected=true]:bg-state-hover",
                    option.value === value && "bg-state-active",
                  )}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "absolute right-2 size-4 text-icon",
                      option.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </PopoverContent>
      </Popover>
    </CommandPrimitive>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
