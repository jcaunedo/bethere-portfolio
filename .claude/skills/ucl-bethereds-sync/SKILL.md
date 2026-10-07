---
name: ucl-bethereds-sync
description: Sync the BeThere design system from Figma (bethere.ds) into the @bethere/ucl component library — design tokens into theme.css and components/typography into src/components. Trigger whenever the user shares a bethere.ds Figma URL, asks to import/update tokens, colors, typography, or a component (button, card, input, etc.) "from Figma", or to make UCL match the design system.
---

# Figma → UCL sync

Translate the BeThere design system in Figma into the `@bethere/ucl` library. This is a recurring task: pull tokens / text styles / component specs from the Figma file, then apply them to `theme.css` or the relevant component using UCL's conventions.

## Key facts

- **Figma file:** `bethere.ds`, fileKey **`ylt50hIBVdtKUmhWpI7Kfx`**. URLs look like `figma.com/design/ylt50hIBVdtKUmhWpI7Kfx/...?node-id=9-860` → nodeId `9:860`.
- **Target package:** `@bethere/ucl` at `bethere-ucl/` (relative to this workspace root).
- **Token file (ships to consumers):** `bethere-ucl/src/styles/theme.css` → copied raw to `dist/styles.css`.
- **Storybook entry CSS (internal only):** `bethere-ucl/src/styles/globals.css`.
- **Components:** shadcn primitives in `src/components/ui/`, custom in `src/components/<name>/`. Public API in `src/index.ts`.
- The Figma design system has **one mode** (light); there is no dark mode — don't invent dark tokens, mark any `.dark` block as a derived placeholder.

## Prerequisites

- **Load the `figma-use` skill before any `use_figma` call** (mandatory).
- Batch-load Figma MCP tool schemas in one `ToolSearch`: `select:use_figma,get_design_context,get_metadata,get_variable_defs`.
- `get_variable_defs` only returns variables **bound to a selected node** — it can't enumerate collections. To list all variables/text styles, use `use_figma` with the Plugin API (scripts below).

## Workflow

### A. Syncing tokens (colors, spacing, radius, typography scale)

1. Enumerate all local variable collections + variables, resolving alias chains to final hex/number. Cross-file aliases ("external") must be resolved separately by ID with `getVariableByIdAsync`. (Script: `references/enumerate-variables.js`.)
2. Map primitives → `:root` raw values; map semantic tokens → shadcn role names so existing components pick them up. See `references/theme-conventions.md`.
3. **Diff every single token against the current `theme.css` value — no sampling, no "looks about right."** Build a table (Figma name → resolved value → current CSS var → current value → match?) and go through it exhaustively, including tokens whose current value already looks plausible. A wrong-but-plausible value (wrong hue, wrong alpha, stale hex) is invisible unless it's actually compared. Specifically:
   - Compare the **raw RGBA object** at each alias hop, not a flattened hex string — an 8-digit hex can hide a hue mismatch behind a matching alpha, or vice versa (this is exactly how `--input-ring-outside` drifted: `#ff782c33` looked like a plausible alpha tint but was both the wrong hue and the wrong alpha vs. Figma's fully-opaque `sunset-100`).
   - For every token flagged `external: true` by the enumeration script, resolve it explicitly with `getVariableByIdAsync` in a follow-up `use_figma` call — never leave it un-resolved or guess its value.
   - Treat "current CSS value has no matching Figma variable at all" (e.g. `--primary-muted`, `--primary-subtle`) as its own reportable category — flag it to the user as "hand-authored, no Figma source" rather than silently skipping or silently "fixing" it.
   - Report the full diff table's outcome to the user (even if the answer is "N tokens checked, 1 drifted, 2 have no Figma source"), not just the deltas — so an all-clear is visibly a checked all-clear, not an assumed one.
4. Edit `theme.css` for every confirmed drift. Verify with `npm run build` in `bethere-ucl/` and grep `dist/styles.css`.

### B. Syncing a component (button, card, …)

1. `get_metadata` on the component frame to decode the variant matrix (Type × Size × Style × State from the symbol names).
2. `get_design_context` on a few **representative** nodes (default state of each style, plus one of each size) — not every variant. Use `excludeScreenshot: true` to save context.
3. Translate Figma's auto-layout output (negative margins, nested padding, `data-node-id`s) into clean shadcn-style `cva` variants using UCL tokens — do **not** copy the raw Figma classes. Conventions: `references/component-conventions.md`.
4. Update the component, its `.stories.tsx`, and `src/index.ts` exports together.

### C. Syncing typography

Typography lives in Figma **text styles**, not on a node. Enumerate with `getLocalTextStylesAsync` (script: `references/enumerate-text-styles.js`). The scale is size × weight (xs→7xl × regular/medium/semibold/bold/black); sizes ≤ lg use the body font, xl+ the headline/display font.

## Always verify

From `bethere-ucl/`:
- `npm run lint` (tsc --noEmit) — must pass; renaming cva variants/types breaks stories and `index.ts`, fix them in the same change.
- `npm run build` — must succeed; for token changes, grep `dist/styles.css` to confirm.

## Known gotchas

- **Font @import ordering:** `dist/styles.css` (theme.css) has the Google Fonts `@import` at the top and works for consumers. But `globals.css` imports Tailwind first, so the font `@import` must be duplicated as the **first line of globals.css** or Storybook ignores it.
- **`@theme inline` vs `@theme` for fonts:** font vars must be in a non-inline `@theme` block so `--font-sans` is emitted to `:root` and feeds the base font; `@theme inline` only inlines into utilities.
- **Color format:** the file uses hex (converted from Figma RGB); shadcn's default is `oklch`. Flag the inconsistency; don't silently mix unless asked.
- **Breaking changes:** renaming cva variant keys or exported types is breaking for other repos consuming `@bethere/ucl`. Call it out explicitly.
