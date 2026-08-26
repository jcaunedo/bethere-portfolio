import * as React from "react";
import { EllipsisIcon, PencilIcon, Trash2Icon, UserPlusIcon } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/account-settings/account-settings";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { TransferOwnershipIcon } from "@/components/icons/transfer-ownership-icon";
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
import {
  EditMemberDialog,
  type EditMemberDialogMember,
} from "@/components/overlays/edit-member-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/overlays/dropdown-menu";
import { SearchTrigger } from "@/components/forms/search-trigger";
import { ROLE_OPTIONS, type TeamRole } from "@/components/forms/role-select";

const TEAM_ROLE_VALUES = new Set(ROLE_OPTIONS.map((option) => option.value));

/** Maps a display role string (e.g. "Admin", "Owner") to a `TeamRole` for
 * `RoleSelect` — falls back to "staff" for values RoleSelect doesn't
 * support (e.g. "Owner", which has no Figma-sourced role-picker option). */
function toTeamRole(role: string): TeamRole {
  const normalized = role.toLowerCase();
  return TEAM_ROLE_VALUES.has(normalized as TeamRole)
    ? (normalized as TeamRole)
    : "staff";
}

type TeamMember = {
  name: string;
  email: string;
  phone: string;
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
    phone: "(207) 555-0119",
    avatarUrl: "https://i.pravatar.cc/72?img=47",
    title: "Manager",
    role: "Admin",
    dateLabel: "Just now",
  },
  {
    name: "Jacob Jones",
    email: "guy.hawkins@email.com",
    phone: "(302) 555-0164",
    title: "Sales",
    role: "Staff",
    dateLabel: "2 days ago",
  },
];

const ACTIVE_MEMBERS: TeamMember[] = [
  {
    name: "Guy Hawkins",
    email: "esther.howard@email.com",
    phone: "(315) 555-0141",
    avatarUrl: "https://i.pravatar.cc/72?img=12",
    title: "Finance",
    role: "Owner",
    dateLabel: "Mar 17, 2026",
  },
  {
    name: "Esther Howard",
    email: "cody.fisher@email.com",
    phone: "(704) 555-0182",
    avatarUrl: "https://i.pravatar.cc/72?img=32",
    title: "General Assistance",
    role: "Admin",
    dateLabel: "May 18, 2022",
  },
  {
    name: "Floyd Miles",
    email: "bessie.cooper@email.com",
    phone: "(913) 555-0127",
    title: "Sales Representative",
    role: "Staff",
    dateLabel: "Apr 22, 2025",
  },
  {
    name: "Bessie Cooper",
    email: "floyd.miles@email.com",
    phone: "(505) 555-0173",
    avatarUrl: "https://i.pravatar.cc/72?img=45",
    title: "Operations",
    role: "Staff",
    dateLabel: "Dec 11, 2024",
  },
  {
    name: "Cody Fisher",
    email: "jacob.jones@email.com",
    phone: "(614) 555-0158",
    title: "Captain",
    role: "Staff",
    dateLabel: "Jun 07, 2025",
  },
  {
    name: "Kathryn Murphy",
    email: "cameron.williamson@email.com",
    phone: "(816) 555-0136",
    avatarUrl: "https://i.pravatar.cc/72?img=28",
    title: "Maintenance",
    role: "Staff",
    dateLabel: "Aug 21, 2021",
  },
];

type MembersTableProps = {
  members: TeamMember[];
  dateColumnLabel: string;
  /** Called when a row's "Edit" action is activated. */
  onEditMember?: (member: TeamMember) => void;
  /** Called when a row's "Delete" action is activated. Not offered for the
   * "Owner" row — an owner can't be deleted. */
  onDeleteMember?: (member: TeamMember) => void;
  /** Called when the "Owner" row's "Transfer ownership" action is
   * activated. Shown only for the "Owner" row, in place of "Delete". */
  onTransferOwnership?: (member: TeamMember) => void;
};

function MembersTable({
  members,
  dateColumnLabel,
  onEditMember,
  onDeleteMember,
  onTransferOwnership,
}: MembersTableProps) {
  return (
    <div className="overflow-hidden rounded-t-xl bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[312px]">Name</TableHead>
            <TableHead>Job title</TableHead>
            <TableHead className="w-[97px]">Role</TableHead>
            <TableHead className="w-[101px]">{dateColumnLabel}</TableHead>
            <TableHead className="w-9" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isOwner = member.role === "Owner";
            return (
              <TableRow
                key={member.email}
                className="cursor-pointer"
                onClick={() => onEditMember?.(member)}
              >
                <TableCell>
                  <TableCellUser
                    name={member.name}
                    email={member.email}
                    phone={member.phone}
                    avatarUrl={member.avatarUrl}
                  />
                </TableCell>
                <TableCell>{member.title}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.dateLabel}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`More actions for ${member.name}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <EllipsisIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        showIcon
                        icon={<PencilIcon />}
                        onSelect={() => onEditMember?.(member)}
                      >
                        Edit
                      </DropdownMenuItem>
                      {isOwner ? (
                        <DropdownMenuItem
                          showIcon
                          icon={<TransferOwnershipIcon className="text-foreground" />}
                          onSelect={() => onTransferOwnership?.(member)}
                        >
                          Transfer ownership
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          showIcon
                          icon={<Trash2Icon />}
                          variant="destructive"
                          onSelect={() => onDeleteMember?.(member)}
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
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
  /**
   * Called with the edited values when a row's `EditMemberDialog` "Save" is
   * activated. The dialog closes itself either way.
   */
  onEditMember?: (member: TeamMember, edited: EditMemberDialogMember) => void;
  /** Called when a row's "Delete" action is activated. Not offered for the
   * "Owner" row — an owner can't be deleted. */
  onDeleteMember?: (member: TeamMember) => void;
  /** Called when the "Owner" row's "Transfer ownership" action is
   * activated. Shown only for the "Owner" row, in place of "Delete". */
  onTransferOwnership?: (member: TeamMember) => void;
};

/**
 * Provider Portal "Team members" settings page (Figma origin: Provider
 * Portal → "Team members" frame). Rendered inside `AccountSettingsLayout`'s
 * content column — a search + invite row, then "Pending invites" and
 * "Active" member tables built from the shared `Table`/`TableCellUser`
 * primitives. "Invite member" opens `InviteTeamMembersDialog`. Each row's
 * "more actions" (ellipsis) opens a `DropdownMenu` with Edit/Delete (Figma:
 * bethere.ds "Select Content (Popper)" panel shell, reused as a row-actions
 * menu) — "Edit" opens `EditMemberDialog` seeded with that row's data.
 */
function TeamMembersLayout({
  onClose,
  onSendInvites,
  onEditMember,
  onDeleteMember,
  onTransferOwnership,
}: TeamMembersLayoutProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(
    null,
  );
  // Separate from `editingMember` so the dialog stays mounted (and its
  // Radix close animation can actually play) while closing — clearing
  // `editingMember` immediately via `{editingMember && <EditMemberDialog>}`
  // would unmount the dialog mid-transition instead of letting `open`
  // toggle to false first. `editingMember` itself is left populated (not
  // reset to null) until the next row's Edit is clicked, so the content
  // doesn't flash empty while it's animating out.
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  function openEditDialog(member: TeamMember) {
    setEditingMember(member);
    setEditDialogOpen(true);
  }

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
            onEditMember={openEditDialog}
            onDeleteMember={onDeleteMember}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Typography size="lg" weight="semibold">
            {ACTIVE_MEMBERS.length} active
          </Typography>
          <MembersTable
            members={ACTIVE_MEMBERS}
            dateColumnLabel="Last seen"
            onTransferOwnership={onTransferOwnership}
            onEditMember={openEditDialog}
            onDeleteMember={onDeleteMember}
          />
        </div>
      </div>

      {editingMember && (
        <EditMemberDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          member={{
            name: editingMember.name,
            email: editingMember.email,
            phone: editingMember.phone,
            avatarUrl: editingMember.avatarUrl,
            title: editingMember.title,
            role: toTeamRole(editingMember.role),
          }}
          onSave={(edited) => onEditMember?.(editingMember, edited)}
        />
      )}
    </AccountSettingsLayout>
  );
}

export { TeamMembersLayout, ACTIVE_MEMBERS };
export type { TeamMember };
