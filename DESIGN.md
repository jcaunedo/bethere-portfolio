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
