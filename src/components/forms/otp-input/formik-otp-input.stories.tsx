import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikOtpInput } from "./formik-otp-input";

const meta: Meta<typeof FormikOtpInput> = {
  title: "Forms/FormikOtpInput",
  component: FormikOtpInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikOtpInput>;

const wrap = (
  initialValues: { code: string },
  initialTouched: { code?: boolean },
  node: ReactNode,
) => (
  <Formik
    initialValues={initialValues}
    initialTouched={initialTouched}
    validate={(values) =>
      values.code.length === 6 ? {} : { code: "Enter the 6-digit code." }
    }
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap({ code: "" }, {}, <FormikOtpInput name="code" label="Verification Code" />),
};

export const WithValue: Story = {
  render: () =>
    wrap(
      { code: "524872" },
      {},
      <FormikOtpInput name="code" label="Verification Code" />,
    ),
};

export const WithError: Story = {
  render: () =>
    wrap(
      { code: "" },
      { code: true },
      <FormikOtpInput name="code" label="Verification Code" required />,
    ),
};
