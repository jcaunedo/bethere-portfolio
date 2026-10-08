import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProfileHeader } from "./profile-header";

const meta: Meta<typeof ProfileHeader> = {
  title: "Navigation/ProfileHeader",
  component: ProfileHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const Default: Story = {
  args: {
    name: "Johanna Wilson",
    email: "jennywilson@email.com",
    role: "Owner",
    onEditAvatar: () => alert("Edit avatar"),
  },
};

export const WithAvatarImage: Story = {
  args: {
    name: "Johanna Wilson",
    email: "jennywilson@email.com",
    role: "Owner",
    avatarSrc: "https://i.pravatar.cc/150?img=47",
    onEditAvatar: () => alert("Edit avatar"),
  },
};

/**
 * At `md` (768px) and below: everything stacks centered, the avatar is 72px
 * (64px on desktop), the email drops to `sm`, and the role badge moves to the
 * end of the stack instead of sitting next to the name (Figma `Profile Header`,
 * `Property 1=Mobile`). Resize the preview or use Storybook's viewport toolbar
 * to see the swap.
 */
export const Mobile: Story = {
  args: {
    name: "Johanna Wilson",
    email: "jennywilson@email.com",
    role: "Owner",
    onEditAvatar: () => alert("Edit avatar"),
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <ProfileHeader name="Johanna Wilson" email="jennywilson@email.com" role="Owner" />
      <ProfileHeader name="Mark Reyes" email="mark.reyes@email.com" role="Staff" avatarSrc="https://i.pravatar.cc/150?img=12" />
    </div>
  ),
};
