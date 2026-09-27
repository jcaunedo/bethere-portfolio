import * as React from "react";
import { cva } from "class-variance-authority";
import { AnimatePresence, Reorder, useDragControls } from "motion/react";
import { GripVerticalIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { fadeVariants, layoutSpring, useMotionPreference } from "@/lib/motion";

const sortableListItemVariants = cva(
	// Row shell (Figma `Sortable List` Property 1=Input): 40px input-look field, 6px gaps.
	// Hover → grip turns foreground + × appears. Focus (label field focused) → input focus
	// ring, × visible. Figma's Focus uses 8px right padding, but that shifts the × 4px on
	// click — kept at 12px in every state so it stays put. Hover border = Input's (color/input/ring).
	"group/sortable-item relative flex h-10 items-center gap-1.5 rounded-input border border-border bg-input-fill px-3 text-sm text-foreground transition-[border-color,box-shadow] hover:border-input-ring has-[input:focus]:border-input-ring-focus has-[input:focus]:ring-[3px] has-[input:focus]:ring-input-ring-outside",
	{
		variants: {
			// Shadows live only here: tailwind-merge doesn't know `shadow-card` is a shadow, so a base
			// `shadow-xs` would survive next to it and win on stylesheet order.
			dragging: {
				// Figma Property 1=dragging — lifted with the card shadow while the grip is dragged.
				true: "z-10 shadow-card",
				false: "shadow-xs",
			},
		},
		defaultVariants: {
			dragging: false,
		},
	},
);

type SortableListItemValue = {
	/** Stable identity — keeps the row (and its focus) attached across reorders. */
	id: string;
	label: string;
};

// Native drag/animation handlers collide with Motion's own on `Reorder.Group`.
type SortableListProps = Omit<
	React.ComponentProps<"ul">,
	| "defaultValue"
	| "onChange"
	| "onDrag"
	| "onDragStart"
	| "onDragEnd"
	| "onAnimationStart"
	| "onAnimationEnd"
> & {
	/** Controlled rows, in display order. Omit to let the list own them (seeded by `defaultValue`). */
	value?: SortableListItemValue[];
	defaultValue?: SortableListItemValue[];
	/** Fires on every reorder, label edit, and removal with the full, ordered list. */
	onValueChange?: (value: SortableListItemValue[]) => void;
	/** Placeholder for an empty row label. */
	placeholder?: string;
	disabled?: boolean;
};

/**
 * Reorderable list of editable rows: drag a row by its grip (or focus the grip and
 * press ↑/↓), edit its label in place, remove it with ×.
 * Translated from bethere.ds `Sortable List` (Property 1=Input/Hover/Focus/dragging).
 */
function SortableList({
	className,
	value,
	defaultValue = [],
	onValueChange,
	placeholder,
	disabled = false,
	...props
}: SortableListProps) {
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
	const items = value ?? uncontrolled;
	const listRef = React.useRef<HTMLUListElement>(null);
	const { resolve } = useMotionPreference();

	const setItems = (next: SortableListItemValue[]) => {
		setUncontrolled(next);
		onValueChange?.(next);
	};

	const move = (index: number, direction: -1 | 1) => {
		const target = index + direction;
		if (target < 0 || target >= items.length) return;
		const next = [...items];
		[next[index], next[target]] = [next[target], next[index]];
		setItems(next);
	};

	// Keyboard removal (Delete on a focused grip) leaves focus on an element that's going away —
	// hand it to the grip of the row that takes its place (or the new last row). Targeted by id:
	// the removed row is still in the DOM while it fades out.
	const focusAfterRemove = React.useRef<string | null>(null);
	React.useEffect(() => {
		const id = focusAfterRemove.current;
		focusAfterRemove.current = null;
		if (id == null) return;
		listRef.current
			?.querySelector<HTMLButtonElement>(`[data-item-id="${CSS.escape(id)}"] [data-slot=sortable-list-grip]`)
			?.focus();
	}, [items]);

	const remove = (index: number, { refocus }: { refocus: boolean }) => {
		if (refocus) focusAfterRemove.current = (items[index + 1] ?? items[index - 1])?.id ?? null;
		setItems(items.filter((_, i) => i !== index));
	};

	return (
		<Reorder.Group
			ref={listRef}
			as="ul"
			axis="y"
			values={items}
			onReorder={setItems}
			data-slot="sortable-list"
			className={cn("relative flex flex-col gap-2", className)}
			{...props}
		>
			{/* popLayout: a removed row leaves the flow at once, so the rest glide up while it fades. */}
			<AnimatePresence initial={false} mode="popLayout">
				{items.map((item, index) => (
					<SortableListItem
						key={item.id}
						item={item}
						index={index}
						count={items.length}
						placeholder={placeholder}
						disabled={disabled}
						layoutTransition={resolve(layoutSpring)}
						onLabelChange={(label) =>
							setItems(items.map((current) => (current.id === item.id ? { ...current, label } : current)))
						}
						onMove={(direction) => move(index, direction)}
						onRemove={(refocus) => remove(index, { refocus })}
					/>
				))}
			</AnimatePresence>
		</Reorder.Group>
	);
}

function SortableListItem({
	item,
	index,
	count,
	placeholder,
	disabled,
	layoutTransition,
	onLabelChange,
	onMove,
	onRemove,
}: {
	item: SortableListItemValue;
	index: number;
	count: number;
	placeholder?: string;
	disabled: boolean;
	layoutTransition: ReturnType<ReturnType<typeof useMotionPreference>["resolve"]>;
	onLabelChange: (label: string) => void;
	onMove: (direction: -1 | 1) => void;
	/** `refocus`: move focus to a neighbouring row afterwards (keyboard removal). */
	onRemove: (refocus: boolean) => void;
}) {
	// Only the grip starts a drag, so the label field stays selectable/editable.
	const dragControls = useDragControls();
	const [dragging, setDragging] = React.useState(false);
	const position = `${index + 1} of ${count}`;

	return (
		<Reorder.Item
			as="li"
			value={item}
			dragListener={false}
			dragControls={dragControls}
			onDragStart={() => setDragging(true)}
			onDragEnd={() => setDragging(false)}
			variants={fadeVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ layout: layoutTransition }}
			data-slot="sortable-list-item"
			data-item-id={item.id}
			data-dragging={dragging || undefined}
			className={sortableListItemVariants({ dragging })}
		>
			<button
				type="button"
				data-slot="sortable-list-grip"
				aria-label={`Reorder item ${position}`}
				aria-description="Drag, or press the up and down arrow keys, to move. Press Delete to remove."
				disabled={disabled}
				onPointerDown={(event) => dragControls.start(event)}
				onKeyDown={(event) => {
					if (event.key === "ArrowUp" || event.key === "ArrowDown") {
						event.preventDefault();
						onMove(event.key === "ArrowUp" ? -1 : 1);
					} else if (event.key === "Delete" || event.key === "Backspace") {
						// Keyboard path for removal — the × is pointer-only (hover).
						event.preventDefault();
						onRemove(true);
					}
				}}
				// Figma: grip in color/icon/subtle, color/icon/foreground on Hover/dragging.
				className="flex shrink-0 cursor-grab touch-none items-center rounded-sm text-icon-subtle outline-none transition-colors group-hover/sortable-item:text-icon-foreground group-data-[dragging]/sortable-item:cursor-grabbing group-data-[dragging]/sortable-item:text-icon-foreground focus-visible:ring-[3px] focus-visible:ring-input-ring-outside disabled:pointer-events-none"
			>
				<GripVerticalIcon aria-hidden="true" className="size-[18px]" />
			</button>
			<input
				data-slot="sortable-list-input"
				aria-label={`Item ${position}`}
				value={item.label}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(event) => onLabelChange(event.target.value)}
				className="h-[22px] min-w-0 flex-1 truncate bg-transparent leading-[22px] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
			/>
			{/* × (color/icon/subtle) is visible and clickable only while the row is hovered — never while
			    its label is focused (even if hovered), nor while dragging. Out of the Tab order; keyboard
			    users remove via the grip. */}
			<button
				type="button"
				tabIndex={-1}
				aria-label={`Remove item ${position}`}
				disabled={disabled}
				onClick={() => onRemove(false)}
				className="pointer-events-none flex shrink-0 items-center text-icon-subtle opacity-0 outline-none transition-[color,opacity] group-hover/sortable-item:pointer-events-auto group-hover/sortable-item:opacity-100 group-has-[input:focus]/sortable-item:pointer-events-none group-has-[input:focus]/sortable-item:opacity-0 group-data-[dragging]/sortable-item:pointer-events-none group-data-[dragging]/sortable-item:opacity-0 hover:text-foreground disabled:pointer-events-none"
			>
				<XIcon aria-hidden="true" className="size-[18px]" />
			</button>
		</Reorder.Item>
	);
}

export { SortableList, sortableListItemVariants };
export type { SortableListProps, SortableListItemValue };
