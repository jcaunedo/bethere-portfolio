"use client";

import * as React from "react";

import { OtpInput } from "./otp-input";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikOtpInputProps = Omit<
  React.ComponentProps<typeof OtpInput>,
  "value" | "onChange" | "aria-invalid" | "id"
> & {
  /** Formik field name (dot-path); the field value is a `string`. */
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  /** className for the FormField wrapper (the control keeps `className`). */
  fieldClassName?: string;
};

/**
 * Formik-connected {@link OtpInput}. Bridges `input-otp`'s
 * `onChange(value: string)` contract into Formik via `setValue` and marks the
 * field touched once the code is fully entered. Requires a `<Formik>` ancestor.
 */
function FormikOtpInput({
  name,
  label,
  description,
  required,
  fieldClassName,
  ...props
}: FormikOtpInputProps) {
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
      <OtpInput
        {...props}
        id={id}
        value={field.value ?? ""}
        onChange={(value) => {
          helpers.setValue(value);
          if (value.length === (props.maxLength ?? 6)) {
            helpers.setTouched(true);
          }
        }}
        onBlur={field.onBlur}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? errorId : description != null ? descriptionId : undefined
        }
      />
    </FormField>
  );
}

export { FormikOtpInput };
export type { FormikOtpInputProps };
