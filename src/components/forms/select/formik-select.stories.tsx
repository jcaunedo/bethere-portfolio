import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikSelect } from "./formik-select";

const meta: Meta<typeof FormikSelect> = {
  title: "Forms/FormikSelect",
  component: FormikSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikSelect>;

const OPTIONS = [
  { value: "us", label: "United States" },
  { value: "br", label: "Brazil" },
  { value: "pt", label: "Portugal" },
];

const wrap = (
  initialValues: { country: string },
  initialTouched: { country?: boolean },
  node: ReactNode,
) => (
  <Formik
    initialValues={initialValues}
    initialTouched={initialTouched}
    validate={(values) =>
      values.country ? {} : { country: "Please choose a country." }
    }
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap(
      { country: "" },
      {},
      <FormikSelect name="country" label="Country" options={OPTIONS} />,
    ),
};

export const WithValue: Story = {
  render: () =>
    wrap(
      { country: "br" },
      {},
      <FormikSelect name="country" label="Country" options={OPTIONS} />,
    ),
};

export const WithError: Story = {
  render: () =>
    wrap(
      { country: "" },
      { country: true },
      <FormikSelect name="country" label="Country" options={OPTIONS} required />,
    ),
};
