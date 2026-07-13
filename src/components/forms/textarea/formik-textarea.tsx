"use client";

import * as React from "react";

import { Textarea } from "./textarea";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikTextareaProps = Omit<
  React.ComponentProps<typeof Textarea>,
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

/** Formik-connected {@link Textarea}. Requires a `<Formik>` ancestor. */
function FormikTextarea({
  name,
  label,
  description,
  required,
  fieldClassName,
  ...props
}: FormikTextareaProps) {
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
      <Textarea
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

export { FormikTextarea };
export type { FormikTextareaProps };
