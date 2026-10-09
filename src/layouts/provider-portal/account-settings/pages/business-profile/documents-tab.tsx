import * as React from "react";
import { IdCardIcon, PlusIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { type badgeVariants } from "@/components/data-display/badge";
import { RowDocuments } from "@/components/data-display/row-documents";
import { Typography } from "@/components/typography";
import { Button } from "@/components/buttons/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { SearchTrigger } from "@/components/forms/search-trigger";

type DocumentRow = {
	id: string;
	icon?: React.ComponentType<{ className?: string }>;
	name: string;
	description?: string;
	badgeLabel?: string;
	badgeColor?: NonNullable<VariantProps<typeof badgeVariants>["color"]>;
	/** Clicking the row opens this URL in a new tab. Placeholder ("#") in this reference layout — no real document storage exists yet. */
	documentUrl: string;
};

type DocumentGroup = {
	id: string;
	title: string;
	description: string;
	rows: DocumentRow[];
};

// Documents tab's three grouped tables (Figma: "Required" / "Required for
// yacht services" / "Additional documents"). Each RowDocuments instance maps
// 1:1 to a Figma row-documents instance — icon/description/badge are only
// set where Figma's instance actually shows them (several rows have no
// description and/or no badge, per RowDocuments' optional-field support).
const DOCUMENT_GROUPS: DocumentGroup[] = [
	{
		id: "required",
		title: "Required",
		description: "Required to approve this business for publishing experiences",
		rows: [
			{
				id: "business-license",
				name: "Business license",
				description: "Expires May 15, 2026",
				badgeLabel: "Expired",
				badgeColor: "red",
				documentUrl: "#",
			},
			{ id: "business-registration", name: "Business registration", documentUrl: "#" },
			{
				id: "certificate-of-insurance",
				name: "Certificate of Insurance",
				description: "Expires Aug 22, 2026",
				badgeLabel: "Expiring soon",
				badgeColor: "yellow",
				documentUrl: "#",
			},
			{ id: "ein-letter", name: "EIN letter", documentUrl: "#" },
			{
				id: "owner-identity-verification",
				icon: IdCardIcon,
				name: "Owner identity verification",
				description: "Driver license · Expires Jun 02, 2032",
				documentUrl: "#",
			},
		],
	},
	{
		id: "yacht-services",
		title: "Required for yacht services",
		description: "Documents needed to verify yacht, vessel, and captain eligibility.",
		rows: [
			{
				id: "captain-license-skipper",
				name: "Captain License - Skipper",
				description: "Expires Dec 02, 2028",
				documentUrl: "#",
			},
			{
				id: "captain-license-robert-gomez",
				name: "Captain License - Robert Gomez",
				description: "Expires Aug 20, 2029",
				badgeLabel: "Needs update",
				badgeColor: "blue",
				documentUrl: "#",
			},
			{
				id: "vessel-registration-little-atocha",
				name: "Vessel registration - Little Atocha",
				description: "Expires May 15, 2027",
				badgeLabel: "Pending review",
				badgeColor: "blue",
				documentUrl: "#",
			},
		],
	},
	{
		id: "additional",
		title: "Additional documents",
		description: "Supporting documents that may be needed for verification, safety, or payouts.",
		rows: [
			{
				id: "proof-of-address",
				name: "Proof of address",
				description: "Expires May 15, 2027",
				documentUrl: "#",
			},
			{
				id: "safety-inspection",
				name: "Safety inspection",
				description: "Expires Dec 02, 2028",
				documentUrl: "#",
			},
			{ id: "w9-tax-form", name: "W-9 Tax Form", documentUrl: "#" },
		],
	},
];

/**
 * Front-end-only search over the seed rows, by name and description (same approach as Team
 * members). Badge labels aren't searched — typing "missing" shouldn't match on status.
 */
function matchesQuery(row: DocumentRow, query: string): boolean {
	const needle = query.trim().toLowerCase();
	if (needle === "") return true;
	return [row.name, row.description].some(
		(field) => field !== undefined && field.toLowerCase().includes(needle),
	);
}

type DocumentsTabProps = {
	/** Called with the search text as the user types. Filtering itself happens here. */
	onSearchDocuments?: (query: string) => void;
	onAddDocument?: () => void;
	onDocumentActions?: (id: string) => void;
};

/**
 * Business Profile's "Documents" tab (Figma: "Business Documents" frame) —
 * a search/Add document `Controls` row above three fixed document-group
 * tables, each a titled card of `RowDocuments`. Search (`SearchTrigger`)
 * filters the rows; groups with no matching rows are hidden, and an empty
 * state offers to clear the search when nothing matches. Group/row data is
 * hardcoded seed data (`DOCUMENT_GROUPS`) — see product-specs/business-profiles.md
 * for the persistence gap.
 */
function DocumentsTab({
	onSearchDocuments,
	onAddDocument,
	onDocumentActions,
}: DocumentsTabProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const updateSearch = (query: string) => {
		setSearchQuery(query);
		onSearchDocuments?.(query);
	};
	const visibleGroups = DOCUMENT_GROUPS.map((group) => ({
		...group,
		rows: group.rows.filter((row) => matchesQuery(row, searchQuery)),
	})).filter((group) => group.rows.length > 0);

	return (
		<div className="flex flex-col gap-12 py-6">
			<div className="flex items-start gap-2">
				<SearchTrigger
					aria-label="Search documents"
					placeholder="Search documents"
					value={searchQuery}
					onChange={(e) => updateSearch(e.target.value)}
					onClear={() => updateSearch("")}
				/>
				<Button type="button" variant="default" size="lg" onClick={onAddDocument}>
					<PlusIcon />
					Add document
				</Button>
			</div>

			{visibleGroups.length === 0 ? (
				<EmptyState
					className="py-12"
					title={`No matches for “${searchQuery.trim()}”`}
					description="Check the spelling, or search by another document name."
					buttonLabel="Clear search"
					buttonProps={{ variant: "outline", onClick: () => updateSearch("") }}
				/>
			) : null}

			{visibleGroups.map((group) => (
				<div key={group.id} className="flex flex-col gap-3">
					<div>
						<Typography size="lg" weight="semibold">
							{group.title}
						</Typography>
						<Typography size="sm" className="text-muted-foreground">
							{group.description}
						</Typography>
					</div>
					<div className="w-full">
						{group.rows.map((row) => (
							<RowDocuments
								key={row.id}
								icon={row.icon}
								name={row.name}
								description={row.description}
								badgeLabel={row.badgeLabel}
								badgeColor={row.badgeColor}
								documentUrl={row.documentUrl}
								onMoreActions={() => onDocumentActions?.(row.id)}
								className="first:border-t"
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

export { DocumentsTab };
