import { SettingsDetailRow } from "@/components/forms/settings-detail-row";
import { Input } from "@/components/forms/input";
import { Typography } from "@/components/typography";
import { ACTIVE_MEMBERS } from "@/layouts/provider-portal/account-settings/pages/team-members/team-members";

import { MemberPicker, MemberSummary } from "./member-picker";
import type { FieldKey, FieldState, RowKey } from "./business-profile";

// Same "good enough" US-phone pattern as MyProfileLayout (my-profile.tsx) —
// kept as a local copy rather than a shared helper since this codebase
// doesn't yet have one (see e.g. invite-team-members-dialog.tsx's own
// EMAIL_PATTERN copy).
const US_PHONE_PATTERN = /^1?\d{10}$/;

function isValidPhone(value: string): boolean {
	return US_PHONE_PATTERN.test(value.replace(/[\s()+-]/g, ""));
}

function formatUsPhone(value: string): string {
	const allDigits = value.replace(/\D/g, "");
	const withoutCountryCode =
		allDigits.length > 10 && allDigits.startsWith("1")
			? allDigits.slice(1)
			: allDigits;
	const local = withoutCountryCode.slice(0, 10);
	const area = local.slice(0, 3);
	const prefix = local.slice(3, 6);
	const line = local.slice(6, 10);

	if (local.length === 0) return "";
	if (local.length <= 3) return `(${area}`;
	if (local.length <= 6) return `(${area}) ${prefix}`;
	return `(${area}) ${prefix}-${line}`;
}

type ProfileTabProps = {
	fields: Record<FieldKey, FieldState>;
	drafts: Record<FieldKey, string>;
	setDrafts: (updater: (prev: Record<FieldKey, string>) => Record<FieldKey, string>) => void;
	startEditing: (key: FieldKey) => void;
	cancelEditing: (key: FieldKey) => void;
	save: (key: FieldKey) => void;
	isUnchanged: (key: FieldKey) => boolean;
	/** Selected primary contact's email — empty string means none set (Figma "Default (Empty)"). */
	primaryContactEmail: string;
	primaryContactEditing: boolean;
	primaryContactDraft: string;
	startEditingPrimaryContact: () => void;
	cancelEditingPrimaryContact: () => void;
	/** Called with the chosen member's email — commits and closes the row immediately, no separate Save step. */
	savePrimaryContactValue: (email: string) => void;
	/** Registers a row's wrapper DOM node for the page-level Escape/Enter handler (see business-profile.tsx). */
	registerRow: (key: RowKey) => (el: HTMLDivElement | null) => void;
};

/**
 * Business Profile's "Profile" tab (Figma: "Business Profile" frame) — the
 * business's editable identity fields plus two navigation-to-another-flow
 * rows (Primary contact/Phone numbers) that intentionally do NOT use
 * `SettingsDetailRow`'s expand-to-edit-form behavior. See DESIGN.md's
 * "SettingsDetailRow reuse across account-settings pages" entry. Business
 * owner lives on the "Compliance" tab now (`VerificationTab`), replacing the
 * old static "Owner verification" row.
 */
function ProfileTab({
	fields,
	drafts,
	setDrafts,
	startEditing,
	cancelEditing,
	save,
	isUnchanged,
	primaryContactEmail,
	primaryContactEditing,
	primaryContactDraft,
	startEditingPrimaryContact,
	cancelEditingPrimaryContact,
	savePrimaryContactValue,
	registerRow,
}: ProfileTabProps) {
	const primaryContact = ACTIVE_MEMBERS.find(
		(member) => member.email === primaryContactEmail,
	);
	const primaryContactDraftMember = ACTIVE_MEMBERS.find(
		(member) => member.email === primaryContactDraft,
	);
	return (
		<div className="flex flex-col divide-y divide-border">
			<div className="py-6" ref={registerRow("displayName")}>
				<SettingsDetailRow
					title="Display name"
					value={fields.displayName.value}
					editDescription="This is the name guests will see. It can be different from your legal business name."
					editing={fields.displayName.editing}
					onEditStart={() => startEditing("displayName")}
					onCancel={() => cancelEditing("displayName")}
					onSave={() => save("displayName")}
					saveDisabled={isUnchanged("displayName")}
				>
					<Input
						value={drafts.displayName}
						onChange={(e) =>
							setDrafts((prev) => ({
								...prev,
								displayName: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("legalName")}>
				<SettingsDetailRow
					title="Legal name"
					value={fields.legalName.value}
					editDescription="This is the official name registered with local authorities. It may appear on invoices and legal documents."
					editing={fields.legalName.editing}
					onEditStart={() => startEditing("legalName")}
					onCancel={() => cancelEditing("legalName")}
					onSave={() => save("legalName")}
					saveDisabled={isUnchanged("legalName")}
				>
					<Input
						value={drafts.legalName}
						onChange={(e) =>
							setDrafts((prev) => ({
								...prev,
								legalName: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("address")}>
				<SettingsDetailRow
					title="Address"
					value={fields.address.value}
					editDescription="Where your business is located. This may be shown to guests for on-site experiences."
					editing={fields.address.editing}
					onEditStart={() => startEditing("address")}
					onCancel={() => cancelEditing("address")}
					onSave={() => save("address")}
					saveDisabled={isUnchanged("address")}
				>
					<Input
						value={drafts.address}
						onChange={(e) =>
							setDrafts((prev) => ({
								...prev,
								address: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("phone")}>
				<SettingsDetailRow
					title="Phone number"
					value={fields.phone.value}
					emptyPlaceholder="No business phone number added yet"
					addLabel="Add phone number"
					addDescription="Your business's main phone number, where the Bethere team can reach you."
					editDescription="Your business's main phone number, where the Bethere team can reach you."
					editing={fields.phone.editing}
					onEditStart={() => startEditing("phone")}
					onCancel={() => cancelEditing("phone")}
					onSave={() => save("phone")}
					saveDisabled={isUnchanged("phone") || !isValidPhone(drafts.phone)}
				>
					<div className="flex w-full flex-col gap-2">
						<Input
							type="tel"
							value={drafts.phone}
							aria-invalid={!isValidPhone(drafts.phone)}
							onChange={(e) =>
								setDrafts((prev) => ({
									...prev,
									phone: formatUsPhone(e.target.value),
								}))
							}
						/>
						{!isValidPhone(drafts.phone) ? (
							<Typography size="xs" className="text-destructive">
								Enter a valid phone number.
							</Typography>
						) : null}
					</div>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("email")}>
				<SettingsDetailRow
					title="Email"
					value={fields.email.value}
					editDescription="Used for account updates, notifications, and important communications."
					editing={fields.email.editing}
					onEditStart={() => startEditing("email")}
					onCancel={() => cancelEditing("email")}
					onSave={() => save("email")}
					saveDisabled={isUnchanged("email")}
				>
					<Input
						type="email"
						value={drafts.email}
						onChange={(e) =>
							setDrafts((prev) => ({
								...prev,
								email: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("website")}>
				<SettingsDetailRow
					title="Website"
					value={fields.website.value}
					editDescription="Link to your business website, if you have one."
					editing={fields.website.editing}
					onEditStart={() => startEditing("website")}
					onCancel={() => cancelEditing("website")}
					onSave={() => save("website")}
					saveDisabled={isUnchanged("website")}
				>
					<Input
						type="url"
						value={drafts.website}
						onChange={(e) =>
							setDrafts((prev) => ({
								...prev,
								website: e.target.value,
							}))
						}
					/>
				</SettingsDetailRow>
			</div>

			<div className="py-6" ref={registerRow("primaryContact")}>
				<SettingsDetailRow
					title="Primary contact"
					value={
						primaryContact ? (
							<MemberSummary
								name={primaryContact.name}
								title={primaryContact.title}
								avatarUrl={primaryContact.avatarUrl}
							/>
						) : undefined
					}
					emptyPlaceholder="No primary contact yet"
					addLabel="Add primary contact"
					addDescription="Choose an existing team member as this business's main point of contact."
					editDescription="Choose an existing team member as this business's main point of contact."
					editing={primaryContactEditing}
					onEditStart={startEditingPrimaryContact}
					onCancel={cancelEditingPrimaryContact}
					hideSaveButton
				>
					<MemberPicker
						value={primaryContactDraft}
						onChange={savePrimaryContactValue}
						selectedMember={primaryContactDraftMember}
					/>
				</SettingsDetailRow>
			</div>
		</div>
	);
}

export { ProfileTab };
