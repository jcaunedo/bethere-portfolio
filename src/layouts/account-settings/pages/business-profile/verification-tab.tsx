import { SettingsDetailRow } from "@/components/forms/settings-detail-row";
import { Input } from "@/components/forms/input";

import type { FieldState, VerificationFieldKey } from "./business-profile";

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
	onViewOwnerVerification?: () => void;
	onEditOwnerVerification?: () => void;
	onEditInsuranceProvider?: () => void;
};

/**
 * Business Profile's "Verification" tab (Figma: "Business Verification"
 * frame) — EIN/License/Registration scalar edits plus two static rows
 * (Owner verification, Insurance provider) whose content is compound
 * (name/provider + doc-type + expiry + link), not a single text value, so
 * `onEditStart` is a stub that never flips `editing`. See DESIGN.md's
 * "SettingsDetailRow reuse across account-settings pages" entry.
 */
function VerificationTab({
	verificationFields,
	verificationDrafts,
	setVerificationDrafts,
	startEditingVerification,
	cancelEditingVerification,
	saveVerification,
	isVerificationUnchanged,
	onViewOwnerVerification,
	onEditOwnerVerification,
	onEditInsuranceProvider,
}: VerificationTabProps) {
	return (
		<div className="flex flex-col divide-y divide-border">
			<div className="py-6">
				<SettingsDetailRow
					title="EIN / Tax ID"
					value={verificationFields.ein.value}
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

			<div className="py-6">
				<SettingsDetailRow
					title="License number"
					value={verificationFields.license.value}
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

			<div className="py-6">
				<SettingsDetailRow
					title="Registration number"
					value={verificationFields.registration.value}
					emptyPlaceholder="No registration entered yet"
					addLabel="Add registration number"
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

			{/* Owner verification/Insurance provider have compound content
			    (name/provider + doc-type + expiry + link) rather than a
			    single scalar value, and no Figma edit-form state exists for
			    them — SettingsDetailRow's title/value/note display is
			    reused, but onEditStart is a plain stub (editing is never
			    set to true, so the row never expands). See DESIGN.md. */}
			<div className="py-6">
				<SettingsDetailRow
					title="Owner verification"
					value="John Smith"
					note={
						<>
							Driver license · Expires Jun 02, 2032{" "}
							<button
								type="button"
								onClick={onViewOwnerVerification}
								className="text-primary outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
							>
								View
							</button>
						</>
					}
					onEditStart={onEditOwnerVerification}
				/>
			</div>

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
