import * as React from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Figma: bethere.ds → inputOTP. shadcn `input-otp` baseline (OTPInput root +
// Group/Slot/Separator) reskinned to UCL tokens. Interaction states
// (Focus/HasValue/Error) are Tailwind state utilities driven by the
// `input-otp` package's slot context, not `cva` variants — only Size is a
// real axis in the design.
const otpInputSlotVariants = cva(
  "relative flex items-center justify-center border-y border-r border-border bg-card text-foreground shadow-xs outline-none first:rounded-l-xl first:border-l last:rounded-r-xl transition-all " +
    "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 " +
    "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20 data-[invalid=true]:data-[active=true]:border-destructive data-[invalid=true]:data-[active=true]:ring-destructive/20",
  {
    variants: {
      size: {
        lg: "h-9 w-9 text-sm", // 36px — default ★, Figma Size=Default
        "6xl": "h-16 w-14 text-3xl", // 56×64px, Figma Size=6xl
      },
    },
    defaultVariants: { size: "lg" },
  },
);

type OtpInputGroupSpec = number[];

interface OtpInputProps
  extends Omit<
      React.ComponentProps<typeof OTPInput>,
      "render" | "children" | "size"
    >,
    VariantProps<typeof otpInputSlotVariants> {
  /**
   * Slot counts per visual group, left to right (e.g. `[3, 3]` for a 6-digit
   * code split into two groups of 3, separated by a dash). Defaults to the
   * Figma layout. The sum must equal `maxLength`.
   */
  groups?: OtpInputGroupSpec;
}

/** One-time-passcode input. Figma origin: bethere.ds inputOTP. */
function OtpInput({
  className,
  containerClassName,
  size,
  maxLength = 6,
  groups = [3, 3],
  "aria-invalid": ariaInvalid,
  ...props
}: OtpInputProps) {
  return (
    <OTPInput
      data-slot="otp-input"
      data-size={size ?? "lg"}
      aria-invalid={ariaInvalid}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      maxLength={maxLength}
      render={({ slots }) => {
        let cursor = 0;
        const groupSlices = groups.map((count) => {
          const slice = slots.slice(cursor, cursor + count);
          cursor += count;
          return slice;
        });

        return (
          <>
            {groupSlices.map((slice, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {groupIndex > 0 ? <OtpInputSeparator /> : null}
                <OtpInputGroup>
                  {slice.map((slot, slotIndex) => (
                    <OtpInputSlot
                      key={slotIndex}
                      slotProps={slot}
                      size={size}
                      invalid={ariaInvalid === true || ariaInvalid === "true"}
                    />
                  ))}
                </OtpInputGroup>
              </React.Fragment>
            ))}
          </>
        );
      }}
      {...props}
    />
  );
}

/** Rounded container for one group of OTP slots. */
function OtpInputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="otp-input-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

/** Single digit slot; `slotProps` carries its value/state from `input-otp`'s `render` prop. */
function OtpInputSlot({
  slotProps,
  size,
  invalid,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "slot"> &
  VariantProps<typeof otpInputSlotVariants> & {
    slotProps: SlotProps;
    /** Mirrors the root `OtpInput`'s `aria-invalid` (Figma State=Error). */
    invalid?: boolean;
  }) {
  const { char, hasFakeCaret, isActive } = slotProps;

  return (
    <div
      data-slot="otp-input-slot"
      data-active={isActive}
      data-invalid={invalid}
      className={cn(otpInputSlotVariants({ size, className }))}
      {...props}
    >
      {char}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground" />
        </div>
      ) : null}
    </div>
  );
}

/** Visual break between OTP slot groups (Figma "-" node). */
function OtpInputSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="otp-input-separator"
      role="separator"
      className="w-2.5 text-muted-foreground"
      {...props}
    >
      –
    </div>
  );
}

export {
  OtpInput,
  OtpInputGroup,
  OtpInputSlot,
  OtpInputSeparator,
  otpInputSlotVariants,
};
export type { OtpInputProps };
