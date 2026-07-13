"use client";

import * as React from "react";

import { DatePicker } from "./date-picker";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikDatePickerProps = Omit<
  React.ComponentProps<typeof DatePicker>,
  "value" | "onValueChange" | "aria-invalid"
> & {
  /** Formik field name (dot-path); the field value is a `Date | undefined`. */
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  /** className for the FormField wrapper (the control keeps `className`). */
  fieldClassName?: string;
};

/**
 * Formik-connected {@link DatePicker}. Bridges the picker's `onValueChange`
 * (a `Date | undefined`) into Formik via `setValue` and marks the field touched
 * on selection. Requires a `<Formik>` ancestor.
 */
function FormikDatePicker({
  name,
  label,
  description,
  required,
  fieldClassName,
  ...props
}: FormikDatePickerProps) {
  const { field, helpers, hasError, error } =
    useFormikField<Date | undefined>(name);

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      className={fieldClassName}
    >
      <DatePicker
        {...props}
        value={field.value}
        onValueChange={(date) => {
          helpers.setValue(date);
          helpers.setTouched(true);
        }}
        aria-invalid={hasError}
      />
    </FormField>
  );
}

export { FormikDatePicker };
export type { FormikDatePickerProps };
