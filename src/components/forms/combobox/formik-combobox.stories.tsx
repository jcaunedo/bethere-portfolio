import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikCombobox } from "./formik-combobox";

const meta: Meta<typeof FormikCombobox> = {
  title: "Forms/FormikCombobox",
  component: FormikCombobox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikCombobox>;

const OPTIONS = [
  { value: "spa", label: "Spa" },
  { value: "dining", label: "Dining" },
  { value: "transport", label: "Transport" },
  { value: "excursions", label: "Excursions" },
];

const wrap = (
  initialValues: { category: string },
  initialTouched: { category?: boolean },
  node: ReactNode,
) => (
  <Formik
    initialValues={initialValues}
    initialTouched={initialTouched}
    validate={(values) =>
      values.category ? {} : { category: "Pick a category." }
    }
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap(
      { category: "" },
      {},
      <FormikCombobox
        name="category"
        label="Category"
        options={OPTIONS}
        placeholder="Select a category…"
      />,
    ),
};

export const WithError: Story = {
  render: () =>
    wrap(
      { category: "" },
      { category: true },
      <FormikCombobox
        name="category"
        label="Category"
        options={OPTIONS}
        required
      />,
    ),
};
