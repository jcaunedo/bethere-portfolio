import { SettingsDetailRow } from "@/components/forms/settings-detail-row";
import { Input } from "@/components/forms/input";

import type { FieldKey, FieldState } from "./business-profile";

type ProfileTabProps = {
	fields: Record<FieldKey, FieldState>;
	drafts: Record<FieldKey, string>;
	setDrafts: (updater: (prev: Record<FieldKey, string>) => Record<FieldKey, string>) => void;
	startEditing: (key: FieldKey) => void;
	cancelEditing: (key: FieldKey) => void;
	save: (key: FieldKey) => void;
	isUnchanged: (key: FieldKey) => boolean;
	onTransferOwnership?: () => void;
	onAddPrimaryContact?: () => void;
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
	onTransferOwnership,
	onAddPrimaryContact,
	onAddPhoneNumber,
}: ProfileTabProps) {
	return (
		<div className="flex flex-col divide-y divide-border">
			<div className="py-6">
				<SettingsDetailRow
					title="Legal business name"
					value={fields.legalName.value}
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

			{/* Owner/Primary contact/Phone numbers start a different flow
			    (transfer, picker, list manager) rather than editing a
			    scalar value in place — no Figma edit-form state exists for
			    them, so they're a plain row + onClick stub, not a
			    SettingsDetailRow expand. See DESIGN.md. */}
			<div className="flex w-full items-center gap-6 px-2 py-6">
				<div className="flex min-w-0 flex-1 flex-col gap-1 text-base">
					<p className="font-semibold text-foreground">Owner</p>
					<p className="text-foreground">John Smith</p>
				</div>
				<button
					type="button"
					onClick={onTransferOwnership}
					className="h-8 shrink-0 py-1.5 text-sm font-medium text-primary outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
				>
					Transfer ownership
				</button>
			</div>

			<div className="flex w-full items-center gap-6 px-2 py-6">
				<div className="flex min-w-0 flex-1 flex-col gap-1 text-base">
					<p className="font-semibold text-foreground">
						Primary contact
					</p>
					<p className="text-foreground-subtle">
						No primary contact yet
					</p>
				</div>
				<button
					type="button"
					onClick={onAddPrimaryContact}
					className="h-8 shrink-0 py-1.5 text-sm font-medium text-primary outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
				>
					Add primary contact
				</button>
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
