"use client";

import * as React from "react";

import { Input } from "./input";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikInputProps = Omit<
  React.ComponentProps<typeof Input>,
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

/** Formik-connected {@link Input}. Requires a `<Formik>` ancestor. */
function FormikInput({
  name,
  label,
  description,
  required,
  fieldClassName,
  ...props
}: FormikInputProps) {
  const { id, field, hasError, error, errorId, descriptionId } =
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
      <Input
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

export { FormikInput };
export type { FormikInputProps };
