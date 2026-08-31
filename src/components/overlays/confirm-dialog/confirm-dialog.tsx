import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/overlays/dialog";

type ConfirmDialogProps = React.ComponentProps<typeof Dialog> & {
  /** Poses the action as a question, e.g. "Remove Guy Hawkins from the team?" */
  title: React.ReactNode;
  /**
   * What actually happens, and what doesn't. Required — a confirmation with
   * nothing but a title asks the user to guess at the consequence, which is
   * the one thing a confirmation exists to prevent.
   */
  description: React.ReactNode;
  /**
   * Names the action rather than agreeing with the question ("Remove", not
   * "Yes"/"OK") so the button is unambiguous read on its own.
   */
  confirmLabel: string;
  cancelLabel?: string;
/**
   * Styles the confirm button as the solid destructive variant. Defaults to
   * `true` — the subtle `destructive` variant reads as a secondary action,
   * which is wrong for the committing button of a confirmation.
   */
  destructive?: boolean;
  /** Called when the confirm button is activated. The dialog closes itself. */
  onConfirm?: () => void;
  className?: string;
};

/**
 * Confirmation dialog for an action that destroys something — removing a
 * team member, revoking an invitation, deleting a document.
 *
 * Composed on the shared `Dialog` (matching `EditMemberDialog` and
 * `InviteTeamMembersDialog`, its siblings in this family) rather than
 * introducing Radix's separate `AlertDialog` primitive. It takes
 * `AlertDialog`'s two behaviors that actually matter here: `role="alertdialog"`
 * so assistive tech announces it as requiring a response, and initial focus
 * on **Cancel** rather than the destructive action, so a stray Enter on a
 * freshly-opened dialog can't confirm the thing it was asking about.
 */
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  className,
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  );
  const isOpen = open ?? uncontrolledOpen;
  function setOpen(next: boolean) {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  function handleConfirm() {
    onConfirm?.();
    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen} {...props}>
      {children}
      <DialogContent
        role="alertdialog"
        showCloseButton={false}
        className={cn("sm:max-w-[440px]", className)}
        onOpenAutoFocus={(e) => {
          // Radix focuses the first focusable descendant, which in DOM order
          // is the confirm button's row — landing focus on the destructive
          // action of a dialog the user hasn't read yet.
          e.preventDefault();
          cancelRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button ref={cancelRef} type="button" variant="outline" size="lg">
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="lg"
            variant={destructive ? "destructive-solid" : "default"}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
export type { ConfirmDialogProps };
