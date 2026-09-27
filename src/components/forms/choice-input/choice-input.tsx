import * as React from "react";
import { cva } from "class-variance-authority";
import { PlusIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { ChoiceButtonIndicator } from "@/components/primitives/choice-button-indicator";

// Every state keeps a 1px border (transparent when Figma has none) so content
// doesn't shift between states inside the fixed 40px height.
const choiceInputVariants = cva(
	"flex h-10 w-full items-center overflow-hidden rounded-card border text-sm leading-[22px] transition-[color,border-color,box-shadow] aria-disabled:pointer-events-none aria-disabled:opacity-50",
	{
		variants: {
			state: {
				// Figma State=Default (dashed "Add" trigger) + State=Hover (solid input-ring border).
				// Figma also binds the `card` shadow here, but it doesn't render on the unfilled frame — omitted.
				default:
					"border-dashed border-border text-muted-foreground hover:border-solid hover:border-input-ring has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-input-ring-outside",
				// Figma State=Focus — same focus treatment as Input.
				focus:
					"gap-1.5 rounded-input border-input-ring-focus bg-input-fill py-2 pr-2 pl-3 text-foreground ring-[3px] ring-input-ring-outside",
				// Figma State=Added. Keyboard focus on the (editable) value shows the same ring as the Add trigger.
				added:
					"gap-2 border-transparent bg-input-fill py-2 pr-2 pl-3 text-foreground shadow-card has-[[data-slot=choice-input-edit]:focus-visible]:ring-[3px] has-[[data-slot=choice-input-edit]:focus-visible]:ring-input-ring-outside",
			},
		},
		defaultVariants: {
			state: "default",
		},
	},
);

type ChoiceInputProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
	/** Committed value; `""` means nothing has been added yet. */
	value?: string;
	defaultValue?: string;
	/** Fires when a value is committed (Enter / blur) or removed (`""`). */
	onValueChange?: (value: string) => void;
	/** Trigger label, also the text field's accessible name (Figma: `Add`). */
	placeholder?: string;
	disabled?: boolean;
	/** Submits the committed value through a hidden input. */
	name?: string;
};

/**
 * Inline "add your own option" control: a dashed Add trigger that turns into a
 * text field, then into an added chip with a remove button.
 * Translated from bethere.ds `choice-input` (State=Default/Hover/Focus/Added).
 */
function ChoiceInput({
	className,
	value,
	defaultValue = "",
	onValueChange,
	placeholder = "Add",
	disabled = false,
	name,
	...props
}: ChoiceInputProps) {
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
	const committed = value ?? uncontrolled;
	const [editing, setEditing] = React.useState(false);
	const [draft, setDraft] = React.useState("");

	const inputRef = React.useRef<HTMLInputElement>(null);
	const addRef = React.useRef<HTMLButtonElement>(null);
	const removeRef = React.useRef<HTMLButtonElement>(null);
	// Where focus should land after the next state change (the focused element unmounts).
	const focusNext = React.useRef<"add" | "remove" | null>(null);
	// Enter/Escape already resolved the edit — ignore the blur that may follow the unmount.
	const skipBlur = React.useRef(false);
	// Focus handed to the remove button after Enter is programmatic — hide its ring until
	// it blurs, so it only shows when the user navigates to it themselves.
	const [quietRemoveFocus, setQuietRemoveFocus] = React.useState(false);

	React.useEffect(() => {
		if (focusNext.current === "add") addRef.current?.focus();
		if (focusNext.current === "remove") removeRef.current?.focus();
		focusNext.current = null;
	});

	const setValue = (next: string) => {
		setUncontrolled(next);
		onValueChange?.(next);
	};

	// From the Add trigger (empty draft) or an added value (pre-filled, to edit it).
	const startEditing = (initial = "") => {
		skipBlur.current = false;
		setDraft(initial);
		setEditing(true);
	};

	// Hand focus back after the field unmounts: to the remove button when a value
	// remains (quietly — see `quietRemoveFocus`), otherwise to the Add trigger.
	const refocusAfterEdit = (hasValue: boolean) => {
		focusNext.current = hasValue ? "remove" : "add";
		if (hasValue) setQuietRemoveFocus(true);
	};

	// An emptied draft never clears an existing value — removal is the × button's job.
	const commit = (refocus: boolean) => {
		const next = draft.trim();
		setEditing(false);
		if (next && next !== committed) setValue(next);
		if (refocus) refocusAfterEdit(Boolean(next || committed));
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			skipBlur.current = true;
			commit(true);
		} else if (event.key === "Escape") {
			skipBlur.current = true;
			setEditing(false);
			refocusAfterEdit(Boolean(committed));
		}
	};

	const onBlur = () => {
		if (skipBlur.current) {
			skipBlur.current = false;
			return;
		}
		commit(false);
	};

	const remove = () => {
		setValue("");
		focusNext.current = "add";
	};

	const state = editing ? "focus" : committed ? "added" : "default";

	return (
		<div
			data-slot="choice-input"
			data-state={state}
			aria-disabled={disabled || undefined}
			className={cn(choiceInputVariants({ state, className }))}
			{...props}
		>
			{state === "default" ? (
				<button
					ref={addRef}
					type="button"
					disabled={disabled}
					onClick={() => startEditing()}
					className="flex size-full items-center gap-2 px-3 py-2 text-left outline-none"
				>
					<PlusIcon aria-hidden="true" className="size-[18px] shrink-0 text-icon-muted" />
					<span className="min-w-0 flex-1 truncate">{placeholder}</span>
				</button>
			) : null}

			{state === "focus" ? (
				<>
					<input
						ref={inputRef}
						autoFocus
						aria-label={placeholder}
						value={draft}
						disabled={disabled}
						onChange={(event) => setDraft(event.target.value)}
						// Editing an added value: caret at the end of the pre-filled text.
						onFocus={(event) => {
							const end = event.currentTarget.value.length;
							event.currentTarget.setSelectionRange(end, end);
						}}
						onKeyDown={onKeyDown}
						onBlur={onBlur}
						className="min-w-0 flex-1 bg-transparent outline-none"
					/>
					{/* Figma `Button Clear`: 20px pill, neutral-50 fill, 12px × in icon-muted. */}
					{draft !== "" ? (
						<button
							type="button"
							aria-label="Clear"
							// Keep focus in the field so clearing doesn't commit via blur.
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => {
								setDraft("");
								inputRef.current?.focus();
							}}
							className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-icon-muted outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-input-ring-outside"
						>
							<XIcon className="size-3" />
						</button>
					) : null}
				</>
			) : null}

			{state === "added" ? (
				<>
					{/* Clicking the value re-opens it for editing, pre-filled. */}
					<button
						type="button"
						data-slot="choice-input-edit"
						aria-label={`Edit ${committed}`}
						disabled={disabled}
						onClick={() => startEditing(committed)}
						className="flex min-w-0 flex-1 items-center gap-2 self-stretch text-left outline-none"
					>
						<ChoiceButtonIndicator isSelected />
						<span className="min-w-0 flex-1 truncate">{committed}</span>
					</button>
					<Button
						ref={removeRef}
						// Explicit: inside a <form> a typeless button submits it.
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label={`Remove ${committed}`}
						disabled={disabled}
						onClick={remove}
						onBlur={() => setQuietRemoveFocus(false)}
						className={cn(
							"shrink-0 rounded-full text-icon-subtle",
							quietRemoveFocus && "focus-visible:ring-0",
						)}
					>
						<XIcon />
					</Button>
				</>
			) : null}

			{name != null ? <input type="hidden" name={name} value={committed} /> : null}
		</div>
	);
}

export { ChoiceInput, choiceInputVariants };
export type { ChoiceInputProps };
