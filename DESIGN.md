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

## Design quality bar — consumer and internal products are equal

**Rule:** Every Bethere product is designed to be intuitive, efficient, and
human by default. This standard applies equally to consumer experiences and
internal operational tools. Internal systems are not treated as secondary
products — they meet the same bar for clarity, usability, and design quality
as customer-facing experiences.

**Why:** The principle is simple: every Bethere product must be human, fast,
and trustworthy. That applies equally to guests, providers, hotel teams, and
internal operators. It's easy to unconsciously treat internal/operational
tools as lower priority since they have no external audience — this rule
exists so that assumption doesn't quietly lower the bar for account-settings,
provider-portal, or other internal-facing UCL consumers.

**How to apply:** Don't reach for a lower-effort pattern (skipping states,
skipping motion, skipping copy quality) just because a screen is
internal-only. See "Brand voice" below for how tone specifically — not the
overall quality bar — differs between consumer and internal/transactional
contexts.

---

## Brand voice — copy tone across UCL-consuming apps

**Rule:** Bethere is a city planner, not a trip planner. Guest-facing,
discovery-oriented copy across UCL-consuming apps should read like a close
friend who lives in the city guiding the user through it — someone who knows
the user and is choosing/suggesting things matched to their mood,
personality, and the moment they're in — not a booking-engine or
travel-platform voice. See [product-specs/concierge/homepage.md](product-specs/concierge/homepage.md)
for this voice applied to a specific page.

**Voice varies by degree of casualness, not by underlying personality.** The
voice stays warm, personal, and conversational across all of Bethere — what
changes across a user's journey is how casual it gets, driven by context and
commitment (how close the moment is to money changing hands), not a switch
between two unrelated voices. **The key rule: casual should never become
careless.** Avoid slang, gimmicky phrasing, excessive enthusiasm, or language
that makes a high-value purchase feel less credible.

Four stages, one funnel:

| Stage | Tone |
| --- | --- |
| **Discover** | Conversational — see discovery voice principles and "what to avoid" below. |
| **Evaluate** | Informative — still warm, but the job is helping the user judge whether this is right for them (details, specifics, honest framing), not just charming them. |
| **Book** | Confident and precise — trust and money are on the line; ambiguity here is a liability, not a personality trait. |
| **Manage** (post-booking, account, settings) | Clear and reassuring — the user needs to know things are handled correctly. |

This gives Bethere one recognizable personality end-to-end, while letting
the experience feel appropriately premium exactly when trust and money
matter most. Internal, transactional, financial, and operational flows (e.g.
account settings, provider portal, payments, confirmations, error states)
map onto the **Book**/**Manage** end of this same spectrum — they are not a
separate, unrelated register, just the more precise/reassuring end of the
same voice.

Discovery voice principles:

- **Approachable.** Reads like a text from a friend, not a notification from an app.
- **Friendly.** Warm by default — never cold, clinical, or transactional.
- **Close/personal.** Speaks as if it knows the user, not as if it's addressing a general audience.
- **Conversational.** Sentences, not labels. Questions and offers, not category names.

What to avoid in discovery copy — it must never fall back to standard/
traditional UI-label language. Generic, category-style headings read as a
booking platform, not a local friend:

- "Most Popular"
- "Top Rated"
- "Recommended For You" (as a flat label)
- "Categories"
- "Explore"

If a discovery heading or button label could be swapped onto any generic
travel/booking site without sounding out of place, it's too generic —
rewrite it as something only a person (not a system) would say. This
"generic-swap" test does not apply to internal/transactional copy, which is
expected to be plain and unambiguous rather than personality-forward.

**Exception: evocative/descriptive copy is allowed when the card's job is to
sell the feeling of an experience, not state a neutral fact.** The
generic-swap test is aimed at *structural* UI language (section headings,
button labels, category chips) reading like a booking platform. It is not a
ban on any phrase a travel site might also plausibly use — a friend
recommending a trip talks like this too. Example: a Concierge "Let's get out
of town" day-trip card for Key West uses `A scenic 85-mile drive` rather
than a flatter `85 miles away, along the coast`. The flatter version reads
more neutral/technical; the chosen version describes the *experience* of the
drive, which is what the card exists to sell — see
[product-specs/concierge/card-content.md](product-specs/concierge/card-content.md)
("Let's get out of town" distance copy) for the fuller reasoning and the
other three day-trip cards it sits alongside. Don't use this exception to
justify generic filler ("Amazing views await!") — it applies specifically to
description-style copy on cards actively pitching an experience, not to
navigation, headings, or system labels, which the generic-swap test still
governs at full strength.

**Why:** The recommended venue could be a luxury spot or a very local,
standard place — the specific venue isn't the point. The point is that
Bethere, as a local friend, knows which one is right for the user in this
moment. That extends to places being genuine hidden gems, known mainly to
locals rather than pulled from a tourist-oriented "top places" list — a
friend who lives in the city recommends the spot they'd actually take you
to, not just whatever ranks highest for visitors. Generic labels ("Most
Popular", "Categories") undercut that positioning by reading as a system
sorting inventory rather than a friend making a recommendation. Book and
Manage carry the opposite risk: ambiguity or cuteness in a payment, error, or
confirmation message erodes trust rather than building warmth, so those
stages favor precision and reassurance first — see "Design quality bar"
above for why those flows still can't be treated as lower-effort overall.
The Discover → Evaluate → Book → Manage progression is also the answer to
formality/price-tier: casualness tapers as the user gets closer to
committing money, regardless of whether the item itself is a $40 dinner
reservation or a $4,000 yacht charter — it's the stage, not the price tag,
that sets the register.

**How to apply:**

- Concrete examples of the Discover-stage voice applied to real headline
  decisions live in [product-specs/concierge/homepage.md](product-specs/concierge/homepage.md)
  (e.g. "A few things I think you'll like." instead of "Recommended," "Let's
  pick a neighborhood." instead of "Locations").
- When writing new Discover-stage copy: draft the generic/functional version
  first (what a standard site would say), then rewrite it as something a
  knowledgeable local friend would actually say out loud, then check it
  against the "what to avoid" list above.
- When writing Evaluate/Book/Manage copy (including internal/transactional/
  financial flows): prioritize the tone in the table above — informative,
  then confident-and-precise, then clear-and-reassuring — over the Discover
  "what to avoid" list, which doesn't apply verbatim past Discover (e.g. a
  settings page section or a booking confirmation can be plainly labeled
  where a Discover-stage heading cannot). Still check the result isn't cold,
  slangy, or gimmicky — the personality doesn't disappear, it just gets more
  precise.

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

## `Button` default size is `lg` (36px) unless Figma specifies otherwise (`src/components/buttons/button/button.tsx`)

**Rule:** Every `Button` defaults to `size="lg"` (36px, `h-9`) —
`defaultVariants.size` in `buttonVariants` already encodes this, so most
call sites don't need to pass `size` at all. When a specific Figma frame
binds a button to a different size (`xs`/`sm`/`md`/`xl`/an `icon-*`
variant), that Figma value wins for that instance — but don't reach for a
smaller size than Figma actually shows just because it "looks fine," and
don't leave `size` unset while assuming it'll come out right without
checking against the source.

**Why:** Buttons in `InviteTeamMembersDialog`
(`src/components/overlays/invite-team-members-dialog/invite-team-members-dialog.tsx`)
and the "Invite member" trigger in `TeamMembersLayout`
(`src/layouts/account-settings/pages/team-members/team-members.tsx`) were
built at a size that didn't match Figma's actual `lg`/36px spec for those
buttons — an easy drift to introduce silently, since an unset `size` prop
still renders *a* button, just not necessarily the right one, and a
slightly-off height doesn't fail a build or a type check.

**How to apply:** When building or reviewing a page with `Button`
instances, check each one's rendered height against Figma's `lg`/36px
default rather than assuming the default prop is already correct — set
`size="lg"` explicitly on user-facing action buttons (primary/secondary CTA
rows, dialog footers) so the intended size is visible in the code, not just
inherited silently. Only omit `size` (or set a different one) when Figma
itself specifies a non-default size for that specific button.

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

---

## Tables round only their top corners (`src/components/data-display/table/table.tsx`)

**Rule:** A table's rounded container only rounds the **top** corners
(`rounded-t-xl`), never the bottom — this is a global rule for every table
in UCL, not a per-page choice. `Table`/`TableHeader` already only apply
`rounded-tl-xl`/`rounded-tr-xl` internally (on the header row's first/last
cell); the bug is in whatever wrapper `div` clips the table's overflow —
using `rounded-xl` there rounds all four corners and visually rounds the
bottom even though the table itself never intended that.

```tsx
// WRONG — rounds all four corners
<div className="overflow-hidden rounded-xl bg-card">
  <Table>…</Table>
</div>

// CORRECT — only the top rounds; overflow-hidden still needed to clip
// the header's own rounded-tl-xl/rounded-tr-xl corners
<div className="overflow-hidden rounded-t-xl bg-card">
  <Table>…</Table>
</div>
```

**Why:** `DataTable` (`src/components/data-display/data-table/data-table.tsx`)
and the "Team members" page's `MembersTable`
(`src/layouts/account-settings/pages/team-members/team-members.tsx`) both
wrapped `Table` in an `overflow-hidden rounded-xl` container. `Table` itself
was already correctly top-only, so the bottom rounding was coming from the
wrapper alone — an easy thing to miss since `rounded-xl` on a clipping
wrapper still renders *something* plausible, it's just not the intended
shape.

**How to apply:** Any new table wrapper (a page-level table, a new shared
table component) must use `rounded-t-xl` (or `rounded-t-*` matching the
surrounding radius scale), never a plain `rounded-xl`/`rounded-*`, on the
`overflow-hidden` container around `Table`. Keep `overflow-hidden` — it's
still required to clip the header's top corners — just drop the bottom
radius.

---

## Dialog close animation: two separate ways it silently breaks (`src/components/overlays/dialog/dialog.tsx`)

**Rule:** A `Dialog`'s close transition (fade-out + zoom-out, the reverse of
its fade-in + zoom-in open) can break in two independent ways — both must be
avoided, and both were live bugs before being fixed:

1. **Use `animation-duration-*`, never `duration-*`, on `DialogContent`.**
   Tailwind's `duration-*` utility sets the *transition*-duration variable.
   `tw-animate-css`'s `animate-in`/`animate-out` (what `data-[state=open]`/
   `data-[state=closed]` actually use) are keyframe *animations*, which read
   `--tw-animation-duration` — set only by `animation-duration-*`. Applying
   `duration-200` to `DialogContent` looked plausible but did nothing for
   either direction, so both silently fell back to `tw-animate-css`'s
   default 150ms in a way that resolved inconsistently, making close look
   noticeably snappier than open.

2. **Never gate a `Dialog`'s own JSX behind the same state its close flow
   clears.** A pattern like:

   ```tsx
   // WRONG — clearing `editingMember` on close unmounts the dialog
   // instantly, before Radix's exit animation gets to play at all.
   {editingMember && (
     <EditMemberDialog
       open
       onOpenChange={(open) => { if (!open) setEditingMember(null); }}
       member={editingMember}
     />
   )}
   ```

   hard-unmounts the dialog the moment Cancel/Save/X fires, since Radix's
   Presence-based exit animation needs the component to stay mounted while
   `data-state="closed"` plays out — an external `&&` unmount skips that
   transition window entirely, so the dialog just vanishes instead of
   animating out.

**Why:** Both bugs are easy to introduce because the broken version still
*looks* correct in code review — `duration-200` reads like it should control
the animation, and `{data && <Dialog>}` reads like ordinary conditional
rendering. Neither error throws or warns; the only symptom is a close that
feels abrupt compared to the open, which is easy to miss without comparing
the two side by side.

**How to apply:**
- Any timing override on `DialogContent` (or another Radix overlay built the
  same way) must use `animation-duration-*`/`--tw-animation-duration`, not
  `duration-*`. `DialogContent` already carries `animation-duration-200` —
  don't reintroduce `duration-*` there or on a new overlay's equivalent.
- Split the state instead: keep a data-holding value that's set on open and
  **never reset to empty/null as part of closing** (only replaced the next
  time the dialog opens for different data), and a separate boolean that
  actually drives `open`/`onOpenChange`. See
  `TeamMembersLayout`'s `editingMember` (data, never cleared on close) vs.
  `editDialogOpen` (the boolean Cancel/Save/X actually toggle) in
  `src/layouts/account-settings/pages/team-members/team-members.tsx`.

---

## "Outside border" on hover: `box-shadow` ring, not `outline`/`border` (`src/components/forms/notification-switcher/notification-switcher.tsx`)

**Rule:** When a Figma spec calls for a border that sits **outside** a
component's box on hover (rather than inset), implement it as a
`box-shadow` ring — `hover:shadow-[0_0_0_<width>_var(--color-token)]` — not
`border` and not `outline`.

- `border` is inset by default — it eats into the box and shifts internal
  padding/content. Wrong primitive for "outside."
- `outline` sits outside the box without affecting layout, which sounds
  right, but in a stacked list with no gap between rows it caused a real
  hover appear/disappear flicker: adding `outline` on `:hover` changes the
  element's painted bounds right where the cursor often sits at a row's
  edge, so the hover state toggled on/off rapidly. `box-shadow` does not
  have this failure mode here.

Two more things must stay true or the ring looks wrong even though it
renders:

1. **Ring color must match the fill token**, not an unrelated one —
   `NotificationSwitcher`'s hover ring uses `--color-state-hover` (the same
   token as `hover:bg-state-hover`), not `--color-card` (white), so the
   fill and ring read as one continuous tinted shape instead of a
   white-on-white-invisible or mismatched edge.
2. **Fill and ring must be in the same `transition-*` property list.**
   Tailwind's `transition-colors` covers `background-color`/`border-color`/
   `color`/`fill`/`stroke` but **not** `box-shadow` — so a ring added via
   `shadow-[...]` pops in with a visible delay after the fill unless both
   are named explicitly: `transition-[background-color,box-shadow]`.

```tsx
// notificationSwitcherVariants (cva base)
"transition-[background-color,box-shadow]"

// hover state
"hover:bg-state-hover hover:shadow-[0_0_0_8px_var(--color-state-hover)]"
```

**Why:** The Figma hover variant for this component had its border bound to
the same near-transparent hover token as its fill (a Figma-side token
issue), so simply copying Figma's border/stroke output verbatim wasn't an
option — the fix had to be built up in code by testing each layer (outline
vs. box-shadow, color choice, transition timing) rather than transcribed.
Each intermediate attempt *looked* plausible (outline is semantically "the
outside-border property," white is a real token in this file, leaving
`transition-colors` alone is the path of least resistance) but was wrong in
a way that only showed up when actually interacting with the component in
Storybook, not from reading the diff.

**How to apply:** Reach for a `box-shadow` ring first for any future
"outside border," "ring," or "outline" hover/focus treatment in UCL. Verify
by actually hovering the component (not just reading the class list) for
flicker, color mismatch against its own fill, and timing lag between fill
and ring appearing.

---

## Gaps/margins/padding must match Figma's literal value — don't normalize to the nearest token (`src/components/cards/integration-card/integration-card.tsx`)

**Rule:** When a Figma spacing value (gap, margin, padding) doesn't match an
existing spacing token exactly, use the literal value as an arbitrary
Tailwind class (e.g. `gap-[2px]`) — do not round it up/down to the nearest
token-backed utility (`gap-2` = 8px) for the sake of "consistency" with a
different variant or a nearby value that *does* use a token. Every gap,
margin, and padding value must be pixel-accurate to what Figma actually
specifies for that exact node, checked independently per variant/state —
never inferred by pattern-matching against a sibling value.

**Why:** `IntegrationCard`'s title/description stack has a real,
Figma-authored discrepancy between its two variants: the `Default` variant's
gap is a raw `2px` (no token), while `Connected`'s equivalent gap is `8px`
(`spacing/2`). When this component was first built, the `2px` value was
normalized to `8px` to match `Connected` and avoid a non-token literal — a
reasonable-looking judgment call that was wrong: Figma's two variants are
not actually the same value, and "normalize to the nearest token" is not a
substitute for reading the exact number. The mistake shipped invisibly —
the component built, rendered, and looked plausible — until it was compared
pixel-for-pixel against Figma and corrected back to `gap-[2px]`.

**How to apply:**
- Pull the literal value from `get_design_context`/`get_variable_defs` for
  the **exact node** in question, not a visually-similar sibling or a
  different variant of the same component.
- If it matches an existing token's value, use that token's utility class.
- If it does not match any token, use the literal value as an arbitrary
  class (`gap-[2px]`, `pl-[13px]`, etc.) rather than rounding to the nearest
  token — a raw value that's honest about not being tokenized is correct;
  a token-backed value that's off by a few pixels is not, no matter how
  much cleaner it reads in the class list.
- If the same visual role has genuinely different raw values across
  variants/states in Figma (as with this component), preserve that
  difference in code rather than collapsing it to one shared value — unless
  you explicitly ask the user whether the discrepancy is intentional or a
  Figma authoring slip, and they confirm which one wins.
- This applies to every spacing value in every component and layout, not
  just this one file — re-check gaps/margins/padding with the same rigor
  used for color/typography tokens (see the token-mismatch guidance in
  [.claude/skills/ucl-generate-component/references/ucl-conventions.md](.claude/skills/ucl-generate-component/references/ucl-conventions.md)).

---

## Icon sizing must match Figma's defined instance size — don't derive a smaller "visible glyph" size (`src/components/primitives/add-indicator/add-indicator.tsx`)

**Rule:** When Figma defines an icon/instance at a given size (e.g. 24×24),
render it at that size. Don't reinterpret it by measuring a smaller shape
nested inside the instance (e.g. a vector inset a few px on each side) and
concluding the "real" visible size is smaller — that inset is often just how
the source asset was authored, not an instruction to shrink the rendered
icon.

**Why:** `AddIndicator`'s plus icon instance is defined at 24×24 in Figma,
but the vector shape inside that instance measures only 16×16 (a 4px inset
baked into the source asset). This was read as "the visible glyph is
actually 16px" and shipped at `size-4` — a plausible-sounding derivation that
was wrong. The user corrected it back to the instance's actual defined size,
`size-6` (24px), and pushed back on the underlying method: don't compute an
alternate number from inner geometry, use what Figma defines for the node
directly.

**How to apply:**
- Take the size directly from the Figma node in question (its own
  width/height from `get_metadata`/`get_design_context`), not from a child
  layer nested inside it.
- If a nested shape's measured size seems to disagree with the instance's
  own size, that's not license to substitute the smaller number — ask the
  user which one is intended rather than silently picking one.
- This is the same rigor as the gaps/margins/padding rule above, applied to
  icon/instance sizing: read the literal defined value, don't infer a
  "more correct" one from surrounding geometry.

---

## Auto-scroll bottom clearance: scroll fade + 400px (`src/layouts/new-listing/new-listing.tsx`)

**Rule:** Whenever a page scrolls content into view automatically (a
`TimeSlotAccordion` day opening or being added open, and any future
`scrollIntoView` on these pages), the revealed content must stop **400px
above the top of the bottom scroll fade** — not flush with the viewport edge
and not under the fade. On New Listing pages this is enforced once, in
`NewListingLayout`, as the document's scroll padding:

```ts
const SCROLL_FADE_HEIGHT = 96; // the fade's h-24
const AUTO_SCROLL_EXTRA = 400;
root.style.scrollPaddingBottom = `${SCROLL_FADE_HEIGHT + AUTO_SCROLL_EXTRA}px`;
```

The scrolled element's own `scroll-margin` (e.g. the accordion row's
`scroll-my-4`) adds on top, so a time-slot day lands ~512px above the
viewport bottom.

**Why:** The first auto-scroll stopped 16px above the viewport bottom, which
left a newly opened day's card under the 96px scroll fade ("Scroll not in
100% position", Provider Portal node 874:4947) — technically in view, but
read as still hidden behind the scroll. Clearing only the fade was then judged
too tight as well: the card should land with clear room below it, so it reads
as fully revealed with the rest of the form still in sight. 200px was tried
first and raised to 400px — don't tighten it back.

**How to apply:**
- Don't add per-component bottom offsets for this (a larger `scroll-mb-*` on a
  row, manual `window.scrollBy` math) — auto-scroll goes through
  `scrollIntoViewSmoothly` (`src/lib/motion/scroll.ts`), which reads the
  document's `scroll-padding` the same way native `scrollIntoView` does, so
  every auto-scroll on the page picks this up. Use that helper (not native
  `scrollIntoView({ behavior: "smooth" })`) for new auto-scrolls so they share
  the same eased timing.
- If the fade's height changes, update `SCROLL_FADE_HEIGHT` with it — the two
  must stay in sync.
- Scroll padding can't scroll past the end of the page: content near the very
  bottom (the last day row) gets as much clearance as the page has left below it.
- A new layout that adds the same fade and auto-scroll should set the same
  scroll padding while it's mounted (and restore the previous value on unmount).

---

## Composed components are black boxes to their parents — never reach into a nested component's internals (`src/components/cards/integration-card/integration-card.tsx`)

**Rule:** Once a component (e.g. `AddIndicator`) is inserted into a layout or
composed inside another component (e.g. `IntegrationCard`'s icon slot), the
parent must not modify, override, or reach into that component's internals —
no deep descendant selectors (`[&_svg]:size-12`) that happen to also match
elements nested inside a child component's own markup.

**Why:** `IntegrationCard`'s icon slot used `[&_svg]:size-12` to size a raw
`<img>`/`<svg>` logo mark passed directly into the `icon` prop. When
`AddIndicator` (which renders its own internal `Plus` icon) was placed in
that same slot, the same selector silently reached two levels deep and
resized `AddIndicator`'s internal icon too — overriding a child component's
own styling from the outside, invisibly. It built and rendered *something*
plausible, so nothing caught the collision short of a visual diff against
Figma.

**How to apply:**
- Scope parent styling to **direct children only** (`[&>svg]`, `[&>img]`)
  when the intent is to size whatever raw element is passed into a slot —
  never an unscoped descendant selector (`[&_svg]`) that can also match
  inside a composed child component.
- If a parent genuinely needs a composed child to render differently in a
  given context, add a prop/variant to the child component itself — don't
  reach through it with CSS from the parent.
- When adding any new component into an existing slot (a card's icon slot,
  a button's leading/trailing icon slot, etc.), check what selectors that
  slot's wrapper already applies and confirm they're scoped to direct
  children, not deep descendants, before assuming the slot is safe to reuse
  as-is.
