import * as React from "react";

import { cn } from "@/lib/utils";
import { Typography, typographyVariants } from "@/components/typography";

interface FormFieldProps {
  /**
   * id of the control this field wraps. Wire the same value to the control's
   * `id` so the label, description, and error are correctly associated.
   */
  htmlFor?: string;
  label?: React.ReactNode;
  /** Helper text shown below the control when there is no error. */
  description?: React.ReactNode;
  /** Error message; when present it is shown in the destructive color. */
  error?: React.ReactNode;
  /** Marks the field required (renders a trailing asterisk on the label). */
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Presentational field wrapper: label + control + description/error. This is
 * Formik-agnostic — the `Formik*` field components render their control inside
 * it, and consumers can use it directly to build custom fields. The id-derived
 * `-error` / `-description` element ids match what the `Formik*` components pass
 * as the control's `aria-describedby`.
 */
function FormField({
  htmlFor,
  label,
  description,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div
      data-slot="form-field"
      className={cn("flex flex-col gap-1.5", className)}
    >
      {label != null ? (
        <label
          htmlFor={htmlFor}
          className={cn(
            typographyVariants({ size: "sm", weight: "medium" }),
            "text-foreground",
          )}
        >
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </label>
      ) : null}

      {children}

      {error == null && description != null ? (
        <Typography id={descriptionId} size="xs" className="text-muted-foreground">
          {description}
        </Typography>
      ) : null}

      {error != null ? (
        <Typography id={errorId} size="xs" className="text-destructive">
          {error}
        </Typography>
      ) : null}
    </div>
  );
}

export { FormField };
export type { FormFieldProps };
