import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignUpSignIn } from "./sign-up-sign-in";

const meta: Meta<typeof SignUpSignIn> = {
  title: "Layouts/SignUpSignIn",
  component: SignUpSignIn,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof SignUpSignIn>;

export const Default: Story = {};
