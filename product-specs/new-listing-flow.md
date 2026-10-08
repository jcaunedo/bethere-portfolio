<!--
Created: Sep 05, 2026
Created by: Julio Caunedo
Last updated: Oct 07, 2026 (layouts moved under src/layouts/provider-portal/; Review step: page, summary cards, publish vs. save as draft; captains in the Documents card; optional sections hidden when empty, required ones always shown; general card before its parts; pricing cards per section; editing from Review ("Save and review" / "Back to review"); code-only summary-card states accepted; Multiple card has no resting shadow; every step's answers on Review — Destinations, Experience types, What's included, Business)
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

### Draft & submission

A provider can leave the Photos step without the minimum of 5 photos by choosing **Skip for now**. The flow continues to the next step, and the listing is saved as a **draft**.

- A draft listing can't be submitted for approval until it has at least 5 photos **and** every other required item in the flow is complete.
- Photos added before skipping (1–4) are kept on the draft.
- "Skip for now" appears in the empty drop zone and, while fewer than 5 photos are uploaded, under the disabled Continue button.

⚠️ **Decision needed:** where the provider sees what's missing from a draft, and how they return to finish it (e.g. from the listings list), is not designed yet.

⚠️ **Gap:** "Skip for now" under the disabled Continue (1–4 photos) has no Figma frame yet; the reference layout places it 16px below Continue. Figma only shows Skip in the empty state (node 103:2266).

### Policies step

Figma: Provider Portal "12. Policies" (node 109:3517). Age requirements, rescheduling notice, cancellation policy and weather policy are single-choice, each with a summary of the picked option underneath. "What's not allowed" and "Safety requirements" are multi-select. "What's not allowed" lists what guests can't do: a selected tile is a restriction (it replaced "What's allowed", where a selected tile was a permission).

ℹ️ Where the frame's buttons and the Figma annotations disagree, the reference layout follows the buttons: Rescheduling notice offers "Not allowed" (annotation: "7 days"), and Weather policy offers "Host review" (annotation: "Reschedule or refund", marked as the recommended default).

⚠️ **Copy needed:** these summaries are draft copy (written to BeThere's provider voice), with no Figma or annotation source yet:

| Section | Option | Draft summary |
| --- | --- | --- |
| Age requirements | All Ages | Guests of any age can participate. |
| Age requirements | 18+ | Only guests 18 and older can participate. |
| Age requirements | 21+ | Only guests 21 and older can participate. |
| Rescheduling notice | 12 hours / 24 hours | Change requests will be accepted until 12 / 24 hours before the scheduled start time. |
| Rescheduling notice | Not allowed | Guests can't request changes once their booking is confirmed. |
| Weather policy | Host review | You'll review each case and offer guests a new date or a refund. |
| Cancellation policy | Custom | Terms field — label "Cancellation terms", placeholder "Explain when guests can cancel and what refund they'll get." |

⚠️ **Gap:** "Custom" cancellation has no design for where the provider writes their terms; the reference layout shows a textarea under the options.

⚠️ **Decision needed:** the Flexible cancellation summary promises "Free rescheduling when available" even when Rescheduling notice is set to "Not allowed". Decide which setting wins, or hide the conflicting line.

### Review step

Figma: Provider Portal "14. Review & Publish" (node 160:6093). The last step: the provider writes the listing's title and description, checks a summary of every earlier step, and publishes — or saves a draft while something required is still missing.

The page, top to bottom:

1. **Tell the story of your experience** (or "service"): Title and Description (600-character limit), both required to publish.
2. **Preview** (secondary) and the main action — **Publish**, or **Save as draft** while something is missing (see below) — then the agreement line linking the experiences terms.
3. **Summary:** cards summarizing what the provider entered in the earlier steps (see "Summary cards" — some steps get several cards, a few get none), each with a pencil that goes back to its step (see "Editing from Review").

**AI copy.** Each field has an AI mark beside its label that rewrites the field from the listing's details (every summary card). Each result is kept as a version; "2/3" beside the label switches between them, and edits apply to the version shown. The field is read-only while the AI writes.

ℹ️ The step can also write both fields with AI as soon as it opens (`autoGenerate`). It's off for now: the step starts from the provider's text (the Figma copy in Storybook).

#### Publish or save as draft

- **Publish** needs every summary card complete (no "Required") and a title and description.
- While anything is missing, the main button reads **Save as draft** and stays enabled, with an info hint underneath (`AlertInline`, info): "Complete required sections below to publish, or save as draft."
- Saving confirms with a toast: "Saved as a draft. You can finish it anytime." (or the error if saving fails).
- Once nothing is missing, the button switches back to Publish (a short crossfade) and the hint goes away.
- The main button is briefly disabled while the AI is writing the title or description, and while a draft is saving (so it can't be submitted twice).
- Every other step with a Continue also offers **Save as draft** beside it (Figma "11. Verify Business - Single", node 106:2827), enabled even while Continue is disabled.

#### Editing from Review

Clicking a summary card (anywhere on it — the pencil's hit area covers the card) opens the step it summarizes, in **edit mode**. The step's actions row changes:

| State | Secondary button | Main button |
| --- | --- | --- |
| Nothing changed yet | **Back to review** — returns to Review | **Save and review**, disabled |
| Something changed | **Discard changes** — puts the step back as it was, **staying on it** (toast: "Changes discarded"); the button turns back into "Back to review" | **Save and review** — returns to Review with the change applied |

Leaving without saving is two clicks — "Discard changes", then "Back to review" — so the provider sees the step reset before they go, and an edit is never thrown away by surprise.

- "Save as draft" isn't offered in edit mode; it's on Review itself.
- "Changed" means the answers differ from when the step was opened from Review; undoing an edit back to how it was counts as unchanged again.
- The step's own rules for its main button still apply on top (e.g. Availability needs every selected day to have hours).
- **Business** is the exception: its confirmation stays inside the step until its main button, so changes aren't tracked there — "Save and review" follows the step's own rule (a business confirmed or picked), and the secondary button is always "Back to review".
- Photos' "Skip for now" also returns to Review.
- Stepping back with the header's back arrow leaves edit mode, keeping the edits: the wizard walks back one step and its main button reads Continue again.

**Why "Save and review" / "Back to review":** "Continue" promised the next step but went back to Review. "Save" alone would sit beside "Save as draft" and blur which one keeps the edit; "Done" doesn't say where it leads. "Cancel" was rejected for the secondary button: in a wizard it reads as abandoning the whole new listing, not just this edit. The secondary button always names what it does — "Back to review" when there's nothing to lose, "Discard changes" when there is — so no confirmation dialog is needed, and the disabled main button (nothing to save yet) makes clear which button keeps a change.

✅ **Resolved (Oct 07, 2026):** in edit mode, "Save as draft" gives way to "Back to review", which becomes "Discard changes" once something changes (resetting the step in place, no dialog); "Save and review" is disabled until something changes.

⚠️ **Gap:** the header's back arrow doesn't return to Review in edit mode; it steps back one screen in the wizard.

#### Summary cards

Each card is a `SummaryCard` (bethere.ds `summary-card`, node 928:4099): a 64px icon tile (or a photo), an uppercase eyebrow naming the step or section, the answer, and a detail line that wraps. The whole card is clickable to edit; hover adds a shadow and darkens the pencil. A card that's missing something required gets a destructive stroke and a "Required" pill, and blocks Publish.

**Only what was set is shown — unless it's required.** An **optional** section with nothing selected doesn't appear at all — no "Not offered" or "None" placeholders:

- **Destinations**, **Experience types** and **What's included** (Expectations step) — a card only when something is set.
- **Add-on Services** — only when switched on with at least one service.
- **Holiday pricing** and **each season** — only when switched on with a % or a custom rate (otherwise base rates apply, covered by the Pricing card).
- **Policies: what's not allowed** and **safety requirements** — an entry only when something is picked.

A section **required to publish** is always shown, even when empty: it's how the provider learns what's missing. Its card says what's missing (e.g. "No photos yet", "No documents yet"), shows "Required", and its pencil leads back to the step. This applies to **Yacht, Duration, Location, Availability, Pricing, Photos, Business and Documents** — see "Required when" below.

Cards follow the wizard order. **Within a step, the general card comes first, then the cards for its parts** — e.g. Pricing (base rates) before Holiday pricing, the seasons and Add-on Services:

| Card | Answer · detail | Required when |
| --- | --- | --- |
| Yacht | Name · match; specs (length, guests, cabins, bathrooms) | Name or any spec is missing |
| Duration | The durations offered | No duration |
| Location | Boarding location; address · extra info | Name or address is missing |
| Destinations | "3 destinations"; the places, in the provider's order. Not shown when none are set | — |
| Experience types | "5 experience types"; the types picked. Not shown when none are picked | — |
| What's included | "8 included"; the inclusions picked. Not shown when none are picked | — |
| Availability | The days; time slots, earliest to latest | No days, or a day without a complete time window ("Add time slots for Thu") |
| Pricing | Starting hourly rate; package range, plus by-day rates when set ("Sat, Sun +20%") | No rates |
| Holiday pricing | Holiday rates, with the adjustment as a badge ("+20%", or "Custom") | — |
| {Season} pricing | One card per season, e.g. "Summer pricing": that season's rates, with its badge | — |
| Add-on Services | "6 available"; the services. Not shown when none are offered | — |
| Photos | Photo count, with the cover photo as the tile | Fewer than 5 ("Add at least 5 to publish") |
| Business | The business confirmed on the Business step; address · EIN / Tax ID | Not confirmed yet ("No business confirmed") |
| Policies | One entry per section — see below | Custom cancellation without terms |
| Documents | Document count; the types, with the captain licenses naming their captains ("Commercial insurance · 2 captain licenses (Frank Smith, Cody Fisher) · Vessel registration") | Missing any of commercial insurance, captain license, vessel registration |

- **Yacht** stays a simple card: name · match and the core specs. Captain/crew, on-board features, water toys and accessibility aren't summarized — they describe the listing, which the listing preview shows.
- **Pricing** gets a card per section — see "Pricing: one card per section" below.
- **Policies** is one card with an entry per section, in the step's order (the card's Multiple variant): the age requirement, rescheduling notice, cancellation policy and weather policy always; what's not allowed ("2 things not allowed") and safety requirements ("3 safety requirements") only when something is picked. Each entry shows the answer with the option's own summary (or the picks) underneath; a Custom cancellation shows the provider's terms.

#### Pricing: one card per section

The Pricing step doesn't collapse into a single summary card. Each of its sections that's set gets **its own card**, in the step's order, so the provider can check every rate they'll charge at a glance. Every pricing card's pencil leads back to the Pricing step.

| Card (eyebrow) | Answer | Detail | Badge | Shown when |
| --- | --- | --- | --- | --- |
| Pricing | Starting hourly rate ("Starting at $200/hr") | Package range ("Packages from $400 – $1,600"), plus by-day rates when set ("Sat, Sun +20%, 1 custom rate") | — | Always (Required when there are no rates) |
| Holiday pricing | Starting hourly rate at holiday rates | Package range at holiday rates | The holiday adjustment ("+20%") | Holiday pricing is on, with a % or a custom rate |
| {Season} pricing, e.g. "Summer pricing" | Starting hourly rate at that season's rates | Package range at that season's rates | The season's adjustment ("+15%") | Seasonal pricing is on, and that season is named and has a % or a custom rate |
| Add-on Services | "6 available" | The services ("Bartender · Catering · …") | — | Add-on services are on, with at least one service |

- **One format for every rate card.** Pricing, Holiday pricing and each season read the same way — the lowest hourly rate as the answer, the package range underneath — so they compare line by line. Holiday and seasons are labeled "{name} pricing" and carry the same dollar icon as Pricing.
- **How holiday and season rates are worked out.** For each included duration: the custom rate the provider typed, if any; otherwise the base rate adjusted by the section's % (rounded to the dollar). "Starting at" is the lowest hourly rate among them (the lowest price when no duration is in hours).
- **The badge** shows the section's adjustment, as on the Pricing step's season cards: the % ("+15%", "-10%"), or **"Custom"** when the % is 0 but some durations have custom rates.
- **By-day rates** aren't a card of their own: they belong to the base rates, so they're added to the Pricing card's detail — and only when the listing runs on two or more days (the option isn't offered otherwise).
- **Order — same as the Pricing step page.** The cards follow the page's sections top to bottom: Charter rates (the Pricing card), Holiday pricing, Seasonal pricing (each season in the order it's listed on the page), Add-on services. If the page's sections are reordered or a section is added, Review follows.

ℹ️ Type, Category, Search and Matches have no card of their own: the picked match shows in the Yacht card's first line ("Little Atocha · Azimut 55 Fly (2021)"), and the listing type only changes Review's own wording ("Tell the story of your experience" / "service"). The yacht type picked on Category isn't shown on Review by design: the provider sees it in the listing preview.

✅ **Resolved (Oct 07, 2026):** the `summary-card` component in Figma has Default, Hover and Multiple only; Required, the badge and the photo tile living in code only (not in the Figma set) is accepted as is.

✅ **Resolved (Oct 07, 2026):** captains have no card of their own; the Documents card names them with their licenses (a missing captain license already makes Documents Required).

✅ **Confirmed (Oct 07, 2026):** a Multiple card has no shadow at rest, like Default; the shadow is the hover state only. (The Multiple variant in Figma shows the hover shadow at rest — the code follows this decision, not the frame.)

## Implementation notes (for dev)

ℹ️ The New Listing screens exist as Storybook reference layouts in `@bethere-group/ucl` (not exported from the package — consuming apps re-implement the composition with their own routing and data). They were reorganized on Sep 27, 2026 into a single flow folder, mirroring how `account-settings/` groups its pages.

### Folder structure

```
bethere-ucl/src/layouts/provider-portal/new-listing/
  README.md                    structure + how to add a step
  new-listing.tsx              NewListingLayout — shared page frame for every step
  new-listing.stories.tsx      Layouts/ProviderPortal/NewListing/Shell
  new-listing-flow.stories.tsx Layouts/ProviderPortal/NewListing/Flow — all steps stitched into one wizard
  shared/                      helpers used by several steps (e.g. choice-chip-grid.tsx)
  steps/
    type/                      Experience or Service?
    category/                  listing subtype (yacht type, service type…)
    search/                    find the yacht, vehicle, venue… by brand/model/year
    matches/                   pick the matching result
    attributes/                facts about that yacht/vehicle/venue (specs, amenities, crew)
    expectations/              what guests get (durations, meeting point, destinations, tags, inclusions)
    availability/              days + time windows
    pricing/                   rates per duration, by-day/holiday/seasonal pricing, add-on services
```

Each step folder holds `<step>.tsx` (exports `<Name>Step` and `<Name>StepProps`) and `<step>.stories.tsx` (Storybook title `Layouts/ProviderPortal/NewListing/<Name>`).

### Shared shell

`NewListingLayout` is the New Listing counterpart of `AccountSettingsLayout`: it renders the stepper, the step title and description, the content column, and the footer, and each step passes only its own content as `children`. Frame options cover the variations between steps: `align` (`center` for short steps, `top` for long forms) — in both, step content stays at least 48px below the stepper header, `width` (640px default, 800px `wide`, or `full`), and `bodyClassName` for a step-specific title → content gap. Step props extend `NewListingStepProps` (`showStepper`, `steps`, `currentStep`, `stepLabel`, `onBack`, `onClose`, `className`).

ℹ️ In Storybook the New Listing group reads in wizard order (Flow, Shell, then each step), set in `.storybook/preview.ts` → `storySort`; every other section keeps its existing order.

### Naming convention

Each step is **one word naming what it collects**: `type`, `category`, `search`, `matches`, `attributes`, `expectations`, `availability`, `pricing`. The component is that word plus `Step` (`SearchStep`, `ExpectationsStep`…), with a matching `<Name>StepProps` type and a `Layouts/ProviderPortal/NewListing/<Name>` story.

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
| `pricing` | The rates: base price per duration, per-day and holiday adjustments, seasonal pricing, add-on services. |

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

⚠️ **Breaking:** old Storybook links (e.g. `layouts-listingattributes--default` or `layouts-newlisting-assetattributes--default`) no longer resolve. Since Oct 07, 2026 the layouts are grouped by app (`src/layouts/provider-portal/new-listing/`), and ids follow `layouts-providerportal-newlisting-<step>--default` (e.g. `layouts-providerportal-newlisting-attributes--default`).

### Adding a step

1. Pick one word for what the step collects (distinct from the existing steps) and create `steps/<word>/<word>.tsx` exporting `<Name>Step`, typed `NewListingStepProps & { … }`, rendering its content inside `<NewListingLayout title="…">`.
2. Add `<word>.stories.tsx` titled `Layouts/ProviderPortal/NewListing/<Name>`.
3. Wire it into `new-listing-flow.stories.tsx` (step number + `previous` step for the back arrow) and add it to the New Listing order in `.storybook/preview.ts`.

A Service path reuses the shared steps and adds any service-specific steps in the same `steps/` folder with the same one-word naming — no separate folder tree.

### Open items

- ✅ **Resolved (Sep 27, 2026):** the page frame all seven steps repeated now lives in the shared `NewListingLayout` shell; every step was measured before and after and renders pixel-identically.
- ⚠️ **Gap:** step content is still yacht-specific by default (headings, sections, sample data); only names and structure are generic so far.
- ⚠️ **Gap:** the Service path is undesigned beyond Step 1 — see [services/master-flow-services.md](services/master-flow-services.md).
