<!--
Created: Sep 05, 2026
Created by: Julio Caunedo
Last updated: Sep 27, 2026 (Implementation notes: one-word step naming convention + rationale)
Scope: the New Listing creation flow for providers.
Purpose: record the design rationale for keeping Experience/Service as the two primary listing-type paths and removing the redundant category step.
-->

# New Listing Flow

## Design rationale

Keep **Experience** and **Service** as the two primary paths when a provider creates a new listing.

The provider's onboarding selection answers _what kind of business they are_, while the New Listing choice answers _what type of offering they are creating_. These are related, but they should remain separate because the same business category can support both listing types.
See [onboarding-business.md](onboarding-business.md) for the business-category taxonomy set during onboarding.

Example:

- Boats & yacht charters → Experience: yacht charter, sunset cruise, sandbar trip
- Boats & yacht charters → Service: private captain, crew service, provisioning

### Remove the current Step 2

Eliminate the generic category step that asks "What are you offering?" with options such as:

- Yacht Charter
- Water Activities
- Tours
- Nightlife
- Food & Drink
- Wellness
- Events
- Other

ℹ️ This information is already established by the provider's business category during onboarding, so asking for it again creates redundant classification and unnecessary friction.

### Updated flow

New listing → choose Experience or Service → go directly into listing-specific details.

For example:

- Boats & yacht charters + Experience → "What type of boat/yacht are you listing?" → Motor yacht / Sailing yacht / Catamaran / etc.
- Boats & yacht charters + Service → "What service are you offering?" → Private captain / Crew service / Provisioning / etc.

See [taxonomy.md](taxonomy.md) for the full business-category × Experience/Service matrix backing this step.

### Product model

- **Business category** — defines the provider's business domain.
- **Experience / Service** — defines the listing model.
- **Listing subtype/details** — defines the specific offering.

The onboarding category should therefore inform and personalize the New Listing flow, but should not replace the Experience / Service choice.

## Implementation notes (for dev)

ℹ️ The New Listing screens exist as Storybook reference layouts in `@bethere-group/ucl` (not exported from the package — consuming apps re-implement the composition with their own routing and data). They were reorganized on Sep 27, 2026 into a single flow folder, mirroring how `account-settings/` groups its pages.

### Folder structure

```
bethere-ucl/src/layouts/new-listing/
  README.md                    structure + how to add a step
  new-listing.tsx              NewListingLayout — shared page frame for every step
  new-listing.stories.tsx      Layouts/NewListing/Shell
  new-listing-flow.stories.tsx Layouts/NewListing/Flow — all steps stitched into one wizard
  shared/                      helpers used by several steps (e.g. choice-chip-grid.tsx)
  steps/
    type/                      Experience or Service?
    category/                  listing subtype (yacht type, service type…)
    search/                    find the yacht, vehicle, venue… by brand/model/year
    matches/                   pick the matching result
    attributes/                facts about that yacht/vehicle/venue (specs, amenities, crew)
    expectations/              what guests get (durations, meeting point, destinations, tags, inclusions)
    availability/              days + time windows
```

Each step folder holds `<step>.tsx` (exports `<Name>Step` and `<Name>StepProps`) and `<step>.stories.tsx` (Storybook title `Layouts/NewListing/<Name>`).

### Shared shell

`NewListingLayout` is the New Listing counterpart of `AccountSettingsLayout`: it renders the stepper, the step title and description, the content column, and the footer, and each step passes only its own content as `children`. Frame options cover the variations between steps: `align` (`center` for short steps, `top` for long forms), `width` (640px default, 800px `wide`, or `full`), and `bodyClassName` for a step-specific title → content gap. Step props extend `NewListingStepProps` (`showStepper`, `steps`, `currentStep`, `stepLabel`, `onBack`, `onClose`, `className`).

ℹ️ In Storybook the New Listing group reads in wizard order (Flow, Shell, then each step), set in `.storybook/preview.ts` → `storySort`; every other section keeps its existing order.

### Naming convention

Each step is **one word naming what it collects**: `type`, `category`, `search`, `matches`, `attributes`, `expectations`, `availability`. The component is that word plus `Step` (`SearchStep`, `ExpectationsStep`…), with a matching `<Name>StepProps` type and a `Layouts/NewListing/<Name>` story.

**Design rationale:**

- **The folder carries the context.** Everything lives under `new-listing/steps/`, so prefixes like `listing-` or `asset-` repeat what the path already says. One word keeps names short and scannable.
- **Named for the job, not the listing.** A name never mentions one category ("yacht") or listing type ("experience"), so the same step serves Experience and Service paths and any kind of hosting asset (yacht, vehicle, venue). Category-specific copy (e.g. "Tell guests about your yacht") lives in each step's default props, not in file or component names.
- **Each name is distinct from the others.** "Details" was considered and rejected: attributes, expectations, and availability are all details, so it wouldn't tell steps apart, and this spec's yacht flow already uses "Listing Details" for the search step.

How each name was chosen:

| Step | Why this word |
| --- | --- |
| `type` | The listing type: Experience or Service. |
| `category` | The listing subtype (yacht type, service type…). |
| `search` | The provider searches for their yacht/vehicle/venue by brand, model, and year — a plain verb for what they do. |
| `matches` | They pick the right result from that search. |
| `attributes` | Facts about the yacht/vehicle/venue itself (specs, crew, amenities). Matches the spec's "Yacht Attributes" and the per-category "Vehicle/Facility Attributes" wording in [onboarding-master-flow.md](onboarding-master-flow.md). |
| `expectations` | Mirrors the screen's own question, "Tell guests what to expect," and the Figma frame name ("Experience Expectations"): durations, meeting point, destinations, tags, inclusions. |
| `availability` | The days and time windows guests can book. |

ℹ️ The Asset vs. Experience separation from [onboarding-master-flow.md](onboarding-master-flow.md) still holds: `search`, `matches`, and `attributes` describe the thing that hosts the listing, `expectations` describes the bookable offering, and `type`, `category`, and `availability` are shared by every path. The names just no longer spell that grouping out.

ℹ️ The `category` step is the listing-subtype question kept by this spec ("What type of boat/yacht are you listing?"), not the generic "What are you offering?" step removed above.

### Rename map

The steps were renamed twice on Sep 27, 2026: first into the flow folder with prefixed names (middle column), then to the one-word convention above.

| Original layout | Interim name | Current location | Component |
| --- | --- | --- | --- |
| `new-listing/` (step 1) | `listing-type` | `new-listing/steps/type/` | `TypeStep` |
| `experience-category-selector/` | `category` | `new-listing/steps/category/` | `CategoryStep` |
| `listing-details/` | `asset-lookup` | `new-listing/steps/search/` | `SearchStep` |
| `listing-details-matches/` | `asset-matches` | `new-listing/steps/matches/` | `MatchesStep` (data type `ListingMatch` → `Match`) |
| `listing-attributes/` (briefly `yacht-attributes/`) | `asset-attributes` | `new-listing/steps/attributes/` | `AttributesStep` |
| `experience-expectations/` | `offering-details` | `new-listing/steps/expectations/` | `ExpectationsStep` |
| `experience-availability/` | `availability` | `new-listing/steps/availability/` | `AvailabilityStep` |
| `shared/choice-chip-grid.tsx` | — | `new-listing/shared/choice-chip-grid.tsx` | `ChoiceChipGrid` |

⚠️ **Breaking:** old Storybook links (e.g. `layouts-listingattributes--default` or `layouts-newlisting-assetattributes--default`) no longer resolve; ids follow `layouts-newlisting-<step>--default` (e.g. `layouts-newlisting-attributes--default`).

### Adding a step

1. Pick one word for what the step collects (distinct from the existing steps) and create `steps/<word>/<word>.tsx` exporting `<Name>Step`, typed `NewListingStepProps & { … }`, rendering its content inside `<NewListingLayout title="…">`.
2. Add `<word>.stories.tsx` titled `Layouts/NewListing/<Name>`.
3. Wire it into `new-listing-flow.stories.tsx` (step number + `previous` step for the back arrow) and add it to the New Listing order in `.storybook/preview.ts`.

A Service path reuses the shared steps and adds any service-specific steps in the same `steps/` folder with the same one-word naming — no separate folder tree.

### Open items

- ✅ **Resolved (Sep 27, 2026):** the page frame all seven steps repeated now lives in the shared `NewListingLayout` shell; every step was measured before and after and renders pixel-identically.
- ⚠️ **Gap:** step content is still yacht-specific by default (headings, sections, sample data); only names and structure are generic so far.
- ⚠️ **Gap:** the Service path is undesigned beyond Step 1 — see [services/master-flow-services.md](services/master-flow-services.md).
