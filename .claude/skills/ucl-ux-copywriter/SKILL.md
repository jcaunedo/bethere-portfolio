---
name: ucl-ux-copywriter
description: Improve, create, audit, or standardize UX copy for Bethere, its curated guest marketplace, provider portal, and internal operations tools. Use for screen titles, descriptions, CTAs, forms, helper text, onboarding, empty states, errors, warnings, success messages, verification, pricing, policies, publishing, booking flows, AI-assisted drafts, and guest-facing experience listings. Apply Bethere's audience-specific voice for guests, providers, and internal operators without requiring a separate UX-writing skill.
---

# UX Write Bethere

Create clear, warm, actionable product copy for Bethere. Keep the experience premium and hospitality-led without becoming formal, vague, or overhyped.

## Workflow

1. Identify the audience: guest, provider, or internal operator.
2. Identify the user's current task, required action, and likely next step.
3. Inspect the surrounding UI context before rewriting. Preserve accurate product behavior and constraints.
4. Apply the relevant voice, terminology, component pattern, and state guidance from [references/copy-guide.md](references/copy-guide.md).
5. Prefer outcome language over system language. Name the next meaningful action in CTAs.
6. Check that the copy explains what matters now without front-loading every detail.
7. Flag product ambiguity instead of inventing requirements, guarantees, policies, or capabilities.

## Priorities

Use this order when principles compete:

1. Accuracy and safety
2. Clarity
3. User confidence and control
4. Actionability
5. Brevity and scanability
6. Warmth and personality

Never make compliance, payment, safety, legal, error, or document requirements playful. Never use aspirational language to hide conditions or consequences.

## Audience Calibration

- **Guest:** Warm, inviting, polished, lightly emotional, and grounded in specific details. Make the experience feel worth booking without unsupported claims.
- **Provider:** Guided, practical, friendly, reassuring, and business-focused. Reduce setup effort and show what guests need.
- **Internal operator:** Direct, precise, neutral, consistent, and audit-friendly. Favor status and decision clarity over personality.

If the audience is unclear, infer it from the workflow and briefly state the assumption when it materially affects the recommendation.

## Writing Rules

- Be clear before being charming.
- Describe the outcome, not the implementation or generic form action.
- Use specific CTAs such as `Set pricing`, `Upload documents`, or `Publish experience` instead of `Continue`, `Submit`, or `Next` when the destination is known.
- Keep labels short in dense forms; use question-style labels in guided flows.
- Use helper text only to prevent confusion, clarify visibility, explain a requirement, or improve content quality.
- Distinguish `Saved`, `Ready to review`, `Ready to publish`, `Published`, `Needs attention`, and `Missing required details`.
- Keep providers in control of suggested or generated content with language such as `Review`, `Edit`, `Preview`, and `Save`.
- Do not expose technical implementation terms unless writing for an internal technical audience.
- Use contractions naturally. Use sentence case. Avoid exclamation marks unless a genuinely celebratory guest-facing moment earns one.

## Listing Copy

For guest-facing experience descriptions:

1. Open with the specific value or moment.
2. Add concrete setting, activity, amenity, or flow details.
3. Set a clear expectation of what guests can enjoy or what is included.

Keep claims supportable. Avoid generic travel language and repeated words such as `luxury`, `exclusive`, `magical`, `world-class`, and `unforgettable`.

## State Copy

- **Empty state:** Say what is missing, why it matters, and what to do next.
- **Error:** Name the issue and recovery path without blame.
- **Success:** Confirm exactly what changed and, when useful, who can now see it.
- **Warning:** State the consequence before the action when risk or loss is meaningful.
- **AI-assisted draft:** Make the draft editable and provider-owned; mention AI only when transparency requires it.

## Response Format

Match the response to the scope of the request.

For a full screen review, provide:

```markdown
## Recommendation
[Main UX issue or opportunity]

## Suggested copy
Title: ...
Description: ...
Primary CTA: ...
Secondary CTA: ...

## Why this works
[Concise rationale]

## Optional alternatives
- ...
```

Include only applicable fields. Add state-specific copy when relevant.

For a small request such as one CTA, label, error, or sentence, return the recommended copy first and one concise rationale. Do not force the full template.

When reviewing multiple strings, use a compact before/after table if it improves scanning. Preserve placeholders, variables, character limits, and localization constraints supplied by the user.

## Final Check

Before responding, verify:

- The user knows where they are, what to do, why it matters, and what happens next.
- Required and optional details are distinguishable.
- The CTA names a real outcome.
- The tone fits the audience and risk level.
- The copy does not promise approval, availability, safety, quality, or booking outcomes without support.
- Terminology is consistent with Bethere.
- The recommendation is concise enough for the component.
