"use client";

import * as React from "react";

import { SearchInput } from "./search-input";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikSearchInputProps = Omit<
  React.ComponentProps<typeof SearchInput>,
  "name" | "value" | "defaultValue" | "id"
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
 * Formik-connected {@link SearchInput}. Clearing empties the Formik value (and
 * still calls any `onClear` you pass). Requires a `<Formik>` ancestor.
 */
function FormikSearchInput({
  name,
  label,
  description,
  required,
  fieldClassName,
  onClear,
  ...props
}: FormikSearchInputProps) {
  const { id, field, helpers, hasError, error, errorId, descriptionId } =
    useFormikField<string>(name);

  return (
    <FormField
      htmlFor={id}
      label={label}
      description={description}
      error={error}
      required={required}
      className={fieldClassName}
    >
      <SearchInput
        {...props}
        {...field}
        id={id}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? errorId : description != null ? descriptionId : undefined
        }
        onClear={() => {
          helpers.setValue("");
          onClear?.();
        }}
      />
    </FormField>
  );
}

export { FormikSearchInput };
export type { FormikSearchInputProps };
