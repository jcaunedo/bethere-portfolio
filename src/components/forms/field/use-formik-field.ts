import * as React from "react";
import { useField } from "formik";

/**
 * Shared wiring for the `Formik*` field components. Reads Formik state for
 * `name`, generates a stable id, and derives the error/description element ids
 * (which line up with what `FormField` renders for the same `htmlFor`). Keep
 * this internal to the library — it requires a `<Formik>` ancestor and the
 * `formik` peer dependency.
 */
export function useFormikField<Value = string>(name: string) {
  const [field, meta, helpers] = useField<Value>(name);
  const id = React.useId();
  const hasError = Boolean(meta.touched && meta.error);

  return {
    id,
    field,
    meta,
    helpers,
    hasError,
    /** The message to display (only when the field is touched + invalid). */
    error: hasError ? meta.error : undefined,
    errorId: `${id}-error`,
    descriptionId: `${id}-description`,
  };
}
