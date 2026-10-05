import * as React from "react";
import { CircleMinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/forms/input";
import { FormField } from "@/components/forms/field";
import { RoleSelect, type TeamRole } from "@/components/forms/role-select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/overlays/dialog";

type InviteRow = {
  id: string;
  email: string;
  role: TeamRole;
  /** Whether the email field has been blurred at least once — an empty or
   * in-progress email shouldn't show an error until the user leaves it. */
  emailTouched: boolean;
};

let nextRowId = 0;
function createInviteRow(): InviteRow {
  nextRowId += 1;
  return {
    id: `invite-${nextRowId}`,
    email: "",
    role: "staff",
    emailTouched: false,
  };
}

// Matches the pattern used by MyProfileLayout's email field — "good enough"
// to catch missing @/domain typos without rejecting valid addresses a
// stricter regex might choke on.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Email addresses compare case-insensitively and ignoring stray whitespace. */
function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

type InviteTeamMembersDialogProps = React.ComponentProps<typeof Dialog> & {
  /** Called with the filled-in rows when "Send Invites" is activated. */
  onSendInvites?: (invites: { email: string; role: TeamRole }[]) => void;
  /**
   * Emails of people already on the team. Inviting one is blocked with an
   * inline row error rather than sent and rejected by the server — the
   * caller already has both lists in memory, so this check costs nothing.
   */
  existingEmails?: string[];
  /** Emails with an invitation already outstanding. Same treatment. */
  pendingEmails?: string[];
  className?: string;
};

/**
 * "Invite team members" dialog (Figma: bethere.ds `Invite team members`).
 * One or more email + role rows, each row addable via "Add Member" — built
 * on the shared `Dialog`, `Input`, and `RoleSelect`. Row state (email
 * value, role) is owned here; the consumer only receives the filled rows
 * on submit via `onSendInvites`.
 *
 * Pass `existingEmails`/`pendingEmails` to catch a duplicate invite before
 * it's sent — inviting someone who is already on the team, or who already
 * has an invitation outstanding, is blocked inline rather than silently
 * creating a second invite.
 */
function InviteTeamMembersDialog({
  onSendInvites,
  existingEmails = [],
  pendingEmails = [],
  className,
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: InviteTeamMembersDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  );
  const isOpen = open ?? uncontrolledOpen;
  function setOpen(next: boolean) {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  const [rows, setRows] = React.useState<InviteRow[]>(() => [
    createInviteRow(),
  ]);

  function addRow() {
    setRows((prev) => [...prev, createInviteRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function updateRow(id: string, patch: Partial<Omit<InviteRow, "id">>) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  const existingSet = React.useMemo(
    () => new Set(existingEmails.map(normalizeEmail)),
    [existingEmails],
  );
  const pendingSet = React.useMemo(
    () => new Set(pendingEmails.map(normalizeEmail)),
    [pendingEmails],
  );

  /**
   * The one blocking problem with a row's email, or `undefined`. An empty
   * row is never an error — it's simply skipped on send.
   *
   * Order matters: a malformed address can't meaningfully be "already a
   * member", so format is checked first, and the duplicate-within-this-list
   * check runs last so the *first* occurrence stays clean and only the
   * repeat is flagged.
   */
  function emailError(row: InviteRow, index: number): string | undefined {
    const value = row.email.trim();
    if (value === "") return undefined;
    if (!isValidEmail(value)) return "Enter a valid email address.";

    const normalized = normalizeEmail(value);
    if (existingSet.has(normalized)) return "Already a team member.";
    if (pendingSet.has(normalized))
      return "Already invited — resend that invitation instead.";
    if (
      rows.some(
        (other, otherIndex) =>
          otherIndex < index && normalizeEmail(other.email) === normalized,
      )
    )
      return "This email is already in the list.";
    return undefined;
  }

  const rowErrors = rows.map(emailError);
  const hasBlockingError = rowErrors.some(Boolean);
  const filledEmailCount = rows.filter(
    (row) => row.email.trim() !== "",
  ).length;

  function handleSend() {
    if (hasBlockingError) {
      // Surface the error on every row that has one, even if the user
      // never blurred that field before clicking Send.
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          emailTouched: true,
        })),
      );
      return;
    }
    onSendInvites?.(
      rows
        .filter((row) => row.email.trim() !== "")
        .map(({ email, role }) => ({ email, role })),
    );
    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen} {...props}>
      {children}
      <DialogContent className={cn("sm:max-w-[600px]", className)}>
        <DialogHeader>
          <DialogTitle>Invite members</DialogTitle>
          <DialogDescription>
            Invite members by email and assign a role.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {rows.map((row, index) => {
            const hasLabel = index === 0;
            const canRemove = rows.length > 1;
            // Held back until the field has been blurred once, so a
            // half-typed address never flashes red mid-keystroke.
            const error = row.emailTouched ? rowErrors[index] : undefined;
            return (
              <div
                key={row.id}
                className={cn(
                  "grid items-start gap-2",
                  canRemove
                    ? "grid-cols-[minmax(0,2fr)_minmax(0,1fr)_fit-content(100%)]"
                    : "grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
                )}
              >
                <FormField
                  htmlFor={`${row.id}-email`}
                  label={hasLabel ? "Email" : undefined}
                  error={error}
                >
                  <Input
                    id={`${row.id}-email`}
                    type="email"
                    placeholder="name@company.com"
                    value={row.email}
                    aria-invalid={error !== undefined}
                    onChange={(e) =>
                      updateRow(row.id, { email: e.target.value })
                    }
                    onBlur={() => updateRow(row.id, { emailTouched: true })}
                  />
                </FormField>
                <FormField
                  htmlFor={`${row.id}-role`}
                  label={hasLabel ? "Role" : undefined}
                >
                  <RoleSelect
                    value={row.role}
                    onValueChange={(role) => updateRow(row.id, { role })}
                    triggerClassName="h-9"
                    contentClassName="w-[304px] min-w-[304px]"
                  />
                </FormField>
                {canRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    aria-label="Remove member"
                    // Aligns the button with the input row, not the label
                    // row above it (Figma: the "X" sits beside the input,
                    // never beside "Email"/"Role").
                    className={cn(
                      "text-muted-foreground hover:text-foreground",
                      hasLabel && "mt-[28px]",
                    )}
                    onClick={() => removeRow(row.id)}
                  >
                    <CircleMinusIcon />
                  </Button>
                )}
              </div>
            );
          })}

          <Button
            type="button"
            variant="link"
            size="lg"
            className="w-fit self-start"
            onClick={addRow}
          >
            <PlusIcon />
            Add Member
          </Button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="lg"
            disabled={hasBlockingError || filledEmailCount === 0}
            onClick={handleSend}
          >
            {filledEmailCount > 1 ? "Send Invites" : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { InviteTeamMembersDialog };
export type { InviteTeamMembersDialogProps };
