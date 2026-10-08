import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { AccountSettingsLayout } from "@/layouts/provider-portal/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/provider-portal/account-settings/account-settings-menu";
import { ProfileHeader } from "@/components/navigation/profile-header";
import { SettingsDetailRow } from "@/components/forms/settings-detail-row";
import { Input } from "@/components/forms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/forms/select";
import { Typography } from "@/components/typography";
import { slideVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

// US zones (incl. territories) paired with the "Name (ABBR) · UTC±HH:MM"
// display format already used by this page — standard-time offsets/
// abbreviations shown for simplicity rather than resolving DST live.
const TIME_ZONE_OPTIONS = [
  "Hawaii-Aleutian Standard Time (HST) · UTC−10:00",
  "Alaska Standard Time (AKST) · UTC−09:00",
  "Pacific Standard Time (PST) · UTC−08:00",
  "Mountain Standard Time (MST) · UTC−07:00",
  "Central Standard Time (CST) · UTC−06:00",
  "Eastern Standard Time (EST) · UTC−05:00",
  "Atlantic Standard Time (AST) · UTC−04:00",
  "Samoa Standard Time (SST) · UTC−11:00",
  "Chamorro Standard Time (ChST) · UTC+10:00",
] as const;

/** A single editable field's local state: current value + whether its row is expanded. */
type FieldState = { value: string; editing: boolean };

// RFC 5322-ish "good enough" email check — not a full spec implementation,
// just enough to catch missing @/domain typos without rejecting valid
// addresses a stricter regex might choke on.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Exactly 10 digits (a US national number), with an optional leading "+1"
// or "1" country code and common separators (spaces, dashes, parens)
// stripped before testing — both Phone number and WhatsApp are US-only.
const US_PHONE_PATTERN = /^1?\d{10}$/;

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

function isValidPhone(value: string): boolean {
  return US_PHONE_PATTERN.test(value.replace(/[\s()+-]/g, ""));
}

// Formats digits into the standard US "(###) ###-####" shape as the user
// types, growing the mask progressively rather than waiting for all 10
// digits — a leading "+1" (or bare "1") country code is dropped first so
// numbers entered with it still land on the 10-digit US mask. Digits-only
// (non-digit characters are dropped) and hard-capped at 10 digits, so
// typing or pasting past a full US number is simply ignored.
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

// WhatsApp is stored as E.164 ("+13055550123") since that's the shape the
// WhatsApp app itself expects, but the UI stays a plain US-masked input
// like Phone number — no country picker for now, "+1" is assumed always.
function toWhatsAppE164(nationalNumber: string): string {
  const digits = nationalNumber.replace(/\D/g, "");
  return digits ? `+1${digits}` : "";
}

function whatsAppNationalNumber(e164Value: string): string {
  return e164Value.replace(/^\+1/, "");
}

// WhatsApp's draft is stored in E.164 with "+1" already prepended (see
// `toWhatsAppE164`), so validating it with `isValidPhone` directly counts
// that prefixed "1" as a digit of the national number — the field would
// pass at 9 entered digits instead of 10. Strip the "+1" back off first so
// validation runs against the national number, same as Phone number.
function isValidWhatsApp(e164Value: string): boolean {
  return isValidPhone(whatsAppNationalNumber(e164Value));
}

// Renders a stored "+1XXXXXXXXXX" value back into "+1 (305) 555-0123" for
// display in the row's collapsed state.
function formatWhatsAppForDisplay(e164Value: string): string {
  if (!e164Value) return e164Value;
  return `+1 ${formatUsPhone(whatsAppNationalNumber(e164Value))}`;
}

const FIELD_KEYS = [
  "name",
  "title",
  "email",
  "phone",
  "whatsapp",
  "timeZone",
  "language",
  "otherLanguages",
] as const;
type FieldKey = (typeof FIELD_KEYS)[number];

// Rows whose edit form spans more than one FieldKey, keyed by the primary
// key tracked in `openOrder` — looked up so the shared Escape/Enter handler
// (keyed only by that primary key) can still cancel/save every field the
// row actually owns, not just the primary one.
const FIELD_GROUPS: Partial<Record<FieldKey, FieldKey[]>> = {
  language: ["language", "otherLanguages"],
};

function fieldGroup(key: FieldKey): FieldKey[] {
  return FIELD_GROUPS[key] ?? [key];
}

const initialFields: Record<FieldKey, FieldState> = {
  name: { value: "Jenny Wilson", editing: false },
  title: { value: "", editing: false },
  email: { value: "jennywilson@email.com", editing: false },
  phone: { value: "(305) 555-5732", editing: false },
  whatsapp: { value: "", editing: false },
  timeZone: {
    value: "Eastern Standard Time (EST) · UTC−05:00",
    editing: false,
  },
  language: { value: "English", editing: false },
  otherLanguages: { value: "Spanish, Italian", editing: false },
};

/**
 * Provider Portal "My Profile" settings page (Figma origin: Provider Portal
 * → "Profile" frame). One of the 8 pages rendered in
 * `AccountSettingsLayout`'s content column — a `ProfileHeader` summary,
 * then a divided stack of `SettingsDetailRow`s for each profile field, each
 * row expanding in place to edit its own value.
 */
function MyProfileLayout() {
  // Mobile-only: the header's back arrow (AccountSettingsLayout's onClose) has
  // nowhere to route to in this standalone Storybook reference layout, so
  // it swaps in the mobile "Account Settings" menu in place of this screen
  // instead — mirroring how a real app would navigate back one level.
  const [mobileScreen, setMobileScreen] = React.useState<"profile" | "menu">(
    "profile",
  );
  // CLAUDE.md "Glide": direction should match the navigation, not just
  // alternate — tapping back (into the menu) glides Account Settings in
  // from the left (-1); going forward (back to the sub-page) glides My
  // profile in from the right (1). Tracked alongside mobileScreen so
  // AnimatePresence/slideVariants know which way to animate the swap.
  const [screenDirection, setScreenDirection] = React.useState<1 | -1>(1);

  const [fields, setFields] =
    React.useState<Record<FieldKey, FieldState>>(initialFields);
  const [drafts, setDrafts] = React.useState<Record<FieldKey, string>>(
    Object.fromEntries(
      FIELD_KEYS.map((key) => [key, initialFields[key].value]),
    ) as Record<FieldKey, string>,
  );
  // "Your Name" edits as separate First/Last inputs (Figma `Settings
  // Detail Row`, State=Edit) even though the stored/displayed value stays
  // one string everywhere else (collapsed row, ProfileHeader) — split on
  // edit-start, recombined into `drafts.name` on every keystroke so the
  // shared save()/isUnchanged() logic doesn't need to know about the split.
  const [firstNameDraft, setFirstNameDraft] = React.useState("");
  const [lastNameDraft, setLastNameDraft] = React.useState("");
  // WhatsApp edits as a plain US-masked Input like Phone number, but is
  // stored/displayed as "+1XXXXXXXXXX" everywhere else — split on
  // edit-start via whatsAppNationalNumber, recombined into `drafts.whatsapp`
  // on every keystroke via toWhatsAppE164, same split/recombine shape as
  // the name First/Last fields above.
  const [whatsappLocalDraft, setWhatsappLocalDraft] = React.useState("");
  // Rows can be opened in any order and several can be open at once;
  // this tracks that order so Escape/Enter fall back to the most recently
  // opened one (LIFO) when focus isn't inside any open row — see
  // `rowRefs`/`focusedRowKey` below for the focus-aware case that takes
  // priority over this fallback.
  const [openOrder, setOpenOrder] = React.useState<FieldKey[]>([]);

  // The keydown handler below is only re-bound when `openOrder` changes, so
  // it would otherwise close over a stale `drafts` from whenever the row
  // was opened — a ref keeps `save` reading the latest keystroke instead.
  const draftsRef = React.useRef(drafts);
  draftsRef.current = drafts;

  // Maps each FieldKey to its row's wrapper DOM node, so the shared
  // Escape/Enter handler can tell which row (if any) currently contains
  // focus — e.g. the user opened Name, then Email, then clicked back into
  // Name to keep typing. Without this, Escape/Enter would always act on
  // whichever row opened last (openOrder's LIFO fallback), even while the
  // user is actively focused inside an earlier-opened row.
  const rowRefs = React.useRef<Partial<Record<FieldKey, HTMLDivElement | null>>>(
    {},
  );

  // Finds which open row (if any) currently contains focus, by walking
  // `rowRefs` — only rows present in `openOrder` are checked, since a
  // collapsed row has no focusable form content to hold focus anyway.
  function focusedRowKey(openKeys: FieldKey[]): FieldKey | undefined {
    const active = document.activeElement;
    if (!active) return undefined;
    return openKeys.find((key) => rowRefs.current[key]?.contains(active));
  }

  // Most rows edit a single FieldKey, but "Preferred language" expands into
  // two independent inputs (Preferred Language, Additional Languages)
  // sharing one row shell/Save button — these helpers take either a single
  // key or a tuple so that row can drive both fields together while every
  // other row
  // keeps passing a lone key.
  function startEditing(key: FieldKey | FieldKey[]) {
    const keys = Array.isArray(key) ? key : [key];
    const [primary] = keys;
    setDrafts((prev) => {
      const next = { ...prev };
      for (const k of keys) next[k] = fields[k].value;
      return next;
    });
    if (primary === "name") {
      const [first = "", ...rest] = fields.name.value.split(" ");
      setFirstNameDraft(first);
      setLastNameDraft(rest.join(" "));
    }
    if (primary === "whatsapp") {
      setWhatsappLocalDraft(
        formatUsPhone(whatsAppNationalNumber(fields.whatsapp.value)),
      );
    }
    setFields((prev) => {
      const next = { ...prev };
      for (const k of keys) next[k] = { ...prev[k], editing: true };
      return next;
    });
    setOpenOrder((prev) => [...prev.filter((k) => k !== primary), primary]);
  }

  function cancelEditing(key: FieldKey | FieldKey[]) {
    const keys = Array.isArray(key) ? key : [key];
    const [primary] = keys;
    setFields((prev) => {
      const next = { ...prev };
      for (const k of keys) next[k] = { ...prev[k], editing: false };
      return next;
    });
    setOpenOrder((prev) => prev.filter((k) => k !== primary));
  }

  // "Additional languages" accepts space- or comma- separated entries in any
  // case while typing, but is always persisted comma-separated and
  // title-cased ("Spanish, Italian") to match the collapsed note's display
  // format.
  function normalizeLanguageList(value: string): string {
    return value
      .split(/[,\s]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map(
        (entry) =>
          entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase(),
      )
      .join(", ");
  }

  function save(key: FieldKey | FieldKey[]) {
    const keys = Array.isArray(key) ? key : [key];
    const [primary] = keys;
    setFields((prev) => {
      const next = { ...prev };
      for (const k of keys) {
        const raw = draftsRef.current[k];
        next[k] = {
          value: k === "otherLanguages" ? normalizeLanguageList(raw) : raw,
          editing: false,
        };
      }
      return next;
    });
    setOpenOrder((prev) => prev.filter((k) => k !== primary));
  }

  // Used by fields that save immediately on selection (e.g. Time zone's
  // Select) instead of going through a separate Save button — takes the
  // chosen value directly rather than reading `drafts` after the fact,
  // since the drafts state update and this call happen in the same
  // `onValueChange` and would otherwise race.
  function saveValue(key: FieldKey, value: string) {
    setDrafts((prev) => ({ ...prev, [key]: value }));
    setFields((prev) => ({ ...prev, [key]: { value, editing: false } }));
    setOpenOrder((prev) => prev.filter((k) => k !== key));
  }

  // Save is disabled until the draft actually differs from the saved value
  // (in addition to any field-specific validity check) — prevents a no-op
  // save and signals there's nothing new to persist yet. Accepts multiple
  // keys for rows editing more than one field (e.g. Preferred language +
  // Additional languages) — unchanged only if every one of them is unchanged.
  function isUnchanged(key: FieldKey | FieldKey[]): boolean {
    const keys = Array.isArray(key) ? key : [key];
    return keys.every((k) => drafts[k] === fields[k].value);
  }

  // Esc cancels / Enter saves whichever open row currently has focus inside
  // it (e.g. several rows are open and the user clicked back into an
  // earlier one to keep editing) — same as clicking that row's own
  // Cancel/Save. When focus isn't inside any open row (e.g. it's on the
  // page body), falls back to the most recently opened row (LIFO), same as
  // before. Repeated presses on the fallback path walk the stack backwards.
  // Enter is skipped while focus is on a button (native click-activation
  // already handles it there) so it doesn't double-fire.
  React.useEffect(() => {
    if (openOrder.length === 0) return;

    function handleKeyDown(event: KeyboardEvent) {
      const activeKey =
        focusedRowKey(openOrder) ?? openOrder[openOrder.length - 1];
      if (event.key === "Escape") {
        cancelEditing(fieldGroup(activeKey));
      } else if (
        event.key === "Enter" &&
        (event.target as HTMLElement | null)?.tagName !== "BUTTON"
      ) {
        event.preventDefault();
        save(fieldGroup(activeKey));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openOrder]);

  function goToMenu() {
    setScreenDirection(-1); // back → Account Settings glides in from the left
    setMobileScreen("menu");
  }

  function goToProfile() {
    setScreenDirection(1); // forward → My profile glides in from the right
    setMobileScreen("profile");
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
        onClose={goToProfile}
        onNavigate={(navigateTo) => {
          // Only "My profile" has a built destination screen in this
          // reference layout — every other row is presentational until
          // its own sub-page exists.
          if (navigateTo === "/settings/profile") goToProfile();
        }}
      />
    </motion.div>
  );

  const profileScreen = (
    <motion.div
      key="profile"
      custom={screenDirection}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen"
    >
      <AccountSettingsLayout activeItem="My profile" onClose={goToMenu}>
      <div className="flex flex-col gap-6 pb-24">
        <ProfileHeader
          name="Johanna Wilson"
          role="Owner"
          email="jennywilson@email.com"
        />

        <div className="flex flex-col divide-y divide-border">
          <div className="py-6" ref={(el) => { rowRefs.current.name = el; }}>
            <SettingsDetailRow
              title="Your Name"
              value={fields.name.value}
              emptyPlaceholder="No name yet"
              editDescription="Use your real name so your teammates can recognize you."
              editing={fields.name.editing}
              onEditStart={() => startEditing("name")}
              onCancel={() => cancelEditing("name")}
              onSave={() => save("name")}
              saveDisabled={isUnchanged("name")}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    First name
                  </label>
                  <Input
                    value={firstNameDraft}
                    onChange={(e) => {
                      const first = e.target.value;
                      setFirstNameDraft(first);
                      setDrafts((prev) => ({
                        ...prev,
                        name: [first, lastNameDraft].filter(Boolean).join(" "),
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Last name
                  </label>
                  <Input
                    value={lastNameDraft}
                    onChange={(e) => {
                      const last = e.target.value;
                      setLastNameDraft(last);
                      setDrafts((prev) => ({
                        ...prev,
                        name: [firstNameDraft, last].filter(Boolean).join(" "),
                      }));
                    }}
                  />
                </div>
              </div>
            </SettingsDetailRow>
          </div>

          <div className="py-6" ref={(el) => { rowRefs.current.title = el; }}>
            <SettingsDetailRow
              title="Title"
              value={fields.title.value}
              emptyPlaceholder="No job title added"
              addLabel="Add Title"
              addDescription="Your role or position within the business."
              editDescription="Your role or position within the business."
              editing={fields.title.editing}
              onEditStart={() => startEditing("title")}
              onCancel={() => cancelEditing("title")}
              onSave={() => save("title")}
              saveDisabled={isUnchanged("title")}
            >
              <Input
                value={drafts.title}
                placeholder="Enter your job title"
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </SettingsDetailRow>
          </div>

          <div className="py-6" ref={(el) => { rowRefs.current.email = el; }}>
            <SettingsDetailRow
              title="Email"
              value={fields.email.value}
              emptyPlaceholder="No email yet"
              editDescription="Used for account updates, notifications, and important communications."
              editing={fields.email.editing}
              onEditStart={() => startEditing("email")}
              onCancel={() => cancelEditing("email")}
              onSave={() => save("email")}
              saveDisabled={isUnchanged("email") || !isValidEmail(drafts.email)}
            >
              {/* gap-2 (8px) matches Figma's Input component: the field →
                  helper/error text spacing is a tight pairing distinct from
                  the looser gap-4 (16px) the form uses between the field
                  group and the Save/Cancel row. */}
              <div className="flex w-full flex-col gap-2">
                <Input
                  type="email"
                  value={drafts.email}
                  aria-invalid={!isValidEmail(drafts.email)}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                {!isValidEmail(drafts.email) ? (
                  <Typography size="xs" className="text-destructive">
                    Enter a valid email address.
                  </Typography>
                ) : null}
              </div>
            </SettingsDetailRow>
          </div>

          <div className="py-6" ref={(el) => { rowRefs.current.phone = el; }}>
            <SettingsDetailRow
              title="Phone number"
              value={fields.phone.value}
              emptyPlaceholder="No phone number yet"
              editDescription="Add the primary number where the Bethere team can reach you."
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

          <div className="py-6" ref={(el) => { rowRefs.current.whatsapp = el; }}>
            <SettingsDetailRow
              title="WhatsApp number"
              value={formatWhatsAppForDisplay(fields.whatsapp.value)}
              emptyPlaceholder="No WhatsApp number yet"
              addLabel="Add WhatsApp"
              addDescription="Add a WhatsApp-enabled number for messages and service updates."
              editDescription="Add a WhatsApp-enabled number for messages and service updates."
              editing={fields.whatsapp.editing}
              onEditStart={() => startEditing("whatsapp")}
              onCancel={() => cancelEditing("whatsapp")}
              onSave={() => save("whatsapp")}
              saveDisabled={isUnchanged("whatsapp") || !isValidWhatsApp(drafts.whatsapp)}
            >
              <div className="flex w-full flex-col gap-2">
                {/* "+1" is a fixed, non-editable prefix (US-only for now) —
                    the wrapper carries Input's own border/bg/shadow/focus
                    treatment so the prefix + input read as one field, while
                    the inner <input> goes borderless/transparent to avoid a
                    visible seam. */}
                <div
                  className={cn(
                    "flex h-9 w-full items-center gap-1 rounded-xl border border-input bg-card pl-3 shadow-xs transition-[color,box-shadow] has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-input-ring-outside",
                    !isValidWhatsApp(drafts.whatsapp) &&
                      "border-destructive ring-destructive/20",
                  )}
                >
                  <span className="shrink-0 text-sm text-muted-foreground select-none">
                    +1
                  </span>
                  <input
                    type="tel"
                    value={whatsappLocalDraft}
                    aria-invalid={!isValidWhatsApp(drafts.whatsapp)}
                    onChange={(e) => {
                      const formatted = formatUsPhone(e.target.value);
                      setWhatsappLocalDraft(formatted);
                      setDrafts((prev) => ({
                        ...prev,
                        whatsapp: toWhatsAppE164(formatted),
                      }));
                    }}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
                {!isValidWhatsApp(drafts.whatsapp) ? (
                  <Typography size="xs" className="text-destructive">
                    Enter a valid phone number.
                  </Typography>
                ) : null}
              </div>
            </SettingsDetailRow>
          </div>

          <div className="py-6" ref={(el) => { rowRefs.current.timeZone = el; }}>
            <SettingsDetailRow
              title="Time zone"
              value={fields.timeZone.value}
              emptyPlaceholder="No time zone yet"
              editDescription="Select your local time zone to ensure accurate scheduling and notifications."
              editing={fields.timeZone.editing}
              onEditStart={() => startEditing("timeZone")}
              onCancel={() => cancelEditing("timeZone")}
              hideSaveButton
            >
              <Select
                value={drafts.timeZone}
                onValueChange={(value) => saveValue("timeZone", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a time zone" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_ZONE_OPTIONS.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingsDetailRow>
          </div>

          <div className="py-6" ref={(el) => { rowRefs.current.language = el; }}>
            <SettingsDetailRow
              title="Preferred language"
              value={fields.language.value}
              emptyPlaceholder="No preferred language yet"
              editDescription="Select your primary language and any additional languages you speak."
              note={
                fields.otherLanguages.value ? (
                  <>
                    <span className="text-muted-foreground">Additional:</span>{" "}
                    <span className="text-foreground">
                      {fields.otherLanguages.value}
                    </span>
                  </>
                ) : undefined
              }
              editing={fields.language.editing}
              onEditStart={() => startEditing(fieldGroup("language"))}
              onCancel={() => cancelEditing(fieldGroup("language"))}
              onSave={() => save(fieldGroup("language"))}
              saveDisabled={isUnchanged(fieldGroup("language"))}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Preferred language
                  </label>
                  <Input
                    value={drafts.language}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Additional languages
                  </label>
                  <Input
                    value={drafts.otherLanguages}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        otherLanguages: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </SettingsDetailRow>
          </div>
        </div>
      </div>
      </AccountSettingsLayout>
    </motion.div>
  );

  return (
    <div className="relative h-screen overflow-hidden">
      {/* `custom` on AnimatePresence itself (not just the child) is what
          actually reaches the *exiting* element's `exit` variant function —
          a child's own `custom` prop stops updating once it's removed from
          the tree, so the exit animation would otherwise run with whatever
          direction was current on the child's last live render instead of
          the direction that triggered this specific transition. */}
      <AnimatePresence initial={false} custom={screenDirection}>
        {mobileScreen === "menu" ? menuScreen : profileScreen}
      </AnimatePresence>
    </div>
  );
}

export { MyProfileLayout };
