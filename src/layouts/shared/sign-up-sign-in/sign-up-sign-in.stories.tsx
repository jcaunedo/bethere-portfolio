import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  SignUpSignIn,
  SignUpSignInPassword,
  SignUpSignInPasswordError,
  SignUpSignInCompleteProfile,
  SignUpSignInOtp,
  SignUpSignInOtpInvalid,
  SignUpSignInLoading,
} from "./sign-up-sign-in";
import { GoogleAccountChooser } from "./google-account-chooser";
import { PROTOTYPE_STORIES, openStory } from "../prototype-links";

const openPortal = () => openStory(PROTOTYPE_STORIES.providerPortal);
/** A new user picking a Google account continues to onboarding ("Tell us about your business"). */
const startOnboarding = () => openStory(PROTOTYPE_STORIES.onboardingBusinessProfile);

/**
 * Prototype sign-in by social login: Google first shows its (faked) account chooser, and picking an
 * account starts a new user's onboarding (Business Profile); Microsoft and Apple have no designed
 * step, so they open the Portal directly.
 */
function WithSocialSignIn({
  screen: Screen,
}: {
  screen: React.ComponentType<{ onSocialLogin?: (provider: "google" | "microsoft" | "apple") => void }>;
}) {
  const [choosingGoogleAccount, setChoosingGoogleAccount] = React.useState(false);
  if (choosingGoogleAccount) return <GoogleAccountChooser onContinue={startOnboarding} />;
  return (
    <Screen
      onSocialLogin={(provider) => {
        if (provider === "google") setChoosingGoogleAccount(true);
        else openPortal();
      }}
    />
  );
}

const meta: Meta<typeof SignUpSignIn> = {
  title: "Layouts/Shared/SignUpSignIn",
  component: SignUpSignIn,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof SignUpSignIn>;

export const Default: Story = {
  render: () => <WithSocialSignIn screen={SignUpSignIn} />,
};

export const PasswordSignIn: Story = {
  name: "Password Sign-In",
  render: () => <WithSocialSignIn screen={SignUpSignInPassword} />,
};

export const PasswordSignInError: Story = {
  name: "Password Sign-In (Invalid Credentials)",
  render: () => <WithSocialSignIn screen={SignUpSignInPasswordError} />,
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

/**
 * Prototype-only: Google's "Choose an account" step after the Google button (Figma: Sign-In →
 * "Account creation by choosing SSO"). Picking an account starts a new user's onboarding
 * ("Tell us about your business").
 */
export const GoogleAccountChooserStep: Story = {
  name: "Google account chooser (prototype)",
  render: () => <GoogleAccountChooser onContinue={startOnboarding} />,
};
