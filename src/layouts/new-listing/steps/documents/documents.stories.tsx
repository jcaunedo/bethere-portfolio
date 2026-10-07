import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { saveDraftSample, withToaster } from "../../shared/save-draft-sample";
import { improveWithClaude } from "../../shared/improve-with-claude";
import { buildReviewSummary, sampleListingAnswers } from "../../shared/listing-summary";
import { ReviewStep } from "../review/review";
import { DocumentsStep, sampleDocuments, type DocumentsStepProps } from "./documents";

/**
 * Documents with its Continue wired to the next step: submitting shows Review & Publish, and
 * Review's back control returns here (documents as they were left). The step component itself
 * stays unaware of Review — the same hand-off the Flow story does.
 */
function DocumentsThenReview(args: DocumentsStepProps) {
	const [screen, setScreen] = React.useState<"documents" | "review">("documents");
	// The documents as left on this step — Review's captain and document cards are built from them
	// (the other cards use each step's sample answers).
	const [documents, setDocuments] = React.useState(args.defaultDocuments ?? sampleDocuments);

	React.useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [screen]);

	return (
		<>
			{/* Kept mounted while Review shows, so going back keeps any removed/added documents. */}
			<div hidden={screen !== "documents"}>
				<DocumentsStep
					{...args}
					onDocumentsChange={(next) => {
						args.onDocumentsChange?.(next);
						setDocuments(next);
					}}
					onContinue={() => {
						args.onContinue?.();
						setScreen("review");
					}}
				/>
			</div>
			{screen === "review" ? (
				<ReviewStep
					listingType={args.listingType}
					summary={buildReviewSummary({ ...sampleListingAnswers, documents })}
					onImprove={improveWithClaude}
					onSaveDraft={args.onSaveDraft}
					onBack={() => setScreen("documents")}
					// Captain and document cards were defined on this step — their pencils come back here.
					onEdit={(section) => {
						if (section === "captain" || section === "documents") setScreen("documents");
					}}
				/>
			) : null}
		</>
	);
}

const meta: Meta<typeof DocumentsStep> = {
	title: "Layouts/NewListing/Documents",
	component: DocumentsStep,
	// "Save as draft" saves (simulated) and confirms with a toast.
	args: { onSaveDraft: saveDraftSample },
	decorators: [withToaster],
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	render: (args) => <DocumentsThenReview {...args} />,
};
export default meta;
type Story = StoryObj<typeof DocumentsStep>;

/** Figma 161:1324: one insurance certificate, two captains (one expired), one vessel registration expiring soon. Each card's "x" removes it; insurance and vessel registration hold one document, so emptying either swaps in its "Add …" button and disables Continue. Continue goes to Review & Publish; its back control returns here. */
export const Default: Story = {};

/** Figma 863:4336 "Documents - Empty state": each section shows a primary "Add …" button and Continue is disabled. */
export const Empty: Story = {
	args: { defaultDocuments: { insurance: [], captain: [], vessel: [] } },
};

/** Service listing: the copy names a service instead of an experience. */
export const Service: Story = {
	args: { listingType: "service" },
};
