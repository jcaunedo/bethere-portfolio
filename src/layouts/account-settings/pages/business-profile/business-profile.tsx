import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Building2Icon, ChevronLeftIcon } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/account-settings/account-settings-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/navigation/tabs";
import { Typography } from "@/components/typography";
import { slideVariants } from "@/lib/motion";

import { ProfileTab } from "./profile-tab";
import { VerificationTab } from "./verification-tab";
import { DocumentsTab } from "./documents-tab";

// Text-edit fields (Figma: rows whose action is "Edit" — a scalar value
// edited in place). Display name and Legal name are separate fields (the
// former is guest-facing, e.g. a DBA; the latter is the officially
// registered name) — Figma reuses the same starting value for both since
// they're the same string until a provider customizes the display name.
// Primary contact is deliberately not here — see ProfileTab's Select-picker
// row and DESIGN.md's "SettingsDetailRow reuse across account-settings
// pages" entry. Phone number reuses MyProfileLayout's US-phone
// validation/formatting (see ProfileTab).
const FIELD_KEYS = ["displayName", "legalName", "address", "phone", "website", "email"] as const;
type FieldKey = (typeof FIELD_KEYS)[number];
type FieldState = { value: string; editing: boolean };

const initialFields: Record<FieldKey, FieldState> = {
	displayName: { value: "Key Biscayne Yacht Club", editing: false },
	legalName: { value: "Key Biscayne Yacht Club, LLC", editing: false },
	address: { value: "888 MacArthur Causeway Miami, FL 33132", editing: false },
	phone: { value: "", editing: false },
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

// Every expandable row across both tabs (Profile + Compliance) shares one
// Escape/Enter keyboard handler and one open-row stack, same as
// MyProfileLayout — a scalar FieldKey/VerificationFieldKey, plus the two
// Select-picker rows (Business owner, Primary contact) which aren't keyed
// to either Record. See DESIGN.md's "Multi-row keyboard shortcuts" entry.
type RowKey = FieldKey | VerificationFieldKey | "businessOwner" | "primaryContact";

type BusinessProfileLayoutProps = {
	/** Business name shown in the header (Figma: header text). */
	name?: string;
	/** Called when "Back to businesses" is activated. */
	onBack?: () => void;
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

	// Rows can be opened in any order (and across both tabs) and several can
	// be open at once; this tracks that order so Escape/Enter fall back to
	// the most recently opened one (LIFO) when focus isn't inside any open
	// row — see `rowRefs`/`focusedRowKey` below for the focus-aware case that
	// takes priority over this fallback. Same model as MyProfileLayout.
	const [openOrder, setOpenOrder] = React.useState<RowKey[]>([]);

	function openRow(key: RowKey) {
		setOpenOrder((prev) => [...prev.filter((k) => k !== key), key]);
	}

	function closeRow(key: RowKey) {
		setOpenOrder((prev) => prev.filter((k) => k !== key));
	}

	// Maps each RowKey to its row's wrapper DOM node, so the shared
	// Escape/Enter handler can tell which row (if any) currently contains
	// focus — e.g. the user opened one row, then another, then clicked back
	// into the first to keep editing. Without this, Escape/Enter would
	// always act on whichever row opened last (openOrder's LIFO fallback),
	// even while the user is actively focused inside an earlier-opened row.
	const rowRefs = React.useRef<Partial<Record<RowKey, HTMLDivElement | null>>>(
		{},
	);

	function registerRow(key: RowKey) {
		return (el: HTMLDivElement | null) => {
			rowRefs.current[key] = el;
		};
	}

	// Finds which open row (if any) currently contains focus, by walking
	// `rowRefs` — only rows present in `openOrder` are checked, since a
	// collapsed row has no focusable form content to hold focus anyway.
	function focusedRowKey(openKeys: RowKey[]): RowKey | undefined {
		const active = document.activeElement;
		if (!active) return undefined;
		return openKeys.find((key) => rowRefs.current[key]?.contains(active));
	}

	function goToMenu() {
		setScreenDirection(-1);
		setMobileScreen("menu");
	}

	function goToBusinessProfile() {
		setScreenDirection(1);
		setMobileScreen("business-profile");
	}

	// The keydown handler below is only re-bound when `openOrder` changes, so
	// it would otherwise close over stale `drafts`/`verificationDrafts` from
	// whenever a row was opened — refs keep save reading the latest keystroke
	// instead. Same fix as MyProfileLayout.
	const draftsRef = React.useRef(drafts);
	draftsRef.current = drafts;

	function startEditing(key: FieldKey) {
		setDrafts((prev) => ({ ...prev, [key]: fields[key].value }));
		setFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: true },
		}));
		openRow(key);
	}

	function cancelEditing(key: FieldKey) {
		setFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: false },
		}));
		closeRow(key);
	}

	function save(key: FieldKey) {
		setFields((prev) => ({
			...prev,
			[key]: { value: draftsRef.current[key], editing: false },
		}));
		closeRow(key);
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
		openRow("businessOwner");
	}

	function cancelEditingBusinessOwner() {
		setBusinessOwnerEditing(false);
		closeRow("businessOwner");
	}

	function saveBusinessOwnerValue(email: string) {
		setBusinessOwnerDraft(email);
		setBusinessOwnerEmail(email);
		setBusinessOwnerEditing(false);
		closeRow("businessOwner");
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
		openRow("primaryContact");
	}

	function cancelEditingPrimaryContact() {
		setPrimaryContactEditing(false);
		closeRow("primaryContact");
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
		closeRow("primaryContact");
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

	// Same stale-closure fix as `draftsRef` above, for the Compliance tab's
	// own draft record.
	const verificationDraftsRef = React.useRef(verificationDrafts);
	verificationDraftsRef.current = verificationDrafts;

	function startEditingVerification(key: VerificationFieldKey) {
		setVerificationDrafts((prev) => ({
			...prev,
			[key]: verificationFields[key].value,
		}));
		setVerificationFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: true },
		}));
		openRow(key);
	}

	function cancelEditingVerification(key: VerificationFieldKey) {
		setVerificationFields((prev) => ({
			...prev,
			[key]: { ...prev[key], editing: false },
		}));
		closeRow(key);
	}

	function saveVerification(key: VerificationFieldKey) {
		setVerificationFields((prev) => ({
			...prev,
			[key]: { value: verificationDraftsRef.current[key], editing: false },
		}));
		closeRow(key);
	}

	function isVerificationUnchanged(key: VerificationFieldKey): boolean {
		return verificationDrafts[key] === verificationFields[key].value;
	}

	// Esc cancels / Enter saves whichever open row currently has focus inside
	// it (e.g. several rows are open — possibly across both tabs — and the
	// user clicked back into an earlier one to keep editing) — same as
	// clicking that row's own Cancel/Save. When focus isn't inside any open
	// row, falls back to the most recently opened one (LIFO). Business
	// owner/Primary contact commit on selection rather than a text edit, so
	// Enter has nothing to submit for them — only Escape (cancel/close)
	// applies. Enter is also skipped while focus is on a button (native
	// click-activation already handles it there) so it doesn't double-fire.
	// Same model as MyProfileLayout.
	React.useEffect(() => {
		if (openOrder.length === 0) return;

		function handleKeyDown(event: KeyboardEvent) {
			const activeKey =
				focusedRowKey(openOrder) ?? openOrder[openOrder.length - 1];

			if (event.key === "Escape") {
				switch (activeKey) {
					case "businessOwner":
						cancelEditingBusinessOwner();
						break;
					case "primaryContact":
						cancelEditingPrimaryContact();
						break;
					default:
						if ((VERIFICATION_FIELD_KEYS as readonly string[]).includes(activeKey)) {
							cancelEditingVerification(activeKey as VerificationFieldKey);
						} else {
							cancelEditing(activeKey as FieldKey);
						}
				}
			} else if (
				event.key === "Enter" &&
				(event.target as HTMLElement | null)?.tagName !== "BUTTON" &&
				activeKey !== "businessOwner" &&
				activeKey !== "primaryContact"
			) {
				event.preventDefault();
				if ((VERIFICATION_FIELD_KEYS as readonly string[]).includes(activeKey)) {
					saveVerification(activeKey as VerificationFieldKey);
				} else {
					save(activeKey as FieldKey);
				}
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [openOrder]);

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
								<TabsTrigger value="profile">Business profile</TabsTrigger>
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
									primaryContactEmail={primaryContactEmail}
									primaryContactEditing={primaryContactEditing}
									primaryContactDraft={primaryContactDraft}
									startEditingPrimaryContact={startEditingPrimaryContact}
									cancelEditingPrimaryContact={cancelEditingPrimaryContact}
									savePrimaryContactValue={savePrimaryContactValue}
									registerRow={registerRow}
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
									businessOwnerEmail={businessOwnerEmail}
									businessOwnerEditing={businessOwnerEditing}
									businessOwnerDraft={businessOwnerDraft}
									startEditingBusinessOwner={startEditingBusinessOwner}
									cancelEditingBusinessOwner={cancelEditingBusinessOwner}
									saveBusinessOwnerValue={saveBusinessOwnerValue}
									onEditInsuranceProvider={onEditInsuranceProvider}
									registerRow={registerRow}
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
export type { FieldKey, FieldState, VerificationFieldKey, RowKey };
