<!--
Created: Aug 15, 2026
Created by: Julio Caunedo
Last updated: Oct 09, 2026 (second CTA renamed "Create my first listing"; it opens Listings with the New listing flow already open)

Scope: Provider-side "Create Business" onboarding funnel — currently just the "Tell us about your
business" screen and its business-category dropdown. Not the Business Profile detail page (see
business-profiles.md).

Purpose: Define the category taxonomy asked during business onboarding, paired against the
guest-facing Concierge mood-tile taxonomy it should stay legible against.
-->

# Business Onboarding — Create Business Flow

**Audience:** Provider, first-time business setup (pre-`business-profiles.md`'s detail page)
**Figma:** [Sign In — "Business profile" screen](https://www.figma.com/design/Yxntd0OUl1SMXtYSu41h3P/Sign-In?node-id=29-1349), node `29:1349`
**Status:** First-screen fields confirmed in Figma. The rest of the "Create Business" flow (post-submit) is still a stub — see [business-profiles.md](business-profiles.md)'s "Add business" gap.

## Purpose

Define the "What does your business offer?" dropdown on the "Tell us about your business" onboarding screen. This is Manage-register copy (account/provider setup) — plain and precise, not Discover-stage conversational phrasing — but should still read as the same product as the guest-facing Concierge tiles. See [../DESIGN.md](../DESIGN.md) "Brand voice."

✅ **Confirmed in Figma:** the screen is a single step — Business name, this dropdown, Website, then two exit actions ("Take me to my portal" / "Create my first listing"). No second "business type" question exists on this screen. Phone number was removed from the screen on Oct 08, 2026.

⚠️ **Copy sync:** the second action was renamed from "Create my first experience" to "Create my first listing" on Oct 09, 2026, in the spec and the code. Check that Figma (`29:1349`) uses the new label too.

## Category list

✅ **Resolved — two registers, one taxonomy.** Guest-facing surfaces (Concierge's "What do you feel like doing?" tiles, [Figma node 116:10130](https://www.figma.com/design/fVJyx4bhZeyS14s6yTbui1/Concierge-App?node-id=116-10098)) use single words — fast to scan as image tiles. This onboarding dropdown is text-only and read once during setup, so it can afford a short descriptive phrase per option, which resolves what a single word like "Transport" or "Shop" actually means for a provider self-classifying their business. Same underlying category, two labels:

| Guest-facing (Concierge tile) | Provider-facing (this dropdown) |
| ----------------------------- | ------------------------------- |
| Water                         | Boats & yacht charters          |
| Dine                          | Food & dining                   |
| Wellness                      | Wellness & beauty               |
| Nightlife                     | Entertainment & nightlife       |
| Transport                     | Transport                       |
| Tours                         | City tours                      |

ℹ️ This table shows only the 6 v1 categories — see "v1 category scope" below for the deferred categories and their guest-tile pairings.

ℹ️ See [taxonomy.md](taxonomy.md) for the Experience/Service listing subtypes available under each of these business categories.

✅ **Confirmed usage — both columns ship, in different surfaces.** This isn't just an internal mapping for reference: both label sets are live product copy, each used in a different place in Concierge.

- **Guest-facing (left column)** — used as the navigation/quick-selection tile labels in the Concierge App's "What do you feel like doing?" section. See [Figma node 116:10098](https://www.figma.com/design/fVJyx4bhZeyS14s6yTbui1/Concierge-App?node-id=116-10098).
- **Provider-facing (right column)** — used on listing detail displays in Concierge (i.e. wherever a listing shows its category to a guest reading the full listing, not just browsing tiles). See [Figma node 212:5398](https://www.figma.com/design/fVJyx4bhZeyS14s6yTbui1/Concierge-App?node-id=212-5398).

So a guest may see "Water" while browsing tiles and "Boats & yacht charters" on the listing detail page for the same underlying category — this is intentional, not a naming inconsistency to fix.

The onboarding dropdown (right column) is what actually ships on this screen:

- City tours
- Boats & yacht charters
- Food & dining
- Wellness & beauty
- Entertainment & nightlife
- Transport

**Notes on specific entries:**

- **Transport** — kept as a single word on both sides; broad enough to cover private drivers and other transport providers without narrowing to one specific service type.
- **City tours** — provider label now more descriptive than the guest-facing "Tours" tile, matching this doc's other entries; guest side stays the single word "Tours."

✅ **Resolved:** single-select. Matches the Figma screen's standard single-value dropdown ("Select a category"). A provider spanning categories (e.g. a restaurant with a late-night bar) picks the single option that best represents the business, same as any other one-value classification field on this screen.

## v1 category scope

✅ **Resolved — v1 ships exactly 6 categories, no fallback.** For the first release, the onboarding dropdown is scoped down to **City tours, Boats & yacht charters, Food & dining, Wellness & beauty, Entertainment & nightlife, and Transport** — no "Other" catch-all. This is a deliberate v1 cut, not the full candidate taxonomy.

⚠️ **Deferred to v2 — not eliminated:** the following categories (and their guest-facing tile pairings, where one exists) were part of the broader taxonomy explored above but are held back from v1:

| Guest-facing (Concierge tile) | Provider-facing (deferred) |
| ----------------------------- | --------------------------- |
| Outdoors                      | Activities & recreation    |
| Shop                          | Shopping experiences       |
| Family                        | Family experiences         |
| Art                           | Art, culture & entertainment |
| —                             | Professional services       |

Their rationale/notes, preserved for whenever they're reconsidered:

- **Shopping experiences** — places to go for shopping in the city, not a business that sells retail goods itself.
- **Family experiences** — family-oriented experiences generally, not a specific activity type.
- **Art, culture & entertainment** — museums, exhibitions, musical events, cultural events, concerts. This absorbs "musical events/concerts," which could also plausibly read as **Entertainment & nightlife**; no hard rule was set for which one a concert-venue or live-music provider should pick.
- **Professional services** — a provider offering a booked professional service delivered to a guest or client, rather than an activity, venue, or transport. Was scoped to cover the service types in `../services/*.md` other than private drivers (which fall under **Transport**): event planning, personal chef, photography, makeup/beauty, massage, concierge services, security — plus babysitting and rentals per `homepage.md`'s "Need a Hand" list. No guest-facing tile equivalent, since guests don't browse "by professional service."

⚠️ **Gap:** with no "Other" fallback, providers whose business would have mapped to one of these deferred categories have no dropdown option that fits in v1. Not resolved here — flagged for whoever finalizes the v1 Figma screen to decide (e.g. force-fit to the nearest of the 6, or add "Other" back before ship).

## Decision history

- **"Tours & experiences" → "Tours."** "Experience" is a reserved platform-level noun elsewhere in this repo (Experience cards, Experience category specs, Experience-vs-Service — see [concierge/card-content.md](concierge/card-content.md), `experiences/*.md`). Using it inside one option overloaded the word at the exact level meant to disambiguate categories from each other.
- **"Tours" checked against GetYourGuide/Viator, kept as-is.** Both split "tours" into finer categories in their much larger (15+ item) catalogs, but this list's job is broad provider self-ID at signup, not a granular browse taxonomy, so the finer split wasn't adopted. Mindtrip/Layla/Stardrift were also checked but don't expose a fixed taxonomy at all (conversational/AI-first, closer to Bethere's own Concierge model).
- **A second "What type of business are you?" question** (Experience Company / Independent Host / Tour Operator / etc.) was reference material from earlier work, not a field on the confirmed Figma screen — not carried into this spec.
- **Single-word pass, then reverted to descriptive provider labels.** A first pass matched the guest-facing tiles word-for-word (`Water`, `Transport`, `Services`, etc.) throughout. Reverted: the provider-facing screen isn't scanned as an image-tile grid the way Concierge is, so it can and should carry more descriptive labels — the guest/provider taxonomies now share a category _mapping_ (table above) rather than identical _labels_.

## Onboarding category vs. New Listing's flow

**Context.** New Listing's first screen, "What would you like to offer?" ([Provider Portal Figma, node 72:832](https://www.figma.com/design/WcuVufMxyCvkEJ2BuxPpX6/Provider-Portal?node-id=72-832)), asks every provider to choose **Experience** ("Hosted activities, tours, adventures, and events") or **Service** ("Professional services delivered to guests or clients"). A later step in that same flow re-asks a generic category question — "What are you offering?" with options like Yacht Charter, Water Activities, Tours, Nightlife, Food & Drink, Wellness, Events, Other — which duplicates the business category already captured by this doc's onboarding dropdown.

✅ **Resolved — product model: three separate properties, not two.**

- **Business category** (this doc) — defines the provider's business domain. Set once, at onboarding.
- **Experience / Service** — defines the listing model: is this a bookable outing the guest participates in, or a professional/operational task delivered to them? Set per listing.
- **Listing subtype/details** — the specific offering within that model (e.g. which kind of boat, which kind of service). Set per listing, informed by business category.

**Keep Experience / Service as the two primary New Listing paths — do not remove or default past it.** The provider's onboarding selection answers _what kind of business they are_; the New Listing choice answers _what type of offering they are creating_. These stay related but separate, because one business category genuinely supports both listing types:

- **Boats & yacht charters** → Experience: yacht charter, sunset cruise, sandbar trip. → Service: private captain, crew service, provisioning.
- **Wellness & beauty** → Experience: a couples spa day. → Service: an in-room massage.

Defaulting or hiding this choice (an earlier draft of this section proposed exactly that) risks silently misrouting the ~50% of listings that don't match the business category's "typical" shape. Asking it directly, every time, is cheap — two clear options — and avoids that failure mode entirely.

**Remove the current Step 2 instead.** The generic re-ask ("What are you offering?" → Yacht Charter / Water Activities / Tours / Nightlife / Food & Drink / Wellness / Events / Other) is the actual redundant step: it re-collects information the provider already gave at onboarding. Eliminating it removes real duplicate classification work without touching the Experience/Service decision, which carries information onboarding category can't supply (listing shape, not business domain).

**Updated flow:**

```
New listing
  → Choose Experience or Service
  → Go directly into listing-specific details, informed by the business's onboarding category
```

Worked example — **Boats & yacht charters**:

- \+ Experience → "What type of boat/yacht are you listing?"
  - Motor yacht
  - Sailing yacht
  - Catamaran
  - Sport fishing boat
  - Pontoon
  - Speedboat
  - Other

- \+ Service → "What type of listing are you creating??"

  ⚠️ **Decision needed — v1 candidate set, not finalized.** Leaning toward a tighter v1 list, with a fuller candidate set to expand into later if demand justifies it:

  **v1 candidate (tighter):**
  - Private captain
  - Crew service
  - Yacht provisioning
  - Catering
  - Boat detailing
  - Other service

  **Full candidate list (later pass):**
  - Private captain
  - Crew service
  - Yacht provisioning
  - Catering
  - Boat detailing
  - Cleaning service
  - Docking assistance
  - Boat delivery / relocation
  - Maintenance support
  - Other service

  Not shipped as final — start tighter (top list), expand only if providers actually need the extra granularity (full list). Confirm the actual v1 cut before this goes into Figma/implementation.

The onboarding category informs and personalizes the listing-details step (which subtype options appear) but never substitutes for the Experience/Service choice, and the Experience/Service choice never substitutes for asking business category at onboarding — each of the three properties answers a question the other two can't.

⚠️ **Gap — not yet designed or finalized:** the worked example above is the only business category with listing-subtype options drafted, and even its Service-subtype list (above) is still an open candidate set, not a locked decision. Every other v1 business category (City tours, Food & dining, Wellness & beauty, Entertainment & nightlife, Transport) still needs its own Experience-subtype and Service-subtype lists defined from scratch — none have a Figma reference yet.

⚠️ **Gap:** whether New Listing can read the business's onboarding category at all today is unconfirmed — `business-profiles.md` already flags no data-fetching contract exists between `BusinessProfilesLayout`/`BusinessProfileLayout` and any other page (see that doc's "Open items / TODOs" #1). Personalizing the listing-details step by business category depends on that plumbing existing.

## Relationship to other taxonomies in this repo

⚠️ **Gap — not fully reconciled.** Beyond the guest/provider pairing above, two more taxonomies overlap with this one and remain unreconciled: the **Experience category specs** (`experiences/*.md`: `Water Activities, Tours, Nightlife, Wellness, Events, Restaurant, Yacht Charter, Other`) and the **Cuisine/food-type taxonomy** ([concierge/card-content.md](concierge/card-content.md), Restaurant-card-specific). `homepage.md` and `card-content.md` each independently flag this same gap. Not resolved here — flagged so a future pass tackles all taxonomies together rather than pairwise.

## Open Questions

- ✅ **Resolved (Oct 09, 2026):** "Take me to my portal" opens the Provider Portal (Dashboard home). "Create my first listing" (renamed from "Create my first experience") opens Dashboard → Listings with the New listing flow already open over it; closing the flow leaves the user on Listings. Implemented in the Storybook prototype (Provider Portal → New Listing story).
- ⚠️ Business name and website (the screen's other two fields) aren't covered by this doc — add if/when they need their own spec notes.
