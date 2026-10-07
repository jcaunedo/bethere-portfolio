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

/**
 * A step's actions row (Figma "11. Verify Business - Single", node 106:2827): "Save as draft"
 * (outline) and the main "Continue" side by side, equal width, 16px apart, both xl (40px).
 * "Save as draft" stays available while Continue is disabled — saving is how a provider leaves a
 * step they can't finish yet. Continue submits the step's form unless `onContinue` is given.
 */
function StepActions({
	onSaveDraft,
	onContinue,
	continueDisabled = false,
	continueLabel = "Continue",
	className,
}: {
	onSaveDraft?: () => void | Promise<unknown>;
	/** Continue as a plain button with this handler; omit to submit the surrounding form. */
	onContinue?: () => void;
	continueDisabled?: boolean;
	continueLabel?: React.ReactNode;
	className?: string;
}) {
	const { saving, save } = useSaveDraft(onSaveDraft);

	return (
		<div className={cn("flex w-full gap-4", className)}>
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
			<Button
				type={onContinue ? "button" : "submit"}
				size="xl"
				className="flex-1"
				disabled={continueDisabled}
				onClick={onContinue}
			>
				{continueLabel}
			</Button>
		</div>
	);
}

export { StepActions, useSaveDraft };
