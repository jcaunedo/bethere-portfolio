import * as React from "react";
import { UserIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/forms/input";
import { FormField } from "@/components/forms/field";
import { RoleSelect, type TeamRole } from "@/components/forms/role-select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/data-display/avatar";
import { Alert, AlertDescription } from "@/components/feedback/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/overlays/dialog";

/**
 * "Lucy Smith" → "LS"; falls back to the first two characters if there's no
 * space, and to an empty string for a member with no name yet (a pending
 * invitation, which is an email address and nothing else until accepted).
 */
function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (trimmed === "") return "";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

type EditMemberDialogMember = {
  name: string;
  email: string;
  /** Optional — Figma: "Phone", sits between Email and Role. */
  phone?: string;
  avatarUrl?: string;
  /** Job title (Figma: "Job title"). */
  title: string;
  /**
   * Absent when the role isn't editable here — the owner, whose role has no
   * `RoleSelect` option. The dialog leaves it absent in the value it saves
   * too, so a consumer can tell "role unchanged" from "role set to staff".
   */
  role?: TeamRole;
};

type EditMemberDialogProps = React.ComponentProps<typeof Dialog> & {
  /** The member being edited — seeds the form's initial values. */
  member: EditMemberDialogMember;
  /** Called with the edited values when "Save" is activated. The dialog
   * closes itself either way. */
  onSave?: (member: EditMemberDialogMember) => void;
  /**
   * Renders Role as read-only text with this label instead of a
   * `RoleSelect` — for the business owner, whose role is written by the
   * backend only and can't be reassigned from a picker. `RoleSelect` has no
   * "Owner" option to select, so without this the owner's row would display
   * a role it doesn't have and save a demotion.
   */
  lockedRoleLabel?: string;
  /**
   * Marks this as an invitation that hasn't been accepted yet. The person
   * has no account, so the name/phone/title fields are pre-seed data rather
   * than edits, and changing the email re-targets the invitation — both of
   * which the dialog says out loud rather than leaving the user to infer.
   */
  pending?: boolean;
  className?: string;
};

/**
 * "Edit member" dialog (Figma: bethere.ds `Edit member`) — avatar, First
 * name/Last name, Email, Phone, Job title, and Role fields with a Cancel/Save
 * footer. Built on the shared `Dialog`, `Avatar`, `Input`, and `RoleSelect`,
 * matching `InviteTeamMembersDialog`'s composition pattern. Form state is
 * seeded from `member` and reset whenever the dialog opens, so reopening it
 * for a different member (or after a previous edit was cancelled) never
 * shows stale values.
 *
 * Two rows need special handling and get it through props rather than a
 * separate dialog: the business owner (`lockedRoleLabel`), whose role isn't
 * assignable from a picker, and a pending invitation (`pending`), whose
 * person doesn't exist yet.
 */
function EditMemberDialog({
  member,
  onSave,
  lockedRoleLabel,
  pending = false,
  className,
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: EditMemberDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  );
  const isOpen = open ?? uncontrolledOpen;
  function setOpen(next: boolean) {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  const { firstName: initialFirstName, lastName: initialLastName } =
    splitName(member.name);
  const [firstName, setFirstName] = React.useState(initialFirstName);
  const [lastName, setLastName] = React.useState(initialLastName);
  const [title, setTitle] = React.useState(member.title);
  const [email, setEmail] = React.useState(member.email);
  const [phone, setPhone] = React.useState(member.phone ?? "");
  const [role, setRole] = React.useState<TeamRole>(member.role ?? "staff");
  const contentRef = React.useRef<React.ComponentRef<typeof DialogContent>>(
    null,
  );

  // Reseed the form from `member` whenever the dialog transitions to open —
  // covers both "reopened for a different member" and "reopened for the
  // same member after Cancel left stale edits in state".
  React.useEffect(() => {
    if (!isOpen) return;
    const { firstName: f, lastName: l } = splitName(member.name);
    setFirstName(f);
    setLastName(l);
    setTitle(member.title);
    setEmail(member.email);
    setPhone(member.phone ?? "");
    setRole(member.role ?? "staff");
    // Only re-seed on the open transition, not on every `member` identity
    // change while already open (e.g. a parent re-render passing a new
    // object) — that would clobber in-progress edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isUnchanged =
    firstName === initialFirstName &&
    lastName === initialLastName &&
    title === member.title &&
    email === member.email &&
    phone === (member.phone ?? "") &&
    // A locked role has no control to change it, so it can never be the
    // thing that enables Save.
    (lockedRoleLabel !== undefined || role === (member.role ?? "staff"));

  const emailRetargeted = pending && email.trim() !== member.email;

  function handleSave() {
    onSave?.({
      name: [firstName, lastName].filter(Boolean).join(" "),
      email,
      phone: phone.trim() === "" ? undefined : phone,
      avatarUrl: member.avatarUrl,
      title,
      // Left absent rather than echoed back when the role wasn't editable,
      // so a consumer never mistakes the placeholder for an edit.
      role: lockedRoleLabel !== undefined ? undefined : role,
    });
    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen} {...props}>
      {children}
      <DialogContent
        ref={contentRef}
        className={cn("gap-6 sm:max-w-[480px]", className)}
        showCloseButton={false}
        onOpenAutoFocus={(e) => {
          // Radix's default auto-focus lands on the Close button (the first
          // focusable descendant in DOM order), showing an unwanted focus
          // ring on open. Redirect to the content root instead (Radix gives
          // it tabIndex={-1} + outline-none, so it's focusable — keeping
          // focus inside the dialog's FocusScope for Tab-trapping — without
          // rendering a visible ring anywhere) so every field stays in its
          // default state until the user actually interacts with it.
          e.preventDefault();
          contentRef.current?.focus();
        }}
      >
        <div className="flex flex-col items-center gap-0">
          <div className="flex w-full justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
              >
                <XIcon />
              </Button>
            </DialogClose>
          </div>
          <Avatar size="xl" className="-mt-4">
            {member.avatarUrl ? (
              <AvatarImage src={member.avatarUrl} alt="" />
            ) : null}
            {initialsFromName(member.name) === "" ? (
              // No name to derive initials from — a neutral icon avatar,
              // not a colored initials tile implying an identity that
              // doesn't exist yet.
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            ) : (
              <AvatarFallback colorSeed={member.name}>
                {initialsFromName(member.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField htmlFor="edit-member-first-name" label="First name">
              <Input
                id="edit-member-first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormField>
            <FormField htmlFor="edit-member-last-name" label="Last name">
              <Input
                id="edit-member-last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormField>
          </div>
          <FormField htmlFor="edit-member-email" label="Email">
            <Input
              id="edit-member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          <FormField htmlFor="edit-member-phone" label="Phone">
            <Input
              id="edit-member-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>
          <FormField htmlFor="edit-member-title" label="Job title">
            <Input
              id="edit-member-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormField>
          {lockedRoleLabel !== undefined ? (
            <FormField
              htmlFor="edit-member-role"
              label="Role"
              description="Ownership can only be changed by transferring it."
            >
              <Input
                id="edit-member-role"
                value={lockedRoleLabel}
                readOnly
                aria-readonly
                className="bg-fill-subtle text-muted-foreground"
              />
            </FormField>
          ) : (
            <FormField htmlFor="edit-member-role" label="Role">
              <RoleSelect value={role} onValueChange={setRole} />
            </FormField>
          )}

          {pending ? (
            <Alert variant="info">
              <AlertDescription>
                This person hasn&apos;t accepted yet — anything you add here
                pre-fills their profile, and their own entries win once they
                sign up.
              </AlertDescription>
            </Alert>
          ) : null}

          {emailRetargeted ? (
            <Alert variant="warning">
              <AlertDescription>
                Saving sends a new invitation to {email.trim()} and cancels the
                one sent to {member.email}.
              </AlertDescription>
            </Alert>
          ) : null}
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
            disabled={isUnchanged}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { EditMemberDialog };
export type { EditMemberDialogProps, EditMemberDialogMember };
