<!--
Created: Aug 05, 2026
Created by: Julio Caunedo
Last updated: Aug 09, 2026

Scope: Writing rules for every spec doc under product-specs/ — not a product spec itself, and no
product content belongs here.

Purpose: Keep spec docs consistent and scannable across the whole folder, regardless of which spec
or which session wrote them, by defining shared conventions once instead of re-deriving them per file.
-->

# product-specs/ — Conventions

Writing conventions for every spec doc under `product-specs/`. Not a product spec itself — no product content belongs here.

## Status labels

Every inline prose note that flags a gap, risk, decision, confirmation, or fix gets an emoji **plus a bold word label** naming what kind of note it is. The label goes immediately after the emoji, before the explanation.

- ⚠️ for anything unresolved, misaligned, or needing attention — paired with a bold label naming the specific kind of issue: `**Gap:**`, `**Constraint:**`, `**Risk:**`, `**Decision needed:**`, `**Accessibility:**`, or another word that accurately describes the note. Don't default to "Gap" if a more specific word fits better.
- ✅ for anything verified resolved, confirmed, or matching — paired with a bold label naming what was resolved: `**Resolved:**`, `**Confirmed in Figma:**`, `**Copy fix:**`, or similar.
- ℹ️ for purely informative or framing notes — context, scope clarification, "here's why this note exists" — with **no bold label**. If it's not actually flagging a problem or a fix, it isn't ⚠️ or ✅.

Examples:

> ⚠️ **Gap:** exact thresholds and weighting are not yet defined — see Open Questions.
>
> ✅ **Confirmed in Figma (2026-08-05):** the performance scale renders left-to-right as At Risk → Off Track → On Track.
>
> ℹ️ Note: the desktop and mobile widget orders intentionally differ per the source design notes.

**Where this applies:** inline prose notes (sentences/paragraphs within a section). Not needed on already-scannable bulleted lists where every line starts with the same emoji (e.g. a "Key Decisions" or "Open Questions" list) — the list structure itself already provides the scan pattern.

**Why:** specs need to be scannable for status at a glance. The emoji alone isn't enough — the word names the status so a reader isn't relying on color/icon recognition alone, and isn't misled into treating framing text as an open risk (or vice versa).

## Creation header

New documentation files in this folder should open with an HTML comment block recording the creation date, who created it, and the last-updated date — no prompt/source quote. Update `Last updated:` whenever the file's content changes:

```html
<!--
Created: Aug 09, 2026
Created by: Julio Caunedo
Last updated: Aug 09, 2026

Scope: one or two lines on which spec doc(s) this file governs.

Purpose: one or two lines on why the file exists.
-->
```

This file's own header (above) follows this exact pattern — use it as the reference example.
