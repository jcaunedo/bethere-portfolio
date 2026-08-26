import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Building2Icon, ChevronLeftIcon } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/account-settings/account-settings-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/navigation/tabs";
import { Typography } from "@/components/typography";
import { slideVariants } from "@/lib/motion";

// Primary contact is picked from the business's own Team members (Figma:
// "choose an existing user" rather than free-text entry) — reuses the same
// mock roster `TeamMembersLayout` renders, keyed by email since that's the
// unique identifier TeamMember already has.
import { ACTIVE_MEMBERS } from "@/layouts/account-settings/pages/team-members/team-members";

import { ProfileTab } from "./profile-tab";
import { VerificationTab } from "./verification-tab";
import { DocumentsTab } from "./documents-tab";

// Text-edit fields (Figma: rows whose action is "Edit" — a scalar value
// edited in place). Display name and Legal name are separate fields (the
// former is guest-facing, e.g. a DBA; the latter is the officially
// registered name) — Figma reuses the same starting value for both since
// they're the same string until a provider customizes the display name.
// Primary contact/Phone numbers are deliberately not here — see
// ProfileTab's onClick-stub rows and DESIGN.md's "SettingsDetailRow reuse
// across account-settings pages" entry.
const FIELD_KEYS = ["displayName", "legalName", "address", "website", "email"] as const;
type FieldKey = (typeof FIELD_KEYS)[number];
type FieldState = { value: string; editing: boolean };

const initialFields: Record<FieldKey, FieldState> = {
	displayName: { value: "Key Biscayne Yacht Club", editing: false },
	legalName: { value: "Key Biscayne Yacht Club, LLC", editing: false },
	address: { value: "888 MacArthur Causeway Miami, FL 33132", editing: false },
	website: { value: "https://www.domain.com", editing: false },
	email: { value: "hello@domain.com", editing: false },
};

// Compliance tab's scalar text-edit fields (Tax ID (EIN), License number,
// Registration number). Owner/Owner verification/Insurance provider are NOT
// here — their content is compound (name/email or name/provider + doc-type +
// expiry + link), not a single text value, so VerificationTab renders them as
// static rows/SettingsDetailRows with a stubbed onEditStart instead — see
// DESIGN.md.
const VERIFICATION_FIELD_KEYS = ["ein", "license", "registration"] as const;
type VerificationFieldKey = (typeof VERIFICATION_FIELD_KEYS)[number];

const initialVerificationFields: Record<VerificationFieldKey, FieldState> = {
	ein: { value: "12-3456789", editing: false },
	license: { value: "MAR-2025-44182", editing: false },
	registration: { value: "", editing: false },
};

type BusinessProfileLayoutProps = {
	/** Business name shown in the header (Figma: header text). */
	name?: string;
	/** Called when "Back to businesses" is activated. */
	onBack?: () => void;
	/** Called when "Add phone number" is activated — hooks into a (future) phone list manager. */
	onAddPhoneNumber?: () => void;
	/** Called when Owner verification's "View" link is activated — hooks into a (future) document viewer. */
	onViewOwnerVerification?: () => void;
	/** Called when Owner verification's "Edit" is activated — hooks into a (future) owner-verification flow. */
	onEditOwnerVerification?: () => void;
	/** Called when Insurance provider's "Edit" is activated — hooks into a (future) insurance-edit flow. */
	onEditInsuranceProvider?: () => void;
	/** Called when the Documents tab's search button is activated — hooks into a (future) document search/filter. */
	onSearchDocuments?: () => void;
	/** Called when "Add document" is activated — hooks into a (future) document upload flow. */
	onAddDocument?: () => void;
	/** Called with a document row's `id` when its "more actions" button is activated — hooks into a (future) per-document actions menu. */
	onDocumentActions?: (id: string) => void;
};

/**
 * Provider Portal "Business Profile" settings page (Figma: Provider-Portal
 * → "Business Profile" frame) — the page a user lands on after clicking a
 * `CardBusiness` row on `BusinessProfilesLayout`. Renders inside
 * `AccountSettingsLayout`'s content column: a "Back to businesses" link,
 * business name, and Profile/Compliance/Documents tabs.
 * This file owns all page state and the mobile menu↔page shell; each tab's
 * JSX lives in its own sibling file (`profile-tab.tsx`, `verification-tab.tsx`,
 * `documents-tab.tsx`) since the combined file previously exceeded my-profile.tsx's
 * size once all three tabs were built out.
 */
function BusinessProfileLayout({
	name = "Key Biscayne Yacht Club",
	onBack,
	onAddPhoneNumber,
	onViewOwnerVerification,
	onEditOwnerVerification,
	onEditInsuranceProvider,
	onSearchDocuments,
	onAddDocument,
	onDocumentActions,
}: BusinessProfileLayoutProps) {
	// Mobile-only: the header's back arrow (AccountSettingsLayout's onClose)
	// has nowhere to route to in this standalone Storybook reference layout,
	// so it swaps in the mobile "Account Settings" menu in place of this
	// screen instead — same pattern as MyProfileLayout/BusinessProfilesLayout.
	const [mobileScreen, setMobileScreen] = React.useState<
		"business-profile" | "menu"
	>("business-profile");
	const [screenDirection, setScreenDirection] = React.useState<1 | -1>(1);

	const [fields, setFields] =
		React.useState<Record<FieldKey, FieldState>>(initialFields);
	const [drafts, setDrafts] = React.useState<Record<FieldKey, string>>(
		Object.fromEntries(
			FIELD_KEYS.map((key) => [key, initialFields[key].value]),
		) as Record<FieldKey, string>,
	);

	function goToMenu() {
		setScreenDirection(-1);
		setMobileScreen("menu");
	}

	function goToBusinessProfile() {
		setScreenDirection(1);
		setMobileScreen("business-profile");
	}

	function startEditing(key: FieldKey) {
		setDrafts((prev) => ({ ...prev, [key]: fields[key].value }));
		setFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: true },
		}));
	}

	function cancelEditing(key: FieldKey) {
		setFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: false },
		}));
	}

	function save(key: FieldKey) {
		setFields((prev) => ({
			...prev,
			[key]: { value: drafts[key], editing: false },
		}));
	}

	function isUnchanged(key: FieldKey): boolean {
		return drafts[key] === fields[key].value;
	}

	// Business owner is picked the same way as Primary contact — a team
	// member's email, empty string meaning "no owner set" — rather than the
	// earlier static "Transfer ownership" stub. Kept as separate state from
	// Primary contact since a business can have a different owner and
	// primary contact.
	const [businessOwnerEmail, setBusinessOwnerEmail] = React.useState("");
	const [businessOwnerEditing, setBusinessOwnerEditing] = React.useState(false);
	const [businessOwnerDraft, setBusinessOwnerDraft] = React.useState("");

	function startEditingBusinessOwner() {
		setBusinessOwnerDraft(businessOwnerEmail);
		setBusinessOwnerEditing(true);
	}

	function cancelEditingBusinessOwner() {
		setBusinessOwnerEditing(false);
	}

	function saveBusinessOwnerValue(email: string) {
		setBusinessOwnerDraft(email);
		setBusinessOwnerEmail(email);
		setBusinessOwnerEditing(false);
	}

	// Primary contact stores the chosen team member's email (unique in
	// ACTIVE_MEMBERS) rather than a free-text value — empty string means
	// "no primary contact set", same as the other fields' empty-string convention.
	const [primaryContactEmail, setPrimaryContactEmail] = React.useState("");
	const [primaryContactEditing, setPrimaryContactEditing] = React.useState(false);
	const [primaryContactDraft, setPrimaryContactDraft] = React.useState("");

	function startEditingPrimaryContact() {
		setPrimaryContactDraft(primaryContactEmail);
		setPrimaryContactEditing(true);
	}

	function cancelEditingPrimaryContact() {
		setPrimaryContactEditing(false);
	}

	// Saves immediately on selection (like MyProfileLayout's Time zone row)
	// instead of a separate Save button — takes the chosen email directly
	// rather than reading `primaryContactDraft` after the fact, since the
	// draft state update and this call happen in the same `onValueChange`
	// and would otherwise race.
	function savePrimaryContactValue(email: string) {
		setPrimaryContactDraft(email);
		setPrimaryContactEmail(email);
		setPrimaryContactEditing(false);
	}

	const [verificationFields, setVerificationFields] = React.useState<
		Record<VerificationFieldKey, FieldState>
	>(initialVerificationFields);
	const [verificationDrafts, setVerificationDrafts] = React.useState<
		Record<VerificationFieldKey, string>
	>(
		Object.fromEntries(
			VERIFICATION_FIELD_KEYS.map((key) => [
				key,
				initialVerificationFields[key].value,
			]),
		) as Record<VerificationFieldKey, string>,
	);

	function startEditingVerification(key: VerificationFieldKey) {
		setVerificationDrafts((prev) => ({
			...prev,
			[key]: verificationFields[key].value,
		}));
		setVerificationFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: true },
		}));
	}

	function cancelEditingVerification(key: VerificationFieldKey) {
		setVerificationFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: false },
		}));
	}

	function saveVerification(key: VerificationFieldKey) {
		setVerificationFields((prev) => ({
			...prev,
			[key]: { value: verificationDrafts[key], editing: false },
		}));
	}

	function isVerificationUnchanged(key: VerificationFieldKey): boolean {
		return verificationDrafts[key] === verificationFields[key].value;
	}

	const menuScreen = (
		<motion.div
			key="menu"
			custom={screenDirection}
			variants={slideVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="absolute inset-0 h-screen"
		>
			<AccountSettingsMenuLayout
				onClose={goToBusinessProfile}
				onNavigate={(navigateTo) => {
					if (navigateTo === "/settings/business-profiles") {
						goToBusinessProfile();
					}
				}}
			/>
		</motion.div>
	);

	const businessProfileScreen = (
		<motion.div
			key="business-profile"
			custom={screenDirection}
			variants={slideVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="absolute inset-0 h-screen"
		>
			<AccountSettingsLayout activeItem="Business profiles" onClose={goToMenu}>
				<div className="flex flex-col items-start gap-8 pb-24">
					<button
						type="button"
						onClick={onBack}
						className="inline-flex items-center gap-2 text-sm font-medium text-primary outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
					>
						<ChevronLeftIcon className="size-4" />
						Back to businesses
					</button>

					<div className="flex w-full flex-col gap-8">
						<div className="flex w-full items-center gap-4">
							<Building2Icon className="size-6 shrink-0 text-foreground" />
							<Typography
								as="h1"
								size="2xl"
								weight="semibold"
								className="min-w-0 flex-1 truncate"
							>
								{name}
							</Typography>
						</div>

						<Tabs defaultValue="profile">
							<TabsList>
								<TabsTrigger value="profile">Profile</TabsTrigger>
								<TabsTrigger value="verification">Compliance</TabsTrigger>
								<TabsTrigger value="documents">Documents</TabsTrigger>
							</TabsList>

							<TabsContent value="profile">
								<ProfileTab
									fields={fields}
									drafts={drafts}
									setDrafts={setDrafts}
									startEditing={startEditing}
									cancelEditing={cancelEditing}
									save={save}
									isUnchanged={isUnchanged}
									businessOwnerEmail={businessOwnerEmail}
									businessOwnerEditing={businessOwnerEditing}
									businessOwnerDraft={businessOwnerDraft}
									startEditingBusinessOwner={startEditingBusinessOwner}
									cancelEditingBusinessOwner={cancelEditingBusinessOwner}
									saveBusinessOwnerValue={saveBusinessOwnerValue}
									primaryContactEmail={primaryContactEmail}
									primaryContactEditing={primaryContactEditing}
									primaryContactDraft={primaryContactDraft}
									startEditingPrimaryContact={startEditingPrimaryContact}
									cancelEditingPrimaryContact={cancelEditingPrimaryContact}
									savePrimaryContactValue={savePrimaryContactValue}
									onAddPhoneNumber={onAddPhoneNumber}
								/>
							</TabsContent>

							<TabsContent value="verification">
								<VerificationTab
									verificationFields={verificationFields}
									verificationDrafts={verificationDrafts}
									setVerificationDrafts={setVerificationDrafts}
									startEditingVerification={startEditingVerification}
									cancelEditingVerification={cancelEditingVerification}
									saveVerification={saveVerification}
									isVerificationUnchanged={isVerificationUnchanged}
									onViewOwnerVerification={onViewOwnerVerification}
									onEditOwnerVerification={onEditOwnerVerification}
									onEditInsuranceProvider={onEditInsuranceProvider}
								/>
							</TabsContent>

							<TabsContent value="documents">
								<DocumentsTab
									onSearchDocuments={onSearchDocuments}
									onAddDocument={onAddDocument}
									onDocumentActions={onDocumentActions}
								/>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</AccountSettingsLayout>
		</motion.div>
	);

	return (
		<div className="relative h-screen overflow-hidden">
			<AnimatePresence initial={false} custom={screenDirection}>
				{mobileScreen === "menu" ? menuScreen : businessProfileScreen}
			</AnimatePresence>
		</div>
	);
}

export { BusinessProfileLayout };
export type { FieldKey, FieldState, VerificationFieldKey };
