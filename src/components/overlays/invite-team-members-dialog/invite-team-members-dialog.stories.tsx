import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/buttons/button";
import { DialogTrigger } from "@/components/overlays/dialog";
import { InviteTeamMembersDialog } from "./invite-team-members-dialog";

const meta: Meta<typeof InviteTeamMembersDialog> = {
  title: "Overlays/InviteTeamMembersDialog",
  component: InviteTeamMembersDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InviteTeamMembersDialog>;

export const Default: Story = {
  render: () => (
    <InviteTeamMembersDialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Invite member</Button>
      </DialogTrigger>
    </InviteTeamMembersDialog>
  ),
};
