# New Listing flow

Reference layouts for the provider's **New Listing** wizard, organized like `account-settings/`
(one folder per screen, grouped under the flow). Product rationale: `product-specs/new-listing-flow.md`
and `product-specs/onboarding-master-flow.md`.

```
new-listing/
  new-listing.tsx              NewListingLayout — the page frame every step renders inside
  new-listing.stories.tsx      Layouts/NewListing/Shell
  new-listing-flow.stories.tsx Layouts/NewListing/Flow — the steps stitched into one flow
  shared/                      helpers used by several steps (not exported from the package)
    choice-chip-grid.tsx
  steps/                       one folder per step: <step>.tsx + <step>.stories.tsx
    type/                      Experience or Service?
    category/                  what kind (yacht type, service type…)
    search/                    find the yacht, vehicle, venue… by brand/model/year
    matches/                   pick the matching result (+ sample-matches.ts)
    attributes/                facts about that yacht/vehicle/venue itself (specs, amenities, crew)
    expectations/              what guests get: durations, meeting point, destinations, tags, inclusions
    availability/              days + time windows
    pricing/                   rates per duration, by-day/holiday/seasonal pricing, add-on services
    photos/                    listing photos: upload, cover, reorder (+ sample-photos.ts)
    business/                  confirm (one) or pick (several) the business that owns the listing (+ sample-businesses.tsx)
    policies/                  age, rescheduling, cancellation, weather; what's not allowed; safety requirements
    documents/                 insurance, captain licenses, vessel registration (document cards + add links)
    review/                    title + description (AI-suggested), preview/publish, summary of every step
```

## The shell

`NewListingLayout` (the counterpart of `AccountSettingsLayout`) owns everything steps share: the
background, Stepper Experience header, the step's title and description, the content column, and the
footer. A step passes its content as `children`, plus a few frame options:

- `align`: `"center"` for short steps (body centered between stepper and footer) or `"top"` for long forms.
  Either way, content stays at least 48px below the stepper header (short screens, expanded content,
  or a flow that renders one shared stepper above the steps).
- `width`: `"default"` 640px, `"wide"` 800px, or `"full"`.
- `bodyClassName`: a step-specific title → content gap when Figma differs from the 32px default.

The header (`NewListingHeader`) is sticky: it stays pinned to the top while long steps scroll under
it. A flow that renders one persistent stepper above the steps uses `NewListingHeader` too, so it
sticks the same way.

Every step's props extend `NewListingStepProps` (`showStepper`, `steps`, `currentStep`, `stepLabel`,
`onBack`, `onClose`, `className`, `onSaveDraft`) and forward them to the shell.

**Save as draft.** Every step with a Continue ends with `StepActions` (`shared/step-actions.tsx`):
"Save as draft" (outline) beside Continue, equal width (Figma node 106:2827). It calls the step's
`onSaveDraft` and confirms with a toast (needs the app's `<Toaster />`); it stays enabled while
Continue is disabled. Review has its own: "Save as draft" replaces Publish while something required
is missing, and its `onSaveDraft` also receives the title and description. Stories wire
`shared/save-draft-sample.tsx` (a simulated save + the toast host).

**Editing from Review.** A step opened from a Review card gets `reviewEdit`: its row becomes
"Back to review" + "Save and review" (disabled until something changes). Once something changes,
"Back to review" becomes "Discard changes", which resets the step in place. The flow snapshots
the answers when the card is clicked to tell what changed and to restore them on discard (re-keying
the step so its fields reset) — see product-specs/new-listing-flow.md.

Storybook lists the group in wizard order (Flow, Shell, then the steps); that order lives in
`.storybook/preview.ts` → `storySort`.

## Naming

Each step is **one word naming what it collects**: `type`, `category`, `search`, `matches`,
`attributes`, `expectations`, `availability`, `pricing`, `photos`, `business`, `policies`, `documents`, `review`. The `new-listing/steps/` path already supplies the
context, so names stay short and never mention one category (yacht) or listing type (experience) —
the same step serves experiences and services, yachts and venues.

Each step exports `<Name>Step` (e.g. `SearchStep`) with a `<Name>StepProps` type, and has a
`Layouts/NewListing/<Name>` story. Category-specific copy (e.g. "Tell guests about your yacht")
lives in the step's defaults/props, not in its file or component name.

## Adding a step

1. Pick one word for what the step collects and create `steps/<word>/<word>.tsx` exporting `<Name>Step`, typed
   `NewListingStepProps & { … }`, that renders its content inside
   `<NewListingLayout title="…" {...frame}>`.
2. Add `<word>.stories.tsx` titled `Layouts/NewListing/<Name>`.
3. Wire it into the flow in `new-listing-flow.stories.tsx` (step number + `previous`), and add its
   name to the New Listing order in `.storybook/preview.ts`.

A Service path (undesigned today) reuses the shared steps and adds any service-specific steps
here with the same one-word naming — no separate folder tree needed.

## AI copy (prototype)

Review's AI marks improve the title or description with Claude. The step only takes an async
`onImprove(request) → Promise<string>`; the stories pass `shared/improve-with-claude.ts`, which calls
`POST /api/improve`. One handler, `server/improve-copy.ts`, serves that route in both places, and the
Anthropic key stays on the server:

- **Local** — the Storybook dev server (`.storybook/improve-copy.ts`). Copy `.env.example` to
  `.env.local`, set `ANTHROPIC_API_KEY` (or run `ant auth login`), then restart `npm run storybook`.
- **Netlify** — a Netlify Function (`netlify/functions/improve.ts`). Add `ANTHROPIC_API_KEY` under
  Site configuration → Environment variables, then redeploy.

`ANTHROPIC_MODEL` optionally overrides the model (default `claude-opus-5-5`). The deployed endpoint is
public, so it only accepts same-origin browser requests and caps request and output sizes; use a key
with a spending limit.
