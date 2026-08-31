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

/**
 * Both tables populated. The seed timestamps are spread across the whole
 * date ladder on purpose — the pending rows read "14 min ago" / "2 days
 * ago", and the active rows run from "5 hr ago" through "Yesterday" and
 * "4 days ago" to full dates once past the 7-day cutover.
 */
export const Default: Story = {};

/**
 * No outstanding invitations — the steady state for most accounts. The
 * pending section is hidden entirely rather than rendering a "0 pending
 * invites" heading above an empty table.
 */
export const NoPendingInvites: Story = {
  args: {
    pendingInvites: [],
  },
};

/** Both queries in flight. */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * The two GETs fail independently — a failed pending query must not blank
 * the active table beside it.
 */
export const PendingQueryFailed: Story = {
  args: {
    pendingError: "Couldn't load pending invitations.",
    onRetry: (scope) => console.log("retry", scope),
  },
};

/** A business with only its owner — nothing to remove, nothing pending. */
export const OwnerOnly: Story = {
  args: {
    pendingInvites: [],
    activeMembers: [
      {
        id: "member-1",
        name: "Guy Hawkins",
        email: "guy.hawkins@email.com",
        phone: "(315) 555-0141",
        title: "Finance",
        role: "Owner",
        lastSeenAt: new Date().toISOString(),
      },
    ],
  },
};

/**
 * A pending invitation with no pre-seed data — an email address, a role,
 * and a date, which is all an unaccepted invite actually contains. The name
 * cell falls back to the email over a neutral icon avatar, and the job
 * title renders as an em dash rather than a fabricated value.
 */
export const PendingInviteOnly: Story = {
  args: {
    activeMembers: [],
    pendingInvites: [
      {
        id: "invite-1",
        email: "new.teammate@email.com",
        role: "Staff",
        lastSentAt: new Date(Date.now() - 14 * 60_000).toISOString(),
      },
    ],
  },
};
