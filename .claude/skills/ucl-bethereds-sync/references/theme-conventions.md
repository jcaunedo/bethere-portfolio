# theme.css conventions

`bethere-ucl/src/styles/theme.css` is a two-tier token file (shadcn + Tailwind v4) that ships raw to consumers as `dist/styles.css`.

## Structure (top to bottom)

1. `@import url(...Google Sans Flex...)` — **must be the first statement** (also duplicated as the first line of `globals.css` for Storybook).
2. `@custom-variant dark (&:is(.dark *));`
3. `@theme { --font-sans; --font-display; }` — **non-inline** so the vars are emitted to `:root` and drive the base font.
4. `@layer base { html { font-family: var(--font-sans); font-synthesis: none; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; font-optical-sizing: auto; } }`
5. `@theme inline { ... }` — maps Tailwind utilities to the `:root` vars (`--color-*: var(--*)`), so `.dark` overrides work. Also registers `--text-*` (with paired `--text-*--line-height`), `--font-weight-*`, `--radius-*`, and the primitive color ramps.
6. `:root { ... }` — **primitives first** (sunset / sand / neutral ramps, white/black) then **semantic** roles referencing them.
7. `.dark { ... }` — derived placeholder only (Figma has no dark mode).

## Mapping rules

- **Primitives** → `--<scale>-<step>` (e.g. `--sunset-500: #f26740`).
- **Semantic** → shadcn role names so components work unchanged: `--background`, `--foreground`, `--primary`/`--primary-foreground`, `--secondary`, `--muted`/`--muted-foreground`, `--accent`, `--destructive`(+`-foreground`,`-subtle`), `--border`, `--input`, `--ring`, `--card`, `--popover`, sidebar-*.
- Brand ramp (`--color-brand-*`) is an alias of sunset for back-compat.
- Spacing intentionally inherits Tailwind's default 4px scale (the DS scale is identical) — don't redefine it.

## Known DS values (from bethere.ds, single light mode)

- sunset 500 `#f26740` (brand/primary), coastal `#66bdb4` (secondary).
- sand: bg `#f9f8f5` (50) … fg `#3a3428` (900).
- neutral: border `#dfe2e7` (200), muted-fg `#686f7d` (500).
- destructive `#e43232`, destructive-subtle (solid light-pink fill) `#ffe9e9`, destructive-soft (5% alpha tint, formerly named "subtle") `#e432320d`.
- alerts: success `#01a746`, warning `#e07400`, info `#0072ca`, danger `#e22323`.
- radius: button-xs 8, sm/md/lg/xl 12 (Figma updated sm from 10→12); base 8 / card 12 / modal 24; badge full scale also present; popover 12 (added 2026-07-15, aliases radius-xl like input/menu); pill corrected 2026-08-04 from a stale 8px alias to radius-lg → now aliases radius-full (Figma value 9999, fully round), not currently consumed by any component.
- `color/input/ring-outside` resolves through its alias chain to `sunset-100` (`#f9e3d7`, **fully opaque**) — corrected 2026-07-15 from a stale hand-authored `#ff782c33` (wrong hue + ~20% alpha) that didn't match any Figma value. Not currently consumed by any component. When resolving alias chains, always check the *raw* color object (r/g/b/a) at each hop, not just a flattened hex string — an alpha-looking value can hide a hue mismatch too. Figma variable was later renamed `color/input/ring-focus-outside` (same value, name only) — re-verified 2026-07-15.
- emphasis role (coastal-based; Figma renamed this from `highlight` → `emphasis`, same value) and tone-accent role (sand-500-based, distinct from shadcn's --accent) were added to match Figma's `color/tone/*` semantic naming — see `color/tone/*` in the semantic collection.
- `--primary-subtle` corrected 2026-07-15 from a stale hand-authored `#ff642c1a` (wrong hue, alpha-tint construction) to `var(--sunset-50)` (`#fceee8`, fully opaque), matching Figma's `color/tone/brand/subtle` exactly.
- `--secondary-subtle` remains hand-authored with **no matching Figma variable** (no `color/tone/secondary/*` group exists in Figma).
- `--primary-muted` corrected 2026-08-01: Figma added `color/tone/brand/muted` (`#f9e3d7`, = `sunset-100`, fully opaque) since the 2026-07-15 sync, when it had no source. Rebound from the stale hand-authored `#ff642c26` (wrong hue + alpha) to `var(--sunset-100)`. Not consumed by any component at time of change, so no visual impact.
- `--input-ring` corrected 2026-08-01 from a stale `var(--neutral-400)` (`#9aa1ac`). Initially matched to `var(--neutral-200)` (`#dfe2e7`, same as `--border`/`--input` — a same-value hover-border no-op), then the user updated the Figma variable itself to `neutral-300` (`#c6cbd2`, distinct from `--border`) same day — re-synced to `var(--neutral-300)`. Also found and fixed: 6 components (`Input`, `DatePicker`, `Textarea`, `PaymentMethod`, `Combobox`, `Select`) were hardcoding `hover:border-neutral-400` directly rather than consuming `--input-ring` at all — switched to `hover:border-input-ring` so the token actually reaches the rendered hover state.
- Figma's semantic collection also has `color/tone/neutral/{neutral,subtle,muted}` and `color/states/active-alt` (added ~2026-07) — all are value-duplicates of existing tokens (`--muted-foreground`/`--fill-subtle`/`--fill-muted`/`--state-active` respectively). Per user decision 2026-07-15, these are intentionally NOT mirrored as new CSS vars — don't add them on a future sync unless asked.

## Naming semantics: accent vs. emphasis (vs. shadcn's own `accent`)

- **`accent`** (`--tone-accent`, sand-500-based) = an **alternate brand color** / secondary expression — a second brand-adjacent hue for variety, not for drawing attention. Distinct from shadcn's own `--accent`, which is an unrelated neutral hover/selected-surface color.
- **`emphasis`** (`--emphasis`, coastal-based; Figma's `color/tone/emphasis/*`, renamed from `color/tone/highlight/*` — same coastal value, name only) = an **attention color** — used for highlight moments, i.e. drawing the eye to something specific. Not to be confused with `--state-highlight`, an unrelated interaction-state overlay tint that Figma did not rename.

> Colors are stored as **hex** (converted from Figma RGB). shadcn's default format is `oklch` — flag the inconsistency if asked, don't silently mix.
