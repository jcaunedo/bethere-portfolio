import * as React from "react";
import {
  EllipsisIcon,
  PencilIcon,
  SendIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/account-settings/account-settings";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { TransferOwnershipIcon } from "@/components/icons/transfer-ownership-icon";
import { TableCellUser } from "@/components/data-display/table-cell-user";
import { Alert, AlertDescription } from "@/components/feedback/alert";
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
import { ConfirmDialog } from "@/components/overlays/confirm-dialog";
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
import { type TeamRole } from "@/components/forms/role-select";
import { formatRelativeDate } from "@/lib/relative-date";

/**
 * A member's role within the business, as displayed. "Owner" is included
 * here because it is *shown*, not because it can be assigned — it is written
 * by the backend only (business creation, or the owner-transfer flow), which
 * is why `TeamRole` — the set a picker may offer — deliberately excludes it.
 */
type MemberRole = "Owner" | "Admin" | "Staff";

/**
 * Maps a displayed role onto the `TeamRole` a `RoleSelect` can represent.
 * Returns `null` for "Owner", which has no picker option — callers must
 * handle that explicitly rather than receiving a silent fallback. An earlier
 * version coerced anything unrecognized to "staff", which made the owner's
 * Edit dialog display the wrong role and save a demotion.
 */
function toTeamRole(role: MemberRole): TeamRole | null {
  switch (role) {
    case "Admin":
      return "admin";
    case "Staff":
      return "staff";
    default:
      return null;
  }
}

/** An active member of the business — a real account behind a real user. */
type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  title: string;
  role: MemberRole;
  /**
   * ISO-8601. ⚠️ No backing field exists in `gql` yet — `BusinessMember`
   * carries only `createdAt` and `User` has no last-activity field at all.
   * See `product-specs/team-members.md` → "The date column".
   */
  lastSeenAt: string;
};

/**
 * An invitation that hasn't been accepted. Deliberately *not* a `TeamMember`
 * with a status flag: until someone accepts, all that exists is an email
 * address, a role, and a token — there is no account, so no name, phone, or
 * job title either. The optional fields are pre-seed data an inviter may
 * have typed ahead of time; the invitee's own entries win on accept.
 */
type PendingInvite = {
  id: string;
  email: string;
  /** Never "Owner" — an invitation cannot make someone the owner. */
  role: Exclude<MemberRole, "Owner">;
  name?: string;
  phone?: string;
  title?: string;
  /** ISO-8601. Set on creation, refreshed on every resend. */
  lastSentAt: string;
};

/**
 * What a table row actually renders, flattened from either source so
 * `MembersTable` doesn't branch on two shapes. `kind` drives the row's
 * actions menu.
 */
type MemberRow = {
  id: string;
  kind: "pending" | "active";
  name?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  title?: string;
  role: MemberRole;
  /** ISO-8601 — "Date invited" for pending rows, "Last seen" for active. */
  date: string;
};

// Seed timestamps are relative to module load so the date column renders a
// live spread across the whole formatter ladder (minutes → hours →
// yesterday → days → absolute) instead of a frozen set of strings.
const SEED_NOW = Date.now();
const minutesAgo = (n: number) => new Date(SEED_NOW - n * 60_000).toISOString();
const hoursAgo = (n: number) => new Date(SEED_NOW - n * 3_600_000).toISOString();
const daysAgo = (n: number) => new Date(SEED_NOW - n * 86_400_000).toISOString();

const PENDING_INVITES: PendingInvite[] = [
  {
    id: "invite-1",
    email: "kathryn.murphy@email.com",
    role: "Admin",
    lastSentAt: minutesAgo(14),
  },
  {
    id: "invite-2",
    email: "guy.hawkins@email.com",
    role: "Staff",
    lastSentAt: daysAgo(2),
  },
];

const ACTIVE_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    name: "Guy Hawkins",
    email: "esther.howard@email.com",
    phone: "(315) 555-0141",
    avatarUrl: undefined,
    title: "Finance",
    role: "Owner",
    lastSeenAt: hoursAgo(5),
  },
  {
    id: "member-2",
    name: "Esther Howard",
    email: "cody.fisher@email.com",
    phone: "(704) 555-0182",
    title: "General Assistance",
    role: "Admin",
    lastSeenAt: daysAgo(1),
  },
  {
    id: "member-3",
    name: "Floyd Miles",
    email: "bessie.cooper@email.com",
    phone: "(913) 555-0127",
    title: "Sales Representative",
    role: "Staff",
    lastSeenAt: daysAgo(4),
  },
  {
    id: "member-4",
    name: "Bessie Cooper",
    email: "floyd.miles@email.com",
    phone: "(505) 555-0173",
    title: "Operations",
    role: "Staff",
    lastSeenAt: "2024-12-11T15:20:00.000Z",
  },
  {
    id: "member-5",
    name: "Cody Fisher",
    email: "jacob.jones@email.com",
    phone: "(614) 555-0158",
    title: "Captain",
    role: "Staff",
    lastSeenAt: "2025-06-07T09:05:00.000Z",
  },
  {
    id: "member-6",
    name: "Kathryn Murphy",
    email: "cameron.williamson@email.com",
    phone: "(816) 555-0136",
    title: "Maintenance",
    role: "Staff",
    lastSeenAt: "2022-08-21T18:40:00.000Z",
  },
];

function toPendingRow(invite: PendingInvite): MemberRow {
  return {
    id: invite.id,
    kind: "pending",
    name: invite.name,
    email: invite.email,
    phone: invite.phone,
    title: invite.title,
    role: invite.role,
    date: invite.lastSentAt,
  };
}

function toActiveRow(member: TeamMember): MemberRow {
  return {
    id: member.id,
    kind: "active",
    name: member.name,
    email: member.email,
    phone: member.phone,
    avatarUrl: member.avatarUrl,
    title: member.title,
    role: member.role,
    date: member.lastSeenAt,
  };
}

/**
 * Front-end-only search: the GET is get-all, so the whole list is already in
 * memory and there is nothing to debounce or round-trip.
 *
 * Role is deliberately not searched — typing "admin" while looking for a
 * person named Adam should not silently collapse the table to every admin.
 */
function matchesQuery(row: MemberRow, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === "") return true;
  return [row.name, row.email, row.phone, row.title].some(
    (field) => field !== undefined && field.toLowerCase().includes(needle),
  );
}

/**
 * The Date column's declared width, and the content box left inside it.
 *
 * ⚠️ Widened from the 101px this column previously declared. Measured in the
 * browser at the column's own `text-sm` / "Google Sans Flex": the widest
 * absolute date ("Sep 30, 2026") renders at 86px and the widest relative
 * value ("59 min ago") at 74px — so 101px, which leaves only 77px inside
 * `TableCell`'s `px-3`, truncated *every* full date to "Dec 11, 20…". The
 * year is the whole point of the absolute form, so the column grew to fit
 * it rather than the format shrinking. If 101px turns out to be bound to a
 * Figma measurement, that's a design decision to make deliberately, not a
 * number to quietly restore.
 */
const DATE_COLUMN_WIDTH = 112;
// `TableCell` is `px-3`, so 12px goes to each side. The remaining 88px
// clears the 86px longest case with a little headroom. Without an explicit
// max-width the nowrap cell would just widen the column instead of
// ellipsising — `Table` has no `table-fixed`, so a width on the `TableHead`
// is only a suggestion.
const DATE_CONTENT_WIDTH = DATE_COLUMN_WIDTH - 24;

function DateCell({ value }: { value: string }) {
  const { label, title } = formatRelativeDate(value);
  return (
    <span
      className="block truncate"
      style={{ maxWidth: DATE_CONTENT_WIDTH }}
      title={title}
    >
      {label}
    </span>
  );
}

/** One shimmering placeholder line, sized to the column it stands in. */
function SkeletonLine({ className }: { className?: string }) {
  return (
    <span
      className={`block h-3.5 animate-pulse rounded bg-muted ${className ?? ""}`}
    />
  );
}

type MembersTableProps = {
  rows: MemberRow[];
  /** Rightmost column header — "Date invited" for pending, "Last seen" for active. */
  dateColumnLabel: string;
  loading?: boolean;
  /** How many placeholder rows to render while `loading`. */
  skeletonRows?: number;
  onEditMember?: (row: MemberRow) => void;
  onResendInvite?: (row: MemberRow) => void;
  onRevokeInvite?: (row: MemberRow) => void;
  onRemoveMember?: (row: MemberRow) => void;
  onTransferOwnership?: (row: MemberRow) => void;
};

function MembersTable({
  rows,
  dateColumnLabel,
  loading = false,
  skeletonRows = 3,
  onEditMember,
  onResendInvite,
  onRevokeInvite,
  onRemoveMember,
  onTransferOwnership,
}: MembersTableProps) {
  return (
    // `rounded-t-xl`, never `rounded-xl` — a table rounds only its top
    // corners (DESIGN.md, "Tables round only their top corners").
    <div className="overflow-hidden rounded-t-xl bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[312px]">Name</TableHead>
            <TableHead>Job title</TableHead>
            <TableHead className="w-[97px]">Role</TableHead>
            <TableHead style={{ width: DATE_COLUMN_WIDTH }}>
              {dateColumnLabel}
            </TableHead>
            <TableHead className="w-9" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: skeletonRows }, (_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
                      <span className="flex flex-1 flex-col gap-1.5">
                        <SkeletonLine className="w-32" />
                        <SkeletonLine className="w-40" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SkeletonLine className="w-24" />
                  </TableCell>
                  <TableCell>
                    <SkeletonLine className="w-12" />
                  </TableCell>
                  <TableCell>
                    <SkeletonLine className="w-16" />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))
            : rows.map((row) => {
                const isOwner = row.kind === "active" && row.role === "Owner";
                const isPending = row.kind === "pending";
                // A pending invite has no name to address the menu by.
                const rowLabel = row.name ?? row.email;
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => onEditMember?.(row)}
                  >
                    <TableCell>
                      <TableCellUser
                        name={row.name}
                        email={row.email}
                        phone={row.phone}
                        avatarUrl={row.avatarUrl}
                      />
                    </TableCell>
                    <TableCell>
                      {row.title ? (
                        row.title
                      ) : (
                        // Nothing is known about a pending invitee's job
                        // title — render the absence, never a placeholder
                        // that reads as real data.
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <DateCell value={row.date} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`More actions for ${rowLabel}`}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <EllipsisIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            showIcon
                            icon={<PencilIcon />}
                            onSelect={() => onEditMember?.(row)}
                          >
                            Edit
                          </DropdownMenuItem>
                          {isPending ? (
                            <DropdownMenuItem
                              showIcon
                              icon={<SendIcon />}
                              onSelect={() => onResendInvite?.(row)}
                            >
                              Resend invitation
                            </DropdownMenuItem>
                          ) : null}
                          {isOwner ? (
                            // The owner is never deletable — removing an
                            // owner isn't a permission problem, it's a
                            // nonsensical operation. Transfer is what this
                            // action is for.
                            <DropdownMenuItem
                              showIcon
                              icon={
                                <TransferOwnershipIcon className="text-foreground" />
                              }
                              onSelect={() => onTransferOwnership?.(row)}
                            >
                              Transfer ownership
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              showIcon
                              icon={<Trash2Icon />}
                              variant="destructive"
                              onSelect={() =>
                                isPending
                                  ? onRevokeInvite?.(row)
                                  : onRemoveMember?.(row)
                              }
                            >
                              {isPending
                                ? "Revoke invitation"
                                : "Remove from team"}
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

type MembersSectionProps = MembersTableProps & {
  heading: string;
  /** Message for a failed query. Replaces the table; the two load independently. */
  error?: string;
  onRetry?: () => void;
};

function MembersSection({
  heading,
  error,
  onRetry,
  ...tableProps
}: MembersSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <Typography size="lg" weight="semibold">
        {heading}
      </Typography>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex w-full items-center justify-between gap-4">
            <span>{error}</span>
            {onRetry ? (
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : (
        <MembersTable {...tableProps} />
      )}
    </div>
  );
}

type TeamMembersLayoutProps = {
  /**
   * Outstanding invitations. ⚠️ Scoped to a single business, which this
   * layout has no selector for — see `product-specs/team-members.md` →
   * "Data model & scope".
   */
  pendingInvites?: PendingInvite[];
  /** Active members of the same business. */
  activeMembers?: TeamMember[];
  /** Names the business in the removal confirmation's copy. */
  businessName?: string;
  /** Renders both tables as skeletons. */
  loading?: boolean;
  /** Per-query errors — the two GETs fail independently. */
  pendingError?: string;
  activeError?: string;
  onRetry?: (scope: "pending" | "active") => void;
  /** Called when the header's close ("Done") button is activated. */
  onClose?: () => void;
  /**
   * Called with the filled-in rows when the "Invite team members" dialog's
   * "Send Invites" is activated. The dialog closes itself either way.
   */
  onSendInvites?: (invites: { email: string; role: TeamRole }[]) => void;
  /**
   * Called with the edited values when a row's `EditMemberDialog` "Save" is
   * activated. `edited.role` is absent for the owner, whose role the dialog
   * doesn't edit.
   */
  onEditMember?: (row: MemberRow, edited: EditMemberDialogMember) => void;
  /** Called after the removal is confirmed. Never offered for the owner. */
  onRemoveMember?: (row: MemberRow) => void;
  /** Called after the revocation is confirmed. Pending rows only. */
  onRevokeInvite?: (row: MemberRow) => void;
  /** Called immediately — resending is idempotent, so it doesn't confirm. */
  onResendInvite?: (row: MemberRow) => void;
  /** Called when the owner row's "Transfer ownership" action is activated. */
  onTransferOwnership?: (row: MemberRow) => void;
};

/**
 * Provider Portal "Team members" settings page (Figma origin: Provider
 * Portal → "Team members" frame). Rendered inside `AccountSettingsLayout`'s
 * content column — a search + invite row, then "Pending invites" and
 * "Active" member tables built from the shared `Table`/`TableCellUser`
 * primitives.
 *
 * Behaviour is specified in `product-specs/team-members.md`; the parts most
 * easily broken by a well-meaning edit:
 *
 * - Search filters **both** tables client-side and the section counts follow
 *   the filtered result, so a heading can never contradict its rows.
 * - A section with no rows is hidden entirely rather than rendering a "0"
 *   heading over an empty table.
 * - The two tables are separate queries with separate error states.
 * - The owner's row can be edited but never removed or re-roled.
 */
function TeamMembersLayout({
  pendingInvites = PENDING_INVITES,
  activeMembers = ACTIVE_MEMBERS,
  businessName = "this business",
  loading = false,
  pendingError,
  activeError,
  onRetry,
  onClose,
  onSendInvites,
  onEditMember,
  onRemoveMember,
  onRevokeInvite,
  onResendInvite,
  onTransferOwnership,
}: TeamMembersLayoutProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingRow, setEditingRow] = React.useState<MemberRow | null>(null);
  // Separate from `editingRow` so the dialog stays mounted (and its Radix
  // close animation can actually play) while closing — clearing `editingRow`
  // immediately via `{editingRow && <EditMemberDialog>}` would unmount the
  // dialog mid-transition instead of letting `open` toggle to false first.
  // `editingRow` itself is left populated (not reset to null) until the next
  // row's Edit is clicked, so the content doesn't flash empty while it's
  // animating out.
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [confirmingRow, setConfirmingRow] = React.useState<MemberRow | null>(
    null,
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  /**
   * ⚠️ Stand-in for a toast. Resending an invitation and removing a member
   * both complete with no other visible change, so without this the user
   * can't tell whether anything happened. Replace with a real toast
   * primitive once UCL has one — `Alert` is a static banner and can't
   * self-dismiss.
   */
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const pendingRows = React.useMemo(
    () => pendingInvites.map(toPendingRow),
    [pendingInvites],
  );
  const activeRows = React.useMemo(
    () => activeMembers.map(toActiveRow),
    [activeMembers],
  );

  const filteredPending = pendingRows.filter((row) =>
    matchesQuery(row, searchQuery),
  );
  const filteredActive = activeRows.filter((row) =>
    matchesQuery(row, searchQuery),
  );

  const isSearching = searchQuery.trim() !== "";
  const showPending =
    pendingError !== undefined || loading || filteredPending.length > 0;
  const showActive =
    activeError !== undefined || loading || filteredActive.length > 0;
  const showNoMatches = isSearching && !loading && !showPending && !showActive;

  function openEditDialog(row: MemberRow) {
    setFeedback(null);
    setEditingRow(row);
    setEditDialogOpen(true);
  }

  function openConfirmDialog(row: MemberRow) {
    setFeedback(null);
    setConfirmingRow(row);
    setConfirmDialogOpen(true);
  }

  function handleConfirm() {
    if (!confirmingRow) return;
    if (confirmingRow.kind === "pending") {
      onRevokeInvite?.(confirmingRow);
      setFeedback(`Invitation for ${confirmingRow.email} revoked.`);
    } else {
      onRemoveMember?.(confirmingRow);
      setFeedback(
        `${confirmingRow.name ?? confirmingRow.email} removed from the team.`,
      );
    }
  }

  function handleResend(row: MemberRow) {
    onResendInvite?.(row);
    setFeedback(`Invitation resent to ${row.email}.`);
  }

  const editingMember: EditMemberDialogMember | null = editingRow
    ? {
        name: editingRow.name ?? "",
        email: editingRow.email,
        phone: editingRow.phone,
        avatarUrl: editingRow.avatarUrl,
        title: editingRow.title ?? "",
        role: toTeamRole(editingRow.role) ?? undefined,
      }
    : null;

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
            onChange={(e) => {
              setFeedback(null);
              setSearchQuery(e.target.value);
            }}
            onClear={() => setSearchQuery("")}
          />
          <InviteTeamMembersDialog
            existingEmails={activeRows.map((row) => row.email)}
            pendingEmails={pendingRows.map((row) => row.email)}
            onSendInvites={(invites) => {
              onSendInvites?.(invites);
              setFeedback(
                invites.length === 1
                  ? `Invitation sent to ${invites[0].email}.`
                  : `${invites.length} invitations sent.`,
              );
            }}
          >
            <DialogTrigger asChild>
              <Button type="button" size="lg" onClick={() => setFeedback(null)}>
                <UserPlusIcon />
                Invite member
              </Button>
            </DialogTrigger>
          </InviteTeamMembersDialog>
        </div>

        {feedback ? (
          <Alert variant="success">
            <AlertDescription>{feedback}</AlertDescription>
          </Alert>
        ) : null}

        {showPending ? (
          <MembersSection
            heading={
              // No count until the data has actually landed — a heading
              // rendered from whatever is in state mid-load either lies
              // ("2 pending invites" over skeleton rows) or reads as a real
              // empty result ("0 pending invites").
              loading || pendingError
                ? "Pending invites"
                : `${filteredPending.length} pending invite${
                    filteredPending.length === 1 ? "" : "s"
                  }`
            }
            error={pendingError}
            onRetry={onRetry ? () => onRetry("pending") : undefined}
            rows={filteredPending}
            dateColumnLabel="Date invited"
            loading={loading}
            skeletonRows={2}
            onEditMember={openEditDialog}
            onResendInvite={handleResend}
            onRevokeInvite={openConfirmDialog}
          />
        ) : null}

        {showActive ? (
          <MembersSection
            heading={
              loading || activeError
                ? "Active"
                : `${filteredActive.length} active`
            }
            error={activeError}
            onRetry={onRetry ? () => onRetry("active") : undefined}
            rows={filteredActive}
            dateColumnLabel="Last seen"
            loading={loading}
            skeletonRows={4}
            onEditMember={openEditDialog}
            onRemoveMember={openConfirmDialog}
            onTransferOwnership={onTransferOwnership}
          />
        ) : null}

        {showNoMatches ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Typography size="base" className="text-muted-foreground">
              No team members match “{searchQuery.trim()}”.
            </Typography>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        ) : null}
      </div>

      {editingRow && editingMember && (
        <EditMemberDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          member={editingMember}
          // The owner's role is backend-assigned; showing a picker here
          // would display the wrong role and save a demotion.
          lockedRoleLabel={editingRow.role === "Owner" ? "Owner" : undefined}
          pending={editingRow.kind === "pending"}
          onSave={(edited) => onEditMember?.(editingRow, edited)}
        />
      )}

      {confirmingRow && (
        <ConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          title={
            confirmingRow.kind === "pending"
              ? `Revoke the invitation for ${confirmingRow.email}?`
              : `Remove ${
                  confirmingRow.name ?? confirmingRow.email
                } from the team?`
          }
          description={
            confirmingRow.kind === "pending"
              ? "The invitation link stops working. You can invite them again at any time."
              : `They'll immediately lose access to ${businessName}. This doesn't delete their BeThere account.`
          }
          confirmLabel={
            confirmingRow.kind === "pending" ? "Revoke invitation" : "Remove"
          }
          onConfirm={handleConfirm}
        />
      )}
    </AccountSettingsLayout>
  );
}

export { TeamMembersLayout, ACTIVE_MEMBERS, PENDING_INVITES };
export type { TeamMember, PendingInvite, MemberRow, MemberRole };
