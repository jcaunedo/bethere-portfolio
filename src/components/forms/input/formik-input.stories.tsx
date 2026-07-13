import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikInput } from "./formik-input";

const meta: Meta<typeof FormikInput> = {
  title: "Forms/FormikInput",
  component: FormikInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikInput>;

const wrap = (
  initialValues: { email: string },
  initialTouched: { email?: boolean },
  node: ReactNode,
) => (
  <Formik
    initialValues={initialValues}
    initialTouched={initialTouched}
    validate={(values) => (values.email ? {} : { email: "Email is required." })}
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap(
      { email: "" },
      {},
      <FormikInput name="email" label="Email" placeholder="you@example.com" />,
    ),
};

export const WithValue: Story = {
  render: () =>
    wrap(
      { email: "julio@bethere.group" },
      {},
      <FormikInput name="email" label="Email" />,
    ),
};

export const WithDescription: Story = {
  render: () =>
    wrap(
      { email: "" },
      {},
      <FormikInput
        name="email"
        label="Email"
        description="We'll only use this to contact you."
      />,
    ),
};

/** Touched + empty → the connected validation error is displayed. */
export const WithError: Story = {
  render: () =>
    wrap(
      { email: "" },
      { email: true },
      <FormikInput name="email" label="Email" required />,
    ),
};
