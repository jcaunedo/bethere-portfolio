import { SettingsDetailRow } from "@/components/forms/settings-detail-row";
import { Input } from "@/components/forms/input";
import { ACTIVE_MEMBERS } from "@/layouts/account-settings/pages/team-members/team-members";

import { MemberPicker, MemberSummary } from "./member-picker";
import type { FieldState, RowKey, VerificationFieldKey } from "./business-profile";

type VerificationTabProps = {
	verificationFields: Record<VerificationFieldKey, FieldState>;
	verificationDrafts: Record<VerificationFieldKey, string>;
	setVerificationDrafts: (
		updater: (
			prev: Record<VerificationFieldKey, string>,
		) => Record<VerificationFieldKey, string>,
	) => void;
	startEditingVerification: (key: VerificationFieldKey) => void;
	cancelEditingVerification: (key: VerificationFieldKey) => void;
	saveVerification: (key: VerificationFieldKey) => void;
	isVerificationUnchanged: (key: VerificationFieldKey) => boolean;
	/** Selected business owner's email — empty string means none set (Figma "Default (Empty)"). */
	businessOwnerEmail: string;
	businessOwnerEditing: boolean;
	businessOwnerDraft: string;
	startEditingBusinessOwner: () => void;
	cancelEditingBusinessOwner: () => void;
	/** Called with the chosen member's email — commits and closes the row immediately, no separate Save step. */
	saveBusinessOwnerValue: (email: string) => void;
	onEditInsuranceProvider?: () => void;
	/** Registers a row's wrapper DOM node for the page-level Escape/Enter handler (see business-profile.tsx). */
	registerRow: (key: RowKey) => (el: HTMLDivElement | null) => void;
};

/**
 * Business Profile's "Compliance" tab (Figma: "Business Compliance" frame)
 * — Business owner (a team-member Select picker, same format as Primary
 * contact on the Profile tab, replacing the old static "Owner verification"
 * row) plus Tax ID/License/Registration scalar edits, and one static row
 * (Insurance provider) whose content is compound (provider + doc-type +
 * expiry + link), not a single text value, so `onEditStart` is a stub that
 * never flips `editing`. See DESIGN.md's "SettingsDetailRow reuse across
 * account-settings pages" entry.
 */
function VerificationTab({
	verificationFields,
	verificationDrafts,
	setVerificationDrafts,
	startEditingVerification,
	cancelEditingVerification,
	saveVerification,
	isVerificationUnchanged,
	businessOwnerEmail,
	businessOwnerEditing,
	businessOwnerDraft,
	startEditingBusinessOwner,
	cancelEditingBusinessOwner,
	saveBusinessOwnerValue,
	onEditInsuranceProvider,
	registerRow,
}: VerificationTabProps) {
	const businessOwner = ACTIVE_MEMBERS.find(
		(member) => member.email === businessOwnerEmail,
	);
	const businessOwnerDraftMember = ACTIVE_MEMBERS.find(
		(member) => member.email === businessOwnerDraft,
	);
	return (
		<div className="flex flex-col divide-y divide-border">
			<div className="py-6" ref={registerRow("businessOwner")}>
				<SettingsDetailRow
					title="Business owner"
					value={
						businessOwner ? (
							<MemberSummary
								name={businessOwner.name}
								title={businessOwner.title}
								avatarUrl={businessOwner.avatarUrl}
							/>
						) : undefined
					}
					emptyPlaceholder="No business owner yet"
					addLabel="Add business owner"
					addDescription="Choose an existing team member as this business's owner."
					editDescription="Choose an existing team member as this business's owner."
					editing={businessOwnerEditing}
					onEditStart={startEditingBusinessOwner}
					onCancel={cancelEditingBusinessOwner}
					hideSaveButton
				>
					<MemberPicker
						value={businessOwnerDraft}
						onChange={saveBusinessOwnerValue}
						selectedMember={businessOwnerDraftMember}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("ein")}>
				<SettingsDetailRow
					title="Tax ID (EIN)"
					value={verificationFields.ein.value}
					editDescription="Your Employer Identification Number, used to verify your business for tax purposes."
					editing={verificationFields.ein.editing}
					onEditStart={() => startEditingVerification("ein")}
					onCancel={() => cancelEditingVerification("ein")}
					onSave={() => saveVerification("ein")}
					saveDisabled={isVerificationUnchanged("ein")}
				>
					<Input
						value={verificationDrafts.ein}
						onChange={(e) =>
							setVerificationDrafts((prev) => ({
								...prev,
								ein: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("license")}>
				<SettingsDetailRow
					title="License number"
					value={verificationFields.license.value}
					editDescription="Your business license number, used to confirm you're authorized to operate."
					editing={verificationFields.license.editing}
					onEditStart={() => startEditingVerification("license")}
					onCancel={() => cancelEditingVerification("license")}
					onSave={() => saveVerification("license")}
					saveDisabled={isVerificationUnchanged("license")}
				>
					<Input
						value={verificationDrafts.license}
						onChange={(e) =>
							setVerificationDrafts((prev) => ({
								...prev,
								license: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("registration")}>
				<SettingsDetailRow
					title="Registration number"
					value={verificationFields.registration.value}
					emptyPlaceholder="No registration entered yet"
					addLabel="Add registration number"
					editDescription="Your official business registration number, used to verify your business is legally registered."
					editing={verificationFields.registration.editing}
					onEditStart={() => startEditingVerification("registration")}
					onCancel={() => cancelEditingVerification("registration")}
					onSave={() => saveVerification("registration")}
					saveDisabled={isVerificationUnchanged("registration")}
				>
					<Input
						value={verificationDrafts.registration}
						onChange={(e) =>
							setVerificationDrafts((prev) => ({
								...prev,
								registration: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			{/* Insurance provider has compound content (provider + doc-type +
			    expiry + link) rather than a single scalar value, and no Figma
			    edit-form state exists for it — SettingsDetailRow's
			    title/value/note display is reused, but onEditStart is a plain
			    stub (editing is never set to true, so the row never expands).
			    See DESIGN.md. */}
			<div className="py-6">
				<SettingsDetailRow
					title="Insurance provider"
					value="Maritime Insurance Group"
					note="Commercial liability (78492031) · Expires Dec 31, 2026"
					onEditStart={onEditInsuranceProvider}
				/>
			</div>
		</div>
	);
}

export { VerificationTab };
