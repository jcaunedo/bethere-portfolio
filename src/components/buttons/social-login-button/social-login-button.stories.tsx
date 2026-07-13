import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocialLoginButton, GoogleIcon } from "./social-login-button";

const meta: Meta<typeof SocialLoginButton> = {
  title: "Buttons/SocialLoginButton",
  component: SocialLoginButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SocialLoginButton>;

export const Google: Story = {
  args: { icon: <GoogleIcon />, label: "Google" },
};

export const Disabled: Story = {
  args: { icon: <GoogleIcon />, label: "Google", disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-40 flex-col gap-3">
      <SocialLoginButton icon={<GoogleIcon />} label="Google" />
      <SocialLoginButton icon={<GoogleIcon />} label="Google" disabled />
    </div>
  ),
};
