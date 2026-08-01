"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/forms/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/overlays/popover";

// Shared field look with the Textfield, applied to the trigger button.
const datePickerTrigger =
  "inline-flex w-full items-center gap-2 rounded-xl border border-input bg-card px-3 text-left text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none " +
  "hover:border-input-ring " + // Figma State=Hover → color/input/ring (#c6cbd2, neutral-300)
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
  "dark:bg-input/30 dark:aria-invalid:ring-destructive/40 " +
  "data-[size=lg]:h-9 data-[size=xl]:h-10 [&_svg]:pointer-events-none [&_svg]:shrink-0";

type DatePickerProps = {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** date-fns format string for the trigger label. */
  dateFormat?: string;
  size?: "lg" | "xl";
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
};

/** Single-date picker. Figma origin: bethere.ds Input / Type=Date Picker. */
function DatePicker({
  value,
  onValueChange,
  placeholder = "Pick a date",
  dateFormat = "PP",
  size = "lg",
  disabled,
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-slot="date-picker"
          data-size={size}
          className={cn(datePickerTrigger, className)}
          {...props}
        >
          <span
            className={cn("flex-1 truncate", !value && "text-muted-foreground")}
          >
            {value ? format(value, dateFormat) : placeholder}
          </span>
          <CalendarIcon className="size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onValueChange?.(date);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
export type { DatePickerProps };
