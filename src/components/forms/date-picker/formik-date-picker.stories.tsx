import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikDatePicker } from "./formik-date-picker";

const meta: Meta<typeof FormikDatePicker> = {
  title: "Forms/FormikDatePicker",
  component: FormikDatePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikDatePicker>;

const wrap = (
  initialValues: { checkIn: Date | undefined },
  initialTouched: { checkIn?: boolean },
  node: ReactNode,
) => (
  <Formik
    initialValues={initialValues}
    initialTouched={initialTouched}
    validate={(values) =>
      values.checkIn ? {} : { checkIn: "Choose a check-in date." }
    }
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap(
      { checkIn: undefined },
      {},
      <FormikDatePicker name="checkIn" label="Check-in date" />,
    ),
};

export const WithValue: Story = {
  render: () =>
    wrap(
      { checkIn: new Date(2026, 6, 20) },
      {},
      <FormikDatePicker name="checkIn" label="Check-in date" />,
    ),
};

export const WithError: Story = {
  render: () =>
    wrap(
      { checkIn: undefined },
      { checkIn: true },
      <FormikDatePicker name="checkIn" label="Check-in date" required />,
    ),
};
