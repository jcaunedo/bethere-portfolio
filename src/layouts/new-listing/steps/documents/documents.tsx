import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import avatarM1 from "@/assets/avatars/m1.png";
import sampleDocumentUrl from "@/assets/documents/sample-document.pdf";
import { Button } from "@/components/buttons/button";
import { DocumentCard } from "@/components/cards/document-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/data-display/avatar";
import { Typography } from "@/components/typography";
import { dismissVariants, fadeVariants, layoutSpring, useMotionPreference } from "@/lib/motion";
import { NewListingLayout, type NewListingStepProps } from "../../new-listing";
import { StepActions } from "../../shared/step-actions";
import { AddLink } from "../../shared/add-link";
import { useReportAnswers } from "../../shared/use-report-answers";
import type { ListingKind } from "../type/type";

/** The document groups this step confirms. */
type DocumentSection = "insurance" | "captain" | "vessel";

/** One uploaded/linked document, rendered as a `DocumentCard`. */
type ListingDocument = {
	id: string;
	title: string;
	description: string;
	/** Status badge — only when the document needs attention (Figma: "Expired", "Expiring Soon"). */
	status?: { label: string; color: "red" | "yellow" };
	/** Captain licenses show the captain instead of the file icon. */
	captain?: { name: string; initials: string; photo?: string };
	/** Document file — clicking the card opens it in a new tab. */
	documentUrl?: string;
};

// Figma copy, "13. Documents". Every card opens the same placeholder PDF.
const sampleDocuments: Record<DocumentSection, ListingDocument[]> = {
	insurance: [
		{
			id: "insurance-1",
			title: "Marine Liability Insurance Certificate",
			description: "Blue Yachts Miami LLC · Expires Jun 15, 2027",
			documentUrl: sampleDocumentUrl,
		},
	],
	captain: [
		{
			id: "captain-1",
			title: "Frank Smith",
			description: "USCG Master Captain License · Expired Feb 23, 2026",
			documentUrl: sampleDocumentUrl,
			status: { label: "Expired", color: "red" },
			captain: { name: "Frank Smith", initials: "FS", photo: avatarM1 },
		},
		{
			id: "captain-2",
			title: "Cody Fisher",
			description: "Master Captain License · Expires Jun 15, 2027",
			documentUrl: sampleDocumentUrl,
			captain: { name: "Cody Fisher", initials: "CF" },
		},
	],
	vessel: [
		{
			id: "vessel-1",
			title: "Little Atocha",
			description: "Vessel Registration · Expires Mar 10, 2028",
			documentUrl: sampleDocumentUrl,
			status: { label: "Expiring Soon", color: "yellow" },
		},
	],
};

type DocumentsStepProps = NewListingStepProps & {
	/** Listing type picked on the Type step — names it in the copy ("…to operate this service"). */
	listingType?: ListingKind;
	/** Documents shown on first render, per section. Defaults to the Figma sample. */
	defaultDocuments?: Record<DocumentSection, ListingDocument[]>;
	/** Called with every section's documents whenever they change (removed, or a flow restores them). */
	onDocumentsChange?: (documents: Record<DocumentSection, ListingDocument[]>) => void;
	/** Called when a section's "+ Add …" link is activated. */
	onAddDocument?: (section: DocumentSection) => void;
	/** Called when "Continue" is submitted. */
	onContinue?: () => void;
};

/**
 * New Listing — documents ("Required documents"): commercial insurance, captain licenses and
 * vessel registration as `DocumentCard`s (click to open the file in a new tab, "x" to remove).
 * Insurance and vessel registration hold one document each; captain licenses can be several, with
 * an "+ Add …" link under them. A section with no document shows a primary "Add …" button, and
 * Continue stays disabled until every section has a document.
 * Figma origin: Provider Portal, "13. Documents" (node 161:1324) and "Documents - Empty state"
 * (node 863:4336).
 */
function DocumentsStep({
	steps = 14,
	currentStep = 13,
	stepLabel = "Little Atocha · Step 13 of 14",
	listingType = "experience",
	defaultDocuments = sampleDocuments,
	onDocumentsChange,
	onAddDocument,
	onContinue,
	onSaveDraft,
	...frame
}: DocumentsStepProps) {
	const id = React.useId();
	const [documents, setDocuments] = React.useState(defaultDocuments);
	useReportAnswers(documents, onDocumentsChange);
	const { prefersReducedMotion, resolve } = useMotionPreference();
	// Glide (layout) for everything that moves up when a card is removed. Reduced motion: no movement.
	const glide = {
		layout: prefersReducedMotion ? false : ("position" as const),
		transition: { layout: resolve(layoutSpring) },
	};

	const remove = (section: DocumentSection, documentId: string) =>
		setDocuments((current) => ({
			...current,
			[section]: current[section].filter((document) => document.id !== documentId),
		}));
	// Every section is required ("Required documents"): Continue stays disabled until each has a document.
	const canContinue = Object.values(documents).every((list) => list.length > 0);

	// `emptyLabel`: the primary button shown while a section has no document (Figma "Documents -
	// Empty state"). `addLabel`: the "+ Add …" link under the cards — only on sections that take
	// several documents (captain licenses); insurance and vessel registration hold exactly one.
	const sections: {
		key: DocumentSection;
		title: string;
		description: string;
		emptyLabel: string;
		addLabel?: string;
	}[] = [
		{
			key: "insurance",
			title: "Commercial insurance",
			description: "Proof of coverage or a certificate of insurance.",
			emptyLabel: "Add commercial insurance",
		},
		{
			key: "captain",
			title: "Captain license",
			description: `Select the licensed captains who can operate this ${listingType}.`,
			emptyLabel: "Add captain license",
			addLabel: "Add captain license",
		},
		{
			key: "vessel",
			title: "Vessel registration",
			description: `Confirm the registered vessel used for this ${listingType}.`,
			emptyLabel: "Add registration",
		},
	];

	return (
		<NewListingLayout
			{...frame}
			steps={steps}
			currentStep={currentStep}
			stepLabel={stepLabel}
			align="top"
			title="Required documents"
			description={`Confirm the documents required to operate this ${listingType}.`}
			// Figma: 40px from the title to the first section.
			bodyClassName="gap-10"
		>
			{/* Standard 48px (spacing/12) gap between form sections. */}
			<form
				className="flex w-full flex-col gap-12"
				onSubmit={(event) => {
					event.preventDefault();
					onContinue?.();
				}}
			>
				{sections.map((section) => (
					<motion.section
						key={section.key}
						{...glide}
						aria-labelledby={`${id}-${section.key}`}
						className="flex flex-col gap-4"
					>
						<SectionHeader id={`${id}-${section.key}`} description={section.description}>
							{section.title}
						</SectionHeader>
						<div className="relative flex flex-col gap-2">
							{/* Dismiss: a removed card leaves the flow at once (popLayout) and fades out, while
							    the cards, add link and sections below glide up. */}
							<AnimatePresence initial={false} mode="popLayout">
								{documents[section.key].map((document) => (
									<motion.div
										key={document.id}
										{...glide}
										variants={prefersReducedMotion ? fadeVariants : dismissVariants}
										initial="initial"
										animate="animate"
										exit="exit"
									>
										<DocumentCard
											avatar={
												document.captain ? (
													<Avatar size="lg">
														{document.captain.photo ? (
															<AvatarImage src={document.captain.photo} alt="" />
														) : null}
														<AvatarFallback colorSeed={document.captain.name}>
															{document.captain.initials}
														</AvatarFallback>
													</Avatar>
												) : undefined
											}
											title={document.title}
											description={document.description}
											badgeLabel={document.status?.label}
											badgeColor={document.status?.color}
											onDismiss={() => remove(section.key, document.id)}
											documentUrl={document.documentUrl}
											dismissLabel={`Remove ${document.title}`}
										/>
									</motion.div>
								))}
							</AnimatePresence>
							{/* Empty: a primary "Add …" button. With documents: the "+ Add …" link, on multi-document
							    sections only. The two crossfade when a section empties or fills. */}
							<AnimatePresence initial={false} mode="popLayout">
								{documents[section.key].length === 0 ? (
									<motion.div
										key="empty"
										{...glide}
										variants={fadeVariants}
										initial="initial"
										animate="animate"
										exit="exit"
										className="flex"
									>
										<Button type="button" size="lg" onClick={() => onAddDocument?.(section.key)}>
											{section.emptyLabel}
										</Button>
									</motion.div>
								) : section.addLabel != null ? (
									<motion.div
										key="link"
										{...glide}
										variants={fadeVariants}
										initial="initial"
										animate="animate"
										exit="exit"
										className="flex"
									>
										<AddLink onClick={() => onAddDocument?.(section.key)}>{section.addLabel}</AddLink>
									</motion.div>
								) : null}
							</AnimatePresence>
						</div>
					</motion.section>
				))}

				<motion.div {...glide}>
					<StepActions onSaveDraft={onSaveDraft} continueDisabled={!canContinue} />
				</motion.div>
			</form>
		</NewListingLayout>
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

export { DocumentsStep, sampleDocuments };
export type { DocumentsStepProps, DocumentSection, ListingDocument };
