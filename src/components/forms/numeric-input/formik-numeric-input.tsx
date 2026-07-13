"use client";

import * as React from "react";

import { NumericInput } from "./numeric-input";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikNumericInputProps = Omit<
  React.ComponentProps<typeof NumericInput>,
  "name" | "value" | "defaultValue" | "id" | "ref"
> & {
  /** Formik field name (dot-path). */
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  /** className for the FormField wrapper (the control keeps `className`). */
  fieldClassName?: string;
};

/**
 * Formik-connected {@link NumericInput}. The steppers dispatch a native `input`
 * event, so Formik's `onChange` picks up programmatic changes. Requires a
 * `<Formik>` ancestor.
 */
function FormikNumericInput({
  name,
  label,
  description,
  required,
  fieldClassName,
  ...props
}: FormikNumericInputProps) {
  const { id, field, hasError, error, errorId, descriptionId } =
    useFormikField<string | number>(name);

  return (
    <FormField
      htmlFor={id}
      label={label}
      description={description}
      error={error}
      required={required}
      className={fieldClassName}
    >
      <NumericInput
        {...props}
        {...field}
        id={id}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? errorId : description != null ? descriptionId : undefined
        }
      />
    </FormField>
  );
}

export { FormikNumericInput };
export type { FormikNumericInputProps };
