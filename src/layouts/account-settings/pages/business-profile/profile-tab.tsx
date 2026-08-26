import { XIcon } from "lucide-react";

import { SettingsDetailRow } from "@/components/forms/settings-detail-row";
import { Input } from "@/components/forms/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/forms/select";
import { Button } from "@/components/buttons/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/data-display/avatar";
import { ACTIVE_MEMBERS } from "@/layouts/account-settings/pages/team-members/team-members";
import type { TeamMember } from "@/layouts/account-settings/pages/team-members/team-members";

import type { FieldKey, FieldState } from "./business-profile";

/** "Lucy Smith" → "LS"; falls back to the first two characters if there's no space. */
function initialsFromName(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MemberAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
	return (
		<Avatar size="sm">
			{avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
			<AvatarFallback colorSeed={name}>{initialsFromName(name)}</AvatarFallback>
		</Avatar>
	);
}

/** Collapsed HasValue display shared by Business owner/Primary contact — avatar + name/job title. */
function MemberSummary({
	name,
	title,
	avatarUrl,
}: {
	name: string;
	title: string;
	avatarUrl?: string;
}) {
	return (
		<div className="mt-1 flex items-center gap-2">
			<Avatar size="lg" className="shrink-0">
				{avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
				<AvatarFallback colorSeed={name}>{initialsFromName(name)}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className="text-base text-foreground">{name}</span>
				<span className="text-sm text-muted-foreground">{title}</span>
			</div>
		</div>
	);
}

/**
 * Team-member Select shared by Business owner/Primary contact's edit form,
 * plus a "clear" button (Figma: ghost, X icon) beside it — clicking it
 * removes the current selection and drops the row straight back to its
 * empty Add state, same as picking a member (both commit immediately, no
 * separate Save step).
 */
function MemberPicker({
	value,
	onChange,
	selectedMember,
}: {
	value: string;
	onChange: (email: string) => void;
	selectedMember: TeamMember | undefined;
}) {
	return (
		<div className="flex w-full items-center gap-2">
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger
					className="w-full"
					avatar={
						selectedMember ? (
							<MemberAvatar name={selectedMember.name} avatarUrl={selectedMember.avatarUrl} />
						) : undefined
					}
				>
					<SelectValue placeholder="Select a team member" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Select team member</SelectLabel>
						{ACTIVE_MEMBERS.map((member) => (
							<SelectItem
								key={member.email}
								value={member.email}
								avatar={<MemberAvatar name={member.name} avatarUrl={member.avatarUrl} />}
							>
								{member.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{value ? (
				<Button
					type="button"
					variant="ghost"
					size="icon-lg"
					aria-label="Remove selected team member"
					onClick={() => onChange("")}
					className="shrink-0 text-muted-foreground hover:text-foreground"
				>
					<XIcon />
				</Button>
			) : null}
		</div>
	);
}

type ProfileTabProps = {
	fields: Record<FieldKey, FieldState>;
	drafts: Record<FieldKey, string>;
	setDrafts: (updater: (prev: Record<FieldKey, string>) => Record<FieldKey, string>) => void;
	startEditing: (key: FieldKey) => void;
	cancelEditing: (key: FieldKey) => void;
	save: (key: FieldKey) => void;
	isUnchanged: (key: FieldKey) => boolean;
	/** Selected business owner's email — empty string means none set (Figma "Default (Empty)"). */
	businessOwnerEmail: string;
	businessOwnerEditing: boolean;
	businessOwnerDraft: string;
	startEditingBusinessOwner: () => void;
	cancelEditingBusinessOwner: () => void;
	/** Called with the chosen member's email — commits and closes the row immediately, no separate Save step. */
	saveBusinessOwnerValue: (email: string) => void;
	/** Selected primary contact's email — empty string means none set (Figma "Default (Empty)"). */
	primaryContactEmail: string;
	primaryContactEditing: boolean;
	primaryContactDraft: string;
	startEditingPrimaryContact: () => void;
	cancelEditingPrimaryContact: () => void;
	/** Called with the chosen member's email — commits and closes the row immediately, no separate Save step. */
	savePrimaryContactValue: (email: string) => void;
	onAddPhoneNumber?: () => void;
};

/**
 * Business Profile's "Profile" tab (Figma: "Business Profile" frame) — the
 * business's editable identity fields plus three navigation-to-another-flow
 * rows (Owner/Primary contact/Phone numbers) that intentionally do NOT use
 * `SettingsDetailRow`'s expand-to-edit-form behavior. See DESIGN.md's
 * "SettingsDetailRow reuse across account-settings pages" entry.
 */
function ProfileTab({
	fields,
	drafts,
	setDrafts,
	startEditing,
	cancelEditing,
	save,
	isUnchanged,
	businessOwnerEmail,
	businessOwnerEditing,
	businessOwnerDraft,
	startEditingBusinessOwner,
	cancelEditingBusinessOwner,
	saveBusinessOwnerValue,
	primaryContactEmail,
	primaryContactEditing,
	primaryContactDraft,
	startEditingPrimaryContact,
	cancelEditingPrimaryContact,
	savePrimaryContactValue,
	onAddPhoneNumber,
}: ProfileTabProps) {
	const businessOwner = ACTIVE_MEMBERS.find(
		(member) => member.email === businessOwnerEmail,
	);
	const businessOwnerDraftMember = ACTIVE_MEMBERS.find(
		(member) => member.email === businessOwnerDraft,
	);
	const primaryContact = ACTIVE_MEMBERS.find(
		(member) => member.email === primaryContactEmail,
	);
	const primaryContactDraftMember = ACTIVE_MEMBERS.find(
		(member) => member.email === primaryContactDraft,
	);
	return (
		<div className="flex flex-col divide-y divide-border">
			<div className="py-6">
				<SettingsDetailRow
					title="Display business name"
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

			<div className="py-6">
				<SettingsDetailRow
					title="Legal business name"
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

			<div className="py-6">
				<SettingsDetailRow
					title="Business address"
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

			<div className="py-6">
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

			<div className="py-6">
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

			<div className="py-6">
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

			<div className="flex w-full items-center gap-6 px-2 py-6">
				<div className="flex min-w-0 flex-1 flex-col gap-1 text-base">
					<p className="font-semibold text-foreground">
						Phone numbers
					</p>
					<p className="text-foreground-subtle">
						No phone numbers added yet
					</p>
				</div>
				<button
					type="button"
					onClick={onAddPhoneNumber}
					className="h-8 shrink-0 py-1.5 text-sm font-medium text-primary outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
				>
					Add phone number
				</button>
			</div>

			<div className="py-6">
				<SettingsDetailRow
					title="Main email"
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
		</div>
	);
}

export { ProfileTab };
