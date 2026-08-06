# Design & Component Contracts

Durable, team-visible rules about *why* a component is built the way it is —
things that would otherwise get silently re-broken by a future edit or
Figma/shadcn resync. This file is committed to git so it travels with the
repo across machines and is visible to any contributor (human or AI).

Add an entry here when a fix or convention:

- took real iteration to land on and could plausibly be "fixed" back to a
  worse state by someone who doesn't know the history, or
- is a contract between two pieces of code (e.g. two CSS rules that must
  change together) that isn't obvious from reading either one alone.

Keep entries short: what the rule is, why it exists, and the exact
known-good shape to check against. Don't restate things that are already
self-evident from reading the code.

---

## Global `cursor: pointer` on every clickable element (`src/styles/theme.css`)

**Rule:** Every clickable/interactive element in UCL must show `cursor: pointer`
on hover (and `cursor: not-allowed` when disabled) — this is enforced **once,
globally**, not per-component. Don't add `cursor-pointer`/`hover:cursor-pointer`
utility classes to individual components; the global `@layer base` rule
already covers any real interactive element for free.

```css
@layer base {
	button:not(:disabled),
	[role="button"]:not([aria-disabled="true"]),
	a[href],
	label[for],
	summary,
	select,
	[data-slot][role="checkbox"]:not([data-disabled]),
	[data-slot][role="radio"]:not([data-disabled]),
	[data-slot][role="switch"]:not([data-disabled]) {
		cursor: pointer;
	}

	button:disabled,
	[role="button"][aria-disabled="true"],
	select:disabled {
		cursor: not-allowed;
	}
}
```

**Why:** Tailwind v4's preflight sets `cursor: default` on `<button>` — a
deliberate change from v3's `cursor: pointer` default. Left alone, every new
component built against v4 would render non-pointer cursors on obviously
clickable controls unless someone remembered to hand-roll `cursor-pointer` on
each one (which is exactly what several individual components — `Input`,
`Select`, `Combobox` — did before this rule existed, each with slightly
different disabled-state handling). Centralizing it once removes that
per-component guesswork and keeps the affordance consistent app-wide.

**How to apply:**

- **New components using a real interactive element or role** (`<button>`,
  `<a href>`, `<select>`, `role="button"`/`"checkbox"`/`"radio"`/`"switch"`)
  get the pointer cursor automatically — do not add a redundant
  `cursor-pointer` class.
- **Custom non-native interactive elements** (a `<div>` acting as a button,
  for instance) must carry `role="button"` (and `aria-disabled="true"` when
  disabled) to match the selector list above — a bare clickable `<div>` with
  only an `onClick` handler and no role will NOT get the pointer cursor from
  this rule.
- **If a new interactive role/pattern is added to the library** (e.g. a new
  Radix primitive with its own trigger role) and it doesn't match any
  selector above, extend the shared selector list in `theme.css` rather than
  patching `cursor-pointer` onto that one new component.

---

## Heading element → `Typography` `size` pairing (`src/components/typography/typography.tsx`)

**Rule:** `Typography`'s `as` (semantic element) and `size` (visual scale)
are independent props — `as="h1"` alone does not imply any particular
`size`. When a page heading uses a semantic heading element, pair it with
the matching `size`/`weight` below rather than picking a size by eye:

- `h1` → `size="2xl" weight="semibold"` (24px/32px line-height, `font-display`).
  Confirmed against Figma (`get_variable_defs` on the Business Profile page's
  business-name header, bethere.ds `font-size/2xl` + `font-weight/semibold`,
  no letter-spacing override). Also the size used for plain page titles
  (e.g. `BusinessProfilesLayout`'s "Business profiles" heading) — both a
  page title and an entity-name header (like the business-name case above)
  are `h1`-level and share this pairing.
- `h2` → `size="lg" weight="semibold"`. Not yet independently confirmed
  against a Figma binding in this codebase — re-verify with
  `get_variable_defs` on an actual `h2`-level Figma node before treating
  this as load-bearing the way the `h1` pairing is.

**Why:** `src/layouts/account-settings/pages/business-profile/
business-profile.tsx`'s business-name header was first built against a
stale Figma pull as `as="h1" size="3xl"` with a `tracking-[0.3px]`
override. A later Figma revision moved the bound style to `font-size/2xl`
(no letter-spacing), and the component was corrected to `size="2xl"` with
the tracking override removed. `3xl` is a plausible-looking size for an
`<h1>` in isolation — this pairing exists so the next `h1` doesn't
re-introduce that same "reasonable-looking but not what Figma actually
binds" guess.

**How to apply:** Any new page-level `h1`/`h2` in `src/layouts/**` should
default to this pairing. If a specific Figma frame binds a heading node to
a different size/weight, that Figma value wins for that instance — but
don't invent a size for a heading element without checking, since `3xl`
looked equally plausible here and was wrong.

---

## `SettingsDetailRow` reuse across account-settings pages (`src/components/forms/settings-detail-row/settings-detail-row.tsx`)

**Rule:** `SettingsDetailRow` (title + value/placeholder + trailing text
action that expands into an inline edit form) is the one reusable row
component for **every** field-like row across `src/layouts/account-settings/
pages/*` — not just `my-profile`. When a new settings page (e.g. Business
Profile) shows a row shaped like "bold title, value below, trailing text
action," reuse `SettingsDetailRow` rather than building a page-specific row
component, even if that page's Figma frame doesn't show an explicit
`Property 1=Edit` state to design the expanded form against.

- `editLabel`/`addLabel` are per-row, not fixed to "Edit"/"Add" — e.g.
  Business Profile's "Owner" row uses `editLabel="Transfer ownership"`, its
  "Primary contact" row uses `addLabel="Add primary contact"`.
- **Not every row needs an expand-to-edit-form.** Rows whose action clearly
  starts a *different* flow rather than editing a scalar value in place —
  Business Profile's Owner ("Transfer ownership"), Primary contact ("Add
  primary contact"), Phone numbers ("Add phone number", plural → a list, not
  a single value) — should NOT be forced into `SettingsDetailRow`'s
  expand/edit-form shape. Render those as a plain row with an `onClick`
  callback stub (same pattern as `BusinessProfilesLayout`'s
  `onAddBusiness`/`onSelectBusiness`) until the real flow (a modal, a picker,
  a list manager) has its own Figma design to build against. Don't invent an
  inline single-text-input edit form for these just to force-fit
  `SettingsDetailRow` — that would be UI with no design source.

**Why:** The alternative (building a new lightweight row component per page)
was considered and rejected — `SettingsDetailRow`'s title/value/action shape
already matches what every account-settings page's Figma frames show, so a
second row component would just duplicate it with a slightly different prop
API for no visual difference. But blindly reusing its expand/edit-form
behavior for rows that are actually navigation-to-another-flow (not a scalar
edit) would invent UI Figma never specified.

**How to apply:** For any new `src/layouts/account-settings/pages/*` page,
default to `SettingsDetailRow` for scalar-value rows (text, a single
picked value) and a plain stubbed-`onClick` row for rows that read as
"start a different flow" — check the row's Figma action label for a verb
that implies navigation/a picker/a list (Transfer, Add X, Manage, Choose…)
vs. a value-in-place edit (Edit, Save) as the signal for which shape to use.

---

## `Select` — `SelectContent` positioning (`src/components/forms/select/select.tsx`)

**Rule:** `SelectContent` must always render **covering** its `SelectTrigger`
(same stacking layer, overlapping position) rather than floating
disconnected above or below it with a gap.

- When Radix places the panel with `side="bottom"` (the common case), the
  panel's **top edge** is shifted up to align with the trigger's **top
  edge**, so it grows downward and covers the trigger.
- When Radix's collision detection flips to `side="top"` (trigger sits low
  enough in a scrollable page that there isn't room below — e.g. a `Select`
  in the last row of a long settings form), the panel's **bottom edge** is
  shifted down to align with the trigger's **bottom edge**, so it grows
  upward and covers the trigger the same way.

Both rules must be kept in sync — editing one without the other reintroduces
a gap for whichever `side` was missed.

```tsx
// data-[side=bottom]: shift panel UP by trigger height (top edges align, grows down)
"data-[side=bottom]:-translate-y-[var(--radix-select-trigger-height)]",
// data-[side=top]: shift panel DOWN by trigger height (bottom edges align, grows up)
"data-[side=top]:translate-y-[var(--radix-select-trigger-height)]",
```

Other load-bearing details on this same component:

- No `side` prop override — Radix's default (`bottom`, auto-flipping to
  `top` on collision) is left intact so its own collision detection keeps
  working. Don't hardcode `side="top"`.
- No `avoidCollisions={false}` — disabling collision detection previously
  broke `--radix-select-content-available-height` and collapsed the panel
  to a near-zero-height line.
- `sideOffset={0}` (not `4`) — the panel is meant to overlap flush, not sit
  in a gap.
- Horizontal transform-origin is hardcoded to `[transform-origin:50%_top]`
  rather than using Radix's computed `origin-(--radix-select-content-transform-origin)`,
  which follows `align` and would scale the zoom animation from top-left
  instead of top-center when `align="start"`.

---

## `--state-hover` token (`src/styles/theme.css`)

**Rule:** `--state-hover` (`#3a342808` — sand-900 at ~3% alpha, exposed as
the `bg-state-hover` Tailwind utility) is the bethere.ds design-system token
`color/states/hover`, pulled directly from Figma's `get_variable_defs` on a
component with a defined `Property 1=Hover` variant. It is deliberately this
subtle — don't swap it for a stronger/opaque tint (e.g. `bg-accent`,
`bg-muted`) to make hover "more visible."

**Why:** The first pass at `CardBusiness`'s hover state
(`src/components/cards/card-business/card-business.tsx`) had no `Hover`
variant to check against in Figma yet, so it borrowed `hover:bg-accent` from
Button's outline-variant pattern as the closest existing precedent. Once
Figma's `card-business` component gained a real `Property 1=Hover` variant,
`get_variable_defs` showed the actual bound value is `color/states/hover`
(`rgba(58,52,40,0.03)`) — much subtler than `--accent` (a flat
`neutral-100`). The borrowed value was corrected to the real token.

**How to apply:** Any component adding a background-tint hover state should
reach for `bg-state-hover` by default rather than `bg-accent`/`bg-muted`,
unless a specific Figma variant for that component binds to a different
token. If a component's hover was implemented before its Figma source had a
`Hover` variant (i.e. it was a reasonable guess at the time), re-check it
against `get_variable_defs` once Figma adds one — don't assume the guess was
already correct.

---

## US phone number format & validation (`src/layouts/account-settings/pages/my-profile/my-profile.tsx`)

**Rule:** Phone number and WhatsApp number are both US-only fields. They
share the same national-number mask and validation, and must be kept in
sync if either changes.

- **Display/input format:** `(###) ###-####` — produced by `formatUsPhone`.
  - Digits-only: every non-digit character typed or pasted is stripped.
  - Hard-capped at 10 digits: a leading `1` (bare or as `+1`) is dropped as
    a country code before masking, and anything beyond the 10th remaining
    digit is ignored — typing or pasting past a full US number is a no-op,
    not silently truncated later or left unformatted.
  - Mask grows progressively as digits are typed (`(3` → `(305` →
    `(305) 5` → `(305) 555-5732`), it does not wait for all 10 digits
    before showing any formatting.
- **Validation:** `isValidPhone` requires exactly 10 digits (optionally
  prefixed with a `1`) after stripping spaces/parens/dashes/`+` —
  `US_PHONE_PATTERN = /^1?\d{10}$/`. Both fields' Save buttons and inline
  error text ("Enter a valid phone number.") are driven directly off this
  check.
- **WhatsApp storage:** WhatsApp is persisted as a full E.164 string
  (`+13055550123`) via `toWhatsAppE164`/`whatsAppNationalNumber`, since
  that's the shape the WhatsApp app itself expects — but the edit UI is
  still just the same `(###) ###-####` mask as Phone number, with a fixed,
  non-editable `+1` prefix rendered beside it (a wrapper reproducing
  `Input`'s border/shadow/focus-visible styling around a borderless inner
  `<input>`, so the prefix + digits read as one field). There is currently
  no country picker — every WhatsApp number is assumed US (`+1`).

**Why:** Earlier iterations explored a full international country-code
picker (`Select` + per-country dial code + per-country mask) for WhatsApp,
since WhatsApp numbers are commonly non-US. That was explicitly reverted —
WhatsApp is US-only for now, matching Phone number, just stored with an
explicit `+1` so the value is already E.164-ready if international support
returns later. Don't reintroduce a country picker without this being asked
for again.

**How to apply:** If either field's formatting or validation drifts (e.g.
during a future refactor of this page), check both `formatUsPhone` and
`isValidPhone` together — they're meant to stay identical in shape across
Phone number and WhatsApp, with WhatsApp only differing by its fixed `+1`
prefix and E.164 storage.

---

## Multi-row keyboard shortcuts: focus-aware, LIFO fallback (`src/layouts/account-settings/pages/my-profile/my-profile.tsx`)

**Rule:** On a page where several independent expandable rows/sections can
be open (editing) at once, a single shared Escape/Enter handler must:

1. **Prefer whichever open row currently contains focus**, if any does.
2. **Fall back to the most-recently-opened row** (LIFO) only when focus
   isn't inside any open row (e.g. focus is on the page body, or nothing
   in the DOM is focused).

```ts
// rowRefs: FieldKey -> that row's wrapper DOM node (one ref per row)
function focusedRowKey(openKeys: FieldKey[]): FieldKey | undefined {
  const active = document.activeElement;
  if (!active) return undefined;
  return openKeys.find((key) => rowRefs.current[key]?.contains(active));
}

// In the keydown handler:
const activeKey = focusedRowKey(openOrder) ?? openOrder[openOrder.length - 1];
```

**Why:** `openOrder` (a stack of the keys of every currently-open row, in
open order) is what makes "multiple rows open simultaneously" possible in
the first place — it's tempting to simplify this down to a single
`activeKey: FieldKey | null` the moment only one row is ever open in
testing, but that silently breaks the multi-open case (a second row
opening has nowhere to be tracked, and Escape/Enter stop working for
whichever row isn't the lone tracked one).

Even with `openOrder` intact, **LIFO alone is not sufficient** once more
than one row is open: opening Name, then Email, then clicking back into
Name to keep typing, and pressing Escape must cancel **Name** (where the
user is actually focused), not Email (merely the most-recently-*opened*
row). Acting on "last opened" instead of "currently focused" reads as a
bug to the user ("Escape closed the wrong field") even though the LIFO
logic itself is working exactly as written — the fix is checking focus
first, with LIFO only as the fallback for when nothing in an open row is
focused.

**How to apply:** Any future page with the same shape (several
independently-collapsible/expandable sections, each ownable via its own
Save/Cancel, with a shared Escape/Enter shortcut) should reuse this same
two-tier lookup — a per-row DOM ref map + `document.activeElement`
containment check, falling back to an open-order stack — rather than
either a single `activeKey` (breaks multi-open) or pure LIFO (ignores
focus). Don't drop the focus check to "simplify" this back to LIFO-only.
