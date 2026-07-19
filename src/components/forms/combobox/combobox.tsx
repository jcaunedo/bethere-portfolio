"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/overlays/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/overlays/popover";

// Shared field look with the Textfield, applied to the trigger button.
// Figma origin: bethere.ds Input / Type=Combobox.
const comboboxTrigger =
  "inline-flex w-full items-center gap-2 rounded-xl border border-input bg-card px-3 text-left text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none " +
  "hover:border-neutral-400 " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
  "dark:bg-input/30 dark:aria-invalid:ring-destructive/40 " +
  // Figma State=Read-only: focusable, full-opacity text, dropdown can't open —
  // distinct from disabled (50% opacity, pointer-events none, not focusable).
  "data-[readonly]:cursor-default data-[readonly]:border-input-border-disabled data-[readonly]:bg-input-fill-read-only data-[readonly]:hover:border-input-border-disabled " +
  "data-[size=lg]:h-9 data-[size=xl]:h-10 [&_svg]:pointer-events-none [&_svg]:shrink-0";

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
 * Trigger opens a popover with a search field (type to filter, via cmdk) and
 * item list — the dropdown panel matches Select's SelectContent styling.
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
  const selected = options.find((o) => o.value === value);
  const canClear = showClear && !disabled && !readOnly && !!selected;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (readOnly) return;
        setOpen(next);
      }}
    >
      <div className="relative">
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-readonly={readOnly}
            disabled={disabled}
            data-slot="combobox"
            data-size={size}
            data-readonly={readOnly ? "" : undefined}
            className={cn(comboboxTrigger, canClear && "pr-9", className)}
            onKeyDown={(e) => {
              if (readOnly && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp")) {
                e.preventDefault();
              }
            }}
            {...props}
          >
            <span
              className={cn("flex-1 truncate", !selected && "text-muted-foreground")}
            >
              {selected ? selected.label : placeholder}
            </span>
            {/* Clear button replaces the chevron when a value is selected, matching
                shadcn's ComboboxTrigger (chevron hides once a clear affordance shows). */}
            {!canClear && (
              <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
            )}
          </button>
        </PopoverTrigger>
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
      <PopoverContent
        align="start"
        // Matches Select's SelectContent (Figma: bethere.ds Select Content,
        // radius/popover = 12px) rather than Popover's default rounded-md.
        className="w-[var(--radix-popover-trigger-width)] rounded-xl p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  onSelect={(next) => {
                    onValueChange?.(next === value ? "" : next);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "size-4",
                      option.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
