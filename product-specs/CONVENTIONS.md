<!--
Created: 2026-08-05
Prompt: "where it can be locally on the repo, that is not DESIGN.md file, in case I work in another computer?" —
Julio asked where the spec status-label convention (previously tracked only in Claude memory) should
live in the repo so it's available on any machine, not just via local Claude memory.
product-specs/CONVENTIONS.md
-->

# product-specs/ — Writing Conventions

Conventions for how spec docs in this folder are written. Not a product spec itself — no product content belongs here.

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

## Initial-prompt header

New documentation files in this folder should open with an HTML comment block recording the creation date and the prompt that triggered the file, in the format used at the top of this file.
