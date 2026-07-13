import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Formik, Form } from "formik";

import { FormikTextarea } from "./formik-textarea";

const meta: Meta<typeof FormikTextarea> = {
  title: "Forms/FormikTextarea",
  component: FormikTextarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormikTextarea>;

const wrap = (
  initialValues: { bio: string },
  initialTouched: { bio?: boolean },
  node: ReactNode,
) => (
  <Formik
    initialValues={initialValues}
    initialTouched={initialTouched}
    validate={(values) => (values.bio ? {} : { bio: "Tell us a little about you." })}
    onSubmit={() => undefined}
  >
    <Form className="w-80">{node}</Form>
  </Formik>
);

export const Default: Story = {
  render: () =>
    wrap(
      { bio: "" },
      {},
      <FormikTextarea name="bio" label="Bio" placeholder="A few words…" />,
    ),
};

export const WithError: Story = {
  render: () =>
    wrap(
      { bio: "" },
      { bio: true },
      <FormikTextarea name="bio" label="Bio" required />,
    ),
};
