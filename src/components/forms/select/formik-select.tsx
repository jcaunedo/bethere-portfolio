"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { FormField, useFormikField } from "@/components/forms/field";

type FormikSelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type FormikSelectProps = {
  /** Formik field name (dot-path). */
  name: string;
  options: FormikSelectOption[];
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  /** className for the SelectTrigger. */
  className?: string;
  /** className for the FormField wrapper. */
  fieldClassName?: string;
};

/**
 * Formik-connected {@link Select}. Renders the trigger + options from `options`
 * and bridges Radix's `onValueChange` into Formik via `setValue`; closing the
 * menu marks the field touched. Requires a `<Formik>` ancestor.
 */
function FormikSelect({
  name,
  options,
  label,
  description,
  required,
  placeholder = "Select…",
  size,
  disabled,
  className,
  fieldClassName,
}: FormikSelectProps) {
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
      <Select
        name={name}
        value={field.value ?? ""}
        onValueChange={(value) => helpers.setValue(value)}
        disabled={disabled}
        onOpenChange={(open) => {
          if (!open) helpers.setTouched(true);
        }}
      >
        <SelectTrigger
          id={id}
          size={size}
          className={className}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : description != null ? descriptionId : undefined
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

export { FormikSelect };
export type { FormikSelectProps, FormikSelectOption };
