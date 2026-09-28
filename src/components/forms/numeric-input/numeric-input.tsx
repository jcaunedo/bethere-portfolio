import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/forms/input";

type NumericInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  /** Leading prefix label (e.g. a currency or unit). Figma "showPrefix". */
  prefix?: React.ReactNode;
  /**
   * Trailing content inside the field, right-aligned (e.g. a unit, an adjustment like "+15%",
   * or a small action like "Reset"). Plain text renders in color/foreground/subtle; interactive
   * children (buttons) stay clickable.
   */
  suffix?: React.ReactNode;
  /** Show the increment/decrement steppers. Figma "Numeric - R". */
  steppers?: boolean;
};

/** Numeric field. Figma origin: bethere.ds Input / Type=Numeric (· -R with steppers). */
function NumericInput({
  className,
  prefix,
  suffix,
  steppers = false,
  min = 0,
  onKeyDown,
  onBlur,
  onInput,
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

  // Tracks the live input value (controlled or uncontrolled) so the
  // decrement button can be disabled at `min` without owning the value.
  const [atMin, setAtMin] = React.useState(false);
  const checkAtMin = React.useCallback(
    (el: HTMLInputElement) => {
      setAtMin(el.value !== "" && el.valueAsNumber <= Number(min));
    },
    [min],
  );
  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    checkAtMin(el);
  }, [checkAtMin, props.value]);

  // Figma lays the prefix out in flow (12px inset → prefix → 6px gap → value). The prefix is
  // overlaid here, so its measured width drives the input's left padding — the value keeps
  // the same 6px gap whatever the prefix is ("$", "€", "USD").
  const prefixRef = React.useRef<HTMLSpanElement>(null);
  const [prefixWidth, setPrefixWidth] = React.useState<number>();
  const hasPrefix = prefix != null;
  React.useLayoutEffect(() => {
    const el = prefixRef.current;
    if (!el) return;
    const measure = () => setPrefixWidth(el.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasPrefix]);

  return (
    <div
      data-slot="numeric-input"
      className="group relative w-full"
      style={
        prefixWidth != null
          ? ({ "--numeric-input-prefix-width": `${prefixWidth}px` } as React.CSSProperties)
          : undefined
      }
    >
      {hasPrefix ? (
        <span
          ref={prefixRef}
          data-slot="numeric-input-prefix"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-foreground-subtle"
        >
          {prefix}
        </span>
      ) : null}
      <Input
        ref={innerRef}
        type="number"
        inputMode="decimal"
        min={min}
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "Subtract") e.preventDefault();
          // Arrow keys step the value: Right/Up increment, Left/Down decrement.
          // Handled here (not natively) so every arrow goes through `step`, same as the steppers.
          const direction =
            e.key === "ArrowRight" || e.key === "ArrowUp"
              ? 1
              : e.key === "ArrowLeft" || e.key === "ArrowDown"
                ? -1
                : 0;
          if (direction !== 0) {
            e.preventDefault();
            if (!(direction === -1 && atMin)) step(direction);
          }
          onKeyDown?.(e);
        }}
        onBlur={(e) => {
          const el = e.currentTarget;
          if (el.value !== "" && el.valueAsNumber < Number(min)) {
            el.value = String(min);
            el.dispatchEvent(new Event("input", { bubbles: true }));
          }
          onBlur?.(e);
        }}
        onInput={(e) => {
          checkAtMin(e.currentTarget);
          onInput?.(e);
        }}
        className={cn(
          "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]",
          // 12px inset + prefix width + 6px gap (falls back to one glyph's width before measuring).
          hasPrefix && "pl-[calc(--spacing(3)+var(--numeric-input-prefix-width,1ch)+--spacing(1.5))]",
          steppers && "pr-14",
          // Room for a short suffix ("+100%", "Reset") so the value never runs under it.
          suffix != null && (steppers ? "pr-28" : "pr-16"),
          className,
        )}
        {...props}
      />
      {suffix != null ? (
        <span
          data-slot="numeric-input-suffix"
          className={cn(
            "pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center text-sm text-foreground-subtle [&_a]:pointer-events-auto [&_button]:pointer-events-auto",
            steppers ? "right-16" : "right-3",
          )}
        >
          {suffix}
        </span>
      ) : null}
      {steppers ? (
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Decrement"
            disabled={atMin}
            onClick={() => step(-1)}
            className="flex size-6 items-center justify-center rounded-lg text-icon-foreground outline-none hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <MinusIcon className="size-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            onClick={() => step(1)}
            className="flex size-6 items-center justify-center rounded-lg text-icon-foreground outline-none hover:bg-accent"
          >
            <PlusIcon className="size-3" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { NumericInput };
export type { NumericInputProps };
