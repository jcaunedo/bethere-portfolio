<!--
Created: Aug 15, 2026
Created by: Julio Caunedo
Last updated: Aug 15, 2026 (simplified: single-word guest taxonomy vs. short descriptive provider taxonomy, side by side; condensed reconciliation notes; provider-side "Tours" → "City tours"; confirmed single-select; removed attribution phrasing; provider-side "Private driver" reverted to "Transport")

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

✅ **Confirmed in Figma:** the screen is a single step — Business name, this dropdown, Phone number, Website, then two exit actions ("Take me to my portal" / "Create my first experience"). No second "business type" question exists on this screen.

## Category list

✅ **Resolved — two registers, one taxonomy.** Guest-facing surfaces (Concierge's "What do you feel like doing?" tiles, [Figma node 116:10130](https://www.figma.com/design/fVJyx4bhZeyS14s6yTbui1/Concierge-App?node-id=116-10098)) use single words — fast to scan as image tiles. This onboarding dropdown is text-only and read once during setup, so it can afford a short descriptive phrase per option, which resolves what a single word like "Transport" or "Shop" actually means for a provider self-classifying their business. Same underlying category, two labels:

| Guest-facing (Concierge tile) | Provider-facing (this dropdown) |
| ----------------------------- | ------------------------------- |
| Water                         | Boats & yacht charters          |
| Outdoors                      | Activities & recreation         |
| Dine                          | Food & dining                   |
| Wellness                      | Wellness & beauty               |
| Nightlife                     | Entertainment & nightlife       |
| Shop                          | Shopping experiences            |
| Family                        | Family experiences              |
| Art                           | Art, culture & entertainment    |
| Transport                     | Transport                       |
| —                             | Professional services           |
| Tours                         | City tours                      |
| Other                         | Other                           |

The onboarding dropdown (right column) is what actually ships on this screen:

- City tours
- Boats & yacht charters
- Activities & recreation
- Food & dining
- Wellness & beauty
- Entertainment & nightlife
- Shopping experiences
- Family experiences
- Art, culture & entertainment
- Transport
- Professional services
- Other

**Notes on specific entries:**

- **Shopping experiences** — places to go for shopping in the city, not a business that sells retail goods itself.
- **Family experiences** — family-oriented experiences generally, not a specific activity type.
- **Art, culture & entertainment** — museums, exhibitions, musical events, cultural events, concerts. ⚠️ **Overlap:** this absorbs "musical events/concerts," which could also plausibly read as **Entertainment & nightlife**. No hard rule yet for which one a concert-venue or live-music provider should pick — leave to provider judgment until this needs tightening.
- **Transport** — kept as a single word on both sides; broad enough to cover private drivers and other transport providers without narrowing to one specific service type.
- **Professional services** — kept from the original list; no guest-facing tile equivalent since guests don't browse "by professional service."
- **City tours** — provider label now more descriptive than the guest-facing "Tours" tile, matching this doc's other entries; guest side stays the single word "Tours."

✅ **Resolved:** single-select. Matches the Figma screen's standard single-value dropdown ("Select a category"). A provider spanning categories (e.g. a restaurant with a late-night bar) picks the single option that best represents the business, same as any other one-value classification field on this screen.

## Decision history

- **"Tours & experiences" → "Tours."** "Experience" is a reserved platform-level noun elsewhere in this repo (Experience cards, Experience category specs, Experience-vs-Service — see [concierge/card-content.md](concierge/card-content.md), `experiences/*.md`). Using it inside one option overloaded the word at the exact level meant to disambiguate categories from each other.
- **"Tours" checked against GetYourGuide/Viator, kept as-is.** Both split "tours" into finer categories in their much larger (15+ item) catalogs, but this list's job is broad provider self-ID at signup, not a granular browse taxonomy, so the finer split wasn't adopted. Mindtrip/Layla/Stardrift were also checked but don't expose a fixed taxonomy at all (conversational/AI-first, closer to Bethere's own Concierge model).
- **A second "What type of business are you?" question** (Experience Company / Independent Host / Tour Operator / etc.) was reference material from earlier work, not a field on the confirmed Figma screen — not carried into this spec.
- **Single-word pass, then reverted to descriptive provider labels.** A first pass matched the guest-facing tiles word-for-word (`Water`, `Transport`, `Services`, etc.) throughout. Reverted: the provider-facing screen isn't scanned as an image-tile grid the way Concierge is, so it can and should carry more descriptive labels — the guest/provider taxonomies now share a category _mapping_ (table above) rather than identical _labels_.

## Relationship to other taxonomies in this repo

⚠️ **Gap — not fully reconciled.** Beyond the guest/provider pairing above, two more taxonomies overlap with this one and remain unreconciled: the **Experience category specs** (`experiences/*.md`: `Water Activities, Tours, Nightlife, Wellness, Events, Restaurant, Yacht Charter, Other`) and the **Cuisine/food-type taxonomy** ([concierge/card-content.md](concierge/card-content.md), Restaurant-card-specific). `homepage.md` and `card-content.md` each independently flag this same gap. Not resolved here — flagged so a future pass tackles all taxonomies together rather than pairwise.

## Open Questions

- ⚠️ What happens after this screen's two exit actions ("Take me to my portal" vs. "Create my first experience")? Neither destination is specced yet — see `business-profiles.md`'s "Add business"/Create Business gap.
- ⚠️ Business name, phone number, and website (the screen's other three fields) aren't covered by this doc — add if/when they need their own spec notes.
