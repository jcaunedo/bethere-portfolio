import * as React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

type NumericInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  /** Leading prefix label (e.g. a currency or unit). Figma "showPrefix". */
  prefix?: React.ReactNode;
  /** Show the increment/decrement steppers. Figma "Numeric - R". */
  steppers?: boolean;
};

/** Numeric field. Figma origin: bethere.ds Input / Type=Numeric (· -R with steppers). */
function NumericInput({
  className,
  prefix,
  steppers = false,
  ref,
  ...props
}: NumericInputProps) {
  const innerRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

  const step = (direction: 1 | -1) => {
    const el = innerRef.current;
    if (!el) return;
    if (direction === 1) el.stepUp();
    else el.stepDown();
    // Notify controlled consumers of the programmatic change.
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  return (
    <div data-slot="numeric-input" className="group relative w-full">
      {prefix != null ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
          {prefix}
        </span>
      ) : null}
      <Input
        ref={innerRef}
        type="number"
        inputMode="decimal"
        className={cn(
          "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]",
          prefix != null && "pl-9",
          steppers && "pr-8",
          className,
        )}
        {...props}
      />
      {steppers ? (
        <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 flex-col opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            onClick={() => step(1)}
            className="flex size-4 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground"
          >
            <ChevronUpIcon className="size-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Decrement"
            onClick={() => step(-1)}
            className="flex size-4 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground"
          >
            <ChevronDownIcon className="size-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { NumericInput };
export type { NumericInputProps };
