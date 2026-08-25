import * as React from "react";
import { EllipsisIcon, UserPlusIcon } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/account-settings/account-settings";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { TableCellUser } from "@/components/data-display/table-cell-user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/data-display/table";
import { DialogTrigger } from "@/components/overlays/dialog";
import { InviteTeamMembersDialog } from "@/components/overlays/invite-team-members-dialog";
import { SearchTrigger } from "@/components/forms/search-trigger";
import type { TeamRole } from "@/components/forms/role-select";

type TeamMember = {
  name: string;
  email: string;
  avatarUrl?: string;
  title: string;
  role: string;
  /** Rightmost column value — "Date invited" for pending, "Last seen" for active. */
  dateLabel: string;
};

const PENDING_INVITES: TeamMember[] = [
  {
    name: "Cameron Williamson",
    email: "kathryn.murphy@email.com",
    avatarUrl: "https://i.pravatar.cc/72?img=47",
    title: "Manager",
    role: "Admin",
    dateLabel: "Just now",
  },
  {
    name: "Jacob Jones",
    email: "guy.hawkins@email.com",
    title: "Sales",
    role: "Staff",
    dateLabel: "2 days ago",
  },
];

const ACTIVE_MEMBERS: TeamMember[] = [
  {
    name: "Guy Hawkins",
    email: "esther.howard@email.com",
    avatarUrl: "https://i.pravatar.cc/72?img=12",
    title: "Finance",
    role: "Owner",
    dateLabel: "Mar 17, 2026",
  },
  {
    name: "Esther Howard",
    email: "cody.fisher@email.com",
    avatarUrl: "https://i.pravatar.cc/72?img=32",
    title: "General Assistance",
    role: "Admin",
    dateLabel: "May 18, 2022",
  },
  {
    name: "Floyd Miles",
    email: "bessie.cooper@email.com",
    title: "Sales Representative",
    role: "Staff",
    dateLabel: "Apr 22, 2025",
  },
  {
    name: "Bessie Cooper",
    email: "floyd.miles@email.com",
    avatarUrl: "https://i.pravatar.cc/72?img=45",
    title: "Operations",
    role: "Staff",
    dateLabel: "Dec 11, 2024",
  },
  {
    name: "Cody Fisher",
    email: "jacob.jones@email.com",
    title: "Captain",
    role: "Staff",
    dateLabel: "Jun 07, 2025",
  },
  {
    name: "Kathryn Murphy",
    email: "cameron.williamson@email.com",
    avatarUrl: "https://i.pravatar.cc/72?img=28",
    title: "Maintenance",
    role: "Staff",
    dateLabel: "Aug 21, 2021",
  },
];

type MembersTableProps = {
  members: TeamMember[];
  dateColumnLabel: string;
  onMemberActions?: (member: TeamMember) => void;
};

function MembersTable({
  members,
  dateColumnLabel,
  onMemberActions,
}: MembersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[312px]">Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[97px]">Role</TableHead>
            <TableHead className="w-[101px]">{dateColumnLabel}</TableHead>
            <TableHead className="w-9" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.email}>
              <TableCell>
                <TableCellUser
                  name={member.name}
                  email={member.email}
                  avatarUrl={member.avatarUrl}
                />
              </TableCell>
              <TableCell>{member.title}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.dateLabel}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`More actions for ${member.name}`}
                  onClick={() => onMemberActions?.(member)}
                >
                  <EllipsisIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type TeamMembersLayoutProps = {
  /** Called when the header's close ("Done") button is activated. */
  onClose?: () => void;
  /**
   * Called with the filled-in rows when the "Invite team members" dialog's
   * "Send Invites" is activated. The dialog closes itself either way.
   */
  onSendInvites?: (invites: { email: string; role: TeamRole }[]) => void;
  /** Called when a row's "more actions" (ellipsis) button is activated. */
  onMemberActions?: (member: TeamMember) => void;
};

/**
 * Provider Portal "Team members" settings page (Figma origin: Provider
 * Portal → "Team members" frame). Rendered inside `AccountSettingsLayout`'s
 * content column — a search + invite row, then "Pending invites" and
 * "Active" member tables built from the shared `Table`/`TableCellUser`
 * primitives. "Invite member" opens `InviteTeamMembersDialog`. Row actions
 * are stubbed via `onMemberActions` — no dropdown menu content is wired up
 * yet.
 */
function TeamMembersLayout({
  onClose,
  onSendInvites,
  onMemberActions,
}: TeamMembersLayoutProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <AccountSettingsLayout activeItem="Team members" onClose={onClose}>
      <div className="flex flex-col gap-8 pb-24">
        <div className="flex flex-col">
          <Typography size="2xl" weight="semibold">
            Team members
          </Typography>
          <Typography size="base">
            Add people to your business and control what they can access.
          </Typography>
        </div>

        <div className="flex items-start gap-2">
          <SearchTrigger
            aria-label="Search team members"
            placeholder="Search team members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
          />
          <InviteTeamMembersDialog onSendInvites={onSendInvites}>
            <DialogTrigger asChild>
              <Button type="button" size="lg">
                <UserPlusIcon />
                Invite member
              </Button>
            </DialogTrigger>
          </InviteTeamMembersDialog>
        </div>

        <div className="flex flex-col gap-3">
          <Typography size="lg" weight="semibold">
            {PENDING_INVITES.length} pending invites
          </Typography>
          <MembersTable
            members={PENDING_INVITES}
            dateColumnLabel="Date invited"
            onMemberActions={onMemberActions}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Typography size="lg" weight="semibold">
            {ACTIVE_MEMBERS.length} active
          </Typography>
          <MembersTable
            members={ACTIVE_MEMBERS}
            dateColumnLabel="Last seen"
            onMemberActions={onMemberActions}
          />
        </div>
      </div>
    </AccountSettingsLayout>
  );
}

export { TeamMembersLayout };
export type { TeamMember };
