import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/buttons/button";
import { DialogTrigger } from "@/components/overlays/dialog";
import { EditMemberDialog } from "./edit-member-dialog";

const meta: Meta<typeof EditMemberDialog> = {
  title: "Overlays/EditMemberDialog",
  component: EditMemberDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EditMemberDialog>;

export const Default: Story = {
  render: () => (
    <EditMemberDialog
      defaultOpen
      member={{
        name: "Esther Howard",
        email: "cody.fisher@email.com",
        phone: "(305) 555-1234",
        title: "General Assistance",
        role: "admin",
      }}
      onRemove={() => {}}
    >
      <DialogTrigger asChild>
        <Button>Edit member</Button>
      </DialogTrigger>
    </EditMemberDialog>
  ),
};

export const WithPhoto: Story = {
  render: () => (
    <EditMemberDialog
      defaultOpen
      member={{
        name: "Guy Hawkins",
        email: "esther.howard@email.com",
        avatarUrl: "https://i.pravatar.cc/144?img=12",
        title: "Finance",
        role: "staff",
      }}
    >
      <DialogTrigger asChild>
        <Button>Edit member</Button>
      </DialogTrigger>
    </EditMemberDialog>
  ),
};

/** `pending` — an invitation not yet accepted: only Email and Role, plus a waiting note. */
export const PendingInvite: Story = {
  render: () => (
    <EditMemberDialog
      defaultOpen
      pending
      member={{
        name: "",
        email: "kathryn.murphy@email.com",
        title: "",
        role: "admin",
      }}
      onRemove={() => {}}
      removeLabel="Revoke invitation"
    >
      <DialogTrigger asChild>
        <Button>Edit invitation</Button>
      </DialogTrigger>
    </EditMemberDialog>
  ),
};
