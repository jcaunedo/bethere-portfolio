import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikSearchInput } from "./formik-search-input";

const meta: Meta<typeof FormikSearchInput> = {
  title: "Forms/FormikSearchInput",
  component: FormikSearchInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikSearchInput>;

const wrap = (initialValues: { query: string }, node: ReactNode) => (
  <Formik
    initialValues={initialValues}
    validate={(values) =>
      values.query.length < 3
        ? { query: "Enter at least 3 characters." }
        : {}
    }
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap(
      { query: "" },
      <FormikSearchInput
        name="query"
        label="Search"
        placeholder="Search services…"
      />,
    ),
};

/** The clear (×) button resets the Formik value to an empty string. */
export const WithValue: Story = {
  render: () =>
    wrap(
      { query: "spa" },
      <FormikSearchInput name="query" label="Search" />,
    ),
};
