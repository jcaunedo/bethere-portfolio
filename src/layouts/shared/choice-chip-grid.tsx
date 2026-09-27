import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { ChoiceChip } from "@/components/forms/choice-chip";
import { ChoiceInput } from "@/components/forms/choice-input";
import {
	fadeVariants,
	layoutSpring,
	revealVariants,
	standardTransition,
	useMotionPreference,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const columnClasses = {
	3: "grid-cols-3",
	4: "grid-cols-4",
} as const;

type ChoiceChipGridProps = {
	/** id of the heading that names this group. */
	labelledBy: string;
	options: string[];
	selected: Set<string>;
	onSelectedChange: (next: Set<string>) => void;
	/** Figma grids use 3 or 4 equal columns. */
	columns?: keyof typeof columnClasses;
	/** End the grid with an "Add" tile (ChoiceInput) that grows the grid as values are added. */
	allowCustom?: boolean;
	className?: string;
};

/**
 * Multi-select ChoiceChip grid shared by the New Listing layouts — equal columns, 8px gaps,
 * 38px rows (Figma instances stretch to the row), optionally ending with a growing "Add" tile.
 * Layout-internal helper, not part of the package API.
 */
function ChoiceChipGrid({
	labelledBy,
	options,
	selected,
	onSelectedChange,
	columns = 3,
	allowCustom = false,
	className,
}: ChoiceChipGridProps) {
	const toggle = (option: string) => {
		const next = new Set(selected);
		if (next.has(option)) next.delete(option);
		else next.add(option);
		onSelectedChange(next);
	};

	// Custom options added through the trailing "Add" tile. Committing a value moves
	// that tile into this list (same key → same instance, so its focus hands off to
	// the remove button) and a fresh empty "Add" tile takes its place.
	const nextId = React.useRef(0);
	const [custom, setCustom] = React.useState<{ id: number; value: string }[]>([]);
	const [addId, setAddId] = React.useState(() => nextId.current++);

	const addCustom = (value: string) => {
		if (!value) return;
		setCustom((items) => [...items, { id: addId, value }]);
		setAddId(nextId.current++);
	};

	// Edited in place (click an added value), or removed when cleared via its × button.
	const updateCustom = (id: number, value: string) =>
		setCustom((items) =>
			value === ""
				? items.filter((item) => item.id !== id)
				: items.map((item) => (item.id === id ? { ...item, value } : item)),
		);

	// Custom tiles Reveal in / fade out, and siblings glide to their new cell (layout).
	// Reduced motion: opacity only, no movement.
	const { prefersReducedMotion, resolve } = useMotionPreference();
	const tileMotion = {
		layout: prefersReducedMotion ? false : ("position" as const),
		variants: prefersReducedMotion ? fadeVariants : revealVariants,
		initial: "initial",
		animate: "animate",
		exit: "exit",
		transition: { layout: resolve(layoutSpring) },
		className: "h-full",
	};

	// Expand: the grid's height eases to its content's (e.g. a custom tile starting a new row),
	// so the sections below glide instead of jumping. Clipped only mid-animation — at rest the
	// chips' card shadow must spill past the grid's edges.
	const gridRef = React.useRef<HTMLDivElement>(null);
	const height = useContentHeight(gridRef);
	const [resizing, setResizing] = React.useState(false);

	return (
		<motion.div
			initial={false}
			animate={{ height: height ?? "auto" }}
			transition={resolve(standardTransition)}
			onAnimationStart={() => setResizing(true)}
			onAnimationComplete={() => setResizing(false)}
			className={cn(resizing && "overflow-hidden")}
		>
			{/* `relative` anchors exiting tiles popped out of flow by AnimatePresence. */}
			<div
				ref={gridRef}
				role="group"
				aria-labelledby={labelledBy}
				className={cn("relative grid auto-rows-[38px] gap-2", columnClasses[columns], className)}
			>
				{options.map((option) => (
					<ChoiceChip
						key={option}
						role="checkbox"
						label={option}
						isSelected={selected.has(option)}
						onClick={() => toggle(option)}
						className="h-full"
					/>
				))}
				{/* One flat keyed array, so the committed "Add" tile is moved (not remounted) into the list.
				    popLayout: a leaving tile exits the grid flow at once, so the rest (and the grid's
				    height) settle while it fades. */}
				{allowCustom ? (
					<AnimatePresence initial={false} mode="popLayout">
						{[
							...custom.map((item) => (
								<motion.div key={item.id} {...tileMotion}>
									<ChoiceInput
										value={item.value}
										onValueChange={(value) => updateCustom(item.id, value)}
										className="h-full"
									/>
								</motion.div>
							)),
							<motion.div key={addId} {...tileMotion}>
								<ChoiceInput value="" onValueChange={addCustom} className="h-full" />
							</motion.div>,
						]}
					</AnimatePresence>
				) : null}
			</div>
		</motion.div>
	);
}

/** Live border-box height of `ref`'s element (`undefined` until first measured). */
function useContentHeight(ref: React.RefObject<HTMLElement | null>) {
	const [height, setHeight] = React.useState<number>();
	React.useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;
		setHeight(element.offsetHeight);
		const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
		observer.observe(element);
		return () => observer.disconnect();
	}, [ref]);
	return height;
}

export { ChoiceChipGrid };
export type { ChoiceChipGridProps };
