"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// Shared field look with the Textfield, applied to the trigger button.
const comboboxTrigger =
  "inline-flex w-full items-center gap-2 rounded-xl border border-input bg-card px-3 text-left text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none " +
  "hover:border-neutral-400 " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
  "dark:bg-input/30 dark:aria-invalid:ring-destructive/40 " +
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
  className?: string;
  "aria-invalid"?: boolean;
};

/** Searchable single-select. Figma origin: bethere.ds Input / Type=Combobox. */
function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  size = "lg",
  disabled,
  className,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          data-slot="combobox"
          data-size={size}
          className={cn(comboboxTrigger, className)}
          {...props}
        >
          <span
            className={cn("flex-1 truncate", !selected && "text-muted-foreground")}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
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
