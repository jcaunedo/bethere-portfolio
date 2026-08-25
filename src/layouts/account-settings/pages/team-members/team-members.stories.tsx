import type { Meta, StoryObj } from "@storybook/react-vite";

import { TeamMembersLayout } from "./team-members";

const meta: Meta<typeof TeamMembersLayout> = {
  title: "Layouts/AccountSettings/TeamMembers",
  component: TeamMembersLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof TeamMembersLayout>;

export const Default: Story = {};
