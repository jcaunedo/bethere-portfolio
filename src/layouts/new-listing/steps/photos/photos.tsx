import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { ImageIcon, PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";
import { AlertInline } from "@/components/feedback/alert-inline";
import { Typography } from "@/components/typography";
import {
	expandVariants,
	fadeVariants,
	layoutSpring,
	motionRotation,
	motionScale,
	subtleSpring,
	useMotionPreference,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { StepActions } from "../../shared/step-actions";
import type { ListingKind } from "../type/type";

/** One photo in the listing. The first one is the cover. */
type Photo = {
	id: string;
	/** Image URL. Missing while the photo uploads. */
	src?: string;
	alt: string;
	/** Still uploading: shown as a loading tile, not draggable, not counted yet. */
	uploading?: boolean;
};

/** "Add at least 5 high-quality photos." — Continue unlocks at this many uploaded photos. */
const MIN_PHOTOS = 5;

/** Formats the Figma copy names ("JPG, PNG, or WebP"). */
const ACCEPT = "image/jpeg,image/png,image/webp";
const ACCEPTED_TYPES = ACCEPT.split(",");

/** Default uploader for the reference layout: a short fake upload that resolves to a local preview URL. */
const previewUpload = (file: File) =>
	new Promise<string>((resolve) => setTimeout(() => resolve(URL.createObjectURL(file)), 1500));

type PhotosStepProps = NewListingStepProps & {
	/** Listing type picked on the Type step — names it in the title ("Add photos to your service"). */
	listingType?: ListingKind;
	/** Step question. Defaults to "Add photos to your experience|service". */
	title?: React.ReactNode;
	description?: React.ReactNode;
	/** Photos to start with, in order (the first is the cover). */
	defaultPhotos?: Photo[];
	/** Fires with the full, ordered list whenever photos are added, finish uploading, move or are removed. */
	onPhotosChange?: (photos: Photo[]) => void;
	/** Uploads one file and resolves to its URL. Defaults to a local preview after a short delay. */
	onUpload?: (file: File) => Promise<string>;
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
	/**
	 * Called when "Skip for now" is activated: move on with fewer than the minimum photos. The
	 * listing stays a draft until it has them (see product-specs/new-listing-flow.md).
	 */
	onSkip?: () => void;
};

/**
 * New Listing — photos ("Add photos to your experience"): drop or browse images, then arrange them.
 * Empty, it's one large drop zone. With photos, they form a grid whose first photo is the cover
 * (2×2); tiles drag to reorder (or ←/→ with the keyboard) and show × on hover. The trailing "+"
 * tile opens the file picker, like "Browse photos"; photos still uploading show a loading tile. Once
 * there are photos, files dragged anywhere over the page fade the step and show "Add more
 * images" — dropping them anywhere uploads them. "Skip for now" moves on without the minimum
 * photos (the listing stays a draft): inside the empty drop zone, and under the disabled Continue
 * while there are fewer than the minimum.
 * Figma origin: Provider Portal, "10. Photos" frames (nodes 103:2266 empty, 106:2718 with photos,
 * 178:7388 loading, 833:6772 drop anywhere).
 */
function PhotosStep({
	steps = 14,
	currentStep = 10,
	stepLabel = "Little Atocha · Step 10 of 14",
	listingType = "experience",
	title = `Add photos to your ${listingType}`,
	description = "Showcase what makes it stand out.",
	defaultPhotos = [],
	onPhotosChange,
	onUpload = previewUpload,
	onContinue,
	onSaveDraft,
	onSkip,
	...frame
}: PhotosStepProps) {
	const [photos, setPhotos] = React.useState(defaultPhotos);
	const nextId = React.useRef(0);

	// Report changes after they land (not from inside state updaters), skipping the initial list.
	const reported = React.useRef(photos);
	React.useEffect(() => {
		if (reported.current === photos) return;
		reported.current = photos;
		onPhotosChange?.(photos);
	}, [photos, onPhotosChange]);

	const addFiles = (files: File[]) => {
		const accepted = files.filter((file) => ACCEPTED_TYPES.includes(file.type));
		const added = accepted.map((file) => ({
			file,
			photo: { id: `upload-${nextId.current++}`, alt: file.name, uploading: true } satisfies Photo,
		}));
		setPhotos((current) => [...current, ...added.map(({ photo }) => photo)]);
		for (const { file, photo } of added) {
			onUpload(file).then(
				(src) =>
					setPhotos((current) =>
						current.map((p) => (p.id === photo.id ? { ...p, src, uploading: false } : p)),
					),
				// A failed upload drops its tile.
				() => setPhotos((current) => current.filter((p) => p.id !== photo.id)),
			);
		}
	};

	const uploaded = photos.filter((photo) => !photo.uploading).length;
	const picker = useFilePicker(addFiles);

	// Files dragged anywhere over the window. With photos already added (and no dialog open) the
	// whole page is the drop target (Figma 833:6772). Drops a drop zone handled (defaultPrevented)
	// aren't added twice; any other file drop is caught so the browser doesn't open the file.
	const [fileDrag, setFileDrag] = React.useState(false);
	const dropAnywhere = photos.length > 0;
	const latest = React.useRef({ dropAnywhere, addFiles });
	latest.current = { dropAnywhere, addFiles };
	React.useEffect(() => {
		let depth = 0;
		const hasFiles = (event: DragEvent) => event.dataTransfer?.types.includes("Files") ?? false;
		const onEnter = (event: DragEvent) => {
			if (!hasFiles(event)) return;
			depth += 1;
			setFileDrag(true);
		};
		const onLeave = (event: DragEvent) => {
			if (!hasFiles(event)) return;
			depth = Math.max(0, depth - 1);
			if (depth === 0) setFileDrag(false);
		};
		const onOver = (event: DragEvent) => {
			if (hasFiles(event)) event.preventDefault();
		};
		const onDrop = (event: DragEvent) => {
			if (!hasFiles(event)) return;
			depth = 0;
			setFileDrag(false);
			if (event.defaultPrevented) return;
			event.preventDefault();
			if (latest.current.dropAnywhere) latest.current.addFiles(Array.from(event.dataTransfer?.files ?? []));
		};
		window.addEventListener("dragenter", onEnter);
		window.addEventListener("dragleave", onLeave);
		window.addEventListener("dragover", onOver);
		window.addEventListener("drop", onDrop);
		return () => {
			window.removeEventListener("dragenter", onEnter);
			window.removeEventListener("dragleave", onLeave);
			window.removeEventListener("dragover", onOver);
			window.removeEventListener("drop", onDrop);
		};
	}, []);
	const dropOverlay = fileDrag && dropAnywhere;

	return (
		<>
			<NewListingLayout
				{...frame}
				steps={steps}
				currentStep={currentStep}
				stepLabel={stepLabel}
				title={title}
				description={description}
				// Figma: title → drop zone → hint 24px when empty; title → photos → Continue 32px (the shell's
				// default gap) once there are photos. While files are dragged over the page, the step's
				// content fades to 5% under the drop overlay.
				bodyClassName={cn(
					"transition-opacity duration-300 motion-reduce:transition-none",
					photos.length === 0 && "gap-6",
					dropOverlay && "opacity-5",
				)}
			>
				{photos.length === 0 ? (
					// Empty (Figma 103:2266): the drop zone and the minimum-photos hint — no Continue until there
					// are photos.
					<>
						{/* Figma: 64px top, 56px bottom padding. */}
						<PhotoDropzone onFiles={addFiles} onSkip={onSkip} className="bg-background pt-16 pb-14" />
						<MinPhotosHint className="py-2" />
					</>
				) : (
					<>
						<PhotoGrid
							photos={photos}
							onPhotosChange={setPhotos}
							addTile={
								<button
									type="button"
									aria-label="Add photos"
									onClick={picker.open}
									// Figma: dashed color/foreground/subtle border on color/background/accent/background.
									className="group/add relative flex aspect-[155/116] w-full items-center justify-center rounded-input bg-background text-muted-foreground outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50"
								>
									<DashedBorder className="group-hover/add:text-input-ring" />
									<PlusIcon aria-hidden="true" className="size-6" />
								</button>
							}
						/>
						{/* Until the minimum is uploaded, the hint sits between the photos and Continue. */}
						<CollapsibleHint show={uploaded < MIN_PHOTOS} />
						{/* No Figma source for Skip under Continue: offered while Continue is locked so the
						    provider is never stuck between 1 and MIN_PHOTOS - 1 photos. */}
						<div className="flex w-full flex-col items-center gap-4">
							<StepActions
								onSaveDraft={onSaveDraft}
								continueDisabled={uploaded < MIN_PHOTOS}
								onContinue={() => onContinue?.()}
							/>
							{uploaded < MIN_PHOTOS ? <SkipButton onClick={onSkip} /> : null}
						</div>
						{picker.input}
					</>
				)}
			</NewListingLayout>
			{/* Portaled: the faded body (and a flow's transformed screen wrapper) would otherwise fade or
			    re-anchor this fixed overlay. */}
			{typeof document === "undefined"
				? null
				: createPortal(
						<AnimatePresence>{dropOverlay ? <DropOverlay /> : null}</AnimatePresence>,
						document.body,
					)}
		</>
	);
}

/**
 * Drop-anywhere message shown while files are dragged over a page that already has photos
 * (Figma 833:6841): the large illustration, "Add more images" (xl semibold) and "Drop them
 * anywhere to upload." (base, muted), centered on the viewport. Fades in and out.
 */
function DropOverlay() {
	return (
		<motion.div
			aria-hidden="true"
			variants={fadeVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<PhotosIllustration size="lg" />
				<div className="flex flex-col items-center gap-1">
					<Typography size="xl" weight="semibold">
						Add more images
					</Typography>
					<Typography size="base" className="text-muted-foreground">
						Drop them anywhere to upload.
					</Typography>
				</div>
			</div>
		</motion.div>
	);
}

/** "Add at least 5 high-quality photos." — Figma `alert-inline` (info). */
function MinPhotosHint({ className }: { className?: string }) {
	return (
		<AlertInline variant="info" className={className}>
			Add at least {MIN_PHOTOS} high-quality photos.
		</AlertInline>
	);
}

/**
 * The minimum-photos hint in the photos state's 32px-gap column, Expanding open from its top edge
 * and collapsing away (fade only with reduced motion) so Continue glides rather than jumps.
 * `-mt-8` cancels the column gap above it and `pt-8` restores it inside the animated box, so
 * collapsed it adds no space. Clipped only while animating, like the Pricing step's sections.
 */
function CollapsibleHint({ show }: { show: boolean }) {
	const { prefersReducedMotion } = useMotionPreference();
	const ref = React.useRef<HTMLDivElement>(null);
	const clip = (on: boolean) => {
		if (ref.current) ref.current.style.overflow = on ? "hidden" : "";
	};

	return (
		<AnimatePresence initial={false}>
			{show ? (
				<motion.div
					ref={ref}
					variants={prefersReducedMotion ? fadeVariants : expandVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					onAnimationStart={() => clip(true)}
					onAnimationComplete={() => clip(false)}
					className="-mt-8 flex flex-col items-center"
				>
					<MinPhotosHint className="pt-8" />
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}

/**
 * The empty state's drop target (Figma 104:1099): dashed, 64px top/bottom padding; the
 * illustration, "Drop photos here" (xl semibold) over the formats (base, muted), then
 * "Browse photos" (8px illustration → copy, 4px between the lines, 24px → button). The dashed outline turns brand
 * while files are dragged over it. Files dropped or browsed go to `onFiles`.
 */
/** "Skip for now" — Figma `button` (Link, Neutral, md · 32). */
function SkipButton({ onClick }: { onClick?: () => void }) {
	return (
		<Button type="button" variant="link-neutral" size="md" onClick={onClick}>
			Skip for now
		</Button>
	);
}

function PhotoDropzone({
	onFiles,
	onSkip,
	className,
}: {
	onFiles: (files: File[]) => void;
	onSkip?: () => void;
	className?: string;
}) {
	const picker = useFilePicker(onFiles);
	// Counts nested dragenter/dragleave pairs so hovering child elements doesn't flicker the state.
	const [dragDepth, setDragDepth] = React.useState(0);

	return (
		<div
			data-slot="photo-dropzone"
			data-dragover={dragDepth > 0 || undefined}
			onDragEnter={(event) => {
				event.preventDefault();
				setDragDepth((depth) => depth + 1);
			}}
			onDragLeave={() => setDragDepth((depth) => Math.max(0, depth - 1))}
			onDragOver={(event) => event.preventDefault()}
			onDrop={(event) => {
				event.preventDefault();
				setDragDepth(0);
				onFiles(Array.from(event.dataTransfer.files));
			}}
			className={cn(
				"group/dropzone relative flex w-full flex-col items-center justify-center gap-6 rounded-input px-6 text-center",
				className,
			)}
		>
			<DashedBorder className="group-data-[dragover]/dropzone:text-primary" />
			<div className="flex flex-col items-center gap-2">
				<PhotosIllustration size="sm" />
				<div className="flex flex-col items-center gap-1">
					<Typography size="xl" weight="semibold">
						Drop photos here
					</Typography>
					<Typography size="base" className="text-muted-foreground">
						Use clear, high-quality JPG, PNG, or WebP images.
					</Typography>
				</div>
			</div>
			<Button type="button" size="md" onClick={picker.open}>
				Browse photos
			</Button>
			<SkipButton onClick={onSkip} />
			{picker.input}
		</div>
	);
}

/**
 * Hidden multi-file input for JPG, PNG and WebP: `open()` shows the system file picker, and the
 * picked files go to `onFiles`. Render `input` anywhere in the tree.
 */
function useFilePicker(onFiles: (files: File[]) => void) {
	const ref = React.useRef<HTMLInputElement>(null);
	return {
		open: () => ref.current?.click(),
		input: (
			<input
				ref={ref}
				type="file"
				accept={ACCEPT}
				multiple
				hidden
				onChange={(event) => {
					onFiles(Array.from(event.target.files ?? []));
					// Picking the same files again should still fire.
					event.target.value = "";
				}}
			/>
		),
	};
}

/**
 * Figma's dashed stroke (1px, 4px dash / 4px gap, butt caps, inside) in color/foreground/subtle.
 * CSS `border-dashed` can't set the dash length (browsers draw it much tighter), so it's an SVG
 * outline over the parent's box, inset 0.5px so its 1px stroke sits just inside the edge — like
 * Figma's inside stroke. Parent must be `relative`.
 */
function DashedBorder({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute inset-[0.5px] h-[calc(100%-1px)] w-[calc(100%-1px)] overflow-visible text-foreground-subtle transition-[color,opacity]",
				className,
			)}
		>
			{/* rx 11.5 = the stroke's centre line inside --radius-input (12px, Figma radius/input). */}
			<rect
				width="100%"
				height="100%"
				rx="11.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
				strokeDasharray="4 4"
			/>
		</svg>
	);
}

/** gradient-1 paint server for the illustration (mirrors --gradient-1; CSS gradients can't paint an SVG stroke). */
const ILLUSTRATION_GRADIENT_ID = "photos-illustration-gradient-1";

/**
 * Figma geometry per illustration size: the frame, each icon's rotated-wrapper box and offset,
 * and the icon size. Icons are Lucide `image` at the listed size.
 */
const illustrationSizes = {
	/** 48px icons, 73×63 — the empty state's drop zone (Figma 844:6964). */
	sm: {
		frame: "h-[63px] w-[73px]",
		back: "top-[4.21px] left-[0.91px] size-[58.186px]",
		front: "top-[0.6px] left-[17.2px] size-[55.606px]",
		icon: "size-12",
	},
	/** 79px icons, 120.5×104 — the drop-anywhere overlay (Figma 833:6842). */
	lg: {
		frame: "h-[104px] w-[120.508px]",
		back: "top-[6.95px] left-[1.5px] size-[96.054px]",
		front: "top-px left-[28.39px] size-[91.794px]",
		icon: "size-[79.238px]",
	},
} as const;

/**
 * Two overlapping `image` icons (gradient-1 stroke): the back one at 50% and -14°, the front one
 * at 10°, filled with the page background so it hides the back one's lines.
 */
function PhotosIllustration({ size }: { size: keyof typeof illustrationSizes }) {
	const geometry = illustrationSizes[size];
	return (
		<div
			aria-hidden="true"
			className={cn(
				"relative shrink-0 [&_svg]:[stroke:url('#photos-illustration-gradient-1')]",
				geometry.frame,
				"[&_.front_rect]:fill-background",
			)}
		>
			<svg width="0" height="0" className="pointer-events-none absolute size-0">
				<defs>
					{/* In the icon's 24px viewBox (Figma: 6 → 42 of 48), top to bottom. */}
					<linearGradient id={ILLUSTRATION_GRADIENT_ID} gradientUnits="userSpaceOnUse" x1="12" y1="3" x2="12" y2="21">
						<stop offset="0" stopColor="#f26740" />
						<stop offset="1" stopColor="#ffa47d" />
					</linearGradient>
				</defs>
			</svg>
			<div className={cn("absolute flex items-center justify-center", geometry.back)}>
				<ImageIcon className={cn("-rotate-14 opacity-50", geometry.icon)} />
			</div>
			<div className={cn("absolute flex items-center justify-center", geometry.front)}>
				<ImageIcon className={cn("front rotate-10", geometry.icon)} />
			</div>
		</div>
	);
}

/** The dragged copy at rest (as the tile) and picked up (Figma 147:1467 shadow). */
const restingPose = { scale: 1, rotate: 0, boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)" };
const liftedPose = {
	scale: motionScale.drag,
	rotate: motionRotation.drag,
	boxShadow: "8px 8px 24px 0px rgba(0, 0, 0, 0.32)",
};

/** Half the grid's 16px gap: how far each tile's drop area reaches into the gaps around it. */
const HALF_GAP = 8;
/** Drag target meaning "after the last uploaded photo". */
const END = Symbol("end");

/** Pointer travel (px) before a press on a tile turns into a drag. */
const DRAG_THRESHOLD = 4;

type DragSession = {
	id: string;
	startX: number;
	startY: number;
	/** Pointer offset inside the tile, kept while the lifted copy follows the pointer. */
	offsetX: number;
	offsetY: number;
	width: number;
	height: number;
	started: boolean;
};

/**
 * Photo grid (Figma: 4 columns, 16px gaps, 155:116 tiles; the first photo is the cover, 2×2 with
 * a "Cover" pill). Drag a tile to move it: its slot stays behind as a blurred ghost (12%, 6px
 * blur) that moves to wherever the tile would land while the others glide aside, and a lifted
 * copy follows the pointer, settling into the ghost's slot on release. Keyboard: ←/→ move the
 * focused photo, Delete removes it.
 *
 * Motion: hovering a photo zooms it slightly inside its tile (media hover). Picking it up, the
 * copy Lifts from the tile — grows to `motionScale.drag`, tilts `motionRotation.drag` and gains the
 * Figma shadow; on release it springs into the slot while easing back to rest, and the tile shows
 * again the instant it lands (no fade from the ghost). Reduced motion: no zoom, scale or tilt.
 */
function PhotoGrid({
	photos,
	onPhotosChange,
	addTile,
}: {
	photos: Photo[];
	onPhotosChange: React.Dispatch<React.SetStateAction<Photo[]>>;
	/** Trailing "+" tile. */
	addTile: React.ReactNode;
}) {
	const { prefersReducedMotion, resolve } = useMotionPreference();
	const tiles = React.useRef(new Map<string, HTMLDivElement>());
	const gridRef = React.useRef<HTMLDivElement>(null);
	const addRef = React.useRef<HTMLDivElement>(null);
	const session = React.useRef<DragSession | null>(null);
	const [dragging, setDragging] = React.useState<Photo | null>(null);
	// Released and springing into its slot: the copy eases back to its resting pose.
	const [settling, setSettling] = React.useState(false);
	// Bumped on each pickup, so a drop that finishes settling after a new drag began leaves it alone.
	const dragCount = React.useRef(0);
	// The lifted copy's box, in viewport coordinates.
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const width = useMotionValue(0);
	const height = useMotionValue(0);

	const move = (id: string, to: number) =>
		onPhotosChange((current) => {
			const from = current.findIndex((photo) => photo.id === id);
			if (from < 0 || to < 0 || to >= current.length || from === to) return current;
			const next = [...current];
			const [photo] = next.splice(from, 1);
			next.splice(to, 0, photo);
			return next;
		});

	const remove = (id: string, { refocus }: { refocus: boolean }) => {
		if (refocus) {
			const index = photos.findIndex((photo) => photo.id === id);
			const neighbour = photos[index + 1] ?? photos[index - 1];
			requestAnimationFrame(() => tiles.current.get(neighbour?.id ?? "")?.focus());
		}
		onPhotosChange((current) => current.filter((photo) => photo.id !== id));
	};

	const onPointerMove = (event: PointerEvent) => {
		const drag = session.current;
		if (!drag) return;
		if (!drag.started) {
			if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < DRAG_THRESHOLD) return;
			drag.started = true;
			dragCount.current += 1;
			// A previous drop may still be settling: take over its copy from here.
			for (const value of [x, y, width, height]) value.stop();
			width.set(drag.width);
			height.set(drag.height);
			setSettling(false);
			setDragging(photos.find((photo) => photo.id === drag.id) ?? null);
			document.body.style.cursor = "grabbing";
		}
		x.set(event.clientX - drag.offsetX);
		y.set(event.clientY - drag.offsetY);

		// Where the photo would go: the uploaded tile under the pointer — it and the photos after it
		// are pushed along as the dragged photo takes its slot — or the end (after the last uploaded
		// photo) over the "+" tile or the empty cells after it. Tested against each tile's settled
		// layout box (offsets ignore the glide's transforms, so tiles sliding under the pointer can't
		// flip the target), each widened by half the 16px gap so gaps have no dead zone. The dragged
		// photo's own slot wins, so the pointer resting on a shared edge doesn't swap back and forth.
		const grid = gridRef.current;
		if (!grid) return;
		const origin = grid.getBoundingClientRect();
		const px = event.clientX - origin.left;
		const py = event.clientY - origin.top;
		const within = (el: HTMLElement) =>
			px >= el.offsetLeft - HALF_GAP &&
			px <= el.offsetLeft + el.offsetWidth + HALF_GAP &&
			py >= el.offsetTop - HALF_GAP &&
			py <= el.offsetTop + el.offsetHeight + HALF_GAP;
		const own = tiles.current.get(drag.id);
		if (own && within(own)) return;
		let target: string | typeof END | null = null;
		for (const [id, el] of tiles.current) {
			if (el.dataset.uploading == null && within(el)) {
				target = id;
				break;
			}
		}
		const add = addRef.current;
		if (
			target == null &&
			add &&
			(within(add) ||
				// Past the "+" tile in reading order: right of it on its row, or any row below.
				(py >= add.offsetTop - HALF_GAP && px >= add.offsetLeft) ||
				py > add.offsetTop + add.offsetHeight + HALF_GAP)
		) {
			target = END;
		}
		if (target == null) return;
		onPhotosChange((current) => {
			const from = current.findIndex((photo) => photo.id === drag.id);
			if (from < 0) return current;
			const next = [...current];
			const [photo] = next.splice(from, 1);
			let to: number;
			if (target === END) {
				// Right after the last uploaded photo (uploading tiles stay after it).
				to = next.length - [...next].reverse().findIndex((p) => !p.uploading);
				if (to > next.length) to = 0;
			} else {
				to = current.findIndex((p) => p.id === target);
				if (to < 0 || current[to].uploading) return current;
			}
			if (to === from) return current;
			next.splice(to, 0, photo);
			return next;
		});
	};

	const onPointerUp = () => {
		detach.current?.();
		const drag = session.current;
		session.current = null;
		if (!drag?.started) return;
		document.body.style.cursor = "";
		// Settle the lifted copy into the ghost's slot, then show the tile there again.
		const slot = tiles.current.get(drag.id)?.getBoundingClientRect();
		if (!slot) return setDragging(null);
		const drop = dragCount.current;
		const transition = resolve(layoutSpring);
		setSettling(true);
		Promise.all([
			animate(x, slot.left, transition),
			animate(y, slot.top, transition),
			animate(width, slot.width, transition),
			animate(height, slot.height, transition),
		]).then(() => {
			if (dragCount.current !== drop) return;
			setDragging(null);
			setSettling(false);
		});
	};

	// Window listeners for the press in progress; detached on release (or unmount).
	const detach = React.useRef<(() => void) | null>(null);
	const startSession = (drag: DragSession) => {
		session.current = drag;
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("pointercancel", onPointerUp);
		detach.current = () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
			detach.current = null;
		};
	};

	// A drag in progress when the grid unmounts (e.g. navigating away) leaves no listeners or cursor behind.
	React.useEffect(
		() => () => {
			detach.current?.();
			document.body.style.cursor = "";
		},
		[],
	);

	const ready = photos.filter((photo) => !photo.uploading);

	return (
		<>
			<div ref={gridRef} role="list" aria-label="Listing photos" className="relative grid w-full grid-cols-4 gap-4">
				<AnimatePresence initial={false} mode="popLayout">
					{photos.map((photo, index) => {
						const cover = index === 0;
						const position = ready.indexOf(photo) + 1;
						const ghost = dragging?.id === photo.id;
						return (
							<motion.div
								key={photo.id}
								ref={(el: HTMLDivElement | null) => {
									// Registered once, on mount: the popLayout wrapper doesn't pass later ref updates
									// through, so a photo that finishes uploading keeps its entry. Loading tiles are
									// told apart by `data-uploading` when hit-testing.
									if (el) tiles.current.set(photo.id, el);
									else tiles.current.delete(photo.id);
								}}
								layout={!prefersReducedMotion}
								variants={fadeVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								whileHover={photo.uploading || dragging || prefersReducedMotion ? undefined : "hover"}
								transition={{ layout: resolve(layoutSpring) }}
								data-uploading={photo.uploading || undefined}
								role="listitem"
								tabIndex={photo.uploading ? undefined : 0}
								aria-label={
									photo.uploading
										? `Uploading ${photo.alt}`
										: `${cover ? "Cover photo" : "Photo"}, ${position} of ${ready.length}: ${photo.alt}`
								}
								aria-description={
									photo.uploading
										? undefined
										: "Drag, or press the left and right arrow keys, to move. The first photo is the cover. Press Delete to remove."
								}
								onPointerDown={
									photo.uploading
										? undefined
										: (event) => {
												if (event.button !== 0 || (event.target as Element).closest("button")) return;
												const rect = event.currentTarget.getBoundingClientRect();
												startSession({
													id: photo.id,
													startX: event.clientX,
													startY: event.clientY,
													offsetX: event.clientX - rect.left,
													offsetY: event.clientY - rect.top,
													width: rect.width,
													height: rect.height,
													started: false,
												});
											}
								}
								onKeyDown={
									photo.uploading
										? undefined
										: (event) => {
												if (event.target !== event.currentTarget) return;
												if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
													event.preventDefault();
													const to = index + (event.key === "ArrowLeft" ? -1 : 1);
													if (photos[to] && !photos[to].uploading) move(photo.id, to);
												} else if (event.key === "Delete" || event.key === "Backspace") {
													event.preventDefault();
													remove(photo.id, { refocus: true });
												}
											}
								}
								className={cn(
									"group/photo relative overflow-hidden rounded-input outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
									// Figma: the cover spans 2×2 (312×237.52); the rest are 155:116.
									cover ? "col-span-2 row-span-2 aspect-[312/237.52]" : "aspect-[155/116]",
									photo.uploading ? "bg-card" : "cursor-grab touch-none select-none",
								)}
							>
								{photo.uploading ? (
									<UploadSpinner />
								) : (
									<>
										{/* Ghost (Figma 106:2718): fades to 12% opacity, 6px blur while its photo is lifted,
										    and turns back at once when it lands (the copy covers it until then). */}
										<motion.img
											layout={!prefersReducedMotion}
											variants={{ hover: { scale: motionScale.mediaHover } }}
											transition={{ ...subtleSpring, layout: resolve(layoutSpring) }}
											src={photo.src}
											alt=""
											draggable={false}
											className={cn(
												"pointer-events-none size-full object-cover",
												ghost && "opacity-12 blur-[6px] transition-[opacity,filter] duration-150",
											)}
										/>
										{/* Figma "Cover" pill: 16px in, black 20%, sm in color/tone/brand/on-brand. */}
										{cover && !ghost ? (
											<span className="absolute top-4 left-4 rounded-full bg-black/20 px-2 py-0.5 text-sm text-primary-foreground">
												Cover
											</span>
										) : null}
										{/* Figma 178:7402 hover: 28px round ×, black 50%, 14px icon, 8px in. Pointer-only —
										    keyboard users press Delete on the tile. Hidden on every tile while a photo is dragged
										    (and settles), so passing over tiles doesn't flash it. */}
										{!dragging ? (
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												tabIndex={-1}
												aria-label={`Remove ${photo.alt}`}
												onClick={() => remove(photo.id, { refocus: false })}
												className="absolute top-2 right-2 rounded-full bg-black/50 text-primary-foreground opacity-0 transition-opacity group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100 hover:bg-black/60 hover:text-primary-foreground"
											>
												<XIcon />
											</Button>
										) : null}
									</>
								)}
							</motion.div>
						);
					})}
					<motion.div
						ref={addRef}
						key="add"
						layout={prefersReducedMotion ? false : "position"}
						transition={{ layout: resolve(layoutSpring) }}
					>
						{addTile}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Lifted copy (Figma 147:1467): follows the pointer, lifted with an 8/8/24 32% shadow. */}
			{dragging ? (
				<motion.div
					aria-hidden="true"
					style={{ x, y, width, height }}
					initial={restingPose}
					animate={settling ? restingPose : prefersReducedMotion ? { ...restingPose, boxShadow: liftedPose.boxShadow } : liftedPose}
					transition={resolve(subtleSpring)}
					className="pointer-events-none fixed top-0 left-0 z-50 overflow-hidden rounded-input"
				>
					<img src={dragging.src} alt="" className="size-full object-cover" />
				</motion.div>
			) : null}
		</>
	);
}

/**
 * Figma `loader-circle` with an angular gradient: fades from the tile's white at the tail to brand
 * at the head as it turns. A conic gradient masked to the icon's arc (SVG strokes can't take one).
 * The arc runs clockwise from 0° (tail) to 288° (head); each round cap reaches ~6° past its end, so
 * the gradient switches back to white with a hard stop mid-gap (324°) — without it the tail's cap,
 * just before 0°, would pick up the wrapped-around brand end as an orange dot.
 */
const LOADER_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M21 12a9 9 0 1 1-6.219-8.56'/%3E%3C/svg%3E") center / contain no-repeat`;

function UploadSpinner() {
	return (
		<div className="flex size-full items-center justify-center">
			<span
				aria-hidden="true"
				style={{ mask: LOADER_MASK, WebkitMask: LOADER_MASK }}
				// Reduced motion: a gentle pulse still says "working" without the spin.
				className="size-6 animate-spin bg-[conic-gradient(from_90deg,var(--card)_0deg,var(--primary)_288deg,var(--primary)_324deg,var(--card)_324deg)] motion-reduce:animate-pulse"
			/>
		</div>
	);
}

export { PhotosStep, MIN_PHOTOS };
export type { Photo, PhotosStepProps };
