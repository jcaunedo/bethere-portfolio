# Experience — Category Flow

> See [../master-flow.md](../master-flow.md) for Step 1 (Listing Type) and the master flow principles referenced below.

## Step 2: Experience Category

**Title:** What are you offering?

**Description:** Choose the category that best describes your experience.

Each category answers one question about the guest's core activity, with no overlap between them:

| Category         | Description                                                                                | Flow file |
| ----------------- | -------------------------------------------------------------------------------------------- | ----------- |
| Yacht Charter    | Private yacht experiences, celebrations, and custom trips.                                 | [yacht-charter.md](yacht-charter.md) |
| Water Activities | Jet skis, parasailing, paddleboarding, kayaking, watersports, snorkeling, and diving.      | [water-activities.md](water-activities.md) |
| Tours            | Guided sightseeing, cultural experiences, walking tours, food tours, and local excursions. | [tours.md](tours.md) |
| Nightlife        | VIP access, club experiences, bar crawls, live music, and nightlife activities.            | [nightlife.md](nightlife.md) |
| Restaurant       | Restaurant profiles with hours, menus, highlights, and reservation links.                  | [restaurant.md](restaurant.md) |
| Wellness         | Fitness classes, yoga sessions, spa experiences, and wellness activities.                  | [wellness.md](wellness.md) |
| Events           | Private events, celebrations, tastings, classes, entertainment, and group experiences.     | [events.md](events.md) |
| Other            | Experiences that do not fit into the categories above.                                     | [other.md](other.md) |

**Rationale:** Category is the primary key for the per-category configuration described in Master Flow Principles. It drives: which Step 3 follow-up (if any) appears, which attribute set the "asset attributes" step shows, the vocabulary used throughout (e.g., "yacht" vs. "vehicle" vs. "venue" vs. "instructor"), the "what's included" / add-on catalogs, and the required-document set. It's also the primary filter guests use for discovery, so it should be treated as close to immutable post-publish (changing category should likely require re-running Steps 3–14).

**Rules / Interactions:**

- Single-select, required.
- Categories without a designed Step 3 (everything except Yacht Charter) should either skip directly to a generalized asset-detail step, or show a lightweight generic "what type of [category] are you offering?" using the sub-category tables in each category's flow file until dedicated screens exist.

**Boundary rules** (for offerings that could plausibly fit more than one category — choose by the guest's core activity):

- The guest eats a meal served at a venue → **Restaurant**, even if the venue also hosts tastings or events.
- The guest samples or learns at a single venue (tasting, cooking/mixology class) → **Events** (Tasting or Workshop type).
- The guest moves between multiple locations, food-focused or not → **Tours** (food walks and market routes are Tours → Food Tours).
- The night out is the experience (VIP table, lounge, club access), even where food is served → **Nightlife**.
- A professional performs the work at the guest's location (e.g. a private chef in a villa) → **Service** branch, not Experience.

## Step 3: Category Follow-Up

A single-select sub-type that **seeds defaults** for later steps without changing the overall step structure — this is the model for how every category's Step 3 should behave (see [../master-flow.md](../master-flow.md) Master Flow Principles #2/#3). Only the **Yacht Charter** follow-up has been designed so far ([yacht-charter.md](yacht-charter.md)).

> TODO: Follow-up screens for 6 categories (Water Activities, Tours, Nightlife, Wellness, Events, Other) have not been designed yet. Each category's flow file contains a sub-category table as the best starting reference for its Step 3. **Restaurant** intentionally has no Step 3 — see [restaurant.md](restaurant.md).
