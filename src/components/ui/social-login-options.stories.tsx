import type { Meta, StoryObj } from "@storybook/react-vite";
import { SocialLoginOptions } from "./social-login-options";

const meta: Meta<typeof SocialLoginOptions> = {
  title: "UI/SocialLoginOptions",
  component: SocialLoginOptions,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SocialLoginOptions>;

export const Default: Story = {
  render: () => (
    <div className="w-[498px]">
      <SocialLoginOptions />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="w-[498px]">
      <SocialLoginOptions />
    </div>
  ),
};
