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
  return { id: `invite-${nextRowId}`, email: "", role: "staff", emailTouched: false };
}

// Matches the pattern used by MyProfileLayout's email field — "good enough"
// to catch missing @/domain typos without rejecting valid addresses a
// stricter regex might choke on.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

type InviteTeamMembersDialogProps = React.ComponentProps<typeof Dialog> & {
  /** Called with the filled-in rows when "Send Invites" is activated. */
  onSendInvites?: (invites: { email: string; role: TeamRole }[]) => void;
  className?: string;
};

/**
 * "Invite team members" dialog (Figma: bethere.ds `Invite team members`).
 * One or more email + role rows, each row addable via "Add Member" — built
 * on the shared `Dialog`, `Input`, and `RoleSelect`. Row state (email
 * value, role) is owned here; the consumer only receives the filled rows
 * on submit via `onSendInvites`.
 */
function InviteTeamMembersDialog({
  onSendInvites,
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

  // A row with no email is simply skipped on send; a row with a non-empty
  // but malformed email blocks sending until it's fixed or removed.
  const hasInvalidEmail = rows.some(
    (row) => row.email.trim() !== "" && !isValidEmail(row.email),
  );
  const filledEmailCount = rows.filter(
    (row) => row.email.trim() !== "",
  ).length;

  function handleSend() {
    if (hasInvalidEmail) {
      // Surface the error on every row that has one, even if the user
      // never blurred that field before clicking Send.
      setRows((prev) => prev.map((row) => ({ ...row, emailTouched: true })));
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
          <DialogTitle>Invite team members</DialogTitle>
          <DialogDescription>
            Invite members by email and assign a role.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {rows.map((row, index) => {
            const hasLabel = index === 0;
            const canRemove = rows.length > 1;
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
                  error={
                    row.emailTouched &&
                    row.email.trim() !== "" &&
                    !isValidEmail(row.email)
                      ? "Enter a valid email address."
                      : undefined
                  }
                >
                  <Input
                    id={`${row.id}-email`}
                    type="email"
                    placeholder="john.smith@email.com"
                    value={row.email}
                    aria-invalid={
                      row.emailTouched &&
                      row.email.trim() !== "" &&
                      !isValidEmail(row.email)
                    }
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
                    className={cn(hasLabel && "mt-[28px]")}
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
            className="w-fit self-start no-underline hover:no-underline"
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
            disabled={hasInvalidEmail || filledEmailCount === 0}
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
