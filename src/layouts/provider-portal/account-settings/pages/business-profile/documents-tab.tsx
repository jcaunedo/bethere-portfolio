import type * as React from "react";
import { IdCardIcon, PlusIcon, SearchIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { type badgeVariants } from "@/components/data-display/badge";
import { RowDocuments } from "@/components/data-display/row-documents";
import { Typography } from "@/components/typography";
import { Button } from "@/components/buttons/button";

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

type DocumentsTabProps = {
	onSearchDocuments?: () => void;
	onAddDocument?: () => void;
	onDocumentActions?: (id: string) => void;
};

/**
 * Business Profile's "Documents" tab (Figma: "Business Documents" frame) —
 * a search/Add document `Controls` row above three fixed document-group
 * tables, each a titled card of `RowDocuments`. Group/row data is
 * hardcoded seed data (`DOCUMENT_GROUPS`) — see product-specs/business-profiles.md
 * for the persistence gap.
 */
function DocumentsTab({
	onSearchDocuments,
	onAddDocument,
	onDocumentActions,
}: DocumentsTabProps) {
	return (
		<div className="flex flex-col gap-12 py-6">
			<div className="flex items-start gap-2">
				<Button
					type="button"
					variant="outline"
					size="icon-lg"
					onClick={onSearchDocuments}
					aria-label="Search documents"
				>
					<SearchIcon />
				</Button>
				<Button type="button" variant="default" size="lg" onClick={onAddDocument}>
					<PlusIcon />
					Add document
				</Button>
			</div>

			{DOCUMENT_GROUPS.map((group) => (
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
