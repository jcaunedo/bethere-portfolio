import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import {
  enterTransition,
  exitTransition,
  useMotionPreference,
} from "@/lib/motion";

type SettingsDetailRowProps = Omit<
  React.ComponentProps<"div">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> & {
  /** Field title (Figma `Title`), e.g. "Name". */
  title: string;
  /**
   * Current field value. When empty/undefined the row renders in its
   * "Default (Empty)" state (Figma) with `emptyPlaceholder` and an "Add"
   * action; when present it renders "HasValue" with the value shown and an
   * "Edit" action.
   */
  value?: React.ReactNode;
  /** Placeholder shown in place of `value` when empty, e.g. "No name yet". */
  emptyPlaceholder?: React.ReactNode;
  /**
   * Optional third line shown below the value in the collapsed state only
   * (Figma `Preferred language`'s "Other: Spanish, Italian" note). Hidden
   * while editing.
   */
  note?: React.ReactNode;
  /** Action label when `value` is empty. Defaults to "Add". */
  addLabel?: string;
  /** Action label when `value` is present. Defaults to "Edit". */
  editLabel?: string;
  /**
   * Form rendered inside the expanded "Edit" state (Figma `Property
   * 1=Edit`). Typically the row's own inputs — this component only owns the
   * expand/collapse shell, header, and Save/Cancel footer.
   */
  children?: React.ReactNode;
  /**
   * Guidance shown as the subtitle while expanded and adding a new value
   * (`title` is empty). Falls back to `emptyPlaceholder`. Figma's single
   * example only covers the "editing an existing value" case, so there is
   * no Figma-sourced copy for this — omit to show no subtitle.
   */
  addDescription?: React.ReactNode;
  /**
   * Guidance shown as the subtitle while expanded and editing an existing
   * value, e.g. "Use your real name so your teammates can recognize you."
   * (Figma `Description`).
   */
  editDescription?: React.ReactNode;
  /** Whether the row is currently expanded into edit mode (controlled). */
  editing?: boolean;
  /** Called when the row should expand (Add/Edit action activated). */
  onEditStart?: () => void;
  /**
   * Called when Cancel is activated. Rendered as a text action in the
   * header row, at the same level as the collapsed Edit/Add action (Figma
   * `Property 1=Edit`) — not next to Save at the bottom.
   */
  onCancel?: () => void;
  /** Called when Save is activated. */
  onSave?: () => void;
  /** Save button label. Defaults to "Save". */
  saveLabel?: string;
  /** Cancel button label. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Disables the Save action (e.g. while submitting or invalid). */
  saveDisabled?: boolean;
  /**
   * Hides the Save button footer entirely (e.g. a single-choice field like
   * Time zone that saves immediately on selection instead of requiring an
   * explicit confirm). The row still expands/collapses and Cancel still
   * works — only the Save action goes away.
   */
  hideSaveButton?: boolean;
};

/**
 * Read-only settings field that expands into an edit form (Figma
 * `Settings Detail Row`, states `Default (Empty)` / `HasValue` / `Edit`).
 * The row itself only owns title/value display, the Add/Edit action, and
 * the expand/collapse shell — the edit form is supplied via `children`
 * since its shape (inputs, checkboxes, pickers…) differs per field.
 */
function SettingsDetailRow({
  className,
  title,
  value,
  emptyPlaceholder,
  note,
  addLabel = "Add",
  editLabel = "Edit",
  children,
  addDescription,
  editDescription,
  editing = false,
  onEditStart,
  onCancel,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  saveDisabled = false,
  hideSaveButton = false,
  ...props
}: SettingsDetailRowProps) {
  const hasValue = value !== undefined && value !== null && value !== "";
  const { resolve } = useMotionPreference();

  // Esc-to-close is handled by the consumer, not here: when several rows
  // can be open at once, only one shared listener can know which row was
  // opened most recently and close just that one (LIFO). A per-row
  // listener here would have every open row react to the same keypress.

  // Editing an existing value → "Edit {title}" + editDescription guidance.
  // Adding a new one → "Add {title}" + addDescription (falls back to the
  // same placeholder shown collapsed) guidance. Collapsed → plain title +
  // value/placeholder. One block, never rendered twice.
  const heading = editing ? (hasValue ? `Edit ${title}` : `Add ${title}`) : title;
  const subtitle = editing
    ? (hasValue ? editDescription : (addDescription ?? emptyPlaceholder))
    : (hasValue ? value : emptyPlaceholder);

  // A note-bearing row (e.g. Insurance provider, Preferred language) uses a
  // wider 6px title→value gap than the ordinary 4px, so the value→note pair
  // below it can sit flush (0px) via the negative margin on `note` — an
  // ordinary row with no note keeps the default 4px throughout.
  const hasNote = !editing && Boolean(note);

  const headingBlock = (
    <motion.div
      layout="position"
      transition={resolve(enterTransition)}
      className={cn(
        "flex min-w-0 flex-1 flex-col text-base",
        hasNote ? "gap-1.5" : "gap-1",
      )}
    >
      <p className="font-semibold text-foreground">{heading}</p>
      {subtitle ? (
        // A plain <div>, not <p> — the collapsed HasValue subtitle can be a
        // rich node (e.g. Primary contact's avatar + name/note block, Figma
        // "row" with `avatar-users`), which a <p> can't validly contain.
        <div
          className={
            editing
              ? "text-sm text-muted-foreground"
              : hasValue
                ? "text-base text-foreground"
                : "text-base text-foreground-subtle"
          }
        >
          {subtitle}
        </div>
      ) : null}
      {hasNote ? (
        // `-mt-1` (-4px) trims the 6px flex gap above down to 2px, so
        // value→note reads as gap-0.5 while title→value keeps its wider 6px.
        <p className="-mt-1 text-sm text-muted-foreground">{note}</p>
      ) : null}
    </motion.div>
  );

  return (
    <motion.div
      data-slot="settings-detail-row"
      data-state={editing ? "edit" : hasValue ? "has-value" : "empty"}
      layout
      transition={resolve(enterTransition)}
      className={cn(
        "flex w-full flex-col items-start gap-4 rounded-xl px-2",
        className,
      )}
      {...props}
    >
      {!editing ? (
        <motion.button
          type="button"
          data-slot="settings-detail-row-trigger"
          layout="position"
          transition={resolve(enterTransition)}
          onClick={onEditStart}
          className="group flex w-full items-center gap-6 rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {headingBlock}
          <span
            data-slot="settings-detail-row-action"
            className="h-8 shrink-0 py-1.5 text-sm font-medium text-primary group-hover:text-foreground"
          >
            {hasValue ? editLabel : addLabel}
          </span>
        </motion.button>
      ) : (
        <motion.div
          layout="position"
          transition={resolve(enterTransition)}
          className="flex w-full items-center gap-6"
        >
          {headingBlock}
          <button
            type="button"
            data-slot="settings-detail-row-cancel"
            onClick={onCancel}
            className="h-8 shrink-0 py-1.5 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {cancelLabel}
          </button>
        </motion.div>
      )}

      <AnimatePresence initial={false}>
        {editing ? (
          <motion.div
            key="edit-form"
            data-slot="settings-detail-row-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: resolve(enterTransition) }}
            exit={{ opacity: 0, transition: resolve(exitTransition) }}
            className="flex w-full flex-col gap-4"
          >
            {children}

            {!hideSaveButton ? (
              <div className="flex items-start gap-2">
                <Button
                  type="button"
                  size="lg"
                  className="w-18 justify-center"
                  onClick={onSave}
                  disabled={saveDisabled}
                >
                  {saveLabel}
                </Button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export { SettingsDetailRow };
export type { SettingsDetailRowProps };
