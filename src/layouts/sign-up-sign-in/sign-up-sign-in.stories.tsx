import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  SignUpSignIn,
  SignUpSignInPassword,
  SignUpSignInPasswordError,
  SignUpSignInCompleteProfile,
  SignUpSignInOtp,
  SignUpSignInOtpInvalid,
  SignUpSignInLoading,
} from "./sign-up-sign-in";

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

export const PasswordSignIn: Story = {
  name: "Password Sign-In",
  render: () => <SignUpSignInPassword />,
};

export const PasswordSignInError: Story = {
  name: "Password Sign-In (Invalid Credentials)",
  render: () => <SignUpSignInPasswordError />,
};

export const CompleteProfile: Story = {
  name: "Complete Your Profile",
  render: () => <SignUpSignInCompleteProfile />,
};

export const OtpSent: Story = {
  name: "OTP Sent",
  render: () => <SignUpSignInOtp />,
};

export const OtpInvalid: Story = {
  name: "OTP Invalid",
  render: () => <SignUpSignInOtpInvalid />,
};

export const Loading: Story = {
  render: () => <SignUpSignInLoading />,
};
