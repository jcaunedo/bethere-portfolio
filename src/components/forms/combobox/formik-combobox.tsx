"use client";

import * as React from "react";

import { Combobox } from "./combobox";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikComboboxProps = Omit<
  React.ComponentProps<typeof Combobox>,
  "value" | "onValueChange" | "aria-invalid"
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
 * Formik-connected {@link Combobox}. Bridges the searchable-select's
 * `onValueChange` into Formik via `setValue` and marks the field touched on
 * selection. Requires a `<Formik>` ancestor.
 */
function FormikCombobox({
  name,
  label,
  description,
  required,
  fieldClassName,
  ...props
}: FormikComboboxProps) {
  const { field, helpers, hasError, error } = useFormikField<string>(name);

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      className={fieldClassName}
    >
      <Combobox
        {...props}
        value={field.value}
        onValueChange={(value) => {
          helpers.setValue(value);
          helpers.setTouched(true);
        }}
        aria-invalid={hasError}
      />
    </FormField>
  );
}

export { FormikCombobox };
export type { FormikComboboxProps };
