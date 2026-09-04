import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "@/components/buttons/button";
import { DialogTrigger } from "@/components/overlays/dialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Overlays/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

/** Removing an active team member (Provider Portal → Team members). */
const renderWithTrigger: Story["render"] = (args) => (
  <ConfirmDialog {...args}>
    <DialogTrigger asChild>
      <Button variant="outline">Open confirmation</Button>
    </DialogTrigger>
  </ConfirmDialog>
);

export const RemoveMember: Story = {
  args: {
    title: "Remove Guy Hawkins from the team?",
    description: "They'll immediately lose access to Key Biscayne Yacht Club.",
    confirmLabel: "Remove",
  },
  render: renderWithTrigger,
};

/** Revoking an invitation that hasn't been accepted yet. */
export const RevokeInvite: Story = {
  args: {
    title: "Revoke the invitation for guy.hawkins@email.com?",
    description:
      "The invitation link stops working. You can invite them again at any time.",
    confirmLabel: "Revoke invitation",
  },
  render: renderWithTrigger,
};

/** A confirmation that isn't destructive — the confirm button stays primary. */
export const NonDestructive: Story = {
  args: {
    title: "Publish this experience?",
    description:
      "It becomes visible to guests immediately. You can unpublish it at any time.",
    confirmLabel: "Publish",
    destructive: false,
  },
  render: renderWithTrigger,
};
