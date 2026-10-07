import * as React from "react";

import { Button } from "@/components/buttons/button";
import { toast } from "@/components/feedback/sonner";
import { cn } from "@/lib/utils";

/**
 * "Save as draft" for any New Listing step: calls `onSaveDraft` and confirms with a toast — success
 * when it resolves (or returns nothing), an error (its message, or a generic one) when it rejects.
 * `saving` is true while a returned promise runs, so the button can wait and not save twice.
 * Toasts need the app's `<Toaster />`. Layout-internal helper, not part of the package API.
 */
function useSaveDraft<T extends unknown[]>(onSaveDraft?: (...values: T) => void | Promise<unknown>) {
	const [saving, setSaving] = React.useState(false);
	const mounted = React.useRef(false);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	const save = async (...values: T) => {
		if (!onSaveDraft || saving) return;
		setSaving(true);
		try {
			await onSaveDraft(...values);
			toast.success("Saved as a draft. You can finish it anytime.");
		} catch (error) {
			toast.error(error instanceof Error && error.message ? error.message : "Couldn't save the draft. Try again.");
		} finally {
			if (mounted.current) setSaving(false);
		}
	};

	return { saving, save };
}

/** A step opened from Review's summary (edit mode) — see `NewListingStepProps.reviewEdit`. */
type ReviewEdit = {
	/** Anything differs from when the step was opened; `undefined` when not tracked. */
	changed?: boolean;
	/** Return to Review (only offered while nothing has changed). */
	onBackToReview: () => void;
	/** Put the step back as it was when opened, staying on it. */
	onDiscard: () => void;
};

/**
 * A step's actions row (Figma "11. Verify Business - Single", node 106:2827): "Save as draft"
 * (outline) and the main "Continue" side by side, equal width, 16px apart, both xl (40px).
 * "Save as draft" stays available while Continue is disabled — saving is how a provider leaves a
 * step they can't finish yet. Continue submits the step's form unless `onContinue` is given.
 *
 * Edit mode (`reviewEdit`, the step opened from Review): the main button reads "Save and review" —
 * disabled until something changes (when tracked) — and "Save as draft" gives way to "Back to
 * review". Once something changes, that button becomes "Discard changes": it puts the step back as
 * it was (staying on it, confirmed with a toast) and turns back into "Back to review".
 */
function StepActions({
	onSaveDraft,
	onContinue,
	continueDisabled = false,
	reviewEdit,
	className,
}: {
	onSaveDraft?: () => void | Promise<unknown>;
	/** Continue as a plain button with this handler; omit to submit the surrounding form. */
	onContinue?: () => void;
	continueDisabled?: boolean;
	reviewEdit?: ReviewEdit;
	className?: string;
}) {
	const { saving, save } = useSaveDraft(onSaveDraft);

	return (
		<div className={cn("flex w-full gap-4", className)}>
			{reviewEdit ? (
				reviewEdit.changed ? (
					<Button
						type="button"
						variant="outline"
						size="xl"
						className="flex-1"
						onClick={() => {
							reviewEdit.onDiscard();
							toast("Changes discarded");
						}}
					>
						Discard changes
					</Button>
				) : (
					<Button type="button" variant="outline" size="xl" className="flex-1" onClick={reviewEdit.onBackToReview}>
						Back to review
					</Button>
				)
			) : (
				<Button
					type="button"
					variant="outline"
					size="xl"
					className="flex-1"
					disabled={saving}
					aria-busy={saving || undefined}
					onClick={() => void save()}
				>
					Save as draft
				</Button>
			)}
			<Button
				type={onContinue ? "button" : "submit"}
				size="xl"
				className="flex-1"
				// Edit mode: nothing to save until something changes.
				disabled={continueDisabled || reviewEdit?.changed === false}
				onClick={onContinue}
			>
				{reviewEdit ? "Save and review" : "Continue"}
			</Button>
		</div>
	);
}

export { StepActions, useSaveDraft };
export type { ReviewEdit };
