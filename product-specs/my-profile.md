# My Profile — Provider Portal

**Location:** Settings → My Profile (`AccountSettingsLayout`'s default/first content page)
**Audience:** Business owner / provider
**Description:** View and edit the personal profile fields tied to the signed-in provider account — name, title, contact methods, time zone, and language.
**Figma:** Provider Portal → "Profile" frame (`Settings Detail Row` component states: `Default (Empty)` / `HasValue` / `Edit`)
**Source:** `src/layouts/account-settings/pages/my-profile/my-profile.tsx`

---

## Overview

My Profile is a single-column stack of fields, each rendered as a `SettingsDetailRow`: a **collapsed** read-only line (title + current value, or an empty-state placeholder) that **expands in place** into an edit form when activated. This is an accordion-style "click a row, edit it, save it, it collapses back" pattern — not a single big form with one Save button for the whole page.

A `ProfileHeader` sits above the field stack: avatar (with an edit-photo affordance), name, role badge, and email — a read-only summary, not itself editable from this component (avatar edit is a separate `onEditAvatar` callback, wired to nothing in this reference layout yet — ⚠️ gap, see [Implementation notes](#implementation-notes)).

---

## Page composition & shell integration

- Rendered inside `AccountSettingsLayout` (desktop: header + `SidebarSettings` rail + this content column; mobile: header only, sidebar hidden below `md`).
- `AccountSettingsLayout`'s `activeItem="My profile"` drives the sidebar's active-item highlight and, per the `SettingsHeader` refine, the *mobile* top-bar title override (`mobileTitle`) — desktop shows the static "Account Settings" title regardless of which sub-page is active.
- Content wrapper: `flex flex-col gap-6 pb-24` — the `pb-24` bottom padding reserves room so the last row's expanded edit form/Save button never sits flush against the viewport edge.
- Fields are separated with `divide-y divide-border` and each gets `py-6` — a plain divided list, not individual cards.

### Entry and exit: default landing page + Done button

Account Settings is not a bookmarkable multi-route section from the rest of the product's point of view — it's entered and exited as a single overlay/destination:

- **Default landing page**: whenever Account Settings is opened (e.g. from an account/avatar menu elsewhere in the app), it opens **directly to My Profile** — there is no intermediate "settings home" or section-picker screen on desktop. (On mobile, `AccountSettingsMenuLayout`'s section list *is* effectively that picker, but only when reached via the header's back arrow from within a sub-page — see [Mobile back-navigation](#mobile-back-navigation-reference-layout-only-behavior).)
- **Done button** (desktop, top-right of `SettingsHeader`) **closes Account Settings entirely and returns the user to whatever page they were on before they opened it** — not to a fixed destination (e.g. not always "the dashboard"). Account Settings behaves like a modal/overlay context in this respect: it remembers nothing about how it was entered beyond "go back to that."
- This is the same `onClose` callback `SettingsHeader` already exposes and `AccountSettingsLayout` forwards. ⚠️ **Not yet wired**: the Storybook reference layout only connects `onClose` to the mobile menu-swap (see below), since there's no real router here to demonstrate "return to the previous page" against. Integrating this layout into a real app still requires wiring `onClose` to actual browser/router back-navigation (e.g. `router.back()` or an explicit "previous page" reference) — a hardcoded route would not satisfy the "return whence you came" behavior specified above.

### Mobile back-navigation (reference-layout-only behavior)

This page has no real router in Storybook, so the header's mobile back arrow (`AccountSettingsLayout`'s `onClose`) doesn't leave the component — it swaps to the mobile **Account Settings menu** (`AccountSettingsMenuLayout`) in place of the profile screen, and tapping "My profile" in that menu swaps back. This mirrors what a real app's router would do (navigate back one level, then forward into the same sub-page) without needing an actual route.

- **Direction is meaningful, not arbitrary** (CLAUDE.md "Glide" motion pattern): going back to the menu glides the menu in **from the left**; returning to My Profile glides it in **from the right** — matching the navigation's spatial direction, not just alternating.
- Implemented via `slideVariants` (opacity + horizontal offset, `motionDistance.medium` ≈ 16px) driven by a `screenDirection` (`1 | -1`) state, wrapped in `AnimatePresence`.
- 💬 **Mechanic worth flagging for any future engineer wiring real routing:** `custom={screenDirection}` must be set on `AnimatePresence` itself, not only on the child `motion.div`. A child's own `custom` prop stops updating once React removes it from the tree — Framer Motion still needs to read the *current* direction to compute the *exiting* element's `exit` variant, and only `AnimatePresence`'s `custom` reaches an element that's already leaving.

---

## Field-by-field behavior

Each row below is a `SettingsDetailRow` instance. Shared mechanics (expand/collapse, Save/Cancel, validation-gates-Save) are documented once in [Shared row mechanics](#shared-row-mechanics); this table is what's specific to each field.

| Field | Empty placeholder | Edit control | Validation | Notes |
|---|---|---|---|---|
| **Your Name** | "No name yet" | Two `Input`s: First name / Last name, side-by-side (`md:grid-cols-2`) | None (any non-empty split is accepted) | Stored/displayed as one string everywhere outside the edit form (row's collapsed value, `ProfileHeader`'s name) — split into first/last only while editing, recombined on every keystroke. Description while editing: "Use your real name so your teammates can recognize you." |
| **Title** | "No job title added" | Single `Input`, placeholder "Enter your job title" | None | Uses `addLabel="Add Title"` (empty-state action) distinct from the default "Add" — the only field with a customized add-action label. |
| **Email** | "No email yet" | Single `Input type="email"` | Must match a loose email pattern (see [Validation rules](#validation-rules)) | Description: "Used for account updates, notifications, and important communications." Invalid state shows a red `aria-invalid` ring + inline error text "Enter a valid email address." below the field. |
| **Phone number** | "No phone number yet" | Single `Input type="tel"`, live US-format mask | Must resolve to exactly 10 US digits | Description: "Add the primary number where the Bethere team can reach you." Same invalid-state treatment as Email, error text "Enter a valid phone number." |
| **WhatsApp number** | "No WhatsApp number yet" | Custom composite field: fixed non-editable "+1" prefix + masked national-number input, styled as one visual field (see [WhatsApp field](#whatsapp-field)) | Same 10-digit rule as Phone, applied to the national number only | Uses `addLabel="Add WhatsApp"`. Stored as E.164 (`+1XXXXXXXXXX`); displayed collapsed as `+1 (305) 555-0123`. Description: "Add a WhatsApp-enabled number for messages and service updates." |
| **Time zone** | "No time zone yet" | `Select` populated with 9 US zones (incl. territories) | N/A (closed set) | **Saves immediately on selection** — no Save/Cancel footer (`hideSaveButton`). Description: "Select your local time zone to ensure accurate scheduling and notifications." |
| **Preferred language** | "No preferred language yet" | Two `Input`s side-by-side: Preferred language / Additional languages | None | The only row that edits **two fields as one unit** (see [Grouped fields](#grouped-fields-preferred-language)). Collapsed state shows a third line — "Additional: {value}" — below the primary value, only when Additional languages is non-empty. |

---

## Shared row mechanics

All rows funnel through the same state machine in `my-profile.tsx`, keyed by a `FieldKey`. `SettingsDetailRow` itself only owns the expand/collapse shell, header, and Save/Cancel footer — every field's actual input(s) are passed as `children`.

### Collapsed vs. expanded content

- **Collapsed, empty** (`data-state="empty"`): title + `emptyPlaceholder` (styled `text-foreground-subtle`, visually deemphasized vs. a real value) + an **"Add"** action (or the field's custom `addLabel`).
- **Collapsed, has value** (`data-state="has-value"`): title + the value (styled `text-foreground`, full-strength) + an **"Edit"** action. A `note` (Preferred language's "Additional: …" line) renders below the value here only.
- **Expanded** (`data-state="edit"`): heading becomes "Edit {title}" (existing value) or "Add {title}" (empty), subtitle becomes the field's guidance copy (`editDescription`, or `addDescription`/`emptyPlaceholder` fallback when adding), the row's action swaps from Add/Edit to a **Cancel** text action at the same header position, and the `children` form + Save button (unless `hideSaveButton`) fade in below.

### Opening / closing a row

- Clicking the collapsed row's Add/Edit action calls `startEditing(key)`: seeds `drafts[key]` from the current saved value, marks that field's `editing: true`, and pushes it onto an `openOrder` stack.
- **Multiple rows can be open simultaneously** — there's no "only one row expanded at a time" constraint. Each row's edit state is independent.
- `openOrder` tracks the sequence rows were opened in (LIFO), which is what lets a single shared Escape/Enter keyboard handler know *which* row to act on (see below) — without it, a keypress would have no way to disambiguate between several open rows.

### Keyboard shortcuts

- **Escape** cancels the **most recently opened** row (top of the `openOrder` stack) — same effect as clicking that row's Cancel.
- **Enter** saves the most recently opened row — same effect as clicking Save — *unless* focus is currently on a `<button>` element, in which case Enter is left alone so native button-activation doesn't double-fire the save.
- Repeated Escape/Enter presses walk the stack backwards, closing rows one at a time in reverse-open order.
- This is a page-level `document` keydown listener (not per-row), re-bound whenever `openOrder` changes.

### Save gating

- The Save button is **disabled until the draft differs from the currently saved value** — prevents a no-op save. This check runs in addition to (not instead of) any field-specific validity check (Email/Phone/WhatsApp additionally require the draft to pass validation).
- For the Preferred Language group, "unchanged" requires **both** Preferred Language and Additional Languages to be unchanged — changing either one alone enables Save.
- **Time zone bypasses this entirely** — see below.

### Immediate-save fields (Time zone)

Time zone has no Save/Cancel footer at all (`hideSaveButton`). Selecting a value in the `Select` fires `onValueChange`, which saves and collapses the row in the same action — there is nothing to confirm afterward. This is the only field on the page that behaves this way; every other field requires an explicit Save click (or Enter) to commit.

### Grouped fields (Preferred Language)

"Preferred language" is the one row whose edit form spans two independently-tracked field keys (`language` + `otherLanguages`) behind a single row shell and a single Save/Cancel pair. A `FIELD_GROUPS` lookup (keyed by the row's primary field) tells the shared Escape/Enter/Save/Cancel logic to act on *both* underlying keys together, so the keyboard shortcuts and the unchanged-check work correctly even though this row doesn't map 1:1 to a `FieldKey`.

**Additional languages** normalization: while typing, entries may be separated by spaces or commas in any case. On Save, the value is normalized to a canonical comma-separated, title-cased form (e.g. `spanish italian` → `Spanish, Italian`) to match how it's displayed in the collapsed row's "Additional: …" note.

---

## Validation rules

- **Email**: a loose "good enough" pattern (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) — catches missing `@`/domain typos without rejecting unusual-but-valid addresses a stricter RFC 5322 regex might choke on. Not a full spec implementation.
- **Phone number / WhatsApp**: both are **US-only** — validated as exactly 10 digits after stripping a leading `+1`/`1` country code and any spaces/dashes/parens. No country picker exists yet for either field.
- Both invalid states render the same way: the field's border/ring turns `destructive`-colored (`aria-invalid`) and an inline `text-destructive` caption appears below the field ("Enter a valid email address." / "Enter a valid phone number."). Save stays disabled the entire time the field is invalid.

## Phone number formatting

Phone number and WhatsApp's national-number input both use a **progressive US mask** as the user types — it doesn't wait for all 10 digits before showing formatting:

| Digits typed | Displayed |
|---|---|
| 0 | *(empty)* |
| 1–3 | `(XXX` |
| 4–6 | `(XXX) XXX` |
| 7–10 | `(XXX) XXX-XXXX` |

Non-digit characters are stripped on input. A leading `1` (country code) is dropped if more than 10 digits are present, so pasting a number with a `+1`/`1` prefix still lands on the correct 10-digit mask. Input is hard-capped at 10 significant digits — typing or pasting further digits is silently ignored rather than producing an overlong number.

## WhatsApp field

WhatsApp is visually and behaviorally almost identical to Phone number (same US mask, same validation), with two differences:

1. **Storage format**: WhatsApp is stored/persisted as E.164 (`+13055550123`) — the shape the WhatsApp platform itself expects — while Phone number is stored as the display-formatted string (`(305) 555-5732`). The national-number mask, validation, and editing UX are otherwise shared logic.
2. **Fixed "+1" prefix**: the edit control is a custom composite, not a plain `Input` — a non-editable `+1` label sits inside the same visual field as the editable national-number input. The wrapper `<div>` carries the field's border/background/shadow/focus-ring treatment (so prefix + input read as one seamless field), while the inner `<input>` itself is borderless/transparent to avoid a visible seam between the static prefix and the live input.

Collapsed-state display re-composes the stored E.164 value back into `+1 (305) 555-0123` for readability.

---

## Motion

- **Row expand/collapse**: `SettingsDetailRow` uses Framer Motion `layout` animation (so surrounding rows reflow smoothly as one expands/collapses) plus an `AnimatePresence`-wrapped fade for the edit form's mount/unmount (`enterTransition` in, `exitTransition` out — exit faster than enter, per the CLAUDE.md Motion System's Dialogs/Overlays guidance).
- **Reduced motion**: every transition on this page is resolved through `useMotionPreference()`'s `resolve()`, which substitutes a reduced-motion-safe transition when the user has `prefers-reduced-motion` set — per CLAUDE.md's motion accessibility requirements, state-change feedback (the row opening/closing) is preserved even when animated movement is stripped.
- **Mobile menu↔profile swap**: see [Mobile back-navigation](#mobile-back-navigation-reference-layout-only-behavior) above — this is the page's only use of the Glide pattern; everything else on the page uses Reveal/Expand-style row transitions, not directional slides.

---

## Implementation notes

- ⚠️ `ProfileHeader`'s `onEditAvatar` callback is not wired to anything in this reference layout — avatar photo editing has no implemented destination yet (no upload flow, no crop UI).
- ⚠️ Time zone options are a **hardcoded static list of 9 US zones** (including territories), using standard-time offsets/abbreviations shown for simplicity rather than resolving DST live (e.g. "Eastern Standard Time (EST) · UTC−05:00" year-round, not switching to EDT/UTC−04:00 in summer). A production version would need either a live DST-aware library or explicit product sign-off that static standard-time labels are acceptable.
- ⚠️ Phone/WhatsApp are hard-scoped to US numbers (10-digit, `+1`-only). Any international-provider expansion needs a country picker and a real phone-validation library (e.g. libphonenumber) — the current regex-based approach does not generalize.
- ⚠️ This page has no persistence layer — `save`/`saveValue` only update in-memory React state (`initialFields` is hardcoded seed data: "Jenny Wilson" / "jennywilson@email.com" / etc., while `ProfileHeader` above it is separately hardcoded to "Johanna Wilson" — **these two names don't currently match**, a reference-layout inconsistency worth fixing before this becomes a real page). No API calls, no optimistic-update/error-rollback behavior is defined yet.
- ⚠️ No "unsaved changes" warning exists if a user navigates away (or the mobile back arrow is tapped) while one or more rows are still expanded with unsaved edits — edits are simply discarded silently along with the component's state.
