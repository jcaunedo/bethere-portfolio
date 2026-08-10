<!--
Created: Aug 09, 2026
Created by: Julio Caunedo
Last updated: Aug 09, 2026
-->

# Experience Card Content Rendering

**Status:** Core content hierarchy and title/metadata rules defined. Data fallbacks and category-to-rendering mappings still need implementation decisions.

## Purpose

Define how guest-facing Experience cards choose, format, and order listing content across Concierge and Browse surfaces. The card should help a guest understand the experience and compare it quickly without forcing every category into the same metadata fields.

ℹ️ This spec defines card **content rendering**, not card layout, image treatment, interaction states, ranking, or the selection logic that determines which experiences appear.

## Scope

These rules apply anywhere the Concierge website renders an Experience as a reusable card, including:

- Featured — Bethere-curated experiences
- Right Now
- Conversational-engine results when cards are used
- Browse / Explore listing grids and list views
- Near You views

⚠️ **Scope:** Service cards are not covered. Services answer a different guest need and may require a separate hierarchy and metadata model.

## Content Hierarchy

✅ **Resolved:** Keep the hierarchy consistent even when the specific metadata changes.

1. Experience image
2. Experience title
3. Contextual metadata — location plus the secondary detail most useful for deciding
4. Commercial and trust metadata — price plus rating, when available

The card may vary which fields appear within levels 3 and 4, but should not reorder the levels by category. Context should come before price and rating.

## Experience Title

✅ **Resolved:** Render card titles in sentence case while preserving proper names, branded names, and unique listing names.

Examples:

| Use                                    | Avoid                                  |
| -------------------------------------- | -------------------------------------- |
| Private yacht charter on Little Atocha | Private Yacht Charter on Little Atocha |
| Little Havana food & culture tour      | Little Havana Food & Culture Tour      |
| Play a round at Crandon Golf           | Play a Round at Crandon Golf           |
| Poolside spritz at The Standard        | Poolside Spritz at The Standard        |
| Shop & dine at Brickell City Centre    | Shop & Dine at Brickell City Centre    |

Preserve capitalization for names such as `ICA Miami`, `The Standard`, `Brickell City Centre`, `The Biltmore Hotel`, `Little Havana`, and `Key West`. Lowercase generic words after the first word, including `tour`, `adventure`, `charter`, `dinner`, `experience`, and `walk`, unless they are part of an intentionally styled proper name.

✅ **Resolved:** Keep the title focused on the experience. Do not repeat location in the title when the metadata row can carry it.

Example:

```text
Private yacht charter on Little Atocha
Key Biscayne · 4 hrs
$1,200 · ★ 4.9
```

⚠️ **Gap:** The source of truth for intentional brand capitalization is not defined. The renderer needs either curated display titles or structured proper-name data; automatic title casing alone cannot reliably distinguish generic words from names.

## Contextual Metadata

✅ **Resolved:** The first metadata row is contextual. It should combine the most useful location label with the secondary fact that helps the guest decide fastest. Do not force distance onto every card when duration is more informative.

| Experience shape           | Location label                | Secondary detail          | Example                     |
| -------------------------- | ----------------------------- | ------------------------- | --------------------------- |
| Place-based experience     | Neighborhood                  | Category or activity type | `Wynwood · Art gallery`     |
| Hotel pool / day pass      | Neighborhood                  | Access or venue type      | `Coral Gables · Hotel pool` |
| Time-bound experience      | Neighborhood                  | Duration                  | `Little Havana · 2.5 hrs`   |
| Restaurant / food & drink  | Cuisine or food type          | Neighborhood              | `Cuban · Little Havana`     |
| Tour or class              | Neighborhood or meeting area  | Duration                  | `Little Havana · 2.5 hrs`   |
| Charter or private booking | Departure or meeting location | Duration                  | `Key Biscayne · 4 hrs`      |

Use the most guest-recognizable location label available: neighborhood for general discovery, meeting area for a tour or class when more useful, and departure/boarding area for a charter. Cards should not expose a precise street address by default.

✅ **Resolved (design rationale): Restaurant's type-first order is a deliberate exception, not an inconsistency to fix.** Every row leads with location except Restaurant / food & drink, which leads with cuisine. This was questioned — should Place-based (`Neighborhood · Category`, e.g. `Design District · Art museum`) flip to match Restaurant's `Type · Neighborhood` order for consistency? Decision: **no, keep both as they are.**

The reasoning: each row leads with whichever fact most changes the guest's decision, not with whichever fact is positionally consistent across rows. For food, the question a guest is usually resolving is "what am I in the mood to eat?" — cuisine is the primary axis of choice, and a guest will often travel further for the right cuisine than pick a mediocre match because it's close. Restaurant earns its type-first order because of that. For a place-based venue (a museum, a shopping center), the type is usually already legible from the title and image — "ICA Miami" next to a gallery photo doesn't need "Art museum" to lead in order to be understood — but _where_ it sits relative to neighborhoods the guest already cares about is the thing the title can't convey. That's also why Tour, Charter, and Time-bound rows all lead with location: consistent with Place-based, not with Restaurant.

There's a brand-voice reason too: leading with the neighborhood mirrors how a local friend actually talks — "there's this great little museum in the Design District" (place first, then what it is) — rather than a directory-listing cadence ("Art museum in the Design District"). See [../../DESIGN.md](../../DESIGN.md) brand voice.

Forcing every row into the same left-to-right order would look consistent but would actually break the more meaningful pattern each row already follows — lead with whatever most helps the guest decide, not with positional sameness for its own sake.

✅ **Resolved — distance removed from Experience cards, except day-trip destinations.** Per Julio: distance (in any form, including plain mileage) depends on the card knowing an accurate, current guest location — which it frequently doesn't, or can't fully trust even when a coordinate exists (stale permission, VPN, guest browsing from a hotel room before heading out). Showing "0.6 mi" makes a confident-sounding claim the card can't actually stand behind, the same underlying problem flagged with travel-time estimates (see the now-superseded note below). **Distance is removed from every Experience card's contextual row**, replaced by **category or activity type** for the one row that used to carry it (Place-based experience) — a fact the card can always assert regardless of guest location.

The sole exception is the **"Let's get out of town"** section (day-trip destinations — Everglades, Key West, Orlando, Palm Beach): those distances are measured from the city itself, a fixed, known reference point, not from the guest's own unverified position — so a distance figure there is a stable geographic fact, not a location-dependent guess. That section keeps a distance display.

✅ **Resolved: day-trip distance copy is conversational, not a bare number.** A raw `15 mi` reads clinical, like a spec sheet, next to description lines already written in the brand voice (e.g. "Wild Florida, airboats, alligators, and miles of untouched wetlands"). The distance line should keep the number — it's a genuinely useful, honest fact here, unlike the removed in-city distances — but wrap it in a phrase a local friend would actually say, not a bare figure:

| Destination | Before  | After                    |
| ----------- | ------- | ------------------------ |
| Everglades  | `15 mi` | `Just 15 miles away`     |
| Key West    | `85 mi` | `A scenic 85-mile drive` |
| Orlando     | `45 mi` | `45 miles up the road`   |
| Palm Beach  | `29 mi` | `Just 29 miles away`     |

✅ **Resolved (Key West wording):** `A scenic 85-mile drive` was chosen over a flatter `85 miles away, along the coast`. Per Julio: this card's job is to sell the _feeling_ of the drive, not just state the distance — "scenic" and "drive" describe the experience the way a friend recommending the trip actually would, closer to poetic than technical. This is a deliberate, scoped exception to the discovery-voice "generic swap" test (a phrase a travel site might also use is fine here, since the card's purpose is evocative description, not a structural UI label) — recorded as a named exception in [../../DESIGN.md](../../DESIGN.md) brand voice, so it isn't mistaken for a drift back toward generic travel copy elsewhere.

⚠️ **Gap:** no fixed phrase bank exists yet for this — the four examples above vary the wording by feel (`Just N miles away` for closer/local-feeling trips, `N miles up the road` for a clear geographic direction, `A scenic N-mile drive` when the drive itself is part of the appeal) rather than following one templated string. Needs either a small curated set of phrase templates keyed to relative distance/direction/appeal, or an explicit decision to hand-write each one (acceptable at 4 cards, likely not at scale).

⚠️ ~~**Superseded:** distance means a straight measurement, not a travel-time estimate. The card's contextual row shows plain distance (`1.2 mi`), never a phrase like `10 min away`.~~ This rule (added earlier the same day) is now superseded by the rule above — it correctly identified travel-time estimates as unreliable, but didn't go far enough: plain distance carries a milder version of the same problem (an unverified guest location) and is now removed too, except for the day-trip exception. Kept here, struck through, so the reasoning trail isn't lost — the travel-time-specific argument is still valid background for why distance is risky at all.

✅ **Resolved:** For restaurants and any food & drink listing (cafes, bars, food halls, dessert spots), the first metadata row leads with **cuisine or food type**, not price range — the guest deciding whether to open a card cares what kind of food it is before what it costs. Price range moves to the Price and Rating line (see below), same position it already holds for every other shape.

```text
Old Havana dinner
Cuban · Little Havana
$25–$45 · ★ 4.8
```

**Cuisine / food-type taxonomy (initial set):**

| Category                    | Examples                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Regional / national cuisine | Cuban, Italian, American, Spanish, Mexican, Peruvian, Japanese, Argentinian, French, Caribbean, Mediterranean |
| Meal or format              | Brunch, Seafood, Steakhouse, Pizza, Sushi, BBQ, Bakery & desserts                                             |
| Drink-led                   | Cocktail bar, Wine bar, Coffee & cafe, Rooftop / drinks with a view                                           |
| Dietary                     | Vegan, Vegetarian-friendly                                                                                    |

⚠️ **Gap:** this taxonomy is a first pass reconciling what's already used ad hoc in the current Figma build (`Cuban · Little Havana`, `Italian · Miami Beach` on Casa Tua) — it hasn't been checked against the category taxonomy already defined for guest-facing browsing in `concierge/homepage.md` (the "Eat & Drink" mood tile) or against the Experience category specs under `../experience/` (`restaurant.md`). These three taxonomies (this one, the homepage mood tiles, and the provider-facing Experience categories) should likely converge on one shared vocabulary rather than drift independently — see the same open reconciliation gap already flagged in `homepage.md`'s "By Mood/Activity" section.

⚠️ **Gap:** a listing can plausibly span more than one cuisine tag (e.g. a Cuban-Asian fusion spot, or a food hall with multiple vendors) — whether a card shows one primary tag only, or up to N, is undefined. Default to one primary tag per the "don't turn the card into a full attribute summary" rendering rule below, but this needs an explicit decision once real menu/category data exists.

✅ **Resolved (tiebreaker):** if a listing has a fixed, scheduled duration — the guest is booking a specific block of time (a tour, class, charter, or any timed booking) — show duration, not distance, even if the listing also reads as "place-based" at a glance. Duration is what the guest is paying for; distance is not. For open-ended, walk-in/no-booked-time experiences (e.g. a hotel pool or spa day pass, or a general-admission venue with no scheduled slot), use the Place-based pattern: `Neighborhood · Category or activity type`. When uncertain which shape a listing is, ask: "did the guest book a specific time window?" — if yes, duration wins.

⚠️ **Gap:** Category alone may not be enough to choose the correct row. A structured experience type or rendering profile is needed for listings that cross shapes—for example, a place-based wellness venue that also offers a scheduled session. The tiebreaker above narrows this but doesn't fully close it — a structured field (e.g. `hasScheduledDuration: boolean`) would remove the ambiguity entirely rather than relying on title/category inference.

✅ **Resolved (mostly moot):** distance calculation, unit localization, and rounding for guest location no longer apply to Experience cards, since distance was removed from every Experience card except "Let's get out of town." ⚠️ **Gap remaining:** those day-trip distances still need unit localization/rounding rules, and their measurement basis (from city center? from the guest, if known?) isn't explicit — this spec currently treats them as fixed, city-relative facts (e.g. "15 mi" from Miami) rather than guest-relative.

⚠️ **Gap:** Duration formatting and multi-duration offerings are not defined. Confirm whether a listing with several options shows the shortest duration, a range, or a label such as `From 2 hrs`.

## Price and Rating

✅ **Resolved:** When present, price and rating render after contextual metadata.

Examples:

```text
From $69 pp · ★ 4.9
```

```text
$1,200 · ★ 4.9
```

Use `From` only when the displayed amount is the lowest of multiple valid prices. Use `pp` on compact cards for per-person pricing; do not add it to flat-rate charters or private bookings. Expand `pp` to `per person` in the accessible name.

✅ **Resolved — cover/day-pass pricing:** When the price is a fixed per-person access fee, such as hotel-pool access or a cover charge, render the fixed amount plus `pp`:

```text
$45 pp · ★ 4.9
```

Do not add `From` when there is one fixed cover price. If multiple valid access tiers start at different prices, use `From $45 pp`. The price communicates access only; the card must not imply that drinks, food, seating, or other amenities are included unless the listing explicitly confirms them.

✅ **Resolved — three price formats, chosen by what the guest can actually compare, not by category.** The card shows one of three shapes: an exact starting amount (`From $69`), an exact fixed amount (`$1,200`, `$45 pp`), or a relative price band (`$$$`). These aren't interchangeable stylistic choices — each answers a different question the guest is actually asking at a glance, and the wrong one either overstates precision the listing doesn't have or understates precision it does.

| Format | When to use | Example | What it tells the guest |
| --- | --- | --- | --- |
| `From $X` | The listing has multiple valid price points (tiers, add-ons, group sizes) and $X is the lowest of them | `From $69 pp` | "This is the minimum you'd pay — the real total may be higher depending on what you choose." |
| `$X` (exact) | The listing has exactly one price — a flat rate, a single fixed access fee, or a single per-person rate with no tiers | `$1,200`, `$45 pp` | "This is the price, full stop — no guessing at a range." |
| `$$$` (band) | The exact price is variable, unknown at render time, or the listing type is priced per-item rather than per-booking (most commonly restaurants, where the "price" is really an average per-person spend across a menu, not a bookable rate) | `$$$` | "Here's the general spend level, for comparing against other restaurants — not a specific number you'd be charged." |

**Design rationale:** a numeric price (`From $X` or `$X`) makes an implicit promise — "if you book this, this is what you'll pay (or the minimum you'll pay)." That promise only holds for **bookable experiences with a defined rate**: tours, charters, classes, day passes, cover charges. A restaurant doesn't have a bookable "rate" in the same sense — the guest chooses items off a menu, and what they actually spend depends on what they order, not a number Bethere can quote up front. Showing `From $25` on a restaurant card would silently misrepresent a menu average as a bookable minimum, which is a precision the listing doesn't actually have. The `$$$` band exists specifically to avoid that false precision while still giving the guest the comparison signal they're actually looking for at a glance ("is this a cheap spot or a splurge?").

The reverse mistake also matters: using `$$$` on a bookable experience (a tour, a charter) would *understate* precision the listing does have — the provider has set an actual rate, and hiding it behind a vague band makes the guest do extra work (open the card) to learn something the compact card could have told them directly. Per [../../DESIGN.md](../../DESIGN.md) brand voice's Discover→Evaluate→Book→Manage funnel — "Book" is confident and precise, since ambiguity there is a liability, not a personality trait — a bookable listing should always show its real number rather than a vaguer band.

**Rule:** default to `$` band notation **only** for Restaurant / food & drink cards (per the Contextual Metadata table above), and default to `From $X` / `$X` numeric pricing for every other experience shape (Place-based, Hotel pool / day pass, Time-bound, Tour or class, Charter or private booking) — these all have a definable rate per booking, so they should always show it. Do not vary format within the same experience shape based on convenience; the shape determines the format, not the specific listing's data availability.

⚠️ **Gap:** the "3–4 dollar sign" band scale itself isn't defined — how many tiers exist (`$` through `$$$$`? `$$$$$`?), what spend range each tier maps to, and whether that mapping is fixed or relative to the local market. An earlier pass on this page briefly used `$$$$$` (5 dollar signs) on a wine-tasting card before it was corrected to cuisine-first format — worth confirming the real tier count before more restaurant cards ship, so bands stay comparable to each other rather than drifting per author.

⚠️ **Gap:** The product has not defined behavior for missing ratings, review-count display, free experiences, price ranges (a numeric low–high, e.g. `$25–$45`, already used on some Restaurant cards — how this relates to the `$$$` band above isn't reconciled), taxes/fees, currency localization, or listings whose price is not available until requested.

## Rendering Rules

- Use the listing's guest-facing title; do not generate a new marketing title at render time.
- Apply sentence case without altering protected proper names or intentional brand styling.
- Keep metadata concise and omit labels already established by position. Use `2.5 hrs`, not `Duration: 2.5 hours`.
- Use a middle dot (`·`) to separate values within a row.
- Do not show empty separators or placeholder values when data is missing.
- Choose one location label and one secondary contextual detail for the first metadata row; do not turn the card into a full attribute summary.
- Keep pricing units explicit enough to compare offers (`pp` versus flat rate).
- Omit unavailable optional metadata rather than inventing or estimating it.

⚠️ **Accessibility:** Visual separators, abbreviations, and the star symbol cannot be the only semantics exposed to assistive technology. Accessible names should express the complete values—for example, `2.5 hours`, `45 dollars per person`, and `Rated 4.9 out of 5`—with localized currency and units.

## Worked Examples

### Tour

```text
Little Havana food & culture tour
Little Havana · 2.5 hrs
From $69 pp · ★ 4.9
```

### Private charter

```text
Private yacht charter on Little Atocha
Key Biscayne · 4 hrs
$1,200 · ★ 4.9
```

### Place-based experience

```text
Poolside spritz at The Standard
Miami Beach · Rooftop lounge
$$$ · ★ 4.8
```

ℹ️ The third example demonstrates the defined rendering pattern; its values are illustrative, not confirmed listing data. (Updated from an earlier `Miami Beach · 0.8 mi` version — see distance-removal note below.)

### Hotel-pool cover / day pass

```text
Poolside drinks at The Biltmore Hotel
Coral Gables · Hotel pool
$45 pp · ★ 4.9
```

✅ **Confirmed in Figma (Aug 09, 2026):** In "There's plenty around you," the former `Old Havana dinner / Cuban · Little Havana / $25–$45 · ★ 4.9` card was updated to the hotel-pool cover scenario above. The existing pool-and-drinks image and rating were retained. `pp` identifies the price as a per-person access/cover fee; it does not state that drinks are included.

✅ **Confirmed in Figma (Aug 09, 2026):** two sections of `Concierge App` (node 51:104) were updated to follow this convention:

- **Featured** ("You should check these out"): `Jetski adventure tour / Key Biscayne · 1 hr / From $160 · ★ 4.9`, `Wine tasting at Pura Vida / Wynwood · 1.2 mi / $$$$ · ★ 4.8`, `Karaoke night in Wynwood / Wynwood · 2.1 mi / From $12 · ★ 4.7`.
- **Right Now** ("People are loving these lately"): `Play a round at Coral Gables Park Golf / Coral Gables · 2 hrs / From $12 · ★ 4.6`, `Everglades airboat adventure in the wild / Everglades · 1.5 hrs / From $12 · ★ 4.8`, `Cafe Blue Sky / Coffee & cafe · Coconut Grove / $$ · ★ 4.5`, `Brunch at The Biltmore Hotel / Coral Gables / From $45 pp · ★ 4.9`.

This replaced title-case titles, a duplicated placeholder "Golf · Key Biscayne" line across 6 cards total, and bare integer ratings ("5") with no decimal, across both sections.

⚠️ **Correction — duration vs. distance tiebreaker.** Two cards initially shipped with distance instead of duration despite being scheduled, timed bookings: the Jetski tour (`Key Biscayne · 15 min away` → corrected to `Key Biscayne · 1 hr`) and the golf outing / Everglades airboat cards (placeholder "Golf · Key Biscayne" → corrected to duration, not distance). This is the general mistake the new tiebreaker rule above exists to prevent: a listing that reads as "place-based" at a glance (jetski on the water, a golf course, an airboat in the Everglades) is still duration-first if the guest is booking a specific time slot. Cafe Blue Sky, by contrast, is food & drink shaped, not a scheduled booking — see the follow-up correction below for its row.

✅ **Corrected — Restaurant row now leads with cuisine, not price range.** Cafe Blue Sky was first fixed to `Coconut Grove · $$` (Neighborhood · price range, the row's original shape) before this cuisine-first taxonomy existed, then corrected again to `Coffee & cafe · Coconut Grove` with `$$` moved to the Price and Rating line — matching the pattern already used on `Old Havana dinner` (`Cuban · Little Havana`) and `Casa Tua` (`Italian · Miami Beach`).

✅ **Confirmed in Figma (Aug 09, 2026) — full-page audit.** Every Experience card across the whole page (`Concierge App`, node 51:104 — Featured, Right Now, There's Plenty Around You, Let's Get Out Of Town) was checked against the Contextual Metadata table. Two more violations found and fixed:

- `Everglades airboat adventure` (`There's plenty around you` — a second, separate card from the "...in the wild" one fixed earlier) showed `Everglades · 40 min away` (distance) despite being the same scheduled-tour shape as its sibling card — corrected to `Everglades · 1.5 hrs`.
- `Brunch at The Biltmore Hotel` (Right Now) had no secondary detail at all — subtitle was the bare neighborhood `Coral Gables` with no cuisine tag. Corrected to `American · Coral Gables` per the Restaurant row.

Confirmed correct on row choice: `ICA Miami` and `Brickell City Centre` both correctly show distance rather than duration, since both are general-admission/walk-in Place-based venues with no scheduled time slot, matching the tiebreaker's stated exception. The four "Let's get out of town" destination cards (Everglades, Key West, Orlando, Palm Beach) have no price/rating — correct per "omit unavailable metadata," since these are geographic teasers, not bookable listings. Service cards (Private driver, Catering, Babysitting, Rentals, Makeup, Haircut) still show bare integer ratings ("5") — left untouched, since Service cards are explicitly out of this spec's scope (see Scope above); would need a separate pass once Services gets its own content spec.

⚠️ **Missed on the first pass, caught by Julio:** `ICA Miami` and `Brickell City Centre` were marked "confirmed correct" above for using distance instead of duration — that row choice was right, but the _value itself_ (`10 min away`, `8 min away`) was still wrong: a travel-time phrase, not a plain distance measurement, silently assuming a mode of transport (walk? drive? transit?) and an accurate, known guest location the card can't actually guarantee. Corrected to `Design District · 0.6 mi` and `Brickell · 0.3 mi`. **Same lesson as the Wine tasting miss:** checking a card against the right _row_ of the table isn't the same as checking every _value_ in that row against every rule that applies to it — this is the second time in this audit that a card passed one check while silently failing an adjacent one.

✅ **Confirmed in Figma (Aug 09, 2026) — distance removed entirely from Experience cards.** Per Julio: even plain distance (not just travel-time) is unreliable without a confirmed guest location, so it was removed from every Experience card except "Let's get out of town." Three remaining cards using distance were corrected to category/activity type: `Karaoke night in Wynwood` (`Wynwood · 2.1 mi` → `Wynwood · Karaoke bar`), `ICA Miami` (`Design District · 0.6 mi` → `Design District · Art museum`), `Brickell City Centre` (`Brickell · 0.3 mi` → `Brickell · Shopping center`). Confirmed via full-page scan that no card outside "Let's get out of town" (y-position < the day-trip section) still shows a `mi` value. This supersedes the `10 min away` → `0.6 mi`-style fix made earlier the same day — that fix corrected the _format_ of distance; this pass removes distance from these cards altogether.

⚠️ **Missed on the first pass, caught by Julio:** `Wine tasting at Pura Vida` (Featured) was still showing `Wynwood · 1.2 mi` — a Place-based distance pattern — when it's actually Restaurant/food & drink shaped (a wine bar). Corrected to `Wine bar · Wynwood`. The prior "full-page audit" note above re-verified duration-vs-distance across every card but didn't re-check every card against the newer cuisine-first Restaurant rule once that rule was added — this card was fixed for duration-vs-distance earlier in the session (before the cuisine taxonomy existed) and never revisited after. **Lesson for future passes:** when a rule changes mid-session, re-audit every card against the new rule specifically, not just the cards touched most recently — an audit marked "complete" against an older version of the convention isn't complete against a newer one.

ℹ️ The specific venue names/prices used here (e.g. "Pura Vida") are illustrative placeholders written to demonstrate the pattern, not confirmed real listings.

## Acceptance Criteria

- Every Experience card follows the shared title → contextual metadata → price/rating hierarchy.
- Generic title words render in sentence case while configured proper names retain their capitalization.
- Tour, class, charter, and other time-bound cards prefer duration over distance.
- Place-based cards show category or activity type, not distance, except in the "Let's get out of town" day-trip section.
- Charter/private-booking cards use departure or meeting location rather than a generic neighborhood when that is more useful.
- Per-person and flat-rate pricing remain distinguishable.
- A fixed cover/day-pass fee renders as `$N pp`; `From` appears only when `$N` is the lowest of multiple valid per-person prices.
- Missing optional fields do not create blank rows, duplicate separators, or placeholder copy.
- Accessible text expands `pp` to `per person` and communicates currency meaning and ratings.

## Open Questions

- ⚠️ What structured field protects proper-name capitalization from automatic sentence-case formatting?
- ⚠️ What is the authoritative mapping from Experience category/type to card rendering profile?
- ⚠️ What's the source/taxonomy for "category or activity type" (the new Place-based secondary detail) — is it the same mood/category taxonomy already flagged for reconciliation across `homepage.md`'s mood tiles and `../experience/` category specs, or a separate, card-specific vocabulary?
- ⚠️ How should cards summarize multiple durations and multiple price options?
- ⚠️ When should meeting/departure area replace neighborhood, and which provider field supplies it?
- ⚠️ What are the display and accessibility rules for ratings with no reviews or a low review count?
