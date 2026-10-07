import * as React from "react";
import { motion } from "motion/react";
import {
	BlocksIcon,
	CalendarClockIcon,
	CircleUserIcon,
	DollarSignIcon,
	FileTextIcon,
	ListChecksIcon,
	MapPinIcon,
	PencilIcon,
	ShipIcon,
	TimerIcon,
} from "lucide-react";

import jumpFromBoat from "@/assets/images/jump-from-boat.webp";
import { Button } from "@/components/buttons/button";
import { FormField } from "@/components/forms/field";
import { Input } from "@/components/forms/input";
import { Textarea } from "@/components/forms/textarea";
import { AiIcon } from "@/components/icons/ai-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/overlays/tooltip";
import { Typography, typographyVariants } from "@/components/typography";
import {
	pendingIconReducedVariants,
	pendingIconVariants,
	useMotionPreference,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import type { ListingKind } from "../type/type";

/** The earlier steps a summary row links back to. */
type ReviewSection =
	| "photos"
	| "yacht"
	| "location"
	| "duration"
	| "availability"
	| "pricing"
	| "captain"
	| "documents"
	| "addons"
	| "policies";

/** Fields with an AI-suggested value. */
type ReviewField = "title" | "description";

/** What `onImprove` receives: the field's current text plus listing context for the rewrite. */
type ReviewImproveRequest = {
	field: ReviewField;
	text: string;
	/** Character limit for the result (the description's counter). */
	maxLength?: number;
	listingType: ListingKind;
	/** One line per summary row, e.g. "Yacht: Little Atocha · Azimut 55 Fly (2021) (55 ft · 13 guests…)". */
	facts: string[];
	/** The other copy fields as they are now, so the rewrite stays consistent with them. */
	otherFields: Record<ReviewField, string>;
};

/** One summary row: what the listing has for an earlier step. */
type ReviewSummaryItem = {
	section: ReviewSection;
	/** Small uppercase label (Figma: "PHOTOS", "YACHT"…). */
	label: string;
	/** Main value (Figma `lg -medium`). */
	value: string;
	/** Supporting line (Figma `xs`, muted). */
	detail?: string;
	/** Something this step must have is missing: the card shows "Required" and Publish is disabled. */
	required?: boolean;
	/** Leading 64px tile: an icon (gradient-1) on brand-subtle, or a photo. */
	media:
		| { type: "icon"; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
		| { type: "image"; src: string };
};

/**
 * Wizard order of the steps behind each summary row — the order each answer was defined. Rows are
 * shown in this order whatever order `summary` comes in (rows of the same section, e.g. several
 * captains, keep their relative order). Attributes → Expectations (durations, then boarding
 * location) → Availability → Pricing (rates, then add-ons) → Photos → Policies → Documents
 * (captain licenses, then the document set).
 */
const SECTION_ORDER: ReviewSection[] = [
	"yacht",
	"duration",
	"location",
	"availability",
	"pricing",
	"addons",
	"photos",
	"policies",
	"captain",
	"documents",
];

const DESCRIPTION_MAX_LENGTH = 600;

/** gradient-1 paint server for the summary icons (mirrors --gradient-1; CSS gradients can't paint an SVG stroke). */
const ICON_GRADIENT_ID = "review-summary-gradient-1";

// Figma copy, "14. Review & Publish". (Summary rows are sorted by SECTION_ORDER when shown.)
const sampleTitle = "Private Miami Yacht Charter Aboard Little Atocha from Key Biscayne";
const sampleDescription =
	"Step aboard Little Atocha and experience Miami from its most beautiful perspective, the water. This private Azimut 55 Fly yacht charter offers the perfect setting to relax, celebrate, and explore the crystal-blue waters of Biscayne Bay. Enjoy spacious areas to lounge, incredible city views, swimming stops, water activities, and a personalized journey guided by your professional captain and crew. From peaceful daytime cruises to unforgettable celebrations, every detail is designed to create a one-of-a-kind Miami experience.";

const sampleSummary: ReviewSummaryItem[] = [
	{ section: "photos", label: "Photos", value: "7 photos", media: { type: "image", src: jumpFromBoat } },
	{
		section: "yacht",
		label: "Yacht",
		value: "Little Atocha · Azimut 55 Fly (2021)",
		detail: "55 ft · 13 guests · 3 cabins · 2 bathrooms",
		media: { type: "icon", icon: ShipIcon },
	},
	{
		section: "location",
		label: "Location",
		value: "Key Biscayne Yacht Club",
		detail: "180 Harbor Dr, Key Biscayne, FL 33149 · Dock B — Slip 14",
		media: { type: "icon", icon: MapPinIcon },
	},
	{
		section: "duration",
		label: "Duration",
		value: "2 hr, 4 hr, 6 hr, and 10 hr",
		media: { type: "icon", icon: TimerIcon },
	},
	{
		section: "availability",
		label: "Availability",
		value: "Mon, Tue, Sat, Sun",
		detail: "6 time slots from 8:00 AM the earliest to 11:30 PM the latest",
		media: { type: "icon", icon: CalendarClockIcon },
	},
	{
		section: "pricing",
		label: "Pricing",
		value: "Starting at $200/hr",
		detail: "Packages from $400 – $1,600",
		media: { type: "icon", icon: DollarSignIcon },
	},
	{
		section: "captain",
		label: "Captain",
		value: "Frank Smith",
		detail: "USCG Master Captain",
		media: { type: "icon", icon: CircleUserIcon },
	},
	{
		section: "captain",
		label: "Captain",
		value: "Cody Fisher",
		detail: "Master Captain",
		media: { type: "icon", icon: CircleUserIcon },
	},
	{
		section: "documents",
		label: "Documents",
		value: "3 documents",
		detail: "Commercial insurance · 2 Captain license · Vessel registration",
		media: { type: "icon", icon: FileTextIcon },
	},
	{
		section: "addons",
		label: "Add-on Services",
		value: "6 available",
		detail: "Bartender · Catering · Private Chef · Jet Ski Rental · Photographer · Transportation",
		media: { type: "icon", icon: BlocksIcon },
	},
	{
		section: "policies",
		label: "Policies",
		value: "7 rules",
		detail: "Flexible cancellation · Reschedule or refund based on weather",
		media: { type: "icon", icon: ListChecksIcon },
	},
];

type ReviewStepProps = NewListingStepProps & {
	/** Listing type picked on the Type step — names it in the copy ("Tell the story of your service"). */
	listingType?: ListingKind;
	/**
	 * Write the title and description with `onImprove` when the step opens, from the earlier steps'
	 * answers (`summary`). Off for now (the step starts from `defaultTitle`/`defaultDescription`);
	 * `true` turns it on when `onImprove` is set.
	 */
	autoGenerate?: boolean;
	/** Starting title without auto-generation, and the fallback when it fails. Defaults to the Figma copy. */
	defaultTitle?: string;
	/** Starting description without auto-generation, and the fallback when it fails. Defaults to the Figma copy. */
	defaultDescription?: string;
	/** One row per earlier step. Defaults to the Figma sample. */
	summary?: ReviewSummaryItem[];
	/** URL of the experiences terms linked from the agreement line. */
	termsUrl?: string;
	/**
	 * Called when a field's AI mark is activated: resolve with improved text for that field (it
	 * replaces the current text) or reject to show an error under the field. The field is read-only
	 * while it runs. Provider-agnostic — the stories wire it to Claude via the Storybook dev server.
	 */
	onImprove?: (request: ReviewImproveRequest) => Promise<string>;
	/** Called when a summary row's pencil is activated — go back to that step. */
	onEdit?: (section: ReviewSection) => void;
	/** Called when "Preview" is activated. */
	onPreview?: () => void;
	/** Called when "Publish" is submitted. */
	onPublish?: (values: { title: string; description: string }) => void;
};

/**
 * New Listing — review & publish: the title and description (editable, each with an AI mark to
 * regenerate it and versions to switch between; `autoGenerate` can also have AI write them when the
 * step opens), "Preview" / "Publish" with the agreement
 * line, and a summary of every earlier step with a pencil to go back and edit it.
 * Figma origin: Provider Portal, "14. Review & Publish" (node 160:6093).
 */
function ReviewStep({
	steps = 14,
	currentStep = 14,
	stepLabel = "Little Atocha · Step 14 of 14",
	listingType = "experience",
	autoGenerate = false,
	defaultTitle = sampleTitle,
	defaultDescription = sampleDescription,
	summary = sampleSummary,
	termsUrl = "#",
	onImprove,
	onEdit,
	onPreview,
	onPublish,
	...frame
}: ReviewStepProps) {
	const id = React.useId();
	// Stable sort into wizard order (see SECTION_ORDER).
	// (Publish needs every summary card complete and a title + description — see `canPublish`.)
	const sortedSummary = React.useMemo(
		() => [...summary].sort((a, b) => SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section)),
		[summary],
	);
	const willAutoGenerate = autoGenerate && !!onImprove;
	// Each field keeps its versions — the first text plus every AI result — and which one is shown.
	// Typing edits the shown version in place, so switching away and back keeps the edits. With
	// auto-generation the first version starts empty and is filled in when the AI answers.
	const [versions, setVersions] = React.useState<Record<ReviewField, { list: string[]; index: number }>>(() => ({
		title: { list: [willAutoGenerate ? "" : defaultTitle], index: 0 },
		description: { list: [willAutoGenerate ? "" : defaultDescription], index: 0 },
	}));
	const title = versions.title.list[versions.title.index];
	const description = versions.description.list[versions.description.index];

	const editVersion = (field: ReviewField, value: string) =>
		setVersions((current) => {
			const { list, index } = current[field];
			return { ...current, [field]: { list: list.map((text, i) => (i === index ? value : text)), index } };
		});
	// The auto-generated (or fallback) text becomes the first version.
	const setFirstVersion = (field: ReviewField, value: string) =>
		setVersions((current) => ({ ...current, [field]: { list: [value], index: 0 } }));
	const addVersion = (field: ReviewField, value: string) =>
		setVersions((current) => {
			const list = [...current[field].list, value];
			return { ...current, [field]: { list, index: list.length - 1 } };
		});
	// Next version, wrapping from the last back to the first.
	const cycleVersion = (field: ReviewField) =>
		setVersions((current) => {
			const { list, index } = current[field];
			return { ...current, [field]: { list, index: (index + 1) % list.length } };
		});
	// Fields with an AI request in flight (read-only, text shimmering — `text-shimmer` in
	// theme.css — while the AI mark pulses), the last regenerate failure per field, and a note on
	// fields that fell back to the sample copy because auto-generation failed.
	const [improving, setImproving] = React.useState<Partial<Record<ReviewField, boolean>>>(() =>
		willAutoGenerate ? { title: true, description: true } : {},
	);
	const [improveErrors, setImproveErrors] = React.useState<Partial<Record<ReviewField, string>>>({});
	const [fallbackNotes, setFallbackNotes] = React.useState<Partial<Record<ReviewField, string>>>({});

	const maxLengthFor = (field: ReviewField) => (field === "description" ? DESCRIPTION_MAX_LENGTH : undefined);
	const requestFor = (field: ReviewField, values: Record<ReviewField, string>): ReviewImproveRequest => ({
		field,
		text: values[field],
		maxLength: maxLengthFor(field),
		listingType,
		facts: sortedSummary.map((item) => `${item.label}: ${item.value}${item.detail ? ` (${item.detail})` : ""}`),
		otherFields: values,
	});
	const clip = (field: ReviewField, text: string) => text.slice(0, maxLengthFor(field) ?? text.length);
	const failure = (field: ReviewField, error: unknown) =>
		error instanceof Error && error.message ? error.message : `Couldn't write the ${field}. Try again.`;

	// Results that land after the step closed are dropped. (A ref, not an effect-local flag: under
	// StrictMode's mount → unmount → mount the request starts once and must still land.)
	const mountedRef = React.useRef(false);
	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	// Auto-generate both fields once, in parallel, when the step opens. A failure falls back to the
	// sample copy with a note; the AI mark can try again.
	const autoGenerateStarted = React.useRef(false);
	React.useEffect(() => {
		if (!willAutoGenerate || !onImprove || autoGenerateStarted.current) return;
		autoGenerateStarted.current = true;
		const empty = { title: "", description: "" };
		const fallback = { title: defaultTitle, description: defaultDescription };
		for (const field of ["title", "description"] as const) {
			onImprove(requestFor(field, empty))
				.then((text) => {
					if (mountedRef.current) setFirstVersion(field, clip(field, text));
				})
				.catch((error: unknown) => {
					if (!mountedRef.current) return;
					setFirstVersion(field, fallback[field]);
					setFallbackNotes((current) => ({ ...current, [field]: `Showing sample copy. ${failure(field, error)}` }));
				})
				.finally(() => {
					if (mountedRef.current) setImproving((current) => ({ ...current, [field]: false }));
				});
		}
		// Runs once, when the step opens.
	}, []);

	// Publish needs every card complete (no "Required") and a title and description.
	const missingTitle = !improving.title && !title.trim();
	const missingDescription = !improving.description && !description.trim();
	const canPublish =
		!sortedSummary.some((item) => item.required) &&
		!!title.trim() &&
		!!description.trim() &&
		!improving.title &&
		!improving.description;

	const improve = async (field: ReviewField) => {
		if (!onImprove || improving[field]) return;
		setImproving((current) => ({ ...current, [field]: true }));
		setImproveErrors((current) => ({ ...current, [field]: undefined }));
		try {
			const text = await onImprove(requestFor(field, { title, description }));
			addVersion(field, clip(field, text));
			setFallbackNotes((current) => ({ ...current, [field]: undefined }));
		} catch (error) {
			setImproveErrors((current) => ({ ...current, [field]: failure(field, error) }));
		} finally {
			setImproving((current) => ({ ...current, [field]: false }));
		}
	};

	return (
		// Radix needs a TooltipProvider above every Tooltip (the AI marks' "Regenerate").
		<TooltipProvider>
			<NewListingLayout
				{...frame}
				steps={steps}
				currentStep={currentStep}
				stepLabel={stepLabel}
				align="top"
				title="Review & Publish"
				description="Review your details and publish when you’re ready."
				// Figma: 48px from the title to the first section.
				bodyClassName="gap-12"
			>
				{/* Standard 48px (spacing/12) gap between form sections. */}
				<form
					className="flex w-full flex-col gap-12"
					onSubmit={(event) => {
						event.preventDefault();
						if (canPublish) onPublish?.({ title, description });
					}}
				>
					{/* The CTAs sit 32px under the story fields (closer than the 48px between sections). */}
					<div className="flex flex-col gap-8">
						<section aria-labelledby={`${id}-story`} className="flex flex-col gap-4">
							<SectionHeader
								id={`${id}-story`}
								description={`Highlight what makes your ${listingType} special and what guests can look forward to.`}
							>
								{`Tell the story of your ${listingType}`}
							</SectionHeader>
							<FormField
								htmlFor={`${id}-title`}
								label="Title"
								labelAside={
									<>
										<VersionSwitcher
											field="title"
											{...versions.title}
											disabled={!!improving.title}
											onCycle={() => cycleVersion("title")}
										/>
										<ImproveButton
											label="Regenerate title"
											pending={!!improving.title}
											onClick={() => improve("title")}
										/>
									</>
								}
								error={improveErrors.title ?? (missingTitle ? "Add a title to publish." : undefined)}
								description={fallbackNotes.title}
								className="gap-2"
							>
								<Input
									id={`${id}-title`}
									size="xl"
									className={cn("text-sm", improving.title && "text-shimmer")}
									value={title}
									readOnly={improving.title}
									aria-busy={improving.title || undefined}
									placeholder={improving.title && !title ? "Writing a title from your listing details…" : undefined}
									aria-describedby={
										improveErrors.title || missingTitle
											? `${id}-title-error`
											: fallbackNotes.title
												? `${id}-title-description`
												: undefined
									}
									onChange={(event) => editVersion("title", event.target.value)}
								/>
							</FormField>
							<FormField
								htmlFor={`${id}-description`}
								label="Description"
								labelAside={
									<>
										<Typography as="span" size="xs" className="text-muted-foreground">
											<span aria-live="polite">
												{description.length}/{DESCRIPTION_MAX_LENGTH}
											</span>
											<VersionSwitcher
												field="description"
												{...versions.description}
												separator
												disabled={!!improving.description}
												onCycle={() => cycleVersion("description")}
											/>
										</Typography>
										<ImproveButton
											label="Regenerate description"
											pending={!!improving.description}
											onClick={() => improve("description")}
										/>
									</>
								}
								error={improveErrors.description ?? (missingDescription ? "Add a description to publish." : undefined)}
								description={fallbackNotes.description}
								className="gap-2"
							>
								<Textarea
									id={`${id}-description`}
									className={cn(improving.description && "text-shimmer")}
									maxLength={DESCRIPTION_MAX_LENGTH}
									value={description}
									readOnly={improving.description}
									aria-busy={improving.description || undefined}
									placeholder={
										improving.description && !description
											? "Writing a description from your listing details…"
											: undefined
									}
									aria-describedby={
										improveErrors.description || missingDescription
											? `${id}-description-error`
											: fallbackNotes.description
												? `${id}-description-description`
												: undefined
									}
									onChange={(event) => editVersion("description", event.target.value)}
								/>
							</FormField>
						</section>

						<div className="flex flex-col items-center gap-4">
							<div className="flex w-full gap-4">
								<Button type="button" variant="outline" size="xl" className="flex-1" onClick={onPreview}>
									Preview
								</Button>
								<Button
									type="submit"
									size="xl"
									className="flex-1"
									disabled={!canPublish}
									aria-describedby={canPublish ? undefined : `${id}-publish-hint`}
								>
									Publish
								</Button>
							</div>
							{canPublish ? null : (
								<Typography id={`${id}-publish-hint`} size="xs" className="text-center text-danger">
									Complete the required sections to publish.
								</Typography>
							)}
							<Typography size="xs" className="max-w-[482px] text-center text-muted-foreground">
								By submitting your request, you agree to the{" "}
								<a
									href={termsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary outline-none hover:text-foreground focus-visible:text-foreground"
								>
									experiences terms
								</a>{" "}
								and confirm all details are accurate, including any suggested content.
							</Typography>
						</div>
					</div>

					<section aria-labelledby={`${id}-summary`} className="flex flex-col gap-4">
						<SectionHeader
							id={`${id}-summary`}
							description="Review each section and edit anything that needs a change."
						>
							Summary
						</SectionHeader>
						<svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute size-0">
							<defs>
								{/* In the icon's 24px viewBox, not per shape: a straight line has a zero-size box,
								    so a bounding-box gradient would paint nothing on it. */}
								<linearGradient id={ICON_GRADIENT_ID} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="24">
									<stop offset="0" stopColor="#f26740" />
									<stop offset="1" stopColor="#ffa47d" />
								</linearGradient>
							</defs>
						</svg>
						<ul className="flex flex-col gap-2">
							{sortedSummary.map((item, index) => (
								<li key={`${item.section}-${index}`}>
									<SummaryRow item={item} onEdit={() => onEdit?.(item.section)} />
								</li>
							))}
						</ul>
					</section>
				</form>
			</NewListingLayout>
		</TooltipProvider>
	);
}

/**
 * "#/#" after a field's label once AI has produced more than one version: which version is shown,
 * as a button that switches to the next (wrapping to the first). With `separator`, it follows other
 * label-row text as " · #/#" (Description: "528/600 · 2/3"). Renders nothing with a single version.
 */
function VersionSwitcher({
	field,
	list,
	index,
	separator = false,
	disabled,
	onCycle,
}: {
	field: ReviewField;
	list: string[];
	index: number;
	separator?: boolean;
	disabled: boolean;
	onCycle: () => void;
}) {
	if (list.length < 2) return null;

	return (
		<>
			{separator ? <span aria-hidden="true"> · </span> : null}
			<button
				type="button"
				disabled={disabled}
				onClick={onCycle}
				aria-label={`${field === "title" ? "Title" : "Description"} version ${index + 1} of ${list.length}. Show the next version.`}
				className={cn(
					typographyVariants({ size: "xs" }),
					"rounded-sm text-muted-foreground tabular-nums outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50",
				)}
			>
				{index + 1}/{list.length}
			</button>
		</>
	);
}

/**
 * The AI mark beside a field label, as a button that improves the field's text, with a
 * "Regenerate" tooltip on hover/focus. No Figma hover/focus source: focus ring as on the other bare
 * icon buttons, slight dim on hover. While a request runs it's disabled (no tooltip) and plays the
 * Pending pulse (scale + fade; fade only under reduced motion).
 */
function ImproveButton({ label, pending, onClick }: { label: string; pending: boolean; onClick: () => void }) {
	const { prefersReducedMotion } = useMotionPreference();

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					aria-label={label}
					aria-busy={pending || undefined}
					disabled={pending}
					onClick={onClick}
					className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm outline-none transition-opacity hover:opacity-70 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-100"
				>
					<motion.span
						className="inline-flex"
						variants={prefersReducedMotion ? pendingIconReducedVariants : pendingIconVariants}
						initial={false}
						animate={pending ? "pending" : "idle"}
					>
						<AiIcon aria-hidden="true" className="size-4" />
					</motion.span>
				</button>
			</TooltipTrigger>
			<TooltipContent>Regenerate</TooltipContent>
		</Tooltip>
	);
}

/**
 * Figma "Form Wizard Answers": white card (radius/card, spacing/3 padding), a 64px tile, an
 * uppercase label over the value and an optional detail line, and a pencil to edit that step.
 * The pencil's hit area stretches over the whole card (one button, no nested controls), so clicking
 * anywhere on the card edits; the card lifts with the `card` shadow on hover, like DocumentCard.
 * A `required` card shows Availability's Required look (TimeSlotAccordion): danger-05 tint and a
 * danger "Required" pill.
 */
function SummaryRow({ item, onEdit }: { item: ReviewSummaryItem; onEdit: () => void }) {
	const { media } = item;

	return (
		<div
			data-required={item.required || undefined}
			className={cn(
				"relative flex items-center gap-3 rounded-card p-3 transition-shadow has-[button:hover]:shadow-card",
				item.required ? "bg-danger-05" : "bg-card",
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-4">
				{media.type === "image" ? (
					<img src={media.src} alt="" className="size-16 shrink-0 rounded-lg object-cover" />
				) : (
					<div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-primary-subtle">
						<media.icon aria-hidden="true" className="size-6 text-primary" style={{ stroke: `url(#${ICON_GRADIENT_ID})` }} />
					</div>
				)}
				<div className="flex min-w-0 flex-1 flex-col gap-px">
					{/* No 10px type token: Figma's literal headline 10/18, +0.4px tracking. */}
					<span className="font-display text-[10px] leading-[18px] tracking-[0.04em] text-muted-foreground uppercase">
						{item.label}
					</span>
					<Typography size="lg" weight="medium" className="truncate">
						{item.value}
					</Typography>
					{item.detail != null ? (
						<Typography size="xs" className="truncate text-muted-foreground">
							{item.detail}
						</Typography>
					) : null}
				</div>
			</div>
			{item.required ? (
				<span className="shrink-0 rounded-full bg-danger-05 px-2 py-0.5 text-xs leading-[18px] whitespace-nowrap text-danger">
					Required
				</span>
			) : null}
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="text-icon-subtle after:absolute after:inset-0 after:rounded-card"
				aria-label={`Edit ${item.label.toLowerCase()}: ${item.value}${item.required ? " (required)" : ""}`}
				onClick={onEdit}
			>
				<PencilIcon />
			</Button>
		</div>
	);
}

/** Section title + supporting line in Figma's 48px-tall header: `lg -semibold` over muted `sm`. */
function SectionHeader({ id, description, children }: { id: string; description: string; children: React.ReactNode }) {
	return (
		<div className="flex h-12 flex-col">
			<Typography as="h2" id={id} size="lg" weight="semibold">
				{children}
			</Typography>
			<Typography size="sm" className="text-muted-foreground">
				{description}
			</Typography>
		</div>
	);
}

export { ReviewStep };
export type { ReviewStepProps, ReviewSection, ReviewField, ReviewImproveRequest, ReviewSummaryItem };
