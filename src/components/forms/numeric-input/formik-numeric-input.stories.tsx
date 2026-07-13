import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikNumericInput } from "./formik-numeric-input";

const meta: Meta<typeof FormikNumericInput> = {
  title: "Forms/FormikNumericInput",
  component: FormikNumericInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikNumericInput>;

const wrap = (
  initialValues: { amount: string },
  initialTouched: { amount?: boolean },
  node: ReactNode,
) => (
  <Formik
    initialValues={initialValues}
    initialTouched={initialTouched}
    validate={(values) =>
      values.amount ? {} : { amount: "Enter an amount." }
    }
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap(
      { amount: "" },
      {},
      <FormikNumericInput
        name="amount"
        label="Amount"
        prefix="$"
        steppers
        min={0}
        placeholder="0"
      />,
    ),
};

export const WithError: Story = {
  render: () =>
    wrap(
      { amount: "" },
      { amount: true },
      <FormikNumericInput name="amount" label="Amount" prefix="$" required />,
    ),
};
