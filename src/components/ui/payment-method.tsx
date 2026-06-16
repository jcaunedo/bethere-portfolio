import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDownIcon, CreditCardIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Figma: bethere.ds → Input / Type=Payment Method. A button-styled trigger that
// shows the selected card (leading icon + value) with a trailing chevron. Shares
// the Textfield field look; not a real <input>, so it's a custom component.
const paymentMethodVariants = cva(
  "inline-flex w-full items-center gap-2 rounded-xl border border-input bg-card px-3 text-left text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none " +
    "hover:border-neutral-400 " +
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
    "dark:bg-input/30 dark:aria-invalid:ring-destructive/40 " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        lg: "h-9", // Figma "lg · 36"
        xl: "h-10", // Figma "xl · 40"
      },
    },
    defaultVariants: { size: "lg" },
  },
);

type PaymentMethodProps = Omit<React.ComponentProps<"button">, "size"> &
  VariantProps<typeof paymentMethodVariants> & {
    /** Leading icon; defaults to a credit-card glyph. */
    icon?: React.ReactNode;
    /** Placeholder shown when there is no selected value (children). */
    placeholder?: string;
  };

/** Payment-method picker trigger. Figma origin: bethere.ds Input / Type=Payment Method. */
function PaymentMethod({
  className,
  size,
  icon,
  placeholder = "Add Payment Method",
  children,
  ...props
}: PaymentMethodProps) {
  const hasValue = children != null && children !== "";
  return (
    <button
      type="button"
      data-slot="payment-method"
      data-size={size ?? "lg"}
      className={cn(paymentMethodVariants({ size, className }))}
      {...props}
    >
      <span className="text-muted-foreground [&_svg]:size-5">
        {icon ?? <CreditCardIcon />}
      </span>
      <span
        className={cn(
          "flex-1 truncate",
          !hasValue && "text-muted-foreground",
        )}
      >
        {hasValue ? children : placeholder}
      </span>
      <ChevronDownIcon className="size-4 text-muted-foreground" />
    </button>
  );
}

export { PaymentMethod, paymentMethodVariants };
export type { PaymentMethodProps };
